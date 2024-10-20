export abstract class ErrorProcessing {

    protected className: string;
    protected functionName: string;
    protected _message: string;

    constructor(className: string, functionName: string, message: string = "") {
        this.className = className;
        this.functionName = functionName;
        this._message = message;
    }

    get message(): string {
        return this._message;
    }

    abstract logMessage(): void;

    addMessage(message: string): void {
        if(this._message === "") {
            this._message = " " + message;
        } else {
            this._message = this._message + " " + message;
        }
    }
}

export class ErrorLog extends ErrorProcessing {

    logMessage(): void {
        console.error(new Error(this.className + ", " + this.functionName + ":" + this._message));
    }

    generateMessageString(): string {
        const message = this.className + ", " + this.functionName + ":" + this._message;
        return message;
    }

}

export class WarningLog extends ErrorProcessing {

    logMessage(): void {
        console.log(this.className + ", " + this.functionName + ": " + this._message);
    }
}