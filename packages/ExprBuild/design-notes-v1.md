**Idea: Imitate the system in Logimat.**

## Design Point: Linear Coding

```ts
$('x') .lteq() .$('y')
```

> The code should be chained in math's natural order and never need parantheses, unless the math itself needs it.\
	- This ensures our code to have isomorphic structure with the math itself.

## Problem: Name Consistency

A big point is to avoid name crashes. i.e, namespace consistency

types of variables:

- **transitionals**: expr & funcs whose references (into other mobjs ...?) are substituted on output
	> implemented by directly using ts value system.

- **explicits**: expr & funcs which takes up a line & whose references are saved on output
	> ts value system + marks in type.

```ts
// v1.ts
const v_1 = expl('v_1') ['='] (1);	// type: Expr<[], "v_1">
const v_11 = v_1 ['^2']				// type: Expr<["v_1"]>
export {v_1, v_11}

// index.ts
import * from './v1'
const v_2 = expl('v_2') ['='] ( v_11 ['+'] (1) ['^2'] );  // type: Expr<["v_1"], "v_2">

export default ExprList(v_1, v_2); 	// Dependency check here (via typing system)
export default ExprList(v_2);  		// or one step further, auto bring up dependencies
```

---

## Option: inputing RHS : $method vs pure-curry

## Option: calling OP : `.$('=')` / `('=')` / `['=']` / `.eq()` / `.eq`

## Option: declaring explicits : .eq() needed 	= true;

## Option: declaring explicits : use closers	= true;

Example: x_b = (x_a + 1)^2 / x_a

```ts
const x_b = $('x_b') .$('=') .$( ( x_a .$('+') .$(1) ) .$('^2') .$('/') .$(x_a) );	// .$('op');	$method; no closers;

const x_b = $('x_b') .$('=') .$( x_a .$('+') .$(1) ) .$('^2') .$('/') .$(x_a) ();	// .$('op');	$method; 

const x_b = $('x_b') .eq() .$( x_a .plus() .$(1) ) .sr() .div() .$(x_a) ();			// .op();		$method;

const x_b = $('x_b') .eq .$( x_a .plus .$(1) ) .sr .div .$(x_a) ();					// .op;			$method;

const x_b = $('x_b') ('=') ( x_a ('+') (1) ) ('^2') ('/') (x_a) ();					// ('op');		curry;

const x_b = $('x_b') ['='] ( x_a ['+'] (1) ) ['^2'] ['/'] (x_a) ();					// ['op'];		curry;

const x_b = $('x_b') .eq ( x_a .plus (1) ) .sr .div (x_a) ();						// .op;			curry;

const x_b = expl`x_b` `(${x_a} + 1)^2 / ${x_a}`										// ??? advanced api

const x_b = $`x_b` `=` `${ $`${x_a}` `+` `1` }` `^2` `/` `${x_a}`					// ????????????????????whatthehellareyoudoing
```
All of these above creates an Expr object of "(x_a + 1)^2 / x_a" based on x_a, another Expr, 's content, 
	and at the same time declaring it to be an explicit variable named 'x_b'.

Explicit means when outputting (to for example multiline LaTeX), the expression will be saved as a line in the output, 
	and the variable name 'x_b' will be used to refer to this expression in other expressions.

Structural info is kept in the Expr object as a tree, 
	and all the explicit variables it depends are kept in the type,
	so when outputting, the output system can check if all the explicit variables have and only have one declaration.

---

**Final Candidate:**

```ts
const x_b = expl('x_b') ['='] ( x_a ['+'] (1) ) ['^2'] ['/'] (x_a) ();					// ['op'];		curry; referred as the chain form below.

const x_b = expl`x_b` `(${x_a} + 1)^2 / ${x_a}`											// tag template literal for explicits

const x_b = expr`(${x_a} + 1)^2 / ${x_a}`												// tag template literal for transitionals
```

The 3 approaches will be provided at the same time --- you can even mix them up.