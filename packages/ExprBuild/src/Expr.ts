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

type Action<mark extends string> = {mark: mark}
type AsActionListLiteral<A extends Action<string>[]> = (
	A extends [] 
		? never 
	: A extends { [MI in keyof infer M extends string[]] : Action<(infer M extends string[])[MI]> }
		? M extends AsUniqueList<M, string>
			? A
			: never
		: never
);
// type AsActionListLiteral<M extends string[]> = (
// 	M extends [] 
// 		? never 
// 	: M extends AsUniqueList<M, string>
// 		? { [MK in keyof M]: Action<M[MK]> }
// 		: never
// );

/**
 * Validate if the list type is unique.
 * LT: List Top
 * LS: List So far
 * LR: List Rest
 */
type AsUniqueList<L extends T[], T> = AsUniqueList_1<L, [], T>;
type AsUniqueList_1<L extends T[], LS extends T[], T> = (
	L extends []	
		? []
	: L extends [infer LT extends T, ...infer LR extends T[]]
		? LT extends LS[number]
			? never
		: LR extends AsUniqueList_1<LR, [...LS, LT], T>
			? L
			: never
		: never
);

type Type1 = AsActionListLiteral<[Action<"0">, Action<"0">, Action<"0">]>;
type Type2 = AsActionListLiteral<[Action<"0">, Action<"1">, Action<"2">]>;

// declare function func<T extends { [MK in keyof M]: Action<M[MK]> }, M extends string[]>(l: AsActionListLiteral<T, M>): void;
declare function func<T extends Action<string>[]>(l: AsActionListLiteral<T>): void;

type MyObj<mark extends string> = {mark: mark}
declare function getMyObj<M extends string>(mark: M): MyObj<M>;
declare function getMyObj2<M extends string>(mark: M): {mark: M};
const l1 = [
	getMyObj("0"),
	getMyObj("1"),
]	// (MyObj<"0"> | MyObj<"1">)[]
const l2 = [
	getMyObj2("0"),
	getMyObj2("1"),
]	// ({ mark: "0"; } | { mark: "1"; })[]
declare function destruction321<T extends { [MI in keyof M]: MyObj<M[MI]> }, M extends string[]>(...l: T): T;
const l3 = destruction321(
	getMyObj("0"),
	getMyObj("1"),
); // [MyObj<"0">, MyObj<"1">]
const l4 = destruction321(
	getMyObj2("0"),
	getMyObj2("1"),
); //[{ mark: "0"; }, { mark: "1"; }]
const l5 = [
	getMyObj("0"),
	getMyObj("1"),
] as const; // readonly [MyObj<"0">, MyObj<"1">]

func([
	getMyObj("0"),
	getMyObj("1"),
]);

func([
	{mark: "0"},
	{mark: "1"},
	{mark: "0"},
]);