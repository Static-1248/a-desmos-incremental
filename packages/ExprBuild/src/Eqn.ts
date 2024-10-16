import { Expr } from "./Expr";
import { Mobj } from "./Mobj";

// expr = 0.

export class Eqn extends Mobj {
	type = "Eqn";
	expr: Expr;
	constructor(expr: Expr) {
		super();
		this.expr = expr;
	}
}
