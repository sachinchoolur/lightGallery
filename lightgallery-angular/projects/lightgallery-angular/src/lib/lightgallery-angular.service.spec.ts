import { TestBed } from '@angular/core/testing';

import { LightgalleryAngularService } from './lightgallery-angular.service';

describe('LightgalleryAngularService', () => {
    let service: LightgalleryAngularService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LightgalleryAngularService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
