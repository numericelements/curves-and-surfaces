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
        // try {
        //     throw new Error(this.message);
        // } catch(e) {
        //     console.error(e);
        // }
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