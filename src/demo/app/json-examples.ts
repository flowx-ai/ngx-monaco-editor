export const EXAMPLE_JSON = `{
  "app": {"valid": \${app.valid}}}`;

export const mvelCode = `// Define a class named Person
class Person {
    // Declare class properties
    String name;
    int age;

    // Constructor
    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Method to return a greeting
    String greet() {
        return "Hello, my name is " + name + " and I am " + age + " years old.";
    }
}

// Instantiate a Person object
Person person = new Person("Alice", 30);

// Call the greet method and print the result
System.out.println(person.greet());
`;

export const pyCode = `# Define a class named Person
class Person:
    # Constructor
    def __init__(self, name, age):
        self.name = name
        self.age = age

    # Method to return a greeting
    def greet(self):
        return f"Hello, my name is {self.name} and I am {self.age} years old."

# Instantiate a Person object
person = Person("Alice", 30)

# Call the greet method and print the result
print(person.greet())
`;
export const jsCode = `// Define a class named Person
class Person {
    // Constructor
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // Method to return a greeting
    greet() {
        return 'Hello, my name is ' + this.name + ' and I am ' + this.age + ' years old.';
    }
}

// Instantiate a Person object
const person = new Person("Alice", 30);

// Call the greet method and print the result
console.log(person.greet());`;

export const groovyCode = `// Define a class named Person
class Person {
    String name
    int age

    // Constructor
    Person(String name, int age) {
        this.name = name
        this.age = age
    }

    // Method to return a greeting
    String greet() {
        return "Hello, my name is $name and I am $age years old."
    }
}

// Instantiate a Person object
def person = new Person("Alice", 30)

// Call the greet method and print the result
println(person.greet())

`;
