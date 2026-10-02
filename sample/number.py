numbers = [1, 2, 3]
print("First number is: " + str(numbers[0]))
for i in range(len(numbers)):
    print("Index:", i, "Value:", numbers[i])
total = sum(numbers)
average = total / len(numbers)
print("Average is", average)
if average == 2:
    print("Average equals 2")
print("Program finished")