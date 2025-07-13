# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)

# In-memory wallet balances (STC and USD)
wallets = {
    "Alice": {"stc": 100.0, "usd": 0.0},
    "Bob": {"stc": 50.0, "usd": 0.0},
    "Charlie": {"stc": 75.0, "usd": 0.0}
}

# Simulated transaction history
transactions = []

# Fixed exchange rate
EXCHANGE_RATE = 0.05  # 1 STC = 0.05 USD

@app.route("/")
def index():
    return jsonify({"message": "🚀 Starcoin Exchange API is live."})

@app.route("/wallets", methods=["GET"])
def get_wallets():
    return jsonify(wallets)

@app.route("/transactions", methods=["GET"])
def get_transactions():
    return jsonify(transactions)

@app.route("/buy", methods=["POST"])
def buy_stc():
    data = request.get_json()
    name = data.get("name")
    usd_amount = float(data.get("usd"))

    if name not in wallets:
        return jsonify({"error": "Invalid wallet name"}), 400

    stc_bought = usd_amount / EXCHANGE_RATE
    wallets[name]["stc"] += stc_bought
    wallets[name]["usd"] -= usd_amount  # simulate deduction

    transactions.append({
        "type": "buy",
        "name": name,
        "usd": usd_amount,
        "stc": stc_bought,
        "timestamp": datetime.utcnow().isoformat()
    })

    return jsonify({
        "status": "success",
        "message": f"{stc_bought:.2f} STC bought for ${usd_amount:.2f}",
        "balance": wallets[name]
    })

@app.route("/sell", methods=["POST"])
def sell_stc():
    data = request.get_json()
    name = data.get("name")
    stc_amount = float(data.get("stc"))

    if name not in wallets:
        return jsonify({"error": "Invalid wallet name"}), 400

    if wallets[name]["stc"] < stc_amount:
        return jsonify({"error": "Insufficient STC"}), 400

    usd_earned = stc_amount * EXCHANGE_RATE
    wallets[name]["stc"] -= stc_amount
    wallets[name]["usd"] += usd_earned

    transactions.append({
        "type": "sell",
        "name": name,
        "usd": usd_earned,
        "stc": stc_amount,
        "timestamp": datetime.utcnow().isoformat()
    })

    return jsonify({
        "status": "success",
        "message": f"{stc_amount:.2f} STC sold for ${usd_earned:.2f}",
        "balance": wallets[name]
    })

@app.route("/withdraw", methods=["POST"])
def withdraw():
    data = request.get_json()
    name = data.get("name")
    usd_amount = float(data.get("usd"))
    email = data.get("email")

    if name not in wallets:
        return jsonify({"error": "Invalid wallet name"}), 400

    if wallets[name]["usd"] < usd_amount:
        return jsonify({"error": "Insufficient USD balance"}), 400

    wallets[name]["usd"] -= usd_amount

    transactions.append({
        "type": "withdraw",
        "name": name,
        "usd": usd_amount,
        "email": email,
        "timestamp": datetime.utcnow().isoformat()
    })

    return jsonify({
        "status": "success",
        "message": f"${usd_amount:.2f} withdrawn to PayPal email: {email}",
        "balance": wallets[name]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
