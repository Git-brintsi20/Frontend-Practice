
// index.ts - TypeScript Documentation with Examples

// 1. Annotations In Depth
// Type annotations explicitly specify the types of variables and functions.
let message: string = "Hello, TypeScript!";

// 2. Type Inference
// TypeScript can infer types without explicit annotations.
let count = 42; // Inferred as number

// 3. Any Type
// Allows a variable to hold any type.
let dynamicVar: any = "Could be anything";
dynamicVar = 42; // No error

// 4. Function Parameter Annotations
function greet(name: string): string {
    return `Hello, ${name}`;
}

// 5. Default Params Values
function greetWithDefault(name: string = "Guest"): string {
    return `Hello, ${name}`;
}

// 6. Function Return Annotations
function add(a: number, b: number): number {
    return a + b;
}

// 7. Void Functions
function logMessage(message: string): void {
    console.log(message);
}

// 8. Never Keyword In Depth
function throwError(errorMsg: string): never {
    throw new Error(errorMsg);
}

// 9. Arrays Types In Depth
let numbers: number[] = [1, 2, 3, 4, 5];

// 10. Multi Dimensional Arrays
let matrix: number[][] = [[1, 2], [3, 4]];

// 11. Objects In Depth
let person: { name: string; age: number } = { name: "Alice", age: 25 };

// 12. Type Aliases
type User = { name: string; age: number };
let user: User = { name: "Bob", age: 30 };

// 13. Optional Properties
type Car = { brand: string; model?: string };
let myCar: Car = { brand: "Tesla" };

// 14. Readonly Property
type ImmutableUser = { readonly id: number; name: string };
let user1: ImmutableUser = { id: 1, name: "John" };
// user1.id = 2; // Error: Cannot assign to 'id' because it is a read-only property.

// 15. Intersection Types
type Employee = { empId: number } & User;
let emp: Employee = { empId: 101, name: "Alice", age: 28 };

// 16. Unions
let value: string | number;
value = "Hello";
value = 100;

// 17. Literal Types
let direction: "left" | "right";
direction = "left";
// direction = "up"; // Error: Type '"up"' is not assignable to type '"left" | "right"'.

// 18. Tuples
let tuple: [string, number] = ["Alice", 25];

// 19. Enums
enum Status { Active, Inactive, Pending }
let currentStatus: Status = Status.Active;

// 20. OOP
class Animal {
    constructor(public name: string) {}
    speak(): void {
        console.log(`${this.name} makes a noise.`);
    }
}

// 21. Interfaces
interface Student {
    name: string;
    age: number;
}
let student: Student = { name: "Jake", age: 22 };

// 22. Generics
function identity<T>(arg: T): T {
    return arg;
}
let output = identity<string>("Generic Example");

// 23. Type Narrowing
function printId(id: string | number) {
    if (typeof id === "string") {
        console.log(`ID is a string: ${id.toUpperCase()}`);
    } else {
        console.log(`ID is a number: ${id}`);
    }
}

// 24. Amazing Setup For TypeScript
// Use tsconfig.json to configure TypeScript settings for better development experience.

// 25. Declaration Files
// Declaration files (.d.ts) provide type information for JavaScript libraries.
// Example: @types/node provides Node.js type definitions.

// 26. TypeScript With Axios
import axios from 'axios';
async function fetchData(url: string) {
    const response = await axios.get(url);
    console.log(response.data);
}

// 27. TypeScript With Express
import express, { Request, Response } from 'express';
const app = express();
app.get('/', (req: Request, res: Response) => {
    res.send('Hello TypeScript with Express!');
});
app.listen(3000, () => console.log('Server running on port 3000'));

// End of documentation

