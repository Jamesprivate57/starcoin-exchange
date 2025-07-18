# File: starcoin-exchange/backend/app.py

from flask import Flask, request, jsonify
import json, os, subprocess
from datetime import datetime
from flask_cors import CORS
from threading import Lock
import qrcode
from io import BytesIO
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import requests

app = Flask(__name__)
CORS(app)
lock = Lock()

TRANSACTION_LOG = "transactions.json"
EXCHANGE_RATE = 3486  # Buy rate
SELL_RATE = 2800      # Sell rate
MIN_PURCHASE_USD = 6972
WALLET_NAME = "starcoin_wallet"

if not os.path.exists(TRANSACTION_LOG):
    with open(TRANSACTION_LOG, "w") as f:
        json.dump([], f)

def get_block_count():
    result = subprocess.run(["litecoin-cli", "-regtest", "getblockcount"], capture_output=True, text=True)
    return int(result.stdout.strip()) if result.returncode == 0 else -1

def send_stc(address, amount_stc):
    result = subprocess.run(["litecoin-cli", "-regtest", "sendtoaddress", address, str(amount_stc)], capture_output=True, text=True)
    return result.stdout.strip() if result.returncode == 0 else ""

def save_transaction(entry):
    with lock:
        with open(TRANSACTION_LOG, "r+") as f:
            data = json.load(f)
            data.insert(0, entry)
            f.seek(0)
            json.dump(data, f, indent=2)
            f.truncate()

def generate_qr(data):
    img = qrcode.make(data)
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer

def send_email(to_email, subject, html_body, qr_data):
    msg = MIMEMultipart()
    msg["From"] = "your_email@gmail.com"
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(html_body, "html"))
    qr_img = generate_qr(qr_data)
    img_part = MIMEImage(qr_img.read(), name="qr.png")
    img_part.add_header('Content-ID', '<qrcode>')
    msg.attach(img_part)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login("your_email@gmail.com", "your_app_password")
        server.send_message(msg)

@app.route("/transaction", methods=["POST"])
def handle_transaction():
    data = request.get_json()
    address = data.get("address")
    usd = float(data.get("usd"))
    email = data.get("email", "")

    if usd < MIN_PURCHASE_USD:
        return jsonify({"status": "error", "msg": "Minimum $6972"}), 400

    stc_amount = round(usd / EXCHANGE_RATE, 8)
    txid = send_stc(address, stc_amount)
    block = get_block_count()
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    entry = {
        "usd": usd,
        "stc": stc_amount,
        "wallet": address,
        "block": block,
        "txid": txid,
        "time": now,
        "via": "manual"
    }
    save_transaction(entry)

    if email:
        html = f"""
        <h2>Thank you for purchasing Starcoin</h2>
        <p>Amount: {stc_amount} STC = ${usd}</p>
        <p>Wallet: {address}</p>
        <p>TXID: {txid}</p>
        <img src='cid:qrcode'>
        """
        send_email(email, "Your Starcoin Receipt", html, txid)

    return jsonify({"status": "success", "txid": txid, "block": block})

@app.route("/paypal/notify", methods=["POST"])
def paypal_notify():
    ipn_data = request.form.to_dict()
    verify_resp = requests.post(
        "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr",
        data={"cmd": "_notify-validate", **ipn_data},
        headers={"content-type": "application/x-www-form-urlencoded"}
    )

    if verify_resp.text == "VERIFIED":
        try:
            if ipn_data["payment_status"] == "Completed":
                usd = float(ipn_data["mc_gross"])
                wallet = ipn_data.get("custom", "")
                email = ipn_data.get("payer_email", "")
                if usd < MIN_PURCHASE_USD:
                    return "Below minimum", 400

                stc_amount = round(usd / EXCHANGE_RATE, 8)
                txid = send_stc(wallet, stc_amount)
                block = get_block_count()
                now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

                entry = {
                    "usd": usd,
                    "stc": stc_amount,
                    "wallet": wallet,
                    "block": block,
                    "txid": txid,
                    "time": now,
                    "via": "paypal"
                }
                save_transaction(entry)

                if email:
                    html = f"""
                    <h2>Thanks for your Starcoin purchase!</h2>
                    <p>Amount: {stc_amount} STC = ${usd}</p>
                    <p>Wallet: {wallet}</p>
                    <p>TXID: {txid}</p>
                    <img src='cid:qrcode'>
                    """
                    send_email(email, "Starcoin Receipt", html, txid)

                return "OK"
        except Exception as e:
            print("IPN error:", e)
            return "Error", 500

    return "INVALID", 400

@app.route("/sell", methods=["POST"])
def handle_sell():
    data = request.get_json()
    wallet = data.get("wallet")
    amount_stc = float(data.get("amount", 0))
    paypal_email = data.get("paypal_email", "")
    FEE_PERCENT = 3.5

    if not wallet or amount_stc <= 0 or not paypal_email:
        return jsonify({"status": "error", "msg": "Invalid input"}), 400

    gross_usd = round(amount_stc * SELL_RATE, 2)
    fee = round(gross_usd * FEE_PERCENT / 100, 2)
    net_usd = round(gross_usd - fee, 2)
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    entry = {
        "usd": net_usd,
        "gross_usd": gross_usd,
        "fee": fee,
        "stc": amount_stc,
        "wallet": wallet,
        "paypal_email": paypal_email,
        "txid": "",
        "block": get_block_count(),
        "time": now,
        "via": "sell"
    }

    save_transaction(entry)

    if paypal_email:
        html = f"""
        <h2>Starcoin Sell Request</h2>
        <p>You sold {amount_stc} STC for ${net_usd} USD after a ${fee} fee.</p>
        <p>Payout will be sent to: {paypal_email}</p>
        """
        try:
            send_email(paypal_email, "Sell Confirmation", html, wallet)
        except Exception as e:
            print("Email error:", e)

    return jsonify({
        "status": "success",
        "msg": f"Sold {amount_stc} STC for ${net_usd} USD after ${fee} fee",
        "net_usd": net_usd
    })

@app.route("/transactions", methods=["GET"])
def get_transactions():
    limit = int(request.args.get("limit", 10))
    with open(TRANSACTION_LOG) as f:
        return jsonify(json.load(f)[:limit])

@app.route("/transactions/all", methods=["GET"])
def get_all_transactions():
    with open(TRANSACTION_LOG) as f:
        return jsonify(json.load(f))

@app.route("/price/live", methods=["GET"])
def get_live_price():
    try:
        r = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd")
        return jsonify(r.json())
    except:
        return jsonify({"error": "Failed to fetch price"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
