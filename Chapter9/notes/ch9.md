# Chapter 9

## Typescript
- Typescript is an open-sourced typed superset of JS developed by Microsoft that compiles to plain JS

## Background and introduction
- Typescript was developed for large-scale JS development and offers features like better development-time tooling, static code analysis, compile-time type checking, and code level documentation

### Main principle
- Typescript is a typed superset of JS which is eventually compiled into plain JS
    - You can even determine which version of the generated code as long as it's ECMAScript 3 or newer
    - Being a superset means that it includes add JS features plus its own features
    - All valid JS code is valid TS code

- Typescript consists of 3 separate parts:
    - The language
    - The compiler
    - The language service

- The language consists of syntax, keywords, and type annotations
    - The syntax is similar but not the same as JS syntax
    - Of the three parts of TS, the language is what programmers have the most direct connection with

- The compiler is responsible for type information erasure - i.e. removing the typing information - and code transformations
    - The code transformations are what allow TS code to be transpiled
    - Everything related to types is removed at compile-time so TypeScript isn't actually genuine statically-typed code
    - Technically we transpile TS, not compile it, but coloquially either work
    - The compiler also performs a static code analysis - it can emit warnings or errors if it finds a reason to do so and it can be set to perform additional tasks like combining the code into a single file

- The language service collects type information from the source code
    - Dev tools can use the type information for intellisense, type hints, and refactoring alternatives

### Typescript key language features

#### Type annotations
- Type annotations in TS are a lightweight way to record the intended contract of a function or variable

- Here we define a function that accepts specifically typed arguments and returns a typed value:

```ts
const birthdayGreeter = (name: string, age: number): string => {
  return `Happy birthday ${name}, you are now ${age} years old!`;
};

const birthdayHero = "Jane User";
const age = 22;

console.log(birthdayGreeter(birthdayHero, 22));
```

#### Structural typing
- TS is a structurally typed language, meaning that two elements are considered compatible with each other if, for each feature within the type of the first element a corresponding and identical feature exists in the type of the second element

- Two types are considered identical if they are compatible with each other

#### Type inference
- The TS compiler can attempt to infer the type information if no type has been specified
    - A variable's type can be inferred based on its assigned value and its usage - the type inference take place when initializing variables and members, setting parameter default values, and determining function return types

- For example, this *add* function:
```ts
const add = (a: number, b: number) => {
  /* The return value is used to determine
     the return type of the function */
  return a + b;
}
```

- The function's return value is inferred by retracing the code to the return expression
    - The return performs an addition of **a** and **b**
    - We can see **a** and **b** are `numbers` based on their types
    - Thus the return of the *add* function must also be a number

- A more complex example:
```ts
type CallsFunction = (callback: (result: string) => any) => void;

const func: CallsFunction = (cb) => {
  cb('done');
  cb(1);
}

func((result) => {
  return result;
});
```

- First we declare a *type alias* called `CallsFunction` - a function type with one parameter *callback*
    - *callback* is of type function which takes a string and returns *any* value - essentially a "wildcard" type
    - Next we define the function *func* of the type *CallsFunction* - we can infer cb will only accept a string as an argument (`cb(1)` will throw an error)
    - Lastly we call *func* giving it the following function as a parameter
        ```ts
        (result) => {
            return result;
        }
        ```

- Despite the of the parameter function not being defined, we can infer from the calling context that the argument result is of type string

#### Type erasure
- TS removes all type system constructs during compilation
    - **Input**
        - `let x: SomeType`
    - **Output**
        - `let x`

- This means no type information remains at runtime - meaning you can't use reflection or other metadata systems

### Why should one use TypeScript?
- Typescript is argued for and against online - but as with all things it depends on if you need the functionality that TS offers

- Some advantages of TS are:
    - *type checking and static code analysis* - we can require values to be of a certain type, have the compiler warn about using them wrong
        - This can reduce runtime errors and maybe redude number of required unit tests when it comes to pure type tests
        - This will also warn of misspellings and usage of variables outside of their scope
    - *code level documentation* - it's easy to check from a function signature what kind of arguments the function can consume and what type of data it will return
    - *specific and smart intellisense* - easier for IDEs to offer better functionality and suggestions when it knows what type of data you're processing

### What does TypeScript not fix?
- Even if your TS compiler doesn't throw any errors, they can still happen at runtime
    - These errors are especially common when it comes to handling external input - such as data received from a network request

#### Incomplete, invalid, or missing types in external libraries
- When using external libraries you may find that some have either missing or invalid type declarations - usually because it wasn't written in TS or the type declarations weren't written correctly

- In this case you may need to write type declarations yourself - but also check [Definitely Typed](https://definitelytyped.org/) or their [Github page](https://github.com/DefinitelyTyped/DefinitelyTyped) first
    - These will often have type declaration files

#### Sometimes type inference needs assistance
- Type inference in TS is good - but not perfect, sometimes despite "doing everything right" the compiler will tell you that property doesn't exist or that the usage is illegal

- In this case you may need to help the compiler by doing an "extra" type check
    - Be careful with casting and type guards - when doing this you are promising the compiler that the value really is of the type you declare
    - See [Type Assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) and [Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)

#### Mysterious type errors
- The errors given by the type system might sometimes be hard to understand, especially for complex types

- Most of the time the most useful error message information will be at the end

## First steps with TypeScript

### Setting things up

### Creating your own first types

### @types/{npmpackage}

### Improving the project

### More about tsconfig

### Adding express to the mix

### The horrors of any

## Typing the express app

### Setting up the project

### Let there be code

### Implementing the functionality

### Node and JSON modules

### Utility types

### Preventing and accidental undefined result

### Adding a new diary

### Proofing requests

## React with types

### Create React App with TypeScript

### React components with TypeScript

### Deeper type usage

### A note about defining object types

### Working with an existing codebase

### Patientor frontend

### State handling

### Patient listing page

### Full entries

### Add patient form