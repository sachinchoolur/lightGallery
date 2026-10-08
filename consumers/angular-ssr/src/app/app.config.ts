import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
    providers: [provideBrowserGlobalErrorListeners(), provideRouter([]), provideClientHydration()],
};
