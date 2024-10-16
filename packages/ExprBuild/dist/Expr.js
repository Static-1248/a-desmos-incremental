"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expr = void 0;
const Mobj_1 = require("./Mobj");
class Expr extends Mobj_1.Mobj {
    constructor() {
        super(...arguments);
        this.type = 'Expr';
        // ...
    }
}
exports.Expr = Expr;
