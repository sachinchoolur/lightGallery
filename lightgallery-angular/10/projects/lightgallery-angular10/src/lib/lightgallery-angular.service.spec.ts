import { TestBed } from '@angular/core/testing';

import { LightgalleryAngualr9Service } from './lightgallery-angular.service';

describe('LightgalleryAngualrService', () => {
    let service: LightgalleryAngualr9Service;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LightgalleryAngualr9Service);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
