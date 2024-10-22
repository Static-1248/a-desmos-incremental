import { expr } from "./expr_func";
import { Mobj } from "./Mobj";

type discriminateValuedTemplateString<T extends string> = {
    readonly raw: readonly [T];
}

export class Expr implements Mobj<"Expr"> {

    type: 'Expr' = 'Expr';

    get "+"(): AddCurry<1> {
        return Object.assign((arg: Expr | number): Expr => {
            const rhs = typeof arg === 'number' ? expr(arg) : arg;
            return new AddExpr(this, rhs);
        }, { lhs: this });
    }

    get "plus"(): AddCurry<1> {
        return this["+"];
    }

    get "-"(): SubCurry<1> {
        return Object.assign((arg: Expr | number): Expr => {
            const rhs = typeof arg === 'number' ? expr(arg) : arg;
            return new SubExpr(this, rhs);
        }, { lhs: this });
    }

    get "minus"(): SubCurry<1> {
        return this["-"];
    }

    get "*"(): MulCurry<1> {
        return Object.assign((arg: Expr | number): Expr => {
            const rhs = typeof arg === 'number' ? expr(arg) : arg;
            return new MulExpr(this, rhs);
        }, { lhs: this });
    }

    get "times"(): MulCurry<1> {
        return this["*"];
    }

    get "/"(): DivCurry<1> {
        return Object.assign((arg: Expr | number): Expr => {
            const rhs = typeof arg === 'number' ? expr(arg) : arg;
            return new DivExpr(this, rhs);
        }, { lhs: this });
    }

    get "div"(): DivCurry<1> {
        return this["/"];
    }

    get "^"(): PowCurry<1> {
        return Object.assign((arg: Expr | number): Expr => {
            const rhs = typeof arg === 'number' ? expr(arg) : arg;
            return new PowExpr(this, rhs);
        }, { lhs: this });
    }

	get "pow"(): PowCurry<1> {
		return this["^"];
	}

    get "%"(): ModCurry<1> {
        return Object.assign((arg: Expr | number): Expr => {
            const rhs = typeof arg === 'number' ? expr(arg) : arg;
            return new ModExpr(this, rhs);
        }, { lhs: this });
    }

    get "rem"(): ModCurry<1> {
        return this["%"];
    }

	get "%of"(): PercentOfCurry<1> {
		return Object.assign((arg: Expr | number): Expr => {
			const rhs = typeof arg === 'number' ? expr(arg) : arg;
			return new PercentOfExpr(this, rhs);
		}, { lhs: this });
	}
}

type AddCurry<n = 1> = {
    lhs: Expr;
    (arg: Expr): Expr;
    (arg: number): Expr;
};
class AddExpr extends Expr {
    readonly lhs: Expr;
    readonly rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
}

type SubCurry<n = 1> = {
    lhs: Expr;
    (arg: Expr): Expr;
    (arg: number): Expr;
};
class SubExpr extends Expr {
    readonly lhs: Expr;
    readonly rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
}

type MulCurry<n = 1> = {
    lhs: Expr;
    (arg: Expr): Expr;
    (arg: number): Expr;
};
class MulExpr extends Expr {
    readonly lhs: Expr;
    readonly rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
}

type DivCurry<n = 1> = {
    lhs: Expr;
    (arg: Expr): Expr;
    (arg: number): Expr;
};
class DivExpr extends Expr {
    readonly lhs: Expr;
    readonly rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
}

type PowCurry<n = 1> = {
    lhs: Expr;
    (arg: Expr): Expr;
    (arg: number): Expr;
};
class PowExpr extends Expr {
    readonly lhs: Expr;
    readonly rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
}

type ModCurry<n = 1> = {
    lhs: Expr;
    (arg: Expr): Expr;
    (arg: number): Expr;
};
class ModExpr extends Expr {
    readonly lhs: Expr;
    readonly rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
}

type PercentOfCurry<n = 1> = {
    lhs: Expr;
    (arg: Expr): Expr;
    (arg: number): Expr;
};
class PercentOfExpr extends Expr {
    readonly lhs: Expr;
    readonly rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
}
