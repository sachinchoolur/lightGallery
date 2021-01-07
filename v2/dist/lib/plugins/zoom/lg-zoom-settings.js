"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoomDefaults = void 0;
var getUseLeft = function () {
    var isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return !!(isChrome && parseInt(isChrome[2], 10) < 54);
};
exports.zoomDefaults = {
    scale: 1,
    zoom: true,
    actualSize: true,
    enableZoomAfter: 300,
    useLeftForZoom: getUseLeft(),
};
//# sourceMappingURL=lg-zoom-settings.js.map