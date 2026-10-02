import '@testing-library/jest-dom';
import lightGallery from '../src';
import Zoom from '../src/plugins/zoom/lg-zoom';

describe('Zoom plugin', () => {
    function createZoomGallery(settings: Record<string, unknown> = {}) {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            {
                plugins: [Zoom],
                download: false,
                showZoomInOutIcons: true,
                ...settings,
            },
        );
        LG.openGallery(0);
        const zoomPlugin = LG.plugins.find(
            (plugin) => plugin instanceof Zoom,
        ) as Zoom;

        return { LG, zoomPlugin };
    }

    it('Should zoom in via mouse wheel', () => {
        const { zoomPlugin } = createZoomGallery();
        const zoomInSpy = jest.spyOn(zoomPlugin, 'zoomIn');

        document.querySelector('.lg-outer')?.dispatchEvent(
            new WheelEvent('wheel', {
                deltaY: -120,
                bubbles: true,
                cancelable: true,
            }),
        );

        expect(zoomInSpy).toHaveBeenCalledWith(1.2);
    });

    it('Should zoom out via mouse wheel', () => {
        const { zoomPlugin } = createZoomGallery();
        const zoomOutSpy = jest.spyOn(zoomPlugin, 'zoomOut');

        document.querySelector('.lg-outer')?.dispatchEvent(
            new WheelEvent('wheel', {
                deltaY: 100,
                bubbles: true,
                cancelable: true,
            }),
        );

        expect(zoomOutSpy).toHaveBeenCalledWith(1);
    });

    it('Should apply proportional zoom when infiniteZoom is enabled', () => {
        const { zoomPlugin } = createZoomGallery({ infiniteZoom: true });
        const beginZoomSpy = jest.spyOn(zoomPlugin, 'beginZoom');
        jest.spyOn(zoomPlugin, 'zoomImage').mockImplementation(() => undefined);

        zoomPlugin.scale = 1;
        zoomPlugin.zoomIn(2.5);

        expect(beginZoomSpy).toHaveBeenCalledWith(3.5);
    });

    it('Should clamp zoom when infiniteZoom is disabled', () => {
        const { zoomPlugin } = createZoomGallery({ infiniteZoom: false });
        const beginZoomSpy = jest.spyOn(zoomPlugin, 'beginZoom');
        jest.spyOn(zoomPlugin, 'zoomImage').mockImplementation(() => undefined);
        jest.spyOn(zoomPlugin, 'getScale').mockReturnValue(2);

        zoomPlugin.scale = 1;
        zoomPlugin.zoomIn(5);

        expect(beginZoomSpy).toHaveBeenCalledWith(2);
    });

    it('Should call zoomOut from the zoom out button', () => {
        const { LG, zoomPlugin } = createZoomGallery();
        const zoomOutSpy = jest.spyOn(zoomPlugin, 'zoomOut');

        document.getElementById(LG.getIdName('lg-zoom-out'))?.click();

        expect(zoomOutSpy).toHaveBeenCalled();
    });
});
