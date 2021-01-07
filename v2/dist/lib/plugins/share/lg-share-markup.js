"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(selector) {
    selector.find('.lg-toolbar').append("<button type=\"button aria-label=\"Share\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"lg-share lg-icon\">\n            <ul class=\"lg-dropdown\" style=\"position: absolute;\"></ul></button>");
    selector.find('.lg').append('<div class="lg-dropdown-overlay"></div>');
    var $shareButton = selector.find('.lg-share');
    $shareButton.first().on('click.lg', function () {
        selector.toggleClass('lg-dropdown-active');
        if (selector.hasClass('lg-dropdown-active')) {
            selector.attr('aria-expanded', true);
        }
        else {
            selector.attr('aria-expanded', false);
        }
    });
    selector
        .find('.lg-dropdown-overlay')
        .first()
        .on('click.lg', function () {
        selector.removeClass('lg-dropdown-active');
        selector.attr('aria-expanded', false);
    });
}
exports.default = default_1;
//# sourceMappingURL=lg-share-markup.js.map