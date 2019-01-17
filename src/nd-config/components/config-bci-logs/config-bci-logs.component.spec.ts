import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigBCILogsComponent } from './config-bci-logs.component';

describe('ConfigBCILogsComponent', () => {
    let component: ConfigBCILogsComponent;
    let fixture: ComponentFixture<ConfigBCILogsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigBCILogsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigBCILogsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
