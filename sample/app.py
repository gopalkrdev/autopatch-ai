def generate_greeting(name, age):
    message = "Hello " + name + ", your age is " + str(age)
    return message

# Test Case
result = generate_greeting("Gopal", 21)

# Check
if "your age is 21" in result:
    print("✅ Python Test Passed successfully!")
else:
    raise AssertionError("Test Failed!")