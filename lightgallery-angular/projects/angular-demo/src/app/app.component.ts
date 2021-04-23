import { Component } from '@angular/core';
import lgZoom from 'lightgallery/plugins/zoom';
import { InitDetail } from 'lightgallery/lg-events';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'angular-demo';
    settings = {
        counter: false,
        plugins: [lgZoom],
    };
    onInit = (detail: InitDetail): void => {
        detail.instance.openGallery();
    };
}
