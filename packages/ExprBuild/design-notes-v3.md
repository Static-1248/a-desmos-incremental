**Idea: Imitate the system in Logimat.**


**This version concerns about how to use Tagged Template Literals to build expressions, with types deducable.**

example:

```ts
const x_b = expr`(${x_a} + 1)^2 / ${x_a}`
```

- **expr** is a tagged template literal function.
- **${x_a}** is a placeholder for an expression. Here, **x_a** is a variable of type **Expr**.

---

# Language Specification

> Specifying the grammer of the math literals in our tagged tamplates.


		