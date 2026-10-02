# E-Commerce Order Checkout & Invoice Generator

# Shop Inventory
inventory = {
    "P101": {"title": "Wireless Earbuds", "price": 2000.0, "stock": 5},
    "P102": {"title": "Smart Watch", "price": 4500.0, "stock": 1},  # Sirf 1 piece hai!
    "P103": {"title": "Fast Charger", "price": 800.0, "stock": 10}
}

# Incoming Customer Orders
customer_order = {
    "order_id": "ORD-9921",
    "customer": {
        "name": "Gopal Kumar",
        # ❌ BUG 1: City missing hai! Phat jayega: KeyError: 'city'
        "address": {"pincode": "152107", "state": "Punjab"}
    },
    "items": [
        {"product_id": "P101", "quantity": 2},
        # ❌ BUG 2: Stock sirf 1 hai, lekin order 3 ka hai! (Out of stock handling missing)
        {"product_id": "P102", "quantity": 3},
        {"product_id": "P103", "quantity": 1}
    ],
    # ❌ BUG 3: Coupon "SAVE20" (20% off) calculate karne ka logic galat hai
    "coupon": "SAVE20"
}

def checkout_and_generate_invoice(stock_data, order):
    print("🛍️ Starting Order Processing for:", order["order_id"])

    # 1. Address Format
    cust = order["customer"]
    shipping_to = cust["name"] + ", " + cust["address"]["city"] + " - " + cust["address"]["pincode"]

    # 2. Calculate Subtotal & Deduct Stock
    subtotal = 0.0
    for item in order["items"]:
        pid = item["product_id"]
        qty = item["quantity"]

        # Yahan inventory check missing hai!
        stock_data[pid]["stock"] -= qty
        subtotal += stock_data[pid]["price"] * qty

    # 3. Apply Discount
    discount = 0.0
    if order["coupon"] == "SAVE20":
        discount = subtotal * "0.20" # ❌ BUG 4: String se multiply kar diya! (TypeError)

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
    # ❌ BUG 5: Type mismatch in string formatting
    print("Total Payable: " + "₹" + final_amount)
    print("-------------------------------------------\n")
    print("Remaining Stock:", stock_data)

# Run checkout
checkout_and_generate_invoice(inventory, customer_order)