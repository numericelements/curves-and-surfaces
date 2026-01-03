"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ErrorLoging_1 = require("../../src/errorProcessing/ErrorLoging");
describe('ErrorLog', () => {
    describe('ErrorLog constructor', () => {
        it('can initialize the configuration of an error message', () => {
            const className = 'Test';
            const functionName = 'FunctionTest';
            const error = new ErrorLoging_1.ErrorLog(className, functionName);
            (0, chai_1.expect)(error.generateMessageString()).to.eql(className + ", " + functionName + ":");
        });
        it('can initialize the configuration of an error message as well as the content of the message', () => {
            const className = 'Test';
            const functionName = 'FunctionTest';
            const message = 'test message';
            const error = new ErrorLoging_1.ErrorLog(className, functionName, message);
            (0, chai_1.expect)(error.generateMessageString()).to.eql(className + ", " + functionName + ":" + message);
        });
    });
    describe('Methods', () => {
        it('can concatenate message subsets', () => {
            const className = 'Test';
            const functionName = 'FunctionTest';
            const message = 'test message';
            const error = new ErrorLoging_1.ErrorLog(className, functionName, message);
            (0, chai_1.expect)(error.generateMessageString()).to.eql(className + ", " + functionName + ":" + message);
            const message1 = 'complement to message';
            error.addMessage(message1);
            (0, chai_1.expect)(error.generateMessageString()).to.eql(className + ", " + functionName + ":" + message + " " + message1);
        });
        it('can log an error message to the console', () => {
            const className = 'Test';
            const functionName = 'FunctionTest';
            const message = 'test message';
            const error = new ErrorLoging_1.ErrorLog(className, functionName, message);
            (0, chai_1.expect)(error.logMessage()).to.eql(undefined);
        });
    });
});
describe('WarningLog', () => {
    describe('WarningLog constructor', () => {
        it('can initialize the configuration of a warning message', () => {
            const className = 'Test';
            const functionName = 'FunctionTest';
            const warning = new ErrorLoging_1.WarningLog(className, functionName);
            (0, chai_1.expect)(warning.message).to.eql("");
            (0, chai_1.expect)(warning.logMessage()).to.eql(undefined);
        });
        it('can initialize the configuration of a warning message as well as the content of the message', () => {
            const className = 'Test';
            const functionName = 'FunctionTest';
            const message = 'test message';
            const warning = new ErrorLoging_1.WarningLog(className, functionName, message);
            (0, chai_1.expect)(warning.message).to.eql(message);
        });
    });
    describe('Methods', () => {
        it('can concatenate message subsets', () => {
            const className = 'Test';
            const functionName = 'FunctionTest';
            const message = 'test message';
            const warning = new ErrorLoging_1.WarningLog(className, functionName, message);
            const message1 = 'complement to message';
            warning.addMessage(message1);
            (0, chai_1.expect)(warning.message).to.eql(message + " " + message1);
        });
    });
});
