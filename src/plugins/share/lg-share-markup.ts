import { lgQuery } from '../../lgQuery';

export default function (selector: lgQuery): void {
    selector.find('.lg-toolbar').append(
        `<button type="button aria-label="Share" aria-haspopup="true" aria-expanded="false" class="lg-share lg-icon">
            <ul class="lg-dropdown" style="position: absolute;"></ul></button>`,
    );

    selector.find('.lg').append('<div class="lg-dropdown-overlay"></div>');
    const $shareButton = selector.find('.lg-share');
    $shareButton.first().on('click.lg', () => {
        selector.toggleClass('lg-dropdown-active');
        if (selector.hasClass('lg-dropdown-active')) {
            selector.attr('aria-expanded', true);
        } else {
            selector.attr('aria-expanded', false);
        }
    });

    selector
        .find('.lg-dropdown-overlay')
        .first()
        .on('click.lg', () => {
            selector.removeClass('lg-dropdown-active');
            selector.attr('aria-expanded', false);
        });
}
