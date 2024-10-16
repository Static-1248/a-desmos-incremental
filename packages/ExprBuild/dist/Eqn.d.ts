import { Expr } from "./Expr";
import { Mobj } from "./Mobj";
export declare class Eqn extends Mobj {
    type: string;
    expr: Expr;
    constructor(expr: Expr);
}
