"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eqn = void 0;
const Mobj_1 = require("./Mobj");
// expr = 0.
class Eqn extends Mobj_1.Mobj {
    constructor(expr) {
        super();
        this.type = "Eqn";
        this.expr = expr;
    }
}
exports.Eqn = Eqn;
