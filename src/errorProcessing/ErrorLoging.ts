export abstract class ErrorProcessing {

    protected className: string;
    protected functionName: string;
    protected message?: string;

    constructor(className: string, functionName: string, message?: string) {
        this.className = className;
        this.functionName = functionName;
        if(message !== undefined) {
            this.message = message;
        }
    }

    abstract logMessageToConsole(): void;

}

export class ErrorLog extends ErrorProcessing {

    logMessageToConsole(): void {
        console.log(this.className + ", " + this.functionName + ":");
        throw new Error(this.message);
    }
}

export class WarningLog extends ErrorProcessing {

    logMessageToConsole(): void {
        console.log(this.className + ", " + this.functionName + ":");
        console.log(this.message);
    }
}