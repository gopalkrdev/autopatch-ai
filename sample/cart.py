# Shopping Cart Average Price Calculator

def calculate_average_price(items):
    if not items:
        return 0
    total = sum(item["price"] for item in items)
    average = total / len(items)
    return average

# Test Case 1: Normal Items
cart_items = [
    {"name": "Laptop", "price": 50000},
    {"name": "Mouse", "price": 1000}
]
print("Normal cart avg:", calculate_average_price(cart_items))

# Test Case 2: Khali Cart (Edge Case - Yahan code phatega!)
empty_cart = []
empty_result = calculate_average_price(empty_cart)

if empty_result == 0:
    print("✅ Cart Test Passed successfully!")
else:
    raise AssertionError("Test Failed!")