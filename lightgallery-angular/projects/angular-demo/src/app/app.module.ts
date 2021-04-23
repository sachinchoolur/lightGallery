import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { LightgalleryAngularModule } from 'lightgallery-angular';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, LightgalleryAngularModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
