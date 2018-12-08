"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var DialogRefMock = (function () {
    function DialogRefMock() {
    }
    DialogRefMock.prototype.close = function (msg) {
        return true;
    };
    DialogRefMock.prototype.hide = function (msg) {
        return true;
    };
    DialogRefMock.prototype.updateSize = function (width, height) {
        return true;
    };
    DialogRefMock = tslib_1.__decorate([
        core_1.Injectable()
    ], DialogRefMock);
    return DialogRefMock;
}());
exports.DialogRefMock = DialogRefMock;
//# sourceMappingURL=dialog-ref.mock.js.map