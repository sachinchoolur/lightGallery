import { TestBed } from '@angular/core/testing';

import { LightgalleryService } from './lightgallery-angular.service';

describe('LightgalleryService', () => {
    let service: LightgalleryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LightgalleryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
