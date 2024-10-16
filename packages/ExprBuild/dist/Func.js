"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Func = void 0;
const Mobj_1 = require("./Mobj");
class Func extends Mobj_1.Mobj {
    constructor(name, args, body) {
        super();
        this.type = "Func";
        this.name = name;
        this.args = args;
        this.body = body;
    }
}
exports.Func = Func;
