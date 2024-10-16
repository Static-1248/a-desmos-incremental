```typescript

$('x') .lteq() .$('y')

// should hinder crashes ...?

// transitionals have no worries.
	const pisr = $.pi .sr();
	// const pisr = $.pi .sqrt();	// never possible as ts context ensured consts' uniqueness
```


but what are they based on?\
1st they can be based on consts.\
2nd whatabout variables ...?\
--- variables are "explicits".

> transitionals: expr & funcs whose references (into other mobjs ...?) are substituted on output
> explicits: expr & funcs which takes up a line & whose references are saved on output


Explicits whose uniqueness is maintained via ts value context:
--- Okay impossible.

Expicits whose uniqueness is maintained via the TYPING SYSTEM:
```typescript
// v1.ts
const v_1 = $("v_1") .eq() .$(1);	// type: Expr<[], "v_1">
const v_11 = v_1 .sr();				// type: Expr<["v_1"]>
export {v_1, v_11}

// index.ts
import * from './v1'
const v_2 = $("v_2") .eq() .$( v_11 .plus() .$(1) .sr() );  // type: Expr<["v_1"], "v_2">

export default ExprList(v_1, v_2); 	// Dependency check here (via typing system)
// ... is it feasible?
// or, a step further,
export default ExprList(v_2);  // like this?
```

```typescript
Expr implements Expr<[]> ...?
```




## Control Flows

```typescript
$.If(  )


```



# Design Options

## Allow `.eq()` = `.$("=")`, still static-analyzable？


## $-based vs pre-curry