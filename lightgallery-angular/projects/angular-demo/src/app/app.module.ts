import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { LightgalleryModule } from 'lightgallery-angular';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, LightgalleryModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
