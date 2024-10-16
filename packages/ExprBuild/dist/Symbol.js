"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symbol = void 0;
const Expr_1 = require("./Expr");
class Symbol extends Expr_1.Expr {
    constructor(name) {
        super();
        this.name = name;
    }
}
exports.Symbol = Symbol;
