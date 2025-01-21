"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarningLog = exports.ErrorLog = exports.ErrorProcessing = void 0;
var ErrorProcessing = /** @class */ (function () {
    function ErrorProcessing(className, functionName, message) {
        if (message === void 0) { message = ""; }
        this.className = className;
        this.functionName = functionName;
        this._message = message;
    }
    Object.defineProperty(ErrorProcessing.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: false,
        configurable: true
    });
    ErrorProcessing.prototype.addMessage = function (message) {
        if (this._message === "") {
            this._message = " " + message;
        }
        else {
            this._message = this._message + " " + message;
        }
    };
    return ErrorProcessing;
}());
exports.ErrorProcessing = ErrorProcessing;
var ErrorLog = /** @class */ (function (_super) {
    __extends(ErrorLog, _super);
    function ErrorLog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ErrorLog.prototype.logMessage = function () {
        console.error(new Error(this.className + ", " + this.functionName + ":" + this._message));
    };
    ErrorLog.prototype.generateMessageString = function () {
        var message = this.className + ", " + this.functionName + ":" + this._message;
        return message;
    };
    return ErrorLog;
}(ErrorProcessing));
exports.ErrorLog = ErrorLog;
var WarningLog = /** @class */ (function (_super) {
    __extends(WarningLog, _super);
    function WarningLog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WarningLog.prototype.logMessage = function () {
        console.log(this.className + ", " + this.functionName + ": " + this._message);
    };
    return WarningLog;
}(ErrorProcessing));
exports.WarningLog = WarningLog;
