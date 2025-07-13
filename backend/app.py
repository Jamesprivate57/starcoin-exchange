from flask import Flask, jsonify, request
from flask_cors import CORS
from wallet import get_balance, send_stc
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)

wallets = {
    "Alice": {
        "address": "rstar1qv6ju8sqzarkgje9l8d2gqqd60fqlt64x3cqlq7",
        "stc": 0.0,
        "usd": 0.0
    },
    "Bob": {
        "address": "rstar1q8g7eha7ehtt7z4t8n80rugh97a329946ync6n9",
        "stc": 0.0,
        "usd": 0.0
    }
}

transactions = []

def log_transaction(tx_type, from_user, to_user, amount, currency):
    transactions.append({
        "timestamp": datetime.utcnow().isoformat(),
        "type": tx_type,
        "from": from_user,
        "to": to_user,
        "amount": amount,
        "currency": currency
    })
    if len(transactions) > 10:
        transactions.pop(0)

@app.route("/wallets", methods=["GET"])
def get_wallets():
    output = []
    for name, data in wallets.items():
        balance = get_balance(data["address"])
        usd = round(balance * 0.05, 2)
        data["stc"] = balance
        data["usd"] = usd
        output.append({
            "name": name,
            "address": data["address"],
            "stc": balance,
            "usd": usd
        })
    return jsonify(output)

@app.route("/transfer", methods=["POST"])
def transfer():
    data = request.get_json()
    from_name = data.get("from")
    to_name = data.get("to")
    amount = float(data.get("amount", 0))

    if from_name not in wallets or to_name not in wallets:
        return jsonify({"error": "Invalid wallets"}), 400

    if wallets[from_name]["stc"] < amount:
        return jsonify({"error": "Insufficient STC balance"}), 400

    success = send_stc(wallets[from_name]["address"], wallets[to_name]["address"], amount)
    if success:
        wallets[from_name]["stc"] -= amount
        wallets[to_name]["stc"] += amount
        log_transaction("transfer", from_name, to_name, amount, "STC")
        return jsonify({"status": "success", "message": f"{amount} STC sent from {from_name} to {to_name}"}), 200
    else:
        return jsonify({"error": "Transfer failed"}), 500

@app.route("/sell", methods=["POST"])
def sell():
    data = request.get_json()
    from_name = data.get("from")
    send_amount = float(data.get("send_amount", 0))

    if from_name not in wallets:
        return jsonify({"error": "Invalid wallet"}), 400

    if wallets[from_name]["stc"] < send_amount:
        return jsonify({"error": "Insufficient STC balance"}), 400

    usd = round(send_amount * 0.05, 2)
    wallets[from_name]["stc"] -= send_amount
    wallets[from_name]["usd"] += usd
    log_transaction("sell", from_name, None, send_amount, "STC")
    return jsonify({"status": "success", "txid": True, "usd": usd})

@app.route("/withdraw", methods=["POST"])
def withdraw():
    data = request.get_json()
    from_name = data.get("from")
    amount = float(data.get("amount", 0))
    email = "jamesnmargie@live.com"  # Hardcoded PayPal email

    if from_name not in wallets:
        return jsonify({"error": "Invalid wallet"}), 400

    if wallets[from_name]["usd"] < amount:
        return jsonify({"error": "Insufficient USD balance"}), 400

    wallets[from_name]["usd"] -= amount
    log_transaction("withdraw", from_name, email, amount, "USD")
    return jsonify({"status": "success", "message": f"${amount:.2f} withdrawn to {email}"}), 200

@app.route("/mint", methods=["POST"])
def mint():
    data = request.get_json()
    to_name = data.get("to")
    if to_name not in wallets:
        return jsonify({"error": "Invalid wallet"}), 400

    hex_map = {
        "Alice": "0x04f118c871fac1fdd6b4c40fd7f9c4ed",
        "Bob": "0x6aa6178656e21cb07b83a5fd0a7164e2"
    }
    payload = {
        "jsonrpc": "2.0",
        "method": "dev.mint",
        "params": [hex_map[to_name], "1000000000"],
        "id": 1
    }
    try:
        res = requests.post("http://localhost:9850", json=payload).json()
        if "error" in res:
            return jsonify({"error": res["error"]["message"]}), 500
        log_transaction("mint", "system", to_name, 1, "STC")
        return jsonify({"status": "success", "message": f"1 STC minted to {to_name}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/transactions", methods=["GET"])
def get_transactions():
    return jsonify(transactions)

if __name__ == "__main__":
    app.run(port=5000)
