import { NgModule } from '@angular/core';
import { LightgalleryAngularComponent } from './lightgallery-angular.component';

@NgModule({
    declarations: [LightgalleryAngularComponent],
    imports: [],
    exports: [LightgalleryAngularComponent],
})
export class LightgalleryAngularModule {
    ngOnInit(): void {
        // ...
        console.log('calling angyualr init');
    }
}
