# Generics in TypeScript: Write Once, Work with Everything

## Introduction

Imagine we are building a toolbox. We could build a separate screwdriver for every single screw size in the world, or we could build one screwdriver with a swappable head. Generics in TypeScript are that swappable head. They let us write a function or a data structure **once** and have it work with any type we throw at it, without sacrificing type safety in the process.

Without generics, we are stuck choosing between two bad options: repeat ourselves for every type, or use `any` and lose all type checking. Generics give us a third, better path.

---

## The Problem Generics Solve

Look at this repetitive code:

```typescript
const createArrayWithString = (value: string) => [value];
const createArrayWithNumber = (value: number) => [value];
const createArrayWithBoolean = (value: boolean) => [value];
```

All three functions do the **exact same thing**, wrap a value in an array. The only difference is the type. This is wasteful and hard to maintain. Change the logic in one, we have to change it in all three.

---

## The Generic Solution

Instead of three functions, we write one:

```typescript
const createArrayWithGeneric = <T>(value: T) => {
  return [value];
};

const arrGenericString = createArrayWithGeneric("Saad"); // string[]
const arrGenericNumber = createArrayWithGeneric(22); // number[]
const arrGenericBoolean = createArrayWithGeneric(true); // boolean[]
const arrGenericUserObject = createArrayWithGeneric({ name: "Saad", age: 22 }); // { name: string; age: number }[]
```

`<T>` is a **type parameter**, a placeholder that TypeScript fills in automatically based on what we pass. When we call `createArrayWithGeneric("Saad")`, TypeScript infers `T = string`. We get full type safety without writing separate functions.

---

## Generic Types

Generics are not just for functions, they work beautifully with type aliases too. Instead of repeating the array type over and over:

```typescript
type GenericArray<value> = Array<value>;

const friends: GenericArray<string> = ["Saad", "Byomkesh", "Feluda"];
const rollNumbers: GenericArray<number> = [1, 2, 3, 4, 5];
const isElligible: GenericArray<boolean> = [true, false, true, true];
```

We define the shape **once** and parameterize it. The same `GenericArray` type adapts to `string`, `number`, `boolean`, or any complex object.

---

## Multiple Type Parameters

Generics can take more than one type parameter. Here is a tuple factory that keeps both positions strictly typed:

```typescript
const createArrayTupleWithGeneric = <X, Y>(param1: X, param2: Y) => [
  param1,
  param2,
];

const res1 = createArrayTupleWithGeneric("Saad", 22); // [string, number]
const res2 = createArrayTupleWithGeneric(true, { name: "Saad", age: 22 }); // [boolean, { name: string, age: number }]
```

Compare this to the non-generic version that only worked with `(string, number)`. The generic version is infinitely more flexible, yet TypeScript knows the exact type of every element.

---

## Generics with Interfaces

Generics shine even brighter when combined with interfaces. Consider a `Developer` type where the smart watch model and bike brand vary between developers:

```typescript
interface Developer<T, X = null> {
  name: string;
  salary: number;
  device: {
    brand: string;
    model: string;
    releasedYear: string;
  };
  smartWatch: T;
  bike?: X;
}
```

Now we can describe a budget developer and a rich developer using the **same interface**, just with different type arguments:

```typescript
const poorDeveloper: Developer<BrandCharaWatch> = { ... };
const richDeveloper: Developer<AdvancedWatch> = { ... };
```

No duplication. No `any`. The interface stays clean and reusable.

---

## Constraints: Keeping Generics in Check

Sometimes we want flexibility, but not _unlimited_ flexibility. We can constrain a generic using `extends`:

```typescript
type StudentInfo = {
  id: number;
  name: string;
};

const addStudentToCourse = <T extends StudentInfo>(studentInfo: T) => {
  return {
    course: "Typescript",
    ...studentInfo,
  };
};
```

Now `T` can be any object as long as it has `id` and `name`. A student with extra properties like `hasPen` or `isMarried` is perfectly fine. But an object with no `id` or `name`? TypeScript will reject it at compile time.

---

## The `keyof` Constraint

One of the most powerful generic patterns combines generics with the `keyof` operator. This ensures the key we pass to a function actually exists on the object:

```typescript
const getPropertyFromObj = <X>(obj: X, key: keyof X) => {
  return obj[key];
};

const result = getPropertyFromObj(user, "name"); // works
const result2 = getPropertyFromObj(user, "salary"); // TypeScript error, "salary" doesn't exist on user
```

Without generics, we would either hardcode the type (`obj: User`) and lose reusability, or use `any` and lose safety. The `<X, keyof X>` combo gives us both.

---

## Conclusion

Generics are one of TypeScript's most powerful features because they solve a real tension in software: the tension between **reusability** and **type safety**. Without generics, we pick one or the other. With generics, we get both.

The pattern flows naturally:

- Use `<T>` when our function or type needs to work with any type
- Use `<T extends SomeType>` when we need flexibility with guardrails
- Use `<T, keyof T>` when we need to reference the keys of an object safely
- Use `<T, X>` when multiple independent types are involved

Once we start thinking in generics, we will find ourselves writing less code that does more, and TypeScript will be with us every step of the way, catching mistakes before they reach production.
