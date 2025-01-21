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
exports.KnotSequenceTest = exports.StrictlyIncreasingKnotSeqIterator = exports.IncreasingKnotSeqIterator = exports.IndexStrictlyIncreasingKnotSeq = exports.IndexIncreasingKnotSeq = exports.AbstractIndexKnotSeq = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var AbstractIndexKnotSeq = /** @class */ (function () {
    function AbstractIndexKnotSeq(index) {
        if (Number.isInteger(index)) {
            this._index = index;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "AbstractIndexKnotSeq", "parameter input must be an integer");
            error.logMessage();
            this._index = 0;
        }
    }
    return AbstractIndexKnotSeq;
}());
exports.AbstractIndexKnotSeq = AbstractIndexKnotSeq;
var IndexIncreasingKnotSeq = /** @class */ (function (_super) {
    __extends(IndexIncreasingKnotSeq, _super);
    function IndexIncreasingKnotSeq(index) {
        var _this = _super.call(this, index) || this;
        _this._index = index;
        return _this;
    }
    Object.defineProperty(IndexIncreasingKnotSeq.prototype, "position", {
        get: function () {
            return this._index;
        },
        set: function (index) {
            this._index = index;
        },
        enumerable: false,
        configurable: true
    });
    IndexIncreasingKnotSeq.prototype.getIndex = function () {
        var index = new IndexIncreasingKnotSeq(this._index);
        return index;
    };
    return IndexIncreasingKnotSeq;
}(AbstractIndexKnotSeq));
exports.IndexIncreasingKnotSeq = IndexIncreasingKnotSeq;
var IndexStrictlyIncreasingKnotSeq = /** @class */ (function (_super) {
    __extends(IndexStrictlyIncreasingKnotSeq, _super);
    function IndexStrictlyIncreasingKnotSeq(index) {
        var _this = _super.call(this, index) || this;
        _this._index = index;
        return _this;
    }
    Object.defineProperty(IndexStrictlyIncreasingKnotSeq.prototype, "position", {
        get: function () {
            return this._index;
        },
        set: function (index) {
            this._index = index;
        },
        enumerable: false,
        configurable: true
    });
    IndexStrictlyIncreasingKnotSeq.prototype.getIndex = function () {
        var index = new IndexStrictlyIncreasingKnotSeq(this._index);
        return index;
    };
    return IndexStrictlyIncreasingKnotSeq;
}(AbstractIndexKnotSeq));
exports.IndexStrictlyIncreasingKnotSeq = IndexStrictlyIncreasingKnotSeq;
var IncreasingKnotSeqIterator = /** @class */ (function () {
    function IncreasingKnotSeqIterator(knotSequence) {
        this.position = new IndexIncreasingKnotSeq(0);
        this.knotsequence = knotSequence;
        this.position = new IndexIncreasingKnotSeq(knotSequence.getLength(this) - 1);
    }
    IncreasingKnotSeqIterator.prototype.rewind = function () {
        this.position = new IndexIncreasingKnotSeq(0);
    };
    IncreasingKnotSeqIterator.prototype.current = function () {
        return this.knotsequence.getKnots(this)[this.position.position];
    };
    IncreasingKnotSeqIterator.prototype.key = function () {
        return this.position;
    };
    IncreasingKnotSeqIterator.prototype.next = function () {
        var item = this.knotsequence.getKnots(this)[this.position.position];
        this.position = new IndexIncreasingKnotSeq(this.position.position + 1);
        return item;
    };
    IncreasingKnotSeqIterator.prototype.valid = function () {
        return this.position.position < this.knotsequence.getLength(this);
    };
    return IncreasingKnotSeqIterator;
}());
exports.IncreasingKnotSeqIterator = IncreasingKnotSeqIterator;
var StrictlyIncreasingKnotSeqIterator = /** @class */ (function () {
    function StrictlyIncreasingKnotSeqIterator(knotSequence) {
        this.position = new IndexStrictlyIncreasingKnotSeq(0);
        this.knotsequence = knotSequence;
        this.position = new IndexStrictlyIncreasingKnotSeq(knotSequence.getLength(this) - 1);
    }
    StrictlyIncreasingKnotSeqIterator.prototype.rewind = function () {
        this.position = new IndexStrictlyIncreasingKnotSeq(0);
    };
    StrictlyIncreasingKnotSeqIterator.prototype.current = function () {
        return this.knotsequence.getKnots(this)[this.position.position];
    };
    StrictlyIncreasingKnotSeqIterator.prototype.key = function () {
        return this.position;
    };
    StrictlyIncreasingKnotSeqIterator.prototype.next = function () {
        var item = this.knotsequence.getKnots(this)[this.position.position];
        this.position = new IndexStrictlyIncreasingKnotSeq(this.position.position + 1);
        return item;
    };
    StrictlyIncreasingKnotSeqIterator.prototype.valid = function () {
        return this.position.position < this.knotsequence.getLength(this);
    };
    return StrictlyIncreasingKnotSeqIterator;
}());
exports.StrictlyIncreasingKnotSeqIterator = StrictlyIncreasingKnotSeqIterator;
var KnotSequenceTest = /** @class */ (function () {
    function KnotSequenceTest(items) {
        this.items = [];
        this.items = items;
        this.positionIncSeq = new IndexIncreasingKnotSeq(0);
        this.positionStrictIncSeq = new IndexStrictlyIncreasingKnotSeq(0);
    }
    KnotSequenceTest.prototype.getKnots = function (iterator) {
        return this.items;
    };
    KnotSequenceTest.prototype.getLength = function (iterator) {
        return this.items.length;
    };
    KnotSequenceTest.prototype.addItem = function (item) {
        this.items.push(item);
    };
    KnotSequenceTest.prototype.getIterator = function () {
        return new IncreasingKnotSeqIterator(this);
    };
    KnotSequenceTest.prototype.getStrictlyIncIterator = function () {
        return new StrictlyIncreasingKnotSeqIterator(this);
    };
    KnotSequenceTest.prototype.knotMutiplicity = function (abscissa) {
        var multiplicity = 1;
        return multiplicity;
    };
    KnotSequenceTest.prototype.knotMultiplicityAtIndex = function (index) {
        var multiplicity = 1;
        return multiplicity;
    };
    KnotSequenceTest.prototype.insertKnot = function (abscissa, multiplicity) {
        var insert = true;
        return insert;
    };
    KnotSequenceTest.prototype.insertKnotAtIndex = function (index, multiplicity) {
        var insert = true;
        return insert;
    };
    KnotSequenceTest.prototype.incrementKnotMultiplicity = function (index, multiplicity) {
    };
    KnotSequenceTest.prototype.findSpan = function (abscissa, iterator) {
        return this.positionIncSeq;
    };
    KnotSequenceTest.prototype.checkConsistencyNonUniformBSpline = function (degree) {
    };
    KnotSequenceTest.prototype.checkConsistencyPeriodicBSpline = function (degree) {
    };
    return KnotSequenceTest;
}());
exports.KnotSequenceTest = KnotSequenceTest;
