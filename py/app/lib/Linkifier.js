"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("./Types");
var MouseZoneManager_1 = require("./input/MouseZoneManager");
var EventEmitter_1 = require("./EventEmitter");
var Linkifier = (function (_super) {
    __extends(Linkifier, _super);
    function Linkifier(_terminal) {
        var _this = _super.call(this) || this;
        _this._terminal = _terminal;
        _this._linkMatchers = [];
        _this._nextLinkMatcherId = 0;
        _this._rowsToLinkify = {
            start: null,
            end: null
        };
        return _this;
    }
    Linkifier.prototype.attachToDom = function (mouseZoneManager) {
        this._mouseZoneManager = mouseZoneManager;
    };
    Linkifier.prototype.linkifyRows = function (start, end) {
        var _this = this;
        if (!this._mouseZoneManager) {
            return;
        }
        if (this._rowsToLinkify.start === null) {
            this._rowsToLinkify.start = start;
            this._rowsToLinkify.end = end;
        }
        else {
            this._rowsToLinkify.start = Math.min(this._rowsToLinkify.start, start);
            this._rowsToLinkify.end = Math.max(this._rowsToLinkify.end, end);
        }
        this._mouseZoneManager.clearAll(start, end);
        if (this._rowsTimeoutId) {
            clearTimeout(this._rowsTimeoutId);
        }
        this._rowsTimeoutId = setTimeout(function () { return _this._linkifyRows(); }, Linkifier.TIME_BEFORE_LINKIFY);
    };
    Linkifier.prototype._linkifyRows = function () {
        this._rowsTimeoutId = null;
        for (var i = this._rowsToLinkify.start; i <= this._rowsToLinkify.end; i++) {
            this._linkifyRow(i);
        }
        this._rowsToLinkify.start = null;
        this._rowsToLinkify.end = null;
    };
    Linkifier.prototype.registerLinkMatcher = function (regex, handler, options) {
        if (options === void 0) { options = {}; }
        if (!handler) {
            throw new Error('handler must be defined');
        }
        var matcher = {
            id: this._nextLinkMatcherId++,
            regex: regex,
            handler: handler,
            matchIndex: options.matchIndex,
            validationCallback: options.validationCallback,
            hoverTooltipCallback: options.tooltipCallback,
            hoverLeaveCallback: options.leaveCallback,
            willLinkActivate: options.willLinkActivate,
            priority: options.priority || 0
        };
        this._addLinkMatcherToList(matcher);
        return matcher.id;
    };
    Linkifier.prototype._addLinkMatcherToList = function (matcher) {
        if (this._linkMatchers.length === 0) {
            this._linkMatchers.push(matcher);
            return;
        }
        for (var i = this._linkMatchers.length - 1; i >= 0; i--) {
            if (matcher.priority <= this._linkMatchers[i].priority) {
                this._linkMatchers.splice(i + 1, 0, matcher);
                return;
            }
        }
        this._linkMatchers.splice(0, 0, matcher);
    };
    Linkifier.prototype.deregisterLinkMatcher = function (matcherId) {
        for (var i = 0; i < this._linkMatchers.length; i++) {
            if (this._linkMatchers[i].id === matcherId) {
                this._linkMatchers.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    Linkifier.prototype._linkifyRow = function (rowIndex) {
        var absoluteRowIndex = this._terminal.buffer.ydisp + rowIndex;
        if (absoluteRowIndex >= this._terminal.buffer.lines.length) {
            return;
        }
        var text = this._terminal.buffer.translateBufferLineToString(absoluteRowIndex, false);
        for (var i = 0; i < this._linkMatchers.length; i++) {
            this._doLinkifyRow(rowIndex, text, this._linkMatchers[i]);
        }
    };
    Linkifier.prototype._doLinkifyRow = function (rowIndex, text, matcher, offset) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        var match = text.match(matcher.regex);
        if (!match || match.length === 0) {
            return;
        }
        var uri = match[typeof matcher.matchIndex !== 'number' ? 0 : matcher.matchIndex];
        var index = text.indexOf(uri);
        if (matcher.validationCallback) {
            matcher.validationCallback(uri, function (isValid) {
                if (_this._rowsTimeoutId) {
                    return;
                }
                if (isValid) {
                    _this._addLink(offset + index, rowIndex, uri, matcher);
                }
            });
        }
        else {
            this._addLink(offset + index, rowIndex, uri, matcher);
        }
        var remainingStartIndex = index + uri.length;
        var remainingText = text.substr(remainingStartIndex);
        if (remainingText.length > 0) {
            this._doLinkifyRow(rowIndex, remainingText, matcher, offset + remainingStartIndex);
        }
    };
    Linkifier.prototype._addLink = function (x, y, uri, matcher) {
        var _this = this;
        this._mouseZoneManager.add(new MouseZoneManager_1.MouseZone(x + 1, x + 1 + uri.length, y + 1, function (e) {
            if (matcher.handler) {
                return matcher.handler(e, uri);
            }
            window.open(uri, '_blank');
        }, function (e) {
            _this.emit(Types_1.LinkHoverEventTypes.HOVER, { x: x, y: y, length: uri.length });
            _this._terminal.element.style.cursor = 'pointer';
        }, function (e) {
            _this.emit(Types_1.LinkHoverEventTypes.TOOLTIP, { x: x, y: y, length: uri.length });
            if (matcher.hoverTooltipCallback) {
                matcher.hoverTooltipCallback(e, uri);
            }
        }, function () {
            _this.emit(Types_1.LinkHoverEventTypes.LEAVE, { x: x, y: y, length: uri.length });
            _this._terminal.element.style.cursor = '';
            if (matcher.hoverLeaveCallback) {
                matcher.hoverLeaveCallback();
            }
        }, function (e) {
            if (matcher.willLinkActivate) {
                return matcher.willLinkActivate(e, uri);
            }
            return true;
        }));
    };
    Linkifier.TIME_BEFORE_LINKIFY = 200;
    return Linkifier;
}(EventEmitter_1.EventEmitter));
exports.Linkifier = Linkifier;

//# sourceMappingURL=Linkifier.js.map
