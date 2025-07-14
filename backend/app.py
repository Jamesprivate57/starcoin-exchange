# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request
import subprocess
import json
import time

app = Flask(__name__)

# CLI + Node settings
LITECOIN_CLI = "/mnt/c/CryptoProjects/litecoin/src/litecoin-cli"
DATADIR = "/mnt/c/CryptoProjects/starcoin-data"
WALLET_NAME = "starcoin_wallet"
CONFIRM_ADDRESS = "rstar1qv6ju8sqzarkgje9l8d2gqqd60fqlt64x3cqlq7"
NETWORK = "-regtest"
MIN_STC = 10

TX_LOG = "transactions.json"

# Load existing transactions
try:
    with open(TX_LOG, "r") as f:
        transactions = json.load(f)
except:
    transactions = []

def send_stc(address, amount):
    """Send STC via litecoin-cli"""
    cmd = [
        LITECOIN_CLI, NETWORK,
        f"-datadir={DATADIR}",
        f"-rpcwallet={WALLET_NAME}",
        "sendtoaddress", address, str(amount)
    ]
    txid = subprocess.check_output(cmd).decode().strip()
    return txid

def mine_block():
    """Mine 1 block to confirm"""
    cmd = [
        LITECOIN_CLI, NETWORK,
        f"-datadir={DATADIR}",
        "generatetoaddress", "1", CONFIRM_ADDRESS
    ]
    subprocess.call(cmd)

@app.route("/transfer", methods=["POST"])
def transfer():
    data = request.get_json()
    address = data.get("address", "").strip()
    amount = float(data.get("amount", 0))
    name = data.get("name", "Anonymous")

    if not address.startswith("rstar1q") or amount < MIN_STC:
        return jsonify({"error": "Invalid address or amount < 10 STC"}), 400

    try:
        txid = send_stc(address, amount)
        mine_block()

        entry = {
            "name": name,
            "stc": amount,
            "address": address,
            "txid": txid,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }

        transactions.insert(0, entry)
        transactions[:] = transactions[:10]

        with open(TX_LOG, "w") as f:
            json.dump(transactions, f, indent=2)

        return jsonify({"status": "success", "txid": txid, "message": f"{amount} STC sent to {address}"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/transactions", methods=["GET"])
def get_tx():
    return jsonify(transactions)

@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "🚀 Starcoin Exchange API is live."})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
