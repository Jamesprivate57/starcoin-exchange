from flask import Flask, request, jsonify
import requests
from datetime import datetime

app = Flask(__name__)

wallets = {
    "Alice": {
        "address": "0x04f118c871fac1fdd6b4c40fd7f9c4ed",
        "stc": 0.0,
        "usd": 100.0  # starting USD balance for demo
    },
    "Bob": {
        "address": "0x6aa6178656e21cb07b83a5fd0a7164e2",
        "stc": 0.0,
        "usd": 100.0
    }
}

transactions = []

EXCHANGE_RATE = 0.05  # 1 STC = $0.05

@app.route("/")
def root():
    return jsonify({"message": "🚀 Starcoin Exchange API is live."})

@app.route("/wallets", methods=["GET"])
def get_wallets():
    live_balances = []
    for name, info in wallets.items():
        live_balances.append({
            "name": name,
            "address": info["address"],
            "stc": info["stc"],
            "usd": info["usd"]
        })
    return jsonify(live_balances)

@app.route("/buy", methods=["POST"])
def buy():
    data = request.get_json()
    name = data.get("name")
    usd_amount = float(data.get("usd"))

    if name not in wallets:
        return jsonify({"error": "Invalid wallet name"}), 400

    wallet = wallets[name]
    if wallet["usd"] < usd_amount:
        return jsonify({"error": "Insufficient USD balance"}), 400

    stc_amount = usd_amount / EXCHANGE_RATE
    wallet["usd"] -= usd_amount
    wallet["stc"] += stc_amount

    transactions.append({
        "type": "buy",
        "name": name,
        "usd": usd_amount,
        "stc": stc_amount,
        "timestamp": datetime.utcnow().isoformat()
    })

    return jsonify({
        "status": "success",
        "message": f"{name} bought {stc_amount:.2f} STC for ${usd_amount:.2f}",
        "balance": wallet
    })

@app.route("/sell", methods=["POST"])
def sell():
    data = request.get_json()
    name = data.get("name")
    stc_amount = float(data.get("stc"))

    if name not in wallets:
        return jsonify({"error": "Invalid wallet name"}), 400

    wallet = wallets[name]
    if wallet["stc"] < stc_amount:
        return jsonify({"error": "Insufficient STC balance"}), 400

    usd_amount = stc_amount * EXCHANGE_RATE
    wallet["stc"] -= stc_amount
    wallet["usd"] += usd_amount

    transactions.append({
        "type": "sell",
        "name": name,
        "stc": stc_amount,
        "usd": usd_amount,
        "timestamp": datetime.utcnow().isoformat()
    })

    return jsonify({
        "status": "success",
        "message": f"{name} sold {stc_amount:.2f} STC for ${usd_amount:.2f}",
        "balance": wallet
    })

@app.route("/transactions", methods=["GET"])
def get_transactions():
    return jsonify(transactions)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
