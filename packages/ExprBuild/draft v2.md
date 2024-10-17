**Idea: Imitate the system in Logimat.**

Math object types:
- **Expr**: a mathematical expression, which can be evaluated.
- **Func**: a mathematical function, which can be evaluated if all its arguments are provided.
- **Eq**: an equation.
- **Ineq**: an inequality.

Other Desmos factors not resolved yet:
- special types of Expr:
	- parametrics
	- lists
	- points
- tables
- action / actions
- polygons
- folders
- special grammers:
	- 'for' comprehension
	- 'with' comprehension
	- recursion


- **transitionals**: expr & funcs, when output, if any other mobj have a reference to it, the reference is substituted.
	> implemented by directly using ts value system.

- **explicits**: expr & funcs with a certain name. when output, if any other mobj have a reference to it, the reference is saved.
	> ts value system + in-type marks.

**This version concerns about how to use Tagged Template Literals to build expressions, with types deducable.**

example:

```ts
const x_b = expr`(${x_a} + 1)^2 / ${x_a}`
```

- **expr** is a tagged template literal function.
- **${x_a}** is a placeholder for an expression. Here, **x_a** is a variable of type **Expr**.



---

# Language Specification

> Specifying the grammer of the string literals in our tagged tamplates.



1. Binary operators:
	1. produces expression