import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightgalleryAngularComponent } from './lightgallery-angular.component';

describe('LightgalleryAngularComponent', () => {
    let component: LightgalleryAngularComponent;
    let fixture: ComponentFixture<LightgalleryAngularComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LightgalleryAngularComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LightgalleryAngularComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
