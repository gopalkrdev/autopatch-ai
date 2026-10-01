# User Profile Formatter Service

def format_user_profile(user_data):
    # Handle missing keys and None values gracefully
    first_name = user_data.get("name", {}).get("first", "Unknown")
    last_name = user_data.get("name", {}).get("last", "")
    
    email = user_data.get("email")
    if email:
        email = email.lower()
    else:
        email = "no-email"
    
    birth_year = 2026 - user_data.get("age", 0)

    # Clean up formatting - if no last name, don't add extra space
    name_string = f"{first_name} {last_name}".strip()
    
    return f"User: {name_string} ({email}) - Born: {birth_year}"


# Database se aane wala real data:
users_from_db = [
    {
        "name": {"first": "Rahul", "last": "Sharma"},
        "email": "Rahul@Gmail.COM",
        "age": 22
    },
    {
        # ❌ REAL HUMAN BUG: Is user ne Google Sign-in kiya tha, toh iska 'last' name missing hai!
        # Python yahan crash karega: KeyError: 'last'
        "name": {"first": "Aman"},
        "email": "Aman@Company.in",
        "age": 25
    },
    {
        # ❌ REAL HUMAN BUG 2: Is user ka email None hai!
        # Python yahan crash karega: AttributeError: 'NoneType' has no attribute 'lower'
        "name": {"first": "Priya", "last": "Verma"},
        "email": None,
        "age": 20
    }
]

# Process and print profiles
print("Starting profile processing...")
for user in users_from_db:
    card = format_user_profile(user)
    print(card)

print("All user profiles processed successfully!")