import { Routes } from '@angular/router';

import { ConfigUiMainComponent } from '../components/config-ui-main/config-ui-main.component';
import { ConfigUiRightMainComponent } from '../components/config-ui-right-main/config-ui-right-main.component';

import { ConfigUiApplicationComponent } from '../components/config-ui-application/config-ui-application.component';
import { ConfigUiTopologyDetailComponent } from '../components/config-ui-topology-detail/config-ui-topology-detail.component';

import { ConfigUiProfileComponent } from '../components/config-ui-profile/config-ui-profile.component';
import { ConfigUiTopologyComponent } from '../components/config-ui-topology/config-ui-topology.component';

export const APP_ROUTES_CONFIG_UI: Routes = [
    {
        path: '',
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: ConfigUiRightMainComponent }, 
            { path: 'topology-detail', component: ConfigUiTopologyDetailComponent },
            { path: 'profile', component: ConfigUiProfileComponent },
            { path: 'topology', component: ConfigUiTopologyComponent },
            // { path: 'topology', component: ConfigUiApplicationComponent },
        ]
    }
];