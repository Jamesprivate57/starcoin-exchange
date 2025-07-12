import requests

NODE_URL = "http://localhost:9850"
EXCHANGE_RATE = 0.05  # 1 STC = $0.05 USD

# Map frontend bech32 to actual Starcoin hex addresses
address_map = {
    "rstar1qv6ju8sqzarkgje9l8d2gqqd60fqlt64x3cqlq7": "0x04f118c871fac1fdd6b4c40fd7f9c4ed",
    "rstar1q8g7eha7ehtt7z4t8n80rugh97a329946ync6n9": "0x6aa6178656e21cb07b83a5fd0a7164e2"
}

def get_balance(bech32_address):
    hex_address = address_map.get(bech32_address)
    if not hex_address:
        print("Unknown address:", bech32_address)
        return 0.0

    payload = {
        "jsonrpc": "2.0",
        "method": "state.list_resource",
        "params": [hex_address],
        "id": 1
    }

    try:
        res = requests.post(NODE_URL, json=payload).json()
        resources = res["result"]["resources"]
        key = "0x00000000000000000000000000000001::Account::Balance<0x00000000000000000000000000000001::STC::STC>"
        raw = resources.get(key, {}).get("raw", "0x00")

        # Extract 8-byte little-endian value (nanoSTC)
        hex_little = raw[2:18]
        value = int.from_bytes(bytes.fromhex(hex_little), "little")
        return value / 1e9
    except Exception as e:
        print("Balance error:", e)
        return 0.0

def send_stc(from_address, to_address, amount):
    # Simulated transfer — replace with signed tx via JSON-RPC later
    print(f"Simulated sending {amount} STC from {from_address} to {to_address}")
    return True
