import { Expr } from "./Expr"

class ConstExpr extends Expr {
	readonly x: number;
	constructor(x: number) { super(); this.x = x; }
}

function expr(x: number): ConstExpr {
	return new ConstExpr(x);
}

export { expr };

expr(1) ['+'] (2) ['+'] (3) ['+'] (5)