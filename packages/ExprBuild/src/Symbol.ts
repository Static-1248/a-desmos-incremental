import { Expr } from "./Expr";

export class Symbol extends Expr {
	name: string;
	constructor(name: string) {
		super();
		this.name = name;
	}
}
