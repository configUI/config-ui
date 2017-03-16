import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**Import Config Components */
import { ConfigHomeComponent } from '../components/config-home/config-home.component';
import { ConfigApplicationListComponent } from '../components/config-application-list/config-application-list.component';
import { ConfigProfileListComponent } from '../components/config-profile-list/config-profile-list.component';
import { ConfigTopologyListComponent } from '../components/config-topology-list/config-topology-list.component';
import { ConfigNdAgentComponent } from '../components/config-nd-agent/config-nd-agent.component';


const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: ConfigHomeComponent },
    { path: 'application-list', component: ConfigApplicationListComponent },
    { path: 'profile-list', component: ConfigProfileListComponent },
    { path: 'topology-list', component: ConfigTopologyListComponent },
    { path: 'nd-agent', component: ConfigNdAgentComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class ConfigRoutingModule {

}