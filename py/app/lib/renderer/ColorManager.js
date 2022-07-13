"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_FOREGROUND = '#ffffff';
var DEFAULT_BACKGROUND = '#000000';
var DEFAULT_CURSOR = '#ffffff';
var DEFAULT_CURSOR_ACCENT = '#000000';
var DEFAULT_SELECTION = 'rgba(255, 255, 255, 0.3)';
exports.DEFAULT_ANSI_COLORS = [
    '#2e3436',
    '#cc0000',
    '#4e9a06',
    '#c4a000',
    '#3465a4',
    '#75507b',
    '#06989a',
    '#d3d7cf',
    '#555753',
    '#ef2929',
    '#8ae234',
    '#fce94f',
    '#729fcf',
    '#ad7fa8',
    '#34e2e2',
    '#eeeeec'
];
function generate256Colors(first16Colors) {
    var colors = first16Colors.slice();
    var v = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff];
    for (var i = 0; i < 216; i++) {
        var r = toPaddedHex(v[(i / 36) % 6 | 0]);
        var g = toPaddedHex(v[(i / 6) % 6 | 0]);
        var b = toPaddedHex(v[i % 6]);
        colors.push("#" + r + g + b);
    }
    for (var i = 0; i < 24; i++) {
        var c = toPaddedHex(8 + i * 10);
        colors.push("#" + c + c + c);
    }
    return colors;
}
function toPaddedHex(c) {
    var s = c.toString(16);
    return s.length < 2 ? '0' + s : s;
}
var ColorManager = (function () {
    function ColorManager(document) {
        this._document = document;
        this.colors = {
            foreground: DEFAULT_FOREGROUND,
            background: DEFAULT_BACKGROUND,
            cursor: DEFAULT_CURSOR,
            cursorAccent: DEFAULT_CURSOR_ACCENT,
            selection: DEFAULT_SELECTION,
            ansi: generate256Colors(exports.DEFAULT_ANSI_COLORS)
        };
    }
    ColorManager.prototype.setTheme = function (theme) {
        this.colors.foreground = this._validateColor(theme.foreground, DEFAULT_FOREGROUND);
        this.colors.background = this._validateColor(theme.background, DEFAULT_BACKGROUND);
        this.colors.cursor = this._validateColor(theme.cursor, DEFAULT_CURSOR);
        this.colors.cursorAccent = this._validateColor(theme.cursorAccent, DEFAULT_CURSOR_ACCENT);
        this.colors.selection = this._validateColor(theme.selection, DEFAULT_SELECTION);
        this.colors.ansi[0] = this._validateColor(theme.black, exports.DEFAULT_ANSI_COLORS[0]);
        this.colors.ansi[1] = this._validateColor(theme.red, exports.DEFAULT_ANSI_COLORS[1]);
        this.colors.ansi[2] = this._validateColor(theme.green, exports.DEFAULT_ANSI_COLORS[2]);
        this.colors.ansi[3] = this._validateColor(theme.yellow, exports.DEFAULT_ANSI_COLORS[3]);
        this.colors.ansi[4] = this._validateColor(theme.blue, exports.DEFAULT_ANSI_COLORS[4]);
        this.colors.ansi[5] = this._validateColor(theme.magenta, exports.DEFAULT_ANSI_COLORS[5]);
        this.colors.ansi[6] = this._validateColor(theme.cyan, exports.DEFAULT_ANSI_COLORS[6]);
        this.colors.ansi[7] = this._validateColor(theme.white, exports.DEFAULT_ANSI_COLORS[7]);
        this.colors.ansi[8] = this._validateColor(theme.brightBlack, exports.DEFAULT_ANSI_COLORS[8]);
        this.colors.ansi[9] = this._validateColor(theme.brightRed, exports.DEFAULT_ANSI_COLORS[9]);
        this.colors.ansi[10] = this._validateColor(theme.brightGreen, exports.DEFAULT_ANSI_COLORS[10]);
        this.colors.ansi[11] = this._validateColor(theme.brightYellow, exports.DEFAULT_ANSI_COLORS[11]);
        this.colors.ansi[12] = this._validateColor(theme.brightBlue, exports.DEFAULT_ANSI_COLORS[12]);
        this.colors.ansi[13] = this._validateColor(theme.brightMagenta, exports.DEFAULT_ANSI_COLORS[13]);
        this.colors.ansi[14] = this._validateColor(theme.brightCyan, exports.DEFAULT_ANSI_COLORS[14]);
        this.colors.ansi[15] = this._validateColor(theme.brightWhite, exports.DEFAULT_ANSI_COLORS[15]);
    };
    ColorManager.prototype._validateColor = function (color, fallback) {
        if (!color) {
            return fallback;
        }
        var isColorValid = this._isColorValid(color);
        if (!isColorValid) {
            console.warn("Color: " + color + " is invalid using fallback " + fallback);
        }
        return isColorValid ? color : fallback;
    };
    ColorManager.prototype._isColorValid = function (color) {
        var litmus = 'red';
        var d = this._document.createElement('div');
        d.style.color = litmus;
        d.style.color = color;
        if (color !== litmus && (d.style.color === litmus || d.style.color === '')) {
            return false;
        }
        return true;
    };
    return ColorManager;
}());
exports.ColorManager = ColorManager;

//# sourceMappingURL=ColorManager.js.map
