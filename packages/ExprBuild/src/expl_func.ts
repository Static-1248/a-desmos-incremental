import { Expr } from "./Expr"

class ConstExpr extends Expr {
	readonly x: number;
	constructor(x: number) { super(); this.x = x; }
}

function expl(x: number): ConstExpr {
	return new ConstExpr(x);
}

export { expl as $ };