import { Expr } from "./Expr";
import { Mobj } from "./Mobj";
export declare class Ineq extends Mobj {
    type: string;
    expr: Expr;
    constructor(expr: Expr);
}
