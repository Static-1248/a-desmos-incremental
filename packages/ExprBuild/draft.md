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


## Option: Allow `.eq()` = `.$("=")`, still static-analyzable？


## Option: $-based vs pure-curry

## The Problem: How to input the rhs linearly ????

```ts
const v_2 = $("v_2") .eq() .$( (v_11 .plus() .$(1)) .sr() );	// $method related
const v_2 = $("v_2") .eq() .$( v_11 .plus() .$(1) ) .sr() ();	// $method related
const v_2 = $("v_2") .$(v_11 .plus() .$(1)) .sr();				// $method related; Max style consistency (?

const v_2 = $("v_2") .eq ( v_11 .plus ($(1)) ) .sr() ();
const v_2 = $("v_2") (v_11 .plus ($(1))).sr();

```