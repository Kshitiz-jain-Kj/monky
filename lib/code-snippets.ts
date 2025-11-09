export const codeSnippets = {
  javascript: {
    beginner: {
      short: [
        `const greeting = "Hello World";
console.log(greeting);`,
        `function add(a, b) {
  return a + b;
}`,
        `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);`,
      ],
      medium: [
        `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
        `const user = {
  name: "John",
  age: 30,
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
};`,
      ],
      long: [
        `class Calculator {
  constructor() {
    this.result = 0;
  }
  
  add(n) {
    this.result += n;
    return this;
  }
  
  subtract(n) {
    this.result -= n;
    return this;
  }
  
  multiply(n) {
    this.result *= n;
    return this;
  }
  
  getResult() {
    return this.result;
  }
}

const calc = new Calculator();
calc.add(10).multiply(2).subtract(5);`,
      ],
    },
    intermediate: {
      short: [
        `const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};`,
        `const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};`,
      ],
      medium: [
        `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = arr.filter((x, i) => x <= pivot && i < arr.length - 1);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
        `const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};`,
      ],
      long: [
        `class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => {
      listener(...args);
    });
  }

  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(
      listener => listener !== listenerToRemove
    );
  }
}`,
      ],
    },
    advanced: {
      short: [
        `const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...args2) => curried.apply(this, args.concat(args2));
  };
};`,
      ],
      medium: [
        `function* fibonacciGenerator() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

const fib = fibonacciGenerator();
const sequence = Array.from({ length: 10 }, () => fib.next().value);`,
      ],
      long: [
        `class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  subscribe(observer) {
    return this._subscribe(observer);
  }

  pipe(...operators) {
    return operators.reduce((prev, fn) => fn(prev), this);
  }

  static create(subscribe) {
    return new Observable(subscribe);
  }
}

const map = (transformFn) => (source) => {
  return Observable.create((observer) => {
    return source.subscribe({
      next: (value) => observer.next(transformFn(value)),
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    });
  });
};`,
      ],
    },
  },
  python: {
    beginner: {
      short: [
        `def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
        `numbers = [1, 2, 3, 4, 5]
squared = [n ** 2 for n in numbers]`,
        `def add(a, b):
    return a + b

result = add(10, 20)`,
      ],
      medium: [
        `def find_max(arr):
    if not arr:
        return None
    max_val = arr[0]
    for num in arr[1:]:
        if num > max_val:
            max_val = num
    return max_val`,
        `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hi, I'm {self.name}"`,
      ],
      long: [
        `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
    
    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        if 0 < amount <= self.balance:
            self.balance -= amount
            return True
        return False
    
    def get_balance(self):
        return self.balance`,
      ],
    },
    intermediate: {
      short: [
        `def decorator(func):
    def wrapper(*args, **kwargs):
        print("Before")
        result = func(*args, **kwargs)
        print("After")
        return result
    return wrapper`,
        `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
      ],
      medium: [
        `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,
        `from functools import wraps

def memoize(func):
    cache = {}
    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper`,
      ],
      long: [
        `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def display(self):
        elements = []
        current = self.head
        while current:
            elements.append(current.data)
            current = current.next
        return elements`,
      ],
    },
    advanced: {
      short: [
        `def compose(*functions):
    def inner(arg):
        for f in reversed(functions):
            arg = f(arg)
        return arg
    return inner`,
      ],
      medium: [
        `class MetaSingleton(type):
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Singleton(metaclass=MetaSingleton):
    pass`,
      ],
      long: [
        `from abc import ABC, abstractmethod

class Observable:
    def __init__(self):
        self._observers = []
    
    def attach(self, observer):
        self._observers.append(observer)
    
    def detach(self, observer):
        self._observers.remove(observer)
    
    def notify(self, *args, **kwargs):
        for observer in self._observers:
            observer.update(self, *args, **kwargs)

class Observer(ABC):
    @abstractmethod
    def update(self, subject, *args, **kwargs):
        pass`,
      ],
    },
  },
  c: {
    beginner: {
      short: [
        `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
        `int add(int a, int b) {
    return a + b;
}`,
        `int arr[] = {1, 2, 3, 4, 5};
int sum = 0;
for (int i = 0; i < 5; i++) {
    sum += arr[i];
}`,
      ],
      medium: [
        `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    int result = factorial(5);
    printf("Result: %d\\n", result);
    return 0;
}`,
      ],
      long: [
        `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

void append(struct Node** head, int data) {
    struct Node* new_node = malloc(sizeof(struct Node));
    new_node->data = data;
    new_node->next = NULL;
    
    if (*head == NULL) {
        *head = new_node;
        return;
    }
    
    struct Node* last = *head;
    while (last->next != NULL) {
        last = last->next;
    }
    last->next = new_node;
}`,
      ],
    },
    intermediate: {
      short: [
        `void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`,
      ],
      medium: [
        `int binary_search(int arr[], int l, int r, int x) {
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == x)
            return mid;
        if (arr[mid] < x)
            l = mid + 1;
        else
            r = mid - 1;
    }
    return -1;
}`,
      ],
      long: [
        `#include <stdio.h>

void bubble_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

void print_array(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
}`,
      ],
    },
    advanced: {
      short: [
        `typedef struct {
    void (*execute)(void*);
    void* data;
} callback_t;`,
      ],
      medium: [
        `void quick_sort(int arr[], int low, int high) {
    if (low < high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                swap(&arr[i], &arr[j]);
            }
        }
        swap(&arr[i + 1], &arr[high]);
        int pi = i + 1;
        quick_sort(arr, low, pi - 1);
        quick_sort(arr, pi + 1, high);
    }
}`,
      ],
      long: [
        `typedef struct AVLNode {
    int key;
    struct AVLNode *left;
    struct AVLNode *right;
    int height;
} AVLNode;

int height(AVLNode *node) {
    return node ? node->height : 0;
}

int max(int a, int b) {
    return (a > b) ? a : b;
}

AVLNode* rotate_right(AVLNode *y) {
    AVLNode *x = y->left;
    AVLNode *T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = max(height(y->left), height(y->right)) + 1;
    x->height = max(height(x->left), height(x->right)) + 1;
    return x;
}`,
      ],
    },
  },
  cpp: {
    beginner: {
      short: [
        `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
        `int add(int a, int b) {
    return a + b;
}`,
      ],
      medium: [
        `#include <vector>
using namespace std;

class Calculator {
public:
    int add(int a, int b) {
        return a + b;
    }
    
    int multiply(int a, int b) {
        return a * b;
    }
};`,
      ],
      long: [
        `#include <iostream>
#include <string>
using namespace std;

class Person {
private:
    string name;
    int age;

public:
    Person(string n, int a) : name(n), age(a) {}
    
    void display() {
        cout << "Name: " << name << ", Age: " << age << endl;
    }
    
    void setAge(int a) {
        age = a;
    }
    
    int getAge() {
        return age;
    }
};`,
      ],
    },
    intermediate: {
      short: [
        `template<typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}`,
      ],
      medium: [
        `#include <vector>
#include <algorithm>

template<typename T>
void quickSort(vector<T>& arr, int low, int high) {
    if (low < high) {
        T pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                swap(arr[i], arr[j]);
            }
        }
        swap(arr[i + 1], arr[high]);
        int pi = i + 1;
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      ],
      long: [
        `#include <memory>
using namespace std;

template<typename T>
class LinkedList {
private:
    struct Node {
        T data;
        unique_ptr<Node> next;
        Node(T val) : data(val), next(nullptr) {}
    };
    unique_ptr<Node> head;

public:
    LinkedList() : head(nullptr) {}
    
    void push_front(T data) {
        auto new_node = make_unique<Node>(data);
        new_node->next = move(head);
        head = move(new_node);
    }
    
    void display() {
        Node* current = head.get();
        while (current) {
            cout << current->data << " ";
            current = current->next.get();
        }
        cout << endl;
    }
};`,
      ],
    },
    advanced: {
      short: [
        `template<typename Func>
auto measure_time(Func f) {
    auto start = chrono::high_resolution_clock::now();
    f();
    auto end = chrono::high_resolution_clock::now();
    return chrono::duration_cast<chrono::milliseconds>(end - start).count();
}`,
      ],
      medium: [
        `template<typename T>
class SmartPtr {
private:
    T* ptr;
    size_t* ref_count;

public:
    SmartPtr(T* p = nullptr) : ptr(p), ref_count(new size_t(1)) {}
    
    SmartPtr(const SmartPtr& other) : ptr(other.ptr), ref_count(other.ref_count) {
        (*ref_count)++;
    }
    
    ~SmartPtr() {
        if (--(*ref_count) == 0) {
            delete ptr;
            delete ref_count;
        }
    }
    
    T& operator*() { return *ptr; }
    T* operator->() { return ptr; }
};`,
      ],
      long: [
        `#include <functional>
#include <vector>
#include <algorithm>

template<typename T>
class Observable {
private:
    vector<function<void(const T&)>> observers;
    T value;

public:
    void subscribe(function<void(const T&)> observer) {
        observers.push_back(observer);
    }
    
    void set_value(const T& new_value) {
        value = new_value;
        notify();
    }
    
    void notify() {
        for (auto& observer : observers) {
            observer(value);
        }
    }
    
    T get_value() const {
        return value;
    }
};`,
      ],
    },
  },
  java: {
    beginner: {
      short: [
        `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
        `public int add(int a, int b) {
    return a + b;
}`,
      ],
      medium: [
        `public class Calculator {
    private int result;
    
    public Calculator() {
        this.result = 0;
    }
    
    public void add(int n) {
        result += n;
    }
    
    public int getResult() {
        return result;
    }
}`,
      ],
      long: [
        `import java.util.ArrayList;
import java.util.List;

public class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        this.age = age;
    }
}`,
      ],
    },
    intermediate: {
      short: [
        `public interface Drawable {
    void draw();
}

public class Circle implements Drawable {
    public void draw() {
        System.out.println("Drawing circle");
    }
}`,
      ],
      medium: [
        `import java.util.Arrays;

public class QuickSort {
    public void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }
    
    private int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, high);
        return i + 1;
    }
}`,
      ],
      long: [
        `import java.util.LinkedList;
import java.util.Queue;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int val) {
        this.val = val;
    }
}

public class BinaryTree {
    TreeNode root;
    
    public void levelOrder() {
        if (root == null) return;
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            System.out.print(node.val + " ");
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
}`,
      ],
    },
    advanced: {
      short: [
        `@FunctionalInterface
public interface Operation<T> {
    T apply(T a, T b);
}`,
      ],
      medium: [
        `import java.util.function.Function;

public class Memoizer<T, R> {
    private final Map<T, R> cache = new HashMap<>();
    private final Function<T, R> function;
    
    public Memoizer(Function<T, R> function) {
        this.function = function;
    }
    
    public R apply(T input) {
        return cache.computeIfAbsent(input, function);
    }
}`,
      ],
      long: [
        `import java.util.ArrayList;
import java.util.List;

public abstract class Observable<T> {
    private List<Observer<T>> observers = new ArrayList<>();
    
    public void addObserver(Observer<T> observer) {
        observers.add(observer);
    }
    
    public void removeObserver(Observer<T> observer) {
        observers.remove(observer);
    }
    
    protected void notifyObservers(T data) {
        for (Observer<T> observer : observers) {
            observer.update(data);
        }
    }
}

interface Observer<T> {
    void update(T data);
}`,
      ],
    },
  },
  go: {
    beginner: {
      short: [
        `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
        `func add(a, b int) int {
    return a + b
}`,
      ],
      medium: [
        `package main

type Person struct {
    Name string
    Age  int
}

func (p Person) Greet() string {
    return fmt.Sprintf("Hi, I'm %s", p.Name)
}`,
      ],
      long: [
        `package main

import "fmt"

type Calculator struct {
    result int
}

func NewCalculator() *Calculator {
    return &Calculator{result: 0}
}

func (c *Calculator) Add(n int) *Calculator {
    c.result += n
    return c
}

func (c *Calculator) Multiply(n int) *Calculator {
    c.result *= n
    return c
}

func (c *Calculator) GetResult() int {
    return c.result
}`,
      ],
    },
    intermediate: {
      short: [
        `func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}`,
      ],
      medium: [
        `package main

func quickSort(arr []int) []int {
    if len(arr) <= 1 {
        return arr
    }
    
    pivot := arr[len(arr)/2]
    var left, middle, right []int
    
    for _, v := range arr {
        if v < pivot {
            left = append(left, v)
        } else if v == pivot {
            middle = append(middle, v)
        } else {
            right = append(right, v)
        }
    }
    
    return append(append(quickSort(left), middle...), quickSort(right)...)
}`,
      ],
      long: [
        `package main

import "sync"

type SafeCounter struct {
    mu    sync.Mutex
    count map[string]int
}

func NewSafeCounter() *SafeCounter {
    return &SafeCounter{count: make(map[string]int)}
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count[key]++
}

func (c *SafeCounter) Value(key string) int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.count[key]
}`,
      ],
    },
    advanced: {
      short: [
        `func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        results <- j * 2
    }
}`,
      ],
      medium: [
        `package main

type Observable struct {
    observers []func(interface{})
}

func (o *Observable) Subscribe(fn func(interface{})) {
    o.observers = append(o.observers, fn)
}

func (o *Observable) Notify(data interface{}) {
    for _, observer := range o.observers {
        go observer(data)
    }
}`,
      ],
      long: [
        `package main

import (
    "context"
    "time"
)

type WorkerPool struct {
    workers int
    jobs    chan Job
    results chan Result
}

type Job struct {
    ID   int
    Data interface{}
}

type Result struct {
    Job    Job
    Output interface{}
    Error  error
}

func NewWorkerPool(workers int) *WorkerPool {
    return &WorkerPool{
        workers: workers,
        jobs:    make(chan Job, 100),
        results: make(chan Result, 100),
    }
}

func (wp *WorkerPool) Start(ctx context.Context) {
    for i := 0; i < wp.workers; i++ {
        go wp.worker(ctx, i)
    }
}`,
      ],
    },
  },
}
