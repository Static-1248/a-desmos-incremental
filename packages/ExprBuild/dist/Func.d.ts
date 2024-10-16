import { Expr } from "./Expr";
import { Mobj } from "./Mobj";
export declare class Func extends Mobj {
    type: string;
    name: string;
    args: Symbol[];
    body: Expr;
    constructor(name: string, args: Symbol[], body: Expr);
}
