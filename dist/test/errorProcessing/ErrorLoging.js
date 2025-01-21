"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var ErrorLoging_1 = require("../../src/errorProcessing/ErrorLoging");
describe('ErrorLog', function () {
    describe('ErrorLog constructor', function () {
        it('can initialize the configuration of an error message', function () {
            var className = 'Test';
            var functionName = 'FunctionTest';
            var error = new ErrorLoging_1.ErrorLog(className, functionName);
            chai_1.expect(error.generateMessageString()).to.eql(className + ", " + functionName + ":");
        });
        it('can initialize the configuration of an error message as well as the content of the message', function () {
            var className = 'Test';
            var functionName = 'FunctionTest';
            var message = 'test message';
            var error = new ErrorLoging_1.ErrorLog(className, functionName, message);
            chai_1.expect(error.generateMessageString()).to.eql(className + ", " + functionName + ":" + message);
        });
    });
    describe('Methods', function () {
        it('can concatenate message subsets', function () {
            var className = 'Test';
            var functionName = 'FunctionTest';
            var message = 'test message';
            var error = new ErrorLoging_1.ErrorLog(className, functionName, message);
            chai_1.expect(error.generateMessageString()).to.eql(className + ", " + functionName + ":" + message);
            var message1 = 'complement to message';
            error.addMessage(message1);
            chai_1.expect(error.generateMessageString()).to.eql(className + ", " + functionName + ":" + message + " " + message1);
        });
        it('can log an error message to the console', function () {
            var className = 'Test';
            var functionName = 'FunctionTest';
            var message = 'test message';
            var error = new ErrorLoging_1.ErrorLog(className, functionName, message);
            chai_1.expect(error.logMessage()).to.eql(undefined);
        });
    });
});
describe('WarningLog', function () {
    describe('WarningLog constructor', function () {
        it('can initialize the configuration of a warning message', function () {
            var className = 'Test';
            var functionName = 'FunctionTest';
            var warning = new ErrorLoging_1.WarningLog(className, functionName);
            chai_1.expect(warning.message).to.eql("");
            chai_1.expect(warning.logMessage()).to.eql(undefined);
        });
        it('can initialize the configuration of a warning message as well as the content of the message', function () {
            var className = 'Test';
            var functionName = 'FunctionTest';
            var message = 'test message';
            var warning = new ErrorLoging_1.WarningLog(className, functionName, message);
            chai_1.expect(warning.message).to.eql(message);
        });
    });
    describe('Methods', function () {
        it('can concatenate message subsets', function () {
            var className = 'Test';
            var functionName = 'FunctionTest';
            var message = 'test message';
            var warning = new ErrorLoging_1.WarningLog(className, functionName, message);
            var message1 = 'complement to message';
            warning.addMessage(message1);
            chai_1.expect(warning.message).to.eql(message + " " + message1);
        });
    });
});
