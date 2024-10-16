import { Expr } from "./Expr";
import { Mobj } from "./Mobj";

export class Func extends Mobj {
	type = "Func";

	name: string;
	args: Symbol[];
	body: Expr;
	constructor(name: string, args: Symbol[], body: Expr) {
		super();
		this.name = name;
		this.args = args;
		this.body = body;
	}
}
