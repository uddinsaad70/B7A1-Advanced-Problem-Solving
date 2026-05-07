# The Four Pillars of OOP in TypeScript: Managing Complexity at Scale

## Introduction

As a project grows, code gets complicated fast. Functions multiply, logic scatters, and one change breaks five things we did not expect. Object-Oriented Programming (OOP) exists to fight this chaos. Its four pillars, **Inheritance**, **Polymorphism**, **Abstraction**, and **Encapsulation**, are not abstract academic concepts. They are practical tools for keeping large TypeScript codebases clean, predictable, and maintainable.

Let us walk through each pillar, where it lives in real code, and why it matters.

---

## Pillar 1: Inheritance - Stop Repeating Yourself

Inheritance lets one class acquire the properties and methods of another. The child class gets everything the parent has, then adds whatever is unique to itself.

**Without inheritance**, shared logic gets copy-pasted into every class:

```typescript
class Student {
    name: string;
    age: number;
    address: string;
    constructor(name: string, age: number, address: string) { ... }
    getSleep(hours: number) { console.log(`${this.name} sleeping...`); }
}

class Teacher {
    name: string;
    age: number;
    address: string;
    // exact same constructor and getSleep, duplicated!
}
```

**With inheritance**, the shared logic lives in one place:

```typescript
class Parent {
  name: string;
  age: number;
  address: string;

  constructor(name: string, age: number, address: string) {
    this.name = name;
    this.age = age;
    this.address = address;
  }

  getSleep(hours: number) {
    console.log(`${this.name} is sleeping for ${hours} hours.`);
  }
}

class Student extends Parent {}

class Teacher extends Parent {
  designation: string;

  constructor(name: string, age: number, address: string, designation: string) {
    super(name, age, address);
    this.designation = designation;
  }
}
```

`Student` gets `getSleep` for free. `Teacher` adds its own `designation` on top of everything it inherits. If we ever need to fix `getSleep`, we fix it in **one place**, `Parent`, and every child class benefits instantly.

---

## Pillar 2: Polymorphism - One Interface, Many Behaviors

Polymorphism means "many forms." In practice, a single function can accept a parent type and correctly call the right method on any subclass, because each subclass has its own version of that method.

```typescript
class Person {
  getSleep(hours: number) {
    console.log(`Person is sleeping for ${hours} hours.`);
  }
}

class Student extends Person {
  getSleep(hours: number) {
    console.log(`Student is sleeping for ${hours} hours.`);
  }
}

class NextLevelDeveloper extends Person {
  getSleep(hours: number) {
    console.log(`Next-level developer is sleeping for ${hours} hours.`);
  }
}
```

Now we write one function that works for all of them:

```typescript
const getSleepingHours = (param: Person) => {
  param.getSleep(7);
};

getSleepingHours(new Person()); // Person is sleeping for 7 hours.
getSleepingHours(new Student()); // Student is sleeping for 7 hours.
getSleepingHours(new NextLevelDeveloper()); // Next-level developer is sleeping for 7 hours.
```

The function accepts `Person` but TypeScript correctly dispatches to each subclass's own `getSleep`. We did not write three functions, we wrote one. Adding a new type (`FrontendDeveloper extends Person`) requires zero changes to `getSleepingHours`.

This scales beautifully. Here is the same idea with shapes:

```typescript
class Shape {
  getArea(): number {
    return 0;
  }
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();
  }
  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(
    public length: number,
    public width: number,
  ) {
    super();
  }
  getArea(): number {
    return this.length * this.width;
  }
}

const getAreaOfShape = (param: Shape) => {
  console.log(`Area: ${param.getArea()}`);
};

getAreaOfShape(new Circle(5)); // Area: 78.53981633974483
getAreaOfShape(new Rectangle(4, 6)); // Area: 24
```

One `getAreaOfShape` function handles circles, rectangles, triangles, whatever we add next.

---

## Pillar 3: Abstraction - Show the What, Hide the How

Abstraction means exposing only what a user of our class _needs to know_, and hiding the implementation details. TypeScript supports this through **abstract classes** and **interfaces**.

An abstract class defines the _contract_, what methods must exist, without implementing them:

```typescript
abstract class MediaPlayer {
  abstract play(): void;
  abstract pause(): void;
  abstract stop(): void;
}
```

We cannot instantiate `MediaPlayer` directly. It is a blueprint. Any class that extends it is **forced** to implement all three methods:

```typescript
class MusicPlayer extends MediaPlayer {
  play(): void {
    console.log("Playing music...");
  }
  pause(): void {
    console.log("Pausing music...");
  }
  stop(): void {
    console.log("Stopping music...");
  }
}

const myPlayer = new MusicPlayer();
myPlayer.play();
// const broken = new MediaPlayer(); // Error: Cannot create an instance of an abstract class.
```

Why does this matter at scale? Because a large team can add new player types (`VideoPlayer`, `PodcastPlayer`) without ever looking at each other's code. They just follow the contract defined by `MediaPlayer`. The abstraction is the agreement.

---

## Pillar 4: Encapsulation - Protect Your Data

Encapsulation means bundling data and the methods that operate on it inside a class, while **restricting direct access** to the data from outside. TypeScript's access modifiers, `private`, `public`, `protected`, are the enforcement mechanism.

```typescript
class BankAccount {
  private userId: number;
  userName: string;
  private userBalance: number;

  constructor(userId: number, userName: string, userBalance: number) {
    this.userId = userId;
    this.userName = userName;
    this.userBalance = userBalance;
  }

  addBalance(amount: number) {
    this.userBalance += amount;
  }

  getBalance() {
    return this.userBalance;
  }
}

const account1 = new BankAccount(1, "Alice", 1000);
console.log(account1.userName); // OK: Alice
// console.log(account1.userBalance); // Error: private
// account1.userBalance = 999999;     // Error: private
```

Nobody outside the class can reach in and arbitrarily change the balance. To add money, we must go through `addBalance`. To read it, we must call `getBalance`. The class is in complete control of its own data.

With **getters and setters**, we add validation logic to these controlled access points:

```typescript
set balance(amount: number) {
    if (amount < 0) {
        console.log("Balance cannot be negative.");
    } else {
        this.userBalance += amount;
    }
}

get balance() {
    return this.userBalance;
}

account1.balance = 500;  // Adds 500
account1.balance = -200; // "Balance cannot be negative."
```

In a large project, encapsulation means a bug in the balance logic lives in **one class**. We fix it once. No other part of the codebase was touching `userBalance` directly, so nothing else breaks.

---

## How the Four Pillars Work Together

These pillars are not isolated techniques, they reinforce each other:

| Pillar            | What it does                      | Scale benefit                                           |
| ----------------- | --------------------------------- | ------------------------------------------------------- |
| **Inheritance**   | Shares logic from parent to child | Eliminates code duplication                             |
| **Polymorphism**  | One function handles many types   | New types need zero changes to existing functions       |
| **Abstraction**   | Enforces contracts via blueprints | Teams can work independently against a shared interface |
| **Encapsulation** | Protects internal state           | Bugs are contained; changes are predictable             |

A real application might have a `Payment` abstract class (abstraction) that `CreditCardPayment` and `BkashPayment` extend (inheritance), each with their own `processPayment` implementation (polymorphism), while keeping sensitive card details private (encapsulation). All four pillars working together in one feature.

---

## Conclusion

OOP's four pillars exist because large codebases are hard. They break in unexpected ways, they become difficult to extend, and new team members get lost in the complexity. Inheritance, Polymorphism, Abstraction, and Encapsulation each attack a specific part of that problem.

TypeScript makes these patterns especially powerful because it enforces them at compile time. Forget to implement an abstract method? Compile error. Try to access a private property? Compile error. The language itself becomes our code reviewer, catching structural mistakes before they ever reach runtime.

Master these four pillars, and we will write code that does not just work today but stays maintainable as the project grows.
