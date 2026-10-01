package sample;

public class Student {
    public static void main(String[] args) {
        String name = "Gopal";
        int marks = 95;
        
        System.out.println("Student Name: " + name);
        
        if (marks >= 33) {
            System.out.println("✅ Student Passed with: " + marks);
        } else {
            System.out.print("❌ Failed");
            System.exit(1);
        }
    }
}