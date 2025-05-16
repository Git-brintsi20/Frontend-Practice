"use strict";
// index.ts - TypeScript Documentation with Examples
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 1. Annotations In Depth
// Type annotations explicitly specify the types of variables and functions.
let message = "Hello, TypeScript!";
// 2. Type Inference
// TypeScript can infer types without explicit annotations.
let count = 42; // Inferred as number
// 3. Any Type
// Allows a variable to hold any type.
let dynamicVar = "Could be anything";
dynamicVar = 42; // No error
// 4. Function Parameter Annotations
function greet(name) {
    return `Hello, ${name}`;
}
// 5. Default Params Values
function greetWithDefault(name = "Guest") {
    return `Hello, ${name}`;
}
// 6. Function Return Annotations
function add(a, b) {
    return a + b;
}
// 7. Void Functions
function logMessage(message) {
    console.log(message);
}
// 8. Never Keyword In Depth
function throwError(errorMsg) {
    throw new Error(errorMsg);
}
// 9. Arrays Types In Depth
let numbers = [1, 2, 3, 4, 5];
// 10. Multi Dimensional Arrays
let matrix = [[1, 2], [3, 4]];
// 11. Objects In Depth
let person = { name: "Alice", age: 25 };
let user = { name: "Bob", age: 30 };
let myCar = { brand: "Tesla" };
let user1 = { id: 1, name: "John" };
let emp = { empId: 101, name: "Alice", age: 28 };
// 16. Unions
let value;
value = "Hello";
value = 100;
// 17. Literal Types
let direction;
direction = "left";
// direction = "up"; // Error: Type '"up"' is not assignable to type '"left" | "right"'.
// 18. Tuples
let tuple = ["Alice", 25];
// 19. Enums
var Status;
(function (Status) {
    Status[Status["Active"] = 0] = "Active";
    Status[Status["Inactive"] = 1] = "Inactive";
    Status[Status["Pending"] = 2] = "Pending";
})(Status || (Status = {}));
let currentStatus = Status.Active;
// 20. OOP
class Animal {
    constructor(name) {
        this.name = name;
    }
    speak() {
        console.log(`${this.name} makes a noise.`);
    }
}
let student = { name: "Jake", age: 22 };
// 22. Generics
function identity(arg) {
    return arg;
}
let output = identity("Generic Example");
// 23. Type Narrowing
function printId(id) {
    if (typeof id === "string") {
        console.log(`ID is a string: ${id.toUpperCase()}`);
    }
    else {
        console.log(`ID is a number: ${id}`);
    }
}
// 24. Amazing Setup For TypeScript
// Use tsconfig.json to configure TypeScript settings for better development experience.
// 25. Declaration Files
// Declaration files (.d.ts) provide type information for JavaScript libraries.
// Example: @types/node provides Node.js type definitions.
// 26. TypeScript With Axios
const axios_1 = __importDefault(require("axios"));
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(url);
        console.log(response.data);
    });
}
// 27. TypeScript With Express
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Hello TypeScript with Express!');
});
app.listen(3000, () => console.log('Server running on port 3000'));
// End of documentation
