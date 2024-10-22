import { Expr } from "./Expr";
import { Mobj } from "./Mobj";

/*
expr < 0 or expr > 0;
remarks:
- 使3个flag独立而可全组合？
- 与Eqn统一？

Desmos中的限制:
	- 不等式作为最终类型时，只允许有限的flag组合: < > <= >= (=)
	- 作为谓词时，除<=>外皆允许

	- 可以变换为等效合法表达式; 所以如果允许在这方面上启用变换，也即撤销Expr结构与输出结构相同的保证，那么flags的范围便能拓展到全组合。

*/


export class Ineq implements Mobj<"Ineq"> {
	type: "Ineq" = "Ineq";
	expr: Expr;
	constructor(expr: Expr) {
		this.expr = expr;
	}
}
