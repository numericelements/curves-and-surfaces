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

    addMessage(message: string): void {
        this.message = this.message + " " + message;
    }

}

export class ErrorLog extends ErrorProcessing {

    logMessageToConsole(): void {
        console.log(this.className + ", " + this.functionName + ":");
        console.error( new Error(this.message));
    }

    logMessage(): string {
        const message = this.className + ", " + this.functionName + ":" + this.message;
        return message;
    }
}

export class WarningLog extends ErrorProcessing {

    logMessageToConsole(): void {
        console.log(this.className + ", " + this.functionName + ": " + this.message);
    }
}