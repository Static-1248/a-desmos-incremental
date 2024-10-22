**Goal: The ts library to build expressions for Desmos with high scalability, reusability, and productivity**

**In previous note we determined the pattern for the chain-form coding with the context of a few simple operators. Now we are going to extend the system to cover all operators in Desmos.**

Recall our Expr-Building system:
- **Transitionals**: Expressions and functions that, when output, will have their references substituted if any other mathematical object (mobj) refers to them.
	> These are maintained directly via the TypeScript language context.

- **Explicits**: Named expressions and functions that, when output, will have their references saved if any other mobj refers to them.
	> This is managed through the TypeScript value system and in-type marks.

# Elements

## General

In the following sections, we will list various elements in Desmos in terms of our ExprBuild library.

The possible math types in Desmos include:
- **Expr**: a mathematical expression, which can be evaluated.
- **Boolean**: which's supposed to be a normal subtype of **Expr** (and are actually built with Exprs), but due to its limited usage in Desmos, we have to treat it as a separate type. We will provide a toolkit for boolean operations.
- **Func**: a mathematical function, which can be evaluated if all its arguments are provided.
- **Eq**: an equation.
- **Ineq**: an inequality.
- **Action** / **Actions** : a mathematical action, which can be executed.
- **Tone** : a Desmos tone which can be played.

Not considered yet:
- Special types of **Expr**:
	- **Parametrics**
	- **Points**
	- **Polygons**
	- **Lists**: list of numerical expr, points, or polygons
	> These subtypes are primarily distinguished by their different plot settings (aka display settings). Desmos does not enforce strict restrictions on these settings; any expression type can have various display settings. The validity of these settings depends on the specific subtype it evaluates to at runtime. For now, we will ignore these distinctions.
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

Other To-dos:
- Draw the line of desmos-specific feature and general features.

## Operators

There should be a wide range of operators, including:

- **a op** : `^2`, `^3`, `^-1`, `!` ...
- **a.attr** : .x, .y, .count, .length; .real, .imag (complex mode only) 
	> Note: `a.attr` and `a op` (i.e., `(a) ['op']`) are equivalent in js and both can be used interchangeably. The classification here is based on intuitive understanding and preferred usage.

- **a op b** : `+`, `-`, `*`, `/`, `^`, `%`, `%of`, `root` ...


**function-likes**:

- **op(a) / op a** : abs, sqrt, cbrt, trig/inv-trig/hyp-trigs, ln, log, exp, ...
- **op(a, b) / op a b** : gcd, lcm, nCr, nPr, mod, round, log, quartile, quantile...
- **op(x1, x2, ..., xn)** : mean, median, min, max, stdev...


**Exhaustive list of function-likes**:

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

- **Basics & Calculus**:
	- abs(x), sqrt(x), cbrt(x),
	- exp(x)
	- log(a, x); log(x) = log(10, x)
	- ln(x) = log(e, x)

- **Number Theory**:
	- lcm(a, b, ...), lcm(list), gcd(a, b, ...), gcd(list)
	- mod(a, b) = a % b
	- ceil(x), floor(x), round(x), round(x, n)
	- sign(x)
	- nPr(n, r), nCr(n, r)

- **Complex Numbers**:
	> Needs Desmos enabled complex mode. Consider adding a flag in a flags dict into type `Expr<...>`'s generic params?
	- real(z), imag(z), arg(z), conj(z)

2. returns bool / predication:
	- a op b : `>`, `<`, `>=`, `<=`, `==`, `!=`, `&&`, `||`, `!`, ...

## The Linear Chain Design, Taking Account of All Operators
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

**Chain-form syntax**:
- **List Making**:
	- $[1, 2, 3] [1]$ <- ` ... ([1, 2, 3]) ...`
	- $[1, ..., 3]$ <- ` ... ([1, "...", 3]) ...`

	Implemention:
	> Any slot that receives an Expr should be able to receive a list of Exprs. More exactly, receive `Array<ListEntry>` where `ListEntry = Expr | Value | "..."`.\
	> And they will be delegated to the `expr()` function which handles the conversion and retuns corresponding list `Expr`.

- **List Indexing**:
	- $[1, 2, 3] [1]$ <- ` ... ([1, 2, 3]) (1) ...`
	- $[1, 2, 3] [1, 2]$ <- ` ... ([1, 2, 3]) ([1, 2]) ...`
	- $[1, 2, 3] [1, ..., 3]$ <- ` ... ([1, 2, 3]) ([1, "...", 3]) ...`
	- $[1, 2, 3] [1, ...]$ <- ` ... ([1, 2, 3]) ([1, "..."]) ...`
	- $[1, 2, 3] [L]$ <- ` ... ([1, 2, 3]) (L) ...` (L is explicit)
	- $[1, 2, 3] [L>5]$ <- ` ... ([1, 2, 3]) (L ['>'] (5)) ...` (L is explicit)
	
	We don't record subtypes so yes you can index anything Expr with anything Expr. It will be Desmos' job to check it. Who knows if your Expr is conditionally a list or a polygon?

	Implemention:
	> The `Expr` class should be callable... wait could it be possible?\
	> Anyway if it can, then it should receive a `Expr | Value` or `Array<ListEntry>`.\


### Piecewise Expressions

Just use the `If` function.

### Points

Desmos supports points in the form of $(x, y)$.

One difficulty is that js/ts cannot treat a `(a, b, c)` form as a tuple --- it will be treated as a sequence evaluation and only returns the last element. 

But if we use array to represent points, it will conflict with the list syntaxes. 

So we have to use a more-detailed data structure to represent points:
```ts
type Point = { x: Expr, y: Expr };
function Point(x: Expr | Value, y: Expr | Value): Point {
	return { expr(x), expr(y) };
}
```

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