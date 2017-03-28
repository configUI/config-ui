import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**Import Config Components */
import { ConfigHomeComponent } from '../components/config-home/config-home.component';
import { ConfigApplicationListComponent } from '../components/config-application-list/config-application-list.component';
import { ConfigTreeMainComponent } from '../components/config-tree-main/config-tree-main.component';
import { ConfigProfileListComponent } from '../components/config-profile-list/config-profile-list.component';
import { ConfigTopologyListComponent } from '../components/config-topology-list/config-topology-list.component';
import { ConfigNdAgentComponent } from '../components/config-nd-agent/config-nd-agent.component';

import { ConfigProfileRoutingComponent } from '../components/config-profile/config-profile-routing/config-profile-routing.component';
import { ConfigurationComponent } from '../components/config-profile/configuration/configuration.component';
import { GeneralComponent } from '../components/config-profile/general/general.component';
import { AdvanceComponent } from '../components/config-profile/advance/advance.component';
import { InstrumentationComponent } from '../components/config-profile/instrumentation/instrumentation.component';
import { ProductIntegrationComponent } from '../components/config-profile/product-integration/product-integration.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: ConfigHomeComponent },
    { path: 'application-list', component: ConfigApplicationListComponent },
    { path: 'tree-main/:dcId', component: ConfigTreeMainComponent },
    {
        path: 'profile', component: ConfigProfileRoutingComponent, children: [
            { path: '', redirectTo : 'profile-list', pathMatch: 'full'},
            { path: 'profile-list', component: ConfigProfileListComponent },
            { path: 'configuration/:profileId', component: ConfigurationComponent },
            { path: 'general/:profileId', component: GeneralComponent },
            { path: 'advance/:profileId', component: AdvanceComponent },
            { path: 'instrumentation/:profileId', component: InstrumentationComponent },
            { path: 'integration/:profileId', component: ProductIntegrationComponent }
        ]
    },
    { path: 'topology-list', component: ConfigTopologyListComponent },
    {
        path: 'nd-agent', component: ConfigNdAgentComponent,
        children: [{
            path: 'test', component: ConfigTopologyListComponent
        }]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class ConfigRoutingModule {

}