
class Expr<T extends string[], U extends string | undefined = undefined> {};

// first argument is dependency, 
// second arguement is if itself is a explicit, that is, 
// it has a identifier in the typing system and can be depended.

// when x_a has type Expr<[], 'x_a'> 
// and when x_b has type Expr<[], 'x_b'>
// const x_c = expr`(${x_a} + 1)^2 / ${x_b}` 		// should have type: Expr<['x_a', 'x_b']>
// const x_d = expl`x_d``(${x_a} + 1)^2 / ${x_b}` 	// should have type: Expr<['x_a', 'x_b'], 'x_d'>

// let's first work on non-explicit version.
// tokens should be recognized and we ensure the string is nothing other than a pure math expression, 
// 		like, it shouldn't be a function or equation something.
// 		if it is, it should return a Func type or Eq type, not Expr type.
//		that is temporary not in our consideration.

// Okay we actually gonna write an ast right in the typing system.
// Challenge accepted.

/**
 * Specification of our Custom Math Language:
 * 
 * 1. binary operator: +, -, *, /, ^, %.
 * 
 */

function expr
	<T extends [string[], string | undefined][]>
	(strings: TemplateStringsArray, ...values: { [K in keyof T]: Expr<T[K][0], T[K][1]> })
	: TypeTransform0<(typeof strings)['raw'], T> {
	return {};
}

type TypeTransform0
	<T extends string[], U extends [string[], string | undefined][]> 
	= TypeTransform1<T, U, 0, [], undefined>;