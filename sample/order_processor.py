# E-Commerce Order Checkout & Invoice Generator

# Shop Inventory
inventory = {
    "P101": {"title": "Wireless Earbuds", "price": 2000.0, "stock": 5},
    "P102": {"title": "Smart Watch", "price": 4500.0, "stock": 1},
    "P103": {"title": "Fast Charger", "price": 800.0, "stock": 10}
}

# Incoming Customer Orders
customer_order = {
    "order_id": "ORD-9921",
    "customer": {
        "name": "Gopal Kumar",
        "address": {"city": "Ludhiana", "pincode": "152107", "state": "Punjab"}
    },
    "items": [
        {"product_id": "P101", "quantity": 2},
        {"product_id": "P102", "quantity": 3},
        {"product_id": "P103", "quantity": 1}
    ],
    "coupon": "SAVE20"
}

def checkout_and_generate_invoice(stock_data, order):
    print("🛍️ Starting Order Processing for:", order["order_id"])

    # 1. Address Format
    cust = order["customer"]
    shipping_to = cust["name"] + ", " + cust["address"].get("city", "Unknown") + " - " + cust["address"]["pincode"]

    # 2. Calculate Subtotal & Deduct Stock
    subtotal = 0.0
    for item in order["items"]:
        pid = item["product_id"]
        qty = item["quantity"]
        
        if pid not in stock_data:
            continue
            
        if stock_data[pid]["stock"] < qty:
            print(f"Warning: Insufficient stock for {stock_data[pid]['title']}. Available: {stock_data[pid]['stock']}, Requested: {qty}")
            qty = stock_data[pid]["stock"]  # Only process available stock
            
        stock_data[pid]["stock"] -= qty
        subtotal += stock_data[pid]["price"] * qty

    # 3. Apply Discount
    discount = 0.0
    if order.get("coupon") == "SAVE20":
        discount = subtotal * 0.20

    total = subtotal - discount
    tax = total * 0.18 # 18% GST
    final_amount = total + tax

    # 4. Generate Receipt
    print("\n-------------------------------------------")
    print("🧾 INVOICE RECEIPT")
    print("Order ID:", order["order_id"])
    print("Customer:", shipping_to)
    print("Subtotal: ₹", subtotal)
    print("Discount: ₹", discount)
    print("GST (18%): ₹", tax)
    print("Total Payable: ₹" + str(final_amount))
    print("-------------------------------------------\n")
    print("Remaining Stock:", stock_data)

# Run checkout
checkout_and_generate_invoice(inventory, customer_order)