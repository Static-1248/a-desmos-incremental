"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ineq = void 0;
const Mobj_1 = require("./Mobj");
/*
expr < 0 or expr > 0;
remarks:
- 使3个flag独立而可全组合？
- 与Eqn统一？

Desmos中的限制:
    - 不等式作为最终类型时，只允许有限的flag组合: < > <= >= (=)
    - 作为谓词时，除<=>外皆允许

    - 可以变换为等效合法表达式; 所以如果允许在这方面上启用变换，也即撤销Expr结构与输出结构相同的保证，那么flags的范围便能拓展到全组合。

*/
class Ineq extends Mobj_1.Mobj {
    constructor(expr) {
        super();
        this.type = "Eqn";
        this.expr = expr;
    }
}
exports.Ineq = Ineq;
