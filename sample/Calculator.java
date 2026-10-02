package sample;

public class Calculator {
    public static void main(String[] args) {
        int a = 10;
        int b = 5;
        
        int result = a + b;
        
        if (result != 15) {
            System.err.println("❌ Test Failed! Expected 15, but got: " + result);
            System.exit(1);
        }
        
        System.out.println("✅ Java Test Passed successfully!");
    }
}