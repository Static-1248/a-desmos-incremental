**Idea: Imitate the system in Logimat.**

## Design Point: Linear Coding

```ts

$('x') .lteq() .$('y')

```

## Problem: Name Consistency

A big point is to avoid name crashes. i.e, namespace consistency

- **transitionals**: expr & funcs whose references (into other mobjs ...?) are substituted on output
	> implemented by directly using ts value system.

- **explicits**: expr & funcs which takes up a line & whose references are saved on output
	> ts value system + marks in type.

Expicits whose consistency is maintained by the TYPING SYSTEM:
```ts
// v1.ts
const v_1 = $("v_1") .eq() .$(1);	// type: Expr<[], "v_1">
const v_11 = v_1 .sr();				// type: Expr<["v_1"]>
export {v_1, v_11}

// index.ts
import * from './v1'
const v_2 = $("v_2") .eq() .$( v_11 .plus() .$(1) .sr() );  // type: Expr<["v_1"], "v_2">

export default ExprList(v_1, v_2); 	// Dependency check here (via typing system)
// ... is it feasible?
// or, one step further,
export default ExprList(v_2);  // like this?
```

```ts
Expr implements Expr<[]> ...?
```

## Control Flows

```ts
const a = $("a") .eq() .$(1);
const a_abs = $.If(  )

```

---

## Option: inputing RHS : $method vs pure-curry

## Option: calling OP : `.$('=')` / `('=')` / `['=']` / `.eq()` / `.eq`

## Option: declaring explicits : .eq() needed 	= true;

## Option: declaring explicits : use closers	= true;

```ts

const x_b = $('x_b') .$('=') .$( ( x_a .$('+') .$(1) ) .$('^2') .$('/') .$(x_a) );	// .$('op');	$method; no closers;

const x_b = $('x_b') .$('=') .$( x_a .$('+') .$(1) ) .$('^2') .$('/') .$(x_a) ();	// .$('op');	$method; 

const x_b = $('x_b') .eq() .$( x_a .plus() .$(1) ) .sr() .div() .$(x_a) ();			// .op();		$method;

const x_b = $('x_b') .eq .$( x_a .plus .$(1) ) .sr .div .$(x_a) ();					// .op;			$method;

const x_b = $('x_b') ('=') ( x_a ('+') (1) ) ('^2') ('/') (x_a) ();					// ('op');		curry;

const x_b = $('x_b') ['='] ( x_a ['+'] (1) ) ['^2'] ['/'] (x_a) ();					// ['op'];		curry;

const x_b = $('x_b') .eq ( x_a .plus (1) ) .sr .div (x_a) ();						// .op;			curry;

const x_b = expr`(${x_a} + 1)^2 / ${x_a}`	//???

const x_b = $`x_b` `=` `${ $`${x_a}` `+` `1` }` `^2` `/` `${x_a}`	// ????????????????????

"x_b = (x_a + 1)^2 / x_a"

```
All of these above creates an Expr object of "(x_a + 1)^2 / x_a" based on x_a, another Expr, 's content, 
	and at the same time declaring it to be an explicit variable named 'x_b'.

Explicit means when outputting (to for example multiline LaTeX), the expression will be saved as a line in the output, 
	and the variable name 'x_b' will be used to refer to this expression in other expressions.

Structural info is kept in the Expr object as a tree, 
	and all the explicit variables it depends are kept in the type,
	so when outputting, the output system can check if all the explicit variables have and only have one declaration.