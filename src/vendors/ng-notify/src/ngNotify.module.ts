import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './ngNotify.component';
import { NotificationService } from './services/notification.service';
import { ComponentInjectService } from './services/componentInject.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NotificationComponent
    ],
    providers: [ComponentInjectService, NotificationService],
    entryComponents: [NotificationComponent],
    exports: [
        NotificationComponent
    ]
})

export class NgNotifyModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgNotifyModule,
            providers: [NotificationService, ComponentInjectService]
        };
    }
}
