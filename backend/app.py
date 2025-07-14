# starcoin_exchange/app.py (Full Expert Version with All Final Touch Options)

from flask import Flask, request, jsonify, send_file
import json, os, subprocess, time
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
EXCHANGE_RATE = 3486  # 1 STC = $3486
MIN_PURCHASE_USD = 6972  # 2 STC
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
            data.insert(0, entry)  # insert at top
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
        "time": now
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

@app.route("/transactions", methods=["GET"])
def get_transactions():
    limit = int(request.args.get("limit", 10))
    with open(TRANSACTION_LOG) as f:
        all_tx = json.load(f)
        return jsonify(all_tx[:limit])

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

# Use Gunicorn in production: gunicorn -w 4 -b 0.0.0.0:5000 app:app
if __name__ == "__main__":
    app.run(port=5000, debug=True)
