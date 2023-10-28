# Stateful JS

<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/@webqit/stateful-js" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@webqit/stateful-js.svg" alt="NPM version" /></a></span> <span class="badge-npmdownloads"><a href="https://npmjs.org/package/@webqit/stateful-js" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@webqit/stateful-js.svg" alt="NPM downloads" /></a></span>

<!-- /BADGES --> 

[Overview](#overview) • [Polyfill](#polyfill) • [Examples](#examples) • [Documentation](#documentation) • [Getting Involved](#getting-involved) • [License](#license)

Stateful JS is a runtime extension to JavaScript that enables us do [Imperative Reactive Programming](https://en.wikipedia.org/wiki/Reactive_programming#Imperative) (IRP) in the very language! This project pursues a futuristic, more efficient way to build reactive applocations *today*!

## Overview

Whereas you normally would need a couple primitives to model reactive logic...

```js
import { useState, useMemo, useEffect } from 'react';

// count
const [ count, setCount ] = useState(5);
// doubleCount
const doubleCount = useMemo(() => count * 2, [count]);
// console.log()
useEffect(() => {
  console.log(doubleCount);
}, [doubleCount]);
```

```js
// An update
setTimeout(() => setCount(10), 500);
```

Stateful JS lets you acheive the same in the ordinary imperative form of the language:

```js
let count = 5;
let doubleCount = count * 2;
console.log(doubleCount);
```

```js
// An update
setTimeout(() => count = 10, 500);
```

Here, you are able to write code that can *statically* reflect changes to state in *micro* details, such that the state of your program is always in sync with the rest of the program at any given point!

## Idea

Imperative programs are really the foundation for *state* and *effect* and the relationship between them - the very things we try to model today at an abstract level using, sometimes, functional reactive primitives, and sometimes some other means to the same end.

<details><summary>Learn more</summary>

Whether it's an assignment expression that sets or changes the data held in a local variable (`a = b`), or a delete expression that mutates some object property (`delete c.d`), it's all *effect* producing an *end state*! (And a large program is just many of these at play, interspersed with control flow structures!)

What we don't get with how this works naturally is having end state automatically maintained by the effects that produce them as other parts of the program change! That's a relationship not maintained by the runtime! And that idea is often what we try to acheive in an alternative approach.

</details>

If we could get the JS runtime to add "statefulness" to how it already works - i.e. having each effect automatically maintain their end state (thus giving us a *stateful program* as a whole), we would have unnecessitated the manual way and unlocked many new possibilities!

<details><summary>Learn more</summary>

Many new things here for free when machine-level concepts are indeed left to the machine:

+ A level of precision and performance that could never be attained manually
+ A maximum authoring experience and much cleaner, leaner code; by a large margine

</details>

But fun question: does this really work? You want to see!

<!--

It's really a new category here in the reactivity spectrum! (You can learn more in the [Relationship with Other Concepts](#relationship-with-other-concepts) section.)

## Update Model

When a change happens, Stateful programs do *just what's needed* to reflect it! Updates will always involve *just the relevant expression*, or sequence of expressions - as entirely determined by your program's dependency graph - that actually need to be touched to keep program state fully in sync!

This means: game on with however your code lends itself to be written, as in below; but only the following sequence of expressions: 4 -> 5, will reflect a change to `count`:

```js
let outputNode = document.createElement('div');
let count = 5; // [Statement 2]
document.body.append(outputNode);
let doubleCount = count * 2; // [Statement 4]: Dependent on statement 2
outputNode.innerHTML = doubleCount; // [Statement 5]: Dependent on statement 4
```

```js
// An update
setTimeout(() => count = 10, 500);
```

Now, this translates to eliminating the overheads of doing **_unrelated_** work - as would be the case with having that `div` above recreated and appending each time `count` is updated! 

Of course, this precision just makes us many "x" more performant!

Also, update sequence is always ordered and *linear*! Reflection will always happen in the same top-down sequence of "control flow" in imperative programs, ensuring familiar and predictable runtime behaviour.

Now, this translates to eliminating the often **_tricky_** reactivity in non-linear update models - as would be the case with having an update below on line 6 moved control up the scope to trigger statements 5 and 3!

```js
let outputNode = document.createElement('div'); // [Statement 1]
let count = 5;
document.body.append(outputNode); // [Statement 3]: Dependent on statement 1
let doubleCount = count * 2;
outputNode.innerHTML = doubleCount; // [Statement 5]: Dependent on statement 1
outputNode = document.createElement('span'); // [Statement 6]: Has no dependents and wouldn't move control up the scope to statements 5 and 3, as those aren't dependents
```

Of course, our current linear update model just makes everything many "x" easier to reason about!

> Note that, earlier, the update to `count` didn't happen as an operation in the same flow as the dependents themselves, but as an operation driven by an external event: `setTimeout(() => count = 10, 500);`!

Armed with this simple principle of operation, you can go pretty any length without breaking a sweat!
-->

## Creating Stateful Programs

This feature comes both as a new function type: "Stateful Functions" and as a new execution mode for entire programs: "Stateful Execution Mode" (or "Stateful Mode" for short; much like "[Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)")!

Given a language-level feature, no setup or build step is required! (Polyfill just ahead!)

### Stateful Functions

You can designate a function as stateful using a double star notation; similar to [how generator functions look](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator):

```js
// Stateful function declaration
function** bar() {
  let count = 5;
  let doubleCount = count * 2;
  console.log(doubleCount);
}
bar();
```

```js
// Stateful async function declaration
async function** bar() {
  let count = await 5;
  let doubleCount = count * 2;
  console.log(doubleCount);
}
await bar();
```

<details><summary>...and in just how a function works in JavaScript</summary>

```js
// Stateful function expression, optionally async
const bar = function** () {
  // Function body
}
```

```js
// Stateful object property, optionally async
const foo = {
  bar: function** () {
    // Function body
  },
}
```

```js
// Stateful object method, optionally async
const foo = {
  **bar() {
    // Function body
  },
}
```

```js
// Stateful class method, optionally async
class Foo {
  **bar() {
    // Function body
  }
}
```

</details>

And you can acheive the same using Stateful Function constructors:

```js
// Stateful function constructor
const bar = StatefulFunction(`
  let count = 5;
  let doubleCount = count * 2;
  console.log(doubleCount);
`);
bar();
```

```js
// Stateful async function constructor
const bar = StatefulAsyncFunction(`
  let count = await 5;
  let doubleCount = count * 2;
  console.log(doubleCount);
`);
await bar();
```

<details><summary>...and in just how <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function">function constructors</a> work in JavaScript</summary>

```js
// With function parameters
const bar = StatefulFunction( param1, ... paramN, functionBody );
```

```js
// With the new keyword
const bar = new StatefulFunction( param1, ... paramN, functionBody );
```

```js
// As class property
class Foo {
  bar = StatefulFunction( param1, ... paramN, functionBody );
}
```

Well, this also includes the fact that, unlike normal function declarations and expressions that can see their surrounding scope, code in function constructors can see only the global scope:

```js
let a;
globalThis.b = 2;
var c = 'c'; // Equivalent to globalThis.c = 'c' assuming that we aren't running in a function scope or module scope
const bar = StatefulFunction(`
  console.log(typeof a); // undefined
  console.log(typeof b); // number
  console.log(typeof c); // string
`);
bar();
```

</details>

### Stateful Mode

Given the same underlying infrastructure, any piece of code can be made to run in stateful mode. Stateful JS exposes two APIs that let us have that:

```js
// Stateful regular JS
const program = new StatefulScript(`
  let count = 5;
  let doubleCount = count * 2;
  console.log(doubleCount);
`);
program.execute();
```

```js
// Stateful module
const program = new StatefulModule(`
  let count = await 5;
  let doubleCount = count * 2;
  console.log(doubleCount);
`);
await program.execute();
```

These will run in the global scope!

The latter does certainly let you use `import` and `export` statements!

<details><summary>Exanple</summary>

```js
// Stateful module
const program = new StatefulModule(`
  import module1, { module2 } from 'package-name';
  import { module3 as alias } from 'package-name';
  ...
  export * from 'package-name';
  export let localVar = 0;
`);
```

</details>

Now, this goes a step further to let us have "Stateful Scripts" - as may be seen in a related work, [OOHTML](https://github.com/webqit/oohtml):

```html
<!-- Stateful classic script -->
<script stateful>
  let count = 5;
  let doubleCount = count * 2;
  console.log(doubleCount);
</script>
```

```html
<!-- Stateful module script -->
<script type="module" stateful>
  let count = await 5;
  let doubleCount = count * 2;
  console.log(doubleCount);
</script>
```

And the ideas there are powerful enough to simplify how we build single page applications!

<details><summary>Sneak peak</summary>

```html
<main id="page1">
  <script scoped stateful>

    console.log(this.id); // page1

  </script>
</main>
```

```html
<main id="page2">
  <script type="module" scoped stateful>

    console.log(this.id); // page2

  </script>
</main>
```

</details>

Now, other tooling may choose to use the same infrastructure in other ways; e.g. as compile target.

## Consuming Stateful Programs

Each call to a stateful function or script returns back a `State` object that lets us consume the program from the outside. (This is similar to [what generator functions do](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).)

### Return Value

The `State` object features a `value` property that carries the program's actual return value:

```js
function** sum(a, b) {
  return a + b;
}
```

```js
const state = sum(5, 4);
console.log(state.value); // 9
```

But given a "live" program, the `state.value` property also comes as a "live" property that always reflects the program's new return value should anything make that change:

```js
function** counter() {
  let count = 0
  setInterval(() => count++, 500);
  return count;
}
```

```js
const state = counter();
console.log(state.value); // 0
```

Now, the general-purpose, object-observability API: [Observer API](https://github.com/webqit/observer) puts those changes right in our hand:

```js
Observer.observe(state, 'value', mutation => {
  //console.log(state.value); Or:
  console.log(mutation.value); // 1, 2, 3, 4, etc.
});
```

### Module Exports

For module programs, the `State` object also features an `exports` property that exposes the module's exports:

```js
// Stateful module
const program = new StatefulModule(`
  import module1, { module2 } from 'package-name';
  import { module3 as alias } from 'package-name';
  ...
  export * from 'package-name';
  export let localVar = 0;
`);
```

```js
const state = await program();
console.log(state.exports); // { module1, module2, module3, ..., localVar }
```

But given a "live" program, each property in the `state.exports` object also comes as a "live" property that always reflects an export's new value should anything make that change:

```js
// As module
const program = new StatefulModule(`
  export let localVar = 0;
  ...
  setInterval(() => localVar++, 500);
`);
```

```js
const state = await program();
console.log(state.exports); // { localVar }
```

Now, again, the Observer API puts those changes right in our hand:

```js
Observer.observe(state.exports, 'localVar', mutation => {
  //console.log(state.exports.localVar); Or:
  console.log(mutation.value); // 1, 2, 3, 4, etc.
});
```

```js
// Observe "any" export
Observer.observe(state.exports, mutations => {
  mutations.forEach(mutation => console.log(mutation.key, mutation.value));
});
```

## Disposing Stateful Programs

Stateful programs may maintain many live relationships and should be disposed when their work is done! The `State` object they return exposes a `dispose()` method that lets us do just that:

```js
state.dispose();
```

<!-- TODO: Talk about auto-disposals -->

## Interactions with the Outside World

Stateful programs can read and write to the given scope in which they run; just in how a regular JavaScript program can reference outside variables and also make side effects:

```js
let a = 2, b;
function** bar() {
  b = a * 2;
}
bar();
```

But unlike regular JavaScript, Stateful programs maintain a live relationship with the outside world.

This means that:

### Outside Changes Will Be Automatically Reflected

Stateful JS programs will statically reflect changes to any external references that they may depend on:

```js
// External value
var foo = { baz: 0 };
```

...whether that reference is made from within program body itself:

```js
function** bar() {
  let localVar = foo.baz;
  console.log(localVar);
}
bar();
```

...or from the place of a parameter's *default value*:

```js
function** bar(localVar = foo.baz) {
  console.log(localVar);
}
bar();
```

```js
// Update external dependency
foo.baz = 1; // This will now be reflected above
```

The above works as Stateful JS uses the Observer API under the hood!

<details><summary>In practice...</summary>

...since the Observer API isn't yet native, the above `foo.baz = 1` assignment would need to happen via the `Observer.set()` method:

```js
Observer.set(foo, 'baz', 1);
```

</details>

### Side Effects Are Observable

Updates made to the outside scope can be observed using, also, the Observer API:

```js
// External value
var foo = { baz: 0 };
```

```js
// An observer
function log(mutation) {
  console.log(mutation.type, mutation.key, mutation.value, mutation.oldValue);
}

// Observe specific property
Observer.observe(foo, 'baz', log);

// Or, observe all properties
Observer.observe(foo, mutations => mutations.forEach(log));
```

```js
// Run the program
bar();
```

### Bare Variables in an *Observable* Scope Will Work the Same Way

Unlike object properties as above, bare variables in a local scope in JavaScript can't be observed or programatically updated! This means that Stateful programs that can access these variables in the zurrounding zcope would only be able to catch updates to their properties if they are objects, but not the variable replacement themselves! 

This may eventually change, or not change, for Stateful programs! But certain scopes are always observable:

#### The Global Scope

Given its object-like nature, the global scope is very much observable by the Observer API, and thus, by Stateful programs!

Above, assuming that we've used the `var` keyword outside of a function and module scope, `foo` is declared in the global scope (i.e. `globalThis.foo`)! Now, if we replaced the whole variable itself, it would also be reflected in our stateful program:

```js
foo = { baz: 1 };
```

<details><summary>In practice...</summary>

...since the Observer API isn't yet native, the above `foo = { baz: 1 }` update would need to happen via the `Observer.set()` method:

```js
Observer.set(globalThis, 'foo', { baz: 1 });
```

</details>

Also, you could observe any updates to `foo` (i.e. side effect) as your stateful program runs:

```js
Observer.observe(globalThis, 'foo', mutation => {
  console.log(mutation.type, mutation.key, mutation.value, mutation.oldValue);
});
```

```js
function** bar() {
  foo = { baz: 2 };
}
bar();
```

#### Stateful JS Scopes

Where a function runs within a Stateful program itself, everything just works; bare variables are live!

```js
(function** () {
  // Live scope

  let count = 0;
  setInterval(() => count++, 500); // Live updates, even though not from within a stateful closure

  console.log('From main stateful scope: ', count); // Reflected here

  function** bar() {
    console.log('From inner stateful scope: ', count); // Reflected here
  }
  bar();

})();
```

## Polyfill

Stateful JS may be used today via a polyfill.

<details><summary>Load from a CDN</summary>

```html
<script src="https://unpkg.com/@webqit/stateful-js/dist/main.js"></script>
```

> This is to be placed early on in the document and should be a classic script without any `defer` or `async` directives:

> `47.8` kB min + gz | `179.5` KB min [↗](https://bundlephobia.com/package/@webqit/stateful-js)

```js
// Destructure from the webqit namespace
const { StatefulFunction, StatefulAsyncFunction, StatefulScript, StatefulModule, State } = window.webqit;
```

</details>

<details><summary>Install from NPM</summary>

```js
// npm install
npm i @webqit/stateful-js
```

```js
// Import API
import { StatefulFunction, StatefulAsyncFunction, StatefulScript, StatefulModule, State } from '@webqit/stateful-js';
```

</details>

While fully supporting program-level APIs - `StatefulScript`, `StatefulModule`, the current polyfill only supports the constructor form of Stateful Functions - which give you the equivalent of the normal function forms!

| API | Runs as... |
| :------- | :----------- |
| `StatefulFunction` | `function** () {}` |
| `StatefulAsyncFunction` | `async function** () {}` |
| `StatefulScript` | `<script>` |
| `StatefulModule` | `<script type="module">` |

```js
// External dependency
globalThis.externalVar = 10;
// StatefulFunction
const sum = StatefulFunction(`a`, `b`, `
  return a + b + externalVar;
`);
const state = sum(10, 10);

// Inspect
console.log(state.value); // 30
// Reflect and inspect again
Observer.set(globalThis, 'externalVar', 20);
console.log(state.value); // 40
```

But the double star syntax is supported from within a Stateful program itself:

```js
const program = StatefulFunction(`
  // External dependency
  let externalVar = 10;

  // StatefulFunction
  function** sum(a, b) {
    return a + b + externalVar;
  }
  const state = sum(10, 10);

  // Inspect
  console.log(state.value); // 30
  // Reflect and inspect again
  externalVar = 20;
  console.log(state.value); // 40
`);
program();
```

### Stateful Functions Lite

It is possible to use a lighter version of Stateful JS where the bundle size of the main build above will impact *initial* application load. The *Lite* version initially comes without the compiler and yet let's you work with Stateful JS ahead of that.

<details><summary>Load from a CDN</summary>

```html
<script src="https://unpkg.com/@webqit/stateful-js/dist/main.async.js"></script>
```

> This is to be placed early on in the document and should be a classic script without any `defer` or `async` directives:

<!--
> 47.8 kB min + gz | 167 KB min [↗](https://bundlephobia.com/package/@webqit/stateful-js/dist/main.async.js)
-->

```js
// Destructure from the webqit namespace
const { StatefulAsyncFunction, StatefulAsyncScript, StatefulModule } = window.webqit;
```

</details>

<details><summary>Install from a NPM</summary>

```js
// npm install
npm i @webqit/stateful-js
```

```js
// Import Lite API
import { StatefulAsyncFunction, StatefulAsyncScript, StatefulModule, State } from '@webqit/stateful-js/src/index.async.js';
```

</details>

<details><summary>See details</summary>

The lazy-loading strategy here could only comfortably give you equivalent APIs to "async" program types!

| API | Runs as... |
| :------- | :----------- |
| `StatefulAsyncFunction` | `async function** () {}` |
| `StatefulAsyncScript` | `<script async>` |
| `StatefulModule` | `<script type="module">` |

```js
// External dependency
globalThis.externalVar = 10;
// StatefulFunction
const sum = StatefulAsyncFunction(`a`, `b`, `
  return a + b + externalVar;
`);
const state = await sum(10, 10);

// Inspect
console.log(state.value); // 30
// Reflect and inspect again
Observer.set(globalThis, 'externalVar', 20);
console.log(state.value); // 40
```

But these APIs also take advantage of the fact that they can do compilation for their source types off the main thread! Thus, as a perk, the compiler is loaded into a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) and all compilations happen off the main thread!

But having been designed as a movable peice, the Stateful JS Compiler is all still loadable directly - as if short-circuiting the lazy-loading strategy of the Lite APIs:

```html
<head>
  <script src="https://unpkg.com/@webqit/stateful-js/dist/compiler.js"></script> <!-- Must come before the polyfil -->
  <script src="https://unpkg.com/@webqit/stateful-js/dist/main.async.js"></script>
</head>
```

</details>

## Examples

Using the polyfills, the following examples work today.

+ [Example 1: *Reactive Custom Elements*](#example-1-reactive-custom-elements)
+ [Example 2: *Pure Computations*](#example-2-pure-computations)

### Example 1: *Reactive Custom Elements*

Manual reactivity accounts for a large part of the UI code we write today. Now, we can simply write *Stateful* code!

In this example, we demonstrate a custom element that has Stateful Function as its `render()` method. We invoke the `render()` method only once and let it statically reflect subsequent updates:

```js
customElements.define('click-counter', class extends HTMLElement {

  count = 10;

  connectedCallback() {
    // Initial rendering
    this._state = this.render();
    // Static reflect at click time
    this.addEventListener('click', () => {
      this.count++;
      //Observer.set(this, 'count', this.count + 1);
    });
  }

  disconnectCallback() {
    // Cleanup
    this._state.dispose();
  }

  // Using the StatefulFunction constructor
  render = StatefulFunction(`
    let countElement = this.querySelector( '#count' );
    countElement.innerHTML = this.count;
    
    let doubleCount = this.count * 2;
    let doubleCountElement = this.querySelector( '#double-count' );
    doubleCountElement.innerHTML = doubleCount;
    
    let quadCount = doubleCount * 2;
    let quadCountElement = this.querySelector( '#quad-count' );
    quadCountElement.innerHTML = quadCount;
  `);

});
```

### Example 2: *Pure Computations*

Even outside of UI code, we often still need to write reactive logic!

In this example, we demonstrate a simple way to implement something like the [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) API - where you have many interdependent properties!

```js
class MyURL {

  constructor(href) {
    // The raw url
    this.href = href;
    // Initial computations
    this.compute();
  }

  compute = StatefulFunction(`
    // These will be re-computed from this.href always
    let [ protocol, hostname, port, pathname, search, hash ] = new URL(this.href);

    this.protocol = protocol;
    this.hostname = hostname;
    this.port = port;
    this.pathname = pathname;
    this.search = search;
    this.hash = hash;

    // These individual property assignments each depend on the previous 
    this.host = this.hostname + (this.port ? ':' + this.port : '');
    this.origin = this.protocol + '//' + this.host;
    let href = this.origin + this.pathname + this.search + this.hash;
    if (href !== this.href) { // Prevent unnecessary update
      this.href = href;
    }
  `);

}
```

```js
// Change a property and have it's dependents auto-compute
const url = new MyURL('https://www.example.com/path');

url.protocol = 'http:'; //Observer.set(url, 'protocol', 'http:');
console.log(url.href); // http://www.example.com/path

url.hostname = 'foo.dev'; //Observer.set(url, 'hostname', 'foo.dev');
console.log(url.href); // http://foo.dev/path
```

## Documentation

Visit [project wiki](https://github.com/webqit/stateful-js/wiki).

## Getting Involved

All forms of contributions are welcome at this time. For example, syntax and other implementation details are all up for discussion. Also, help is needed with more formal documentation. And here are specific links:

+ [Project](https://github.com/webqit/stateful-js)
+ [Documentation](https://github.com/webqit/stateful-js/wiki)
+ [Discusions](https://github.com/webqit/stateful-js/discussions)
+ [Issues](https://github.com/webqit/stateful-js/issues)

## License

MIT.
