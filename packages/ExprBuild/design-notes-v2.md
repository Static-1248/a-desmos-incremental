**Idea: Imitate the system in Logimat.**

**In previous note we determined the pattern for the chain-form coding with the context of a few simple operators. Now we are going to extend the system to cover all operators in Desmos.**

Math object types for Desmos are:
- **Expr**: a mathematical expression, which can be evaluated.
- **Func**: a mathematical function, which can be evaluated if all its arguments are provided.
- **Eq**: an equation.
- **Ineq**: an inequality.
- **Action** / **Actions** : a mathematical action, which can be executed.
- **Tone** : a Desmos tone which can be played.

Other Desmos factors not considered yet:
- special types of Expr:
	- parametrics
	- points
	- lists of numbers / points / polygons
	> The only reason to tell these subtypes is that different subtypes have different plot settings available. But I heard Desmos doesn't take restrictions on that, and all expr types may have all kinds of display settings, and it is only the problem of whether the settings are valid or not, when this line turned out to be this subtype.\
	> So currently just ignore it.
- tables
- polygons
- things with suspended symbols (used but not defined)
	- yx-like functions	(any 2 undefined symbols)
	- equations & inequalities (x-y or r-θ)
	- parametrics (t)
- folders
- special grammers:
	- 'for' comprehension
	- 'with' comprehension
	- recursion

Other To-dos:
- Draw the line of desmos-specific features.

Logical Toolkits:
- **If**: if-else function
```ts
const a = expl('a') ['='] (1);
const a_abs = If( a ['>'] (0) ) ( a ) ( a ['*'] (-1) );
// we can even use it as switch-case:
// the rule is odd calls are conditions, and even calls are results.
// equivalent to piecewises expressions sin Desmos.
const a_sign = If( a ['>'] (0) ) (1) ( a ['<'] (0) ) (-1) (0);
```

- **transitionals**: expr & funcs, when output, if any other mobj have a reference to it, the reference is substituted.
	> maintained directly via the ts language context.

- **explicits**: expr & funcs with a certain name. when output, if any other mobj have a reference to it, the reference is saved.
	> ts value system + in-type marks.

---

# List of Operators

1. Returns expr:
	- a op : `^2`, `^3`, `^-1`, `!` ...
	- a.attr : .x, .y, .count, .length, .real, .imag, 
	> a.attr is actually equivalent to a op (`(a) ['op']`) in practice. Here the classification is only based on intuition & preferred usage.

	- a op b : `+`, `-`, `*`, `/`, `^`, `%`, `%of`, `root` ...

	function-likes:

	- op(a) / op a : abs, sqrt, cbrt, trig/inv-trig/hyp-trigs , ln, log, exp, ...
	- op(a, b) / op a b : gcd, lcm, nCr, nPr, mod, round, log, quartile, quantile...
	- op(x1, x2, ..., xn) : mean, median, min, max, stdev...

	Exhaustive list of function-likes:
	- Trigs - all are `op(a)`s:
		- sin, cos, tan, cot, sec, csc = "asin-1", "acos-1", "atan-1", "acot-1", "asec-1", "acsc-1";
		- sin2, cos2, tan2, cot2, sec2, csc2;
		- "sin-1", "cos-1", "tan-1", "cot-1", "sec-1", "csc-1" = asin, acos, atan, acot, asec, acsc;
		- asin2, acos2, atan2, acot2, asec2, acsc2;

		- sinh, cosh, tanh, coth, sech, csch = "asinh-1", "acosh-1", "atanh-1", "acoth-1", "asech-1", "acsch-1";
		- sinh2, cosh2, tanh2, coth2, sech2, csch2;
		- "sinh-1", "cosh-1", "tanh-1", "coth-1", "sech-1", "csch-1" = asinh, acosh, atanh, acoth, asech, acsch;
		- asinh2, acosh2, atanh2, acoth2, asech2, acsch2;

		Note: atan = "tan-1" also supports `op(a, b)` form, which equals `atan2(a, b)`.
	
	- Basics & Calculus:
		- abs(x), sqrt(x), cbrt(x),
		- exp(x)
		- log(a, x); log(x) = log(10, x)
		- ln(x) = log(e, x)
	
	- Number Theory:
		- lcm(a, b, ...), lcm(list), gcd(a, b, ...), gcd(list)
		- mod(a, b) = a % b
		- ceil(x), floor(x), round(x), round(x, n)
		- sign(x)
		- nPr(n, r), nCr(n, r)

	- Complex Numbers:
		> Needs Desmos enabled complex mode. Consider adding a flag in a flags dict into type `Expr<...>`'s generic params?
		- real(z), imag(z), arg(z), conj(z)

2. returns bool / predication:
	- a op b : `>`, `<`, `>=`, `<=`, `==`, `!=`, `&&`, `||`, `!`, ...

# The Linear Chain Design Taking All Operators into Account
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

