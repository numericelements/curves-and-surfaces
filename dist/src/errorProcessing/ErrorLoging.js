"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarningLog = exports.ErrorLog = exports.ErrorProcessing = void 0;
class ErrorProcessing {
    constructor(className, functionName, message = "") {
        this.className = className;
        this.functionName = functionName;
        this._message = message;
    }
    get message() {
        return this._message;
    }
    addMessage(message) {
        if (this._message === "") {
            this._message = " " + message;
        }
        else {
            this._message = this._message + " " + message;
        }
    }
}
exports.ErrorProcessing = ErrorProcessing;
class ErrorLog extends ErrorProcessing {
    logMessage() {
        console.error(new Error(this.className + ", " + this.functionName + ":" + this._message));
    }
    generateMessageString() {
        const message = this.className + ", " + this.functionName + ":" + this._message;
        return message;
    }
}
exports.ErrorLog = ErrorLog;
class WarningLog extends ErrorProcessing {
    logMessage() {
        console.log(this.className + ", " + this.functionName + ": " + this._message);
    }
}
exports.WarningLog = WarningLog;
