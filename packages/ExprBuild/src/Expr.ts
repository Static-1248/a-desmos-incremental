import { $ } from "./dollar";
import { Mobj } from "./Mobj";

type PlusCurry1 = {};
type MinusCurry1 = {
	$(arg: Expr): Expr;
	$(arg: number): Expr;
};

export class Expr implements Mobj {
	
	type = 'Expr';
	// No inherance ...?
	// private constructor(){}

	plus(): PlusCurry1 {
		return {};
	}

	minus(): MinusCurry1 {
		return {
			$: ((arg: Expr | number): Expr => {
				const rhs = typeof arg === 'number' ? $(arg) : arg;
				return rhs;
			})
		};
	}


	$(x: "+"): PlusCurry1;
	$(x: "-"): MinusCurry1;
	$(arg: "+" | "-"): PlusCurry1 | MinusCurry1 {
		if ( arg === '+') {
			return this.plus();
		} else {
			return this.minus();
		}
	}
}
