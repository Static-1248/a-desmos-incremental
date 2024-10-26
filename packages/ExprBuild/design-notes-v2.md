**Goal: The ts library to build expressions for Desmos with high scalability, reusability, and productivity**

**In previous note we determined the pattern for the chain-form coding with the context of a few simple operators. Now we are going to extend the system to cover all operators in Desmos.**

Recall our Expr-Building system:
- **Transitionals**: Expressions and functions that, when output, will have their references substituted if any other mathematical object (mobj) refers to them.
	> These are maintained directly via the TypeScript language context.

- **Explicits**: Named expressions and functions that, when output, will have their references saved if any other mobj refers to them.
	> This is managed through the TypeScript value system and in-type marks.
	also, we can get the name of a explicit expression by `expr.name`.

# Elements

## General

In the following sections, we will list various elements in Desmos in terms of our ExprBuild library.

The possible math types in Desmos include:
- **Expr**: a mathematical expression, which can be evaluated.
- **Boolean**: which's supposed to be a normal subtype of **Expr** (and are actually built with Exprs), but due to its limited usage in Desmos, we have to treat it as a separate type. We will provide a toolkit for boolean operations.
- **Action** / **Actions** : a mathematical action, which can be executed.
- **Tone** : a Desmos tone which can be played.
- **Color**: a color (or a list of colors).
- **STest**: a statistical test.
- **Dist**: a distribution.
- **Func**: a mathematical function, which can be evaluated if all its arguments are provided.
- **Eq**: an equation.
- **Ineq**: an inequality.

> **About Special types of Expr**:
> 
> There are several subtypes of Expr in Desmos:
> - **Parametrics**
> - **Points**
> - **Polygons**
> - **Lists**: list of numerical expr, points, or polygons
> 
> These subtypes are primarily distinguished by their different plot settings (aka display settings). Desmos does not enforce strict restrictions on these settings; any expression type can have various display settings. The validity of these settings depends on the specific subtype it evaluates to at runtime. For now, we will ignore these distinctions.

Todo:
- operators / inline functions:
	- [x] exhaustive list by domain
	- [ ] By-type implementation
- functions & recursion
- tables
- things with suspended symbols (used but not defined)
	- yx-like functions	(any 2 undefined symboSls)
	- equations & inequalities (x-y or r-θ)
	- parametrics (t)
- folders
- derivatives
- display settings

We will also provide extensive toolkits for logical and mathematical operations. These toolkits are designed for convenience and are the only components that do not guarantee homomorphic output. They will undergo some form of transformation.

Logical Toolkits:
- **If**: if-else function
	```ts
	const a = expl('a') ['='] (1);
	const a_abs = If( a ['>'] (0) ) ( a ) ( a ['*'] (-1) );
	// we can even use it as "switch-cases":
	// the rule is that odd calls are conditions, even calls are results.
	// Equivalant to the piecewise expression in Desmos.
	const a_sign = If( a ['>'] (0) ) (1) ( a ['<'] (0) ) (-1) (0);
	```
- Boolean operators (see below)

Other Staged To-dos:
- Draw the line of desmos-specific feature and general features.
- Support runtime checks (support usage in js, not just in ts)

## Operators

There are multiple types of operators, including:

- **a op** : `^2`, `^3`, `^-1`, `!` ...
- **a.attr** : .x, .y, .count, .length, .random; .real, .imag (complex mode only) 
	> Note: `a.attr` and `a op` (i.e., `(a) ['op']`) are equivalent in js and both can be used interchangeably. The classification here is based on intuitive understanding and preferred usage.

- **a op b** : `+`, `-`, `*`, `/`, `^`, `%`, `%of`, `root` ...

- **function-likes**:
	- **op(a) / op a** : abs, sqrt, cbrt, trig/inv-trig/hyp-trigs, ln, log, exp, ...
	- **op(a, b) / op a b** : gcd, lcm, nCr, nPr, mod, round, log, quartile, quantile...
	- **op(x1, x2, ..., xn)** : mean, median, min, max, stdev...

**Exhaustive list of operators, classified by domain**:

- **Basics & Calculus**:
	- a op : `^2`, `^3`, `^-1`, `!`
	- a op b : `+`, `-`, `*`, `/`, `^`, `%`, `%of`, `root`
	- abs(x), sqrt(x), cbrt(x),
	- exp(x)
	- log(a, x); log(x) = log(10, x)
	- ln(x) = log(e, x)

- **Boolean / Predicates**:
	- `>`, `<`, `>=`, `<=`, `==`
	- our extension: `!=`, `&&`, `||`, `!`, `xor`, `nand`, `nor`, `xnor`

- **Trigs** - all are `op(a)`s:
	- sin, cos, tan, cot, sec, csc = "asin-1", "acos-1", "atan-1", "acot-1", "asec-1", "acsc-1";
	- sin2, cos2, tan2, cot2, sec2, csc2;
	- "sin-1", "cos-1", "tan-1", "cot-1", "sec-1", "csc-1" = asin, acos, atan, acot, asec, acsc;
	- asin2, acos2, atan2, acot2, asec2, acsc2;
	- sinh, cosh, tanh, coth, sech, csch = "asinh-1", "acosh-1", "atanh-1", "acoth-1", "asech-1", "acsch-1";
	- sinh2, cosh2, tanh2, coth2, sech2, csch2;
	- "sinh-1", "cosh-1", "tanh-1", "coth-1", "sech-1", "csch-1" = asinh, acosh, atanh, acoth, asech, acsch;
	- asinh2, acosh2, atanh2, acoth2, asech2, acsch2;
	Note: atan = "tan-1" also supports `op(a, b)` form, which equals `atan2(a, b)`.

- **Number Theory**:
	- lcm(a, b, ...), lcm(L), L.lcm
	- gcd(a, b, ...), gcd(L), L.gcd
	- mod(a, b) = a % b
	- ceil(x), floor(x), round(x), round(x, n)
	- sign(x)
	- nPr(n, r), nCr(n, r)

- **Complex Numbers**:
	> Needs Desmos enabled complex mode. Consider adding a flag in a flags dict into type `Expr<...>`'s generic params?
	- real(z), imag(z), arg(z), conj(z)

- **Geometry**:
	- Point(x, y): Introduced by ourselves. It's a function that returns a $(x, y)$ point expr. It's not a Desmos function.
	- P.x, P.y: Get the x/y coordinate of a point.
	- midpoint(p1, p2)
	- distance(p1, p2)
	- polygon(...points) / polygon(pointList)

- **List Operations**:
	- join: join elements or/and lists into a big list
		- join(x1 | L1, x2 | L2...)  (>= 2 arguments)
		- L.join(x | L...)(>= 1 argument)
		- x.join(x1 | L1, x2 | L2...)  (>= 2 arguments) (note that x will be ignored... is it Desmos' delibrate design?)
	- sort(L), L.sort: sort a list
	- sort(L, L0), L.sort(L0): sort a list based on another list
	- shuffle(L), L.shuffle: shuffle a list
	- shuffle(L, seed), L.shuffle(seed): shuffle a list with a seed
	- unique(L), L.unique: makes a list of the unique elements of an original list

- **Statistics**:
	- mean(x1, x2, ...), mean(L), L.mean
	- median(x1, x2, ...), median(L), L.median
	- min(x1, x2, ...), min(L), L.min
	- max(x1, x2, ...), max(L), L.max
	- quartile(L, n), L.quartile(n)
	- quantile(L, p), L.quantile(p)
	- stdev(x1, x2, ...), stdev(L), L.stdev
	- stdevp(x1, x2, ...), stdevp(L), L.stdevp
	- var(x1, x2, ...), var(L), L.var
	- varp(x1, x2, ...), varp(L), L.varp
	- mad(x1, x2, ...), mad(L), L.mad
	- cov(L1, L2)
	- covp(L1, L2)
	- corr(L1, L2)
	- spearman(L1, L2)
	- stats(L): five number summary - (minimum, first quartile, median, third quartile, and maximum values) of a list
	- count(x1, x2, ...), count(list), L.count: count of elements in a list
	- total(x1, x2, ...), total(list), L.total: sum of elements in a list

- **Statistical Tests**:

	To be honest idk what they mean. But they are in Desmos.
	
	Introduces `STest` type. Unoperable, unassignable.
	
	- ttest(list, sample)
	- tscore(list, sample)
	- ittest(list1, list2)

- **Distributions**:
	> This part mainly serves the $random()$ function in Desmos.
	Introduces `Dist` type, explained below.

	- normaldist(mean, stdev)
	- tdist(df)
	- poissondist(lambda)
	- binomialdist(n, p)
	- uniformdist(min, max)
	- pdf(dist, x)
	- cdf(dist, x)
	- inversecdf(dist, p) \
		/ (a secret usage) inversecdf(list, p): inverse CDF of a discrete distribution
	- **randoms**:
		- random(): a random number between 0 and 1
		- random(n): n random numbers between 0 and 1
		- random(n, seed): n random numbers between 0 and 1 with a seed
		- random(L): a random element from a list
		- random(L, n): n random elements from a li
		- random(L, n, seed): n random elements from a list with a seed
		- L.random(): a random element from a list
		- L.random(n): n random elements from a list
		- L.random(n, seed): n random elements from a list with a seed
		- random(D): a random number from a distribution
		- random(D, n): n random numbers from a distribution
		- random(D, n, seed): n random numbers from a distribution with a seed
		- D.random(): a random number from a distribution
		- D.random(n): n random numbers from a distribution
		- D.random(n, seed): n random numbers from a distribution with a seed

	Notes about random seeds: Please see section "Generating Random Values" > "A Note on Random Seeds": https://help.desmos.com/hc/en-us/articles/4405633253389-Statistics#h_01FB2RSKNB6NT6P03Y9MXA0VX5


## Operators: Implementation
<!-- 
1. returns expr:
	- a op : `^2`, `^3`, `^-1`, `!` ...
		- chain-form: `a ['op']`
			> `Expr` implements `op` getter, for a new `Expr`.
			> `expr(x)` & the `expl("name")["="](x)` support inputing the `Value` interface (numbers and a few string tokens like "infty") and are the endpoint to handle all Value-to-Expr conversions.\
				This is a requirement from that generally a expression buildchain is always possible to be headed with a Expr, and that a Value is always eligable to take the place of an Expr.
			> Ensures it is an `Expr` for subsequent operations.
	
	- a op b : `+`, `-`, `*`, `/`, `^`, `%`, `%of`, ...
		- chain-form: `a ['op'] (b)`
			- handle cases with inversed precendences?
			> `Expr` implements `op` getter, for a function to receive rhs `Expr` | `Value` and return the result `Expr`.

	- op(a) : abs, sqrt, cbrt, sin, cos, tan, asin, acos, atan, ln, log, exp, ...
		- These operators often have explicit precedence. If there's no tools like parantheses, we have to assume they have higher precedence.
			- Issues emerges at sqrt as people may have the same expectation of it having low precedence as the expectation of it having high precedence without parantheses.
			- Without paratheses, trigonometric functions' conventional precedence is at an akward position: lowe than * and /, but higher than + and -.
		- chain-form: `op (a)`
			> `op` to be a global function that receives `Expr` | `Value` and returns `Expr`.
		- alternative: `['op'] (a)` --- whatever but it just rid the parentheses. Because the interactional cases are:
			- `expr ['op'] (a)`
			- `... ['+'] ['op'] (a) ['+']` for 'a op b' operators. we had to assume 'op(a)'s always has higher precedence than 'a op b's
			
			

	- op(a, b) : min, max, gcd, lcm, nCr, nPr, mod, round, ...
		- chain-form: `op(a, b)` --- we have to suppose the operator has a name as valid js identifier.

2. returns bool / predication:
	- a op b : `>`, `<`, `>=`, `<=`, `==`, `!=`, `&&`, `||`, `!`, ...
		- chain-form: `a ['op'] (b)`
		- boolean operators are in the range of toolkits and will finally be transformed. -->

```ts
const x1 = expl('x1') ['='] (1) ();

// 'a op' type
const y1 = expl('y1') ['='] (2) ['+'] (x1) ["^2"] ();
const y2 = expl('y2') ['='] (x1) ['^2'] ['+'] (2) ();	// compability ok

// 'op(a)' type
// y3 = 2 + abs(x1) + 3
const y3 = expl('y3') ['='] (2) ['+'] (abs(x1)) ['+'] (3) ();	
// maybe we can say that parentheses are necessary cuz they exists in math.
// y4 = abs(x1) + 3, expr
const y4 = expr (abs(x1)) ['+'] (3);
// yet another way
const y4 = expr ['abs'] (x1) ['+'] (3);
const y3 = expr (2) ['+'] ['abs'] (x1) ['+'] (3);

// ''
```



## Special Syntaxes

### List Making & Indexing

Desmos supports:

(latex : description)
- $[1, 2, 3]$: declaring a list with all known elements.
- $[1, \ldots, 10]$: declaring a list with a range. 
- $[1 \ldots 10]$: Yes in this case you can omit the commas.
- $[1, 2, \ldots, 10]$: declaring a list with a range and custom step. 
- $[1, 3, 5, \ldots, 9, 11, 12]$: you can literally put anything plus a "..." into the square brackets, as long as you keep them arithmetic...? Okay I can't explain it either. Anyway list the entries however you like and we won't check for that. "..." will be allowed everywhere in a list declaring syntax. (But we'll still check for if there're entries before and after it.)

- $[1, 2, 3][1]$: indexing a list for a single element.
- $[1, 2, 3][1, 2]$: indexing a list for a sublist.
- $[1, 2, 3][1, ..., 10]$: indexing a list with ranges! You can use the range syntaxes here too, like that mentioned above.
- $[1, 2, 3][1 \ldots]$: one adiitional syntax here. In the context of list indexing you can range without an end, as Desmos will work it out.
- $[1, \ldots, 10][L]$: indexing a list with another list. If $A[L] = B$, then $A[L[i]] = B[i]$ for all $i$ in the domain of $L$.
- $L[L>5]$: filtering a list with specific conditions. The condition can be any expression that returns a boolean value.
- $A[B>5]$ (for A, B as lists): okay the previous one is a special case of this. For the filter here, "B>5", we can suggest its data type to be "a list of predicates / booleans" even though such concept aren't mentioned in Desmos official docs. 
	> Boolean Lists can be easily supported here, and we support the extensional boolean operations on them as well. But in Desmos such existence are often fragile --- it cannot undergo list manipulations, cannot be explitly saved, and cannot be used in other contexts --- just the same as ordinary booleans (which finally belongs to a piecewise expression, or be top-level as an inequality). Even $A[(B>5)]$ will make Desmos errors! So that's why we have to treat them as a separate type.

A general point for dealing with lists is: **We don't know whether your object is a object or its list. You can assume they are lists at any time.**

**Chain-form syntax**:
- **List Making**:
	- $[1, 2, 3] [1]$ <- ` ... ([1, 2, 3]) ...`
	- $[1, ..., 3]$ <- ` ... ([1, "...", 3]) ...`

	Implemention:
	> Any slot that receives an type `T` (Expr, Boolean, Color, Tone) should be able to receive a list of `T`'s. More exactly, receive `T[]`; But for Expr it receives `ExprEntry[] | [ExprEntry, ...ExprEntry[], "...", ExprEntry]`.\
	> So generally we request they should receive `T | ListLiteral<T>`, where `ListLiteral<T> = T extends ExprEntry ? T[] | [T, ...T[], "...", T] : T[]`.
	> And they will be delegated to the `expr()` function which handles the conversion and returns corresponding object.

- **List Indexing**:
	- $[1, 2, 3] [1]$ <- ` ... ([1, 2, 3]) (1) ...`
	- $[1, 2, 3] [1, 2]$ <- ` ... ([1, 2, 3]) ([1, 2]) ...`
	- $[1, 2, 3] [1, ..., 3]$ <- ` ... ([1, 2, 3]) ([1, "...", 3]) ...`
	- $[1, 2, 3] [1, ...]$ <- ` ... ([1, 2, 3]) ([1, "..."]) ...`
	- $[1, 2, 3] [L]$ <- ` ... ([1, 2, 3]) (L) ...`
	- $[1, 2, 3] [L>5]$ <- ` ... ([1, 2, 3]) (L ['>'] (5)) ...`
	
	We don't record subtypes so yes you can index anything Expr with anything Expr. It will be Desmos' job to check it. Who knows if your Expr is conditionally a list or a polygon?

	Implemention:
	- The `Expr` class (and else, like `Color` `Tone` below) should implement `List` interface, which
		- have a callable signature, receiving: 
			- a `ExprEntry` or `Boolean`, for single / list-based indexing
			- `IndexListLiteral = ExprEntry[] | [ExprEntry, ...ExprEntry[], "..."] | [ExprEntry, ...ExprEntry[], "...", ExprEntry]`, for inline multi indexing
	telling an object a `List` is more like to tell it "Indexable".


### Piecewise Expressions

Just use the `If` function.

### Points

Desmos supports points in the form of $(x, y)$.

One difficulty is that js/ts cannot treat a `(a, b, c)` form as a tuple --- it will be treated as a sequence evaluation and only returns the last element. 

But if we use array to represent points, it will conflict with the list syntaxes. 

So we have to use a more-detailed data structure to represent points:
```ts
function Point(x: ExprEntry, y: ExprEntry): Expr {
	//...
}
```
also implement binary operator for creating points: ` ... .Point(x, y) ...`

We don't record subtypes, so you access coordinates of anything you think is point and take your own care of it.


### Scope Syntaxes

Sometimes you can write something to define a local scope with local variables. These are:

- **"With" Comprehension**: $b^2 \text{ with } a = 1$: a local variable $a$ is defined and used in the expression $b^2$. If $b$ depends on $a$ in global scope, then it will be evaluated with the $a$ replaced by the local one in the comprehension. Note that this is a common property across all local scopes, only that it is the only feature of "With" comprehension.
- **"For" Comprehension**: 
	- **"For" on Lists**: $[f(a) \text{ for } a = [1, 2, 3]]$: a list of $f(x)$ for each $x$ in $[1, 2, 3]$.
	- **"For" on Intervals**: $(a, a^2 - 2a - 3) \text{ for } -1 < a < 3$: Again idk why Desmos call them "intervals" --- they are going to be essentially **Parametrics**!
- **Sums & Products**: $\sum_{a = 1}^{10} a^2$, $\prod_{a = 1}^{10} a^2$.
- **Integrals**: $\int_{-1}^{1} x^2 dx$.

Actually I don't really know why Desmos always call these things "comprehensions", of lists and "for"'s and "with"'s. I think it is just nothing more than sth like foreach() function in other languages. But anyway, we can support them.

> Note: If there's a scope syntax, for example a "with" comprehension, wrapping outside of another scope syntax, for example a "for" comprehension, and the local variables the outer and inner define exactly collide, then Desmos will error: "You can't define 'a' more than one on the right-hand side of 'for'."

So due to the complicated rules of scoping, we have to extend our type system a bit. In previous notes we say we have to record the "external" symbol dependencies marks in the `Expr` type. Now we have to record local symbol dependencies marks as well.

Assume we gotta implement the `foreach` method (or for more writting options, implement it as a getter for a function) in this way:
```ts
L.foreach("i", i => sqrt(i));
```
then:
- The variable `i` will be a external dependency in the perspective of the content.
- The content may refer to the local `i` or a global variable with explicit name "i" --- in the end it always becomes the local one.
- However the content depend on symbol "i", the result of the `foreach` method should clear the external symbol dependency on "i", unless the list `L` itself depends on "i".
- There should be a local symbol dependency mark for `i` in the result's type.
- `foreach` should check if the content have already have a local symbol dependency mark for `i`, if so it should prevent it.

The complete syntaxes are:
- **"With" Comprehension**:
	- $c^2 \text{ with } a = 1, b = 2$ <- 
		- `... .with ("a", 1, "b", 2, (a, b) => c ['^'] (2)) ...`
		- `... .with ({a: 1, b: 2}, (a, b) => c ['^'] (2)) ...`
		- `... .with (a, 1) (b, 2) ((a, b) => c ['^'] (2)) ...`
		- `with ("a", 1, "b", 2, (a, b) => c ['^'] (2)) ...`
		- `with ({a: 1, b: 2}, (a, b) => c ['^'] (2)) ...`
		- `with (a, 1) (b, 2) ((a, b) => c ['^'] (2)) ...`
- **"For" Comprehension**:
	- $[a^2 \text{ for } a = L]$ <- `L.foreach("a", a => a ['^'] (2))`
	- $[a + b \text{ for } a = [1, 2, 3], b = [4, 5, 6]]$ <- 
		- `... .for ("a", [1, 2, 3], "b", [4, 5, 6], (a, b) => a ['+'] (b)) ...` 
		- `... .for ({a: [1, 2, 3], b: [4, 5, 6]}, (a, b) => a ['+'] (b)) ...`
		- `... .for (a, [1, 2, 3]) (b, [4, 5, 6]) ((a, b) => a ['+'] (b)) ...`
		- `for ("a", [1, 2, 3], "b", [4, 5, 6], (a, b) => a ['+'] (b)) ...`
		- `for ({a: [1, 2, 3], b: [4, 5, 6]}, (a, b) => a ['+'] (b)) ...`
		- `for (a, [1, 2, 3]) (b, [4, 5, 6]) ((a, b) => a ['+'] (b)) ...`
	- $[(a, a^2 - 2a - 3) \text{ for } -1 < a < 3]$ <- 
		- `... .for ("a", [-1, 3], (a) => Point(a, a ['^'] (2) ['+'] (a ['*'] (-2)) ['+'] (-3)) ...`
		- `for ("a", [-1, 3], (a) => Point(a, a ['^'] (2) ['+'] (a ['*'] (-2)) ['+'] (-3)) ...`
- **Sums & Products**:
	- $\sum_{a = 1}^{10} a^2$ <- 
		- `... .sum ("a", 1, 10, a => a ['^'] (2)) ...`
		- `sum("a", 1, 10, a => a ['^'] (2)) ...`
	- $\prod_{a = 1}^{10} a^2$ <- 
		- `... .prod ("a", 1, 10, a => a ['^'] (2)) ...`
		- `prod("a", 1, 10, a => a ['^'] (2))`
- **Integrals**:
	- $\int_{-1}^{1} x^2 dx$ <- 
		- `... .int ("x", -1, 1, x => x ['^'] (2)) ...`
		- `int("x", -1, 1, x => x ['^'] (2)) ...`

## Misc Objects

### Colors
In Desmos, colors are created using the `rgb(r, g, b)` or `hsv(h, s, v)` functions.

Color objects have limited manipulation options; they can primarily be assigned or added to a color list, which can be applied list operations.

The primary use of colors is to assign them to the color property of a graph object. Color lists are treated the same way as individual colors in this context.

Therefore, we can simplify by using a single `Color` type, allowing list operations to be applied universally. `Color` implements `List` interface and all `Color` receivers also receive `ListLiteral<Color>`.

The `rgb` and `hsv` functions will be implemented to return a `Color` object.

```ts
const c1 = rgb(255, 0, 0);
const c2 = expr.hsv(0, 1, 1);
const c3 = c1 .join (c2);
const c4 = c3 .join ([c2, c1]);
const c5 = rgb([1, '...', 255], 0, 0);
```

### Tones

Tone function: $tone(f, a)$ plays a tone of frequency $f$ Hz for $a$ seconds.
```ts
const tone1 = tone(440, 1);
```
support list input, list operations, and is list insensitive. `Tone` implements `List` interface and all `Tone` receivers also receive `ListLiteral<Tone>`.

### Actions

Actions are directives that, when executed, update specific variables. They can be set to the "on click" property of a graph object, making them interactive.

Examples:
- `$a \to 1$` sets the variable `$a$` to 1.
- `$a \to a + 1$` increments the variable `$a$` by 1.
- `$A_1 = a \to a + 1$` assigns or names the action `$A_1$`.
- `$A_2 = a \to a + 1, b \to b + 1$` combines actions with commas, running them in parallel.
- `$A_3 = A_1, A_2$` combines actions `$A_1$` and `$A_2$` in parallel.

> Note: Batch of actions run in parallel, that means they all depend on the same initial state of variables. For example, `$a \to a + 1, b \to a$` sets `$b$` to `$a$`, not `$a + 1$`.

Additional notes:
- The operand of an action must be an explicitly defined variable.
- A composite action cannot update a variable more than once.

Actions behave similarly to lists but with the constraint that their operands should not duplicate. In implementation, we mark the operand name in the Action object/type to ensure different actions are distinguishable.

User can combine multiple actions into a tuple as transitional, then input it into explicit declarations or the `expr()` function to get a converted composite action. Alternatively, actions can be input one by one into the `expr(...actions)` function for conversion.

```ts
const a = expl('a') ['='] (1);
const b = expl('b') ['='] (2);
const A1 = a ['->'] (a) ['+'] (1);
const A2 = b ['->'] (b) ['+'] (1);
const A01 = [A1, A2] as const;  // tuple
const A02 = expr(A1, A2);
const A03 = expl('A_03') ['='] (A1, A2);
const A04 = expl('A_04') ['='] (A01);
```

## Graph Settings

The global settings and factors in a Desmos graph include:
- **Ticker**: A feature which constantly runs actions. User can define the ticker's interval, the actions to run, and whether it starts on graph load. The context of the actions input provide a variable `dt` for the system-measured real time interval.
- **Graphing Calculator Configuration & Settings**: that desmos officially provides. Officials only disclosed docs and the community's type declarations are outdated. We will make the setting of type `{ [key: string]: any }` and watch out the docs when passing the setting params.

We only give approaches to set the settings on graph initialization. The settings can be changed later by the UI.

Latest Desmos API docs (v1.10): https://www.desmos.com/api/v1.10/docs/index.html; See "Graphing Calculator" section.



## Concepts Explained

### Value Literals

In certain cases, we need to directly input numbers and special tokens into expressions. These are referred to as "Value Literals".

Desmos supports the following constants:

- $\pi$, $\tau$, $e$, $\infty$, $i$: Mathematical constants.
- `width`, `height`: Constants representing the width and height in pixels of the graphing area.

ts definition:
```ts
type ValueToken = "pi" | "tau" | "e" | "infty" | "i" | "width" | "height";
type ValueLiteral = ValueToken | number;
type ExprEntry = Expr | ValueLiteral;
```

### Name Literals

In Desmos, an object can be assigned a name. But there are some constraints on the name. Strings meeting such constraints will be referred to as "Name Literals".

- Names must consist of: one letter, optionally one loadash (means subscript), followed by a subscript string.
- Subscript string must consist of one or more letters and digits.

Unfortunately there is no way to directly specify a type covering the range of all possible name literals. So we gotta use type validators:

```ts
type Letter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type AsAllowedSubscript<T extends string> = (
	T extends ""
		? ""
	: T extends `${Letter | Digit}${infer Rest}`
		? Rest extends AsAllowedSubscript<Rest>
    	  	? T
    		: never
    	: never
);
type AsNameLiteral<T extends string> = (
	T extends `${Letter}_${infer Rest}`
		? Rest extends AsAllowedSubscript<Rest>
			? T
			: never
	: T extends Letter
		? T
		: never
);

// example usage
declare function func<T extends string>(x: AsNameLiteral<T>): void;
func('a_a@a');
func('a_a');
func('a_a0');
func('');
func('@');
```

