import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightgalleryComponent } from './lightgallery-angular.component';

describe('LightgalleryComponent', () => {
    let component: LightgalleryComponent;
    let fixture: ComponentFixture<LightgalleryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LightgalleryComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LightgalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
