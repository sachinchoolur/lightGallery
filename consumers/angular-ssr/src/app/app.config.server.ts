import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, RenderMode, withRoutes } from '@angular/ssr';

import { appConfig } from './app.config';

// Rendered on every request, so the check exercises server rendering.
const serverConfig: ApplicationConfig = {
    providers: [provideServerRendering(withRoutes([{ path: '**', renderMode: RenderMode.Server }]))],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
