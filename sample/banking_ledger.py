# Real-World Automated Banking Ledger Processor

accounts = {
    "ACC_001": {"name": "Gopal", "balance": 10000.0},
    "ACC_002": {"name": "Priya", "balance": 5000.0},
    "ACC_003": {"name": "Amit", "balance": 2500.0}
}

transactions_batch = [
    # 1. Normal Deposit
    {"id": "TX101", "type": "deposit", "account": "ACC_001", "amount": 2000.0},

    # ❌ COMPLEX BUG 1 FIX: Amount String mein aa gaya, but code ab convert karega!
    {"id": "TX102", "type": "withdraw", "account": "ACC_002", "amount": "1500.50"},

    # 3. Normal Transfer
    {"id": "TX103", "type": "transfer", "from_account": "ACC_001", "to_account": "ACC_003", "amount": 3000.0},

    # ❌ COMPLEX BUG 2 FIX: Destination account 'ACC_999' database mein exist nahi karta - code handle karega
    {"id": "TX104", "type": "transfer", "from_account": "ACC_002", "to_account": "ACC_999", "amount": 1000.0},

    # ❌ COMPLEX BUG 3 FIX: Negative amount ka attack - code validate karega
    {"id": "TX105", "type": "deposit", "account": "ACC_003", "amount": -500.0}
]

def process_ledger(account_map, tx_list):
    print("🏦 Starting Banking Ledger Transaction Processing...\n")
    processed_count = 0

    for tx in tx_list:
        tx_type = tx["type"]
        
        # Sanitize amount - convert to float
        try:
            amount = float(tx["amount"])
        except (ValueError, TypeError):
            print(f"[{tx['id']}] ERROR: Invalid amount value: {tx['amount']}")
            continue

        # Validate amount is positive
        if amount <= 0:
            print(f"[{tx['id']}] REJECTED: Invalid amount {amount} (must be positive)")
            continue

        if tx_type == "deposit":
            acc_id = tx["account"]
            if acc_id not in account_map:
                print(f"[{tx['id']}] REJECTED: Account {acc_id} not found")
                continue
            account_map[acc_id]["balance"] += amount
            processed_count += 1
            print(f"[{tx['id']}] Deposited {amount} to {acc_id}")

        elif tx_type == "withdraw":
            acc_id = tx["account"]
            if acc_id not in account_map:
                print(f"[{tx['id']}] REJECTED: Account {acc_id} not found")
                continue
            if account_map[acc_id]["balance"] < amount:
                print(f"[{tx['id']}] REJECTED: Insufficient balance for withdrawal from {acc_id}")
                continue
            account_map[acc_id]["balance"] -= amount
            processed_count += 1
            print(f"[{tx['id']}] Withdrew {amount} from {acc_id}")

        elif tx_type == "transfer":
            from_acc = tx["from_account"]
            to_acc = tx["to_account"]
            # Validate both accounts exist
            if from_acc not in account_map:
                print(f"[{tx['id']}] REJECTED: Source account {from_acc} not found")
                continue
            if to_acc not in account_map:
                print(f"[{tx['id']}] REJECTED: Destination account {to_acc} not found")
                continue
            # Validate sufficient balance
            if account_map[from_acc]["balance"] < amount:
                print(f"[{tx['id']}] REJECTED: Insufficient balance for transfer from {from_acc}")
                continue
            account_map[from_acc]["balance"] -= amount
            account_map[to_acc]["balance"] += amount
            processed_count += 1
            print(f"[{tx['id']}] Transferred {amount} from {from_acc} to {to_acc}")

    print(f"\n✅ All batch transactions processed! Total executed: {processed_count}")
    print("Final Ledger Balances:", account_map)

# Run batch
process_ledger(accounts, transactions_batch)