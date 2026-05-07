// Problem - 1
const filterEvenNumbers = (numbers: number[]): number[] => {
    let evenNumbers: number[] = [];
    for (let i = 0; i < numbers.length; ++i) {
        if ((numbers[i] & 1) === 0) {
            evenNumbers.push(numbers[i]);
        }
    }
    return evenNumbers;
}


// Problem - 2
const reverseString = (str: string): string => {
    let chars = str.split('');

    let left = 0;
    let right = chars.length - 1;

    while (left < right) {
        let temp = chars[left];
        chars[left] = chars[right];
        chars[right] = temp;

        left++;
        right--;
    }
    return chars.join('');
}


// Problem - 3
type StringOrNumber = string | number;

const checkType = (input: StringOrNumber) => {
    if (typeof input === 'string') {
        return "String";
    } else {
        return "Number";
    }
}

// Problem - 4
const getProperty = <T>(obj: T, key: keyof T) => {
    return obj[key];
}


// Problem - 5
interface Book {
    title: string;
    author: string;
    publishedYear: number;
}

const toggleReadStatus = (book: Book) => {
    return {
        ...book,
        isRead: true,
    };
}


// Problem - 6
class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

class Student extends Person {
    grade: string;

    constructor(name: string, age: number, grade: string) {
        super(name, age);
        this.grade = grade;
    }

    getDetails() {
        return `Name: ${this.name}, Age: ${this.age}, Grade: ${this.grade}`;
    }
}


// Problem - 7
const getIntersection = (arr1: number[], arr2: number[]): number[] => {
    let set = new Set(arr2);

    return arr1.filter(num => set.has(num));
}
