import { lgQuery } from '../../lgQuery';

export default function (selector: lgQuery): void {
    selector
        .find('.lg-toolbar')
        .append(
            '<div class="lg-share lg-icon"><ul class="lg-dropdown" style="position: absolute;"></ul></div>',
        );

    selector.find('.lg').append('<div class="lg-dropdown-overlay"></div>');
    selector
        .find('.lg-share')
        .first()
        .on('click.lg', () => {
            selector.toggleClass('lg-dropdown-active');
        });

    selector
        .find('.lg-dropdown-overlay')
        .first()
        .on('click.lg', () => {
            selector.removeClass('lg-dropdown-active');
        });
}
