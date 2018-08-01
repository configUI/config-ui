import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**Import Config Components */
import { ConfigHomeComponent } from '../components/config-home/config-home.component';
import { AppComponentForConfig } from '../config.component';
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
import { ConfigImportInstrProfileComponent } from '../components/config-import-instr-profile/config-import-instr-profile.component';
import { ConfigAutoDiscoverMainComponent } from "../components/config-auto-discover/config-auto-discover-main/config-auto-discover-main.component";
import { ConfigAutoDiscoverTreeComponent } from "../components/config-auto-discover/config-auto-discover-tree/config-auto-discover-tree.component";
import { ConfigAutoDiscoverComponent } from '../components/config-auto-discover/config-auto-discover.component';
import { ConfigViewAuditLogComponent } from '../components/config-view-audit-log/config-view-audit-log.component';
import { ConfigNDCKeywordsSettingComponent } from '../components/config-ndc-keywords-setting/config-ndc-keywords-setting.component'
import { ConfigAutoInstrumentationComponent } from '../components/config-auto-discover/config-auto-instrumentation/config-auto-instrumentation.component';
import { ConfigEditAutoInstrumentationComponent } from '../components/config-auto-discover/config-edit-auto-instrumentation/config-edit-auto-instrumentation.component';
import { NDEClusterConfiguration } from '../components/nde-cluster-configuration/nde-cluster-configuration.component';
import { UserConfiguredKeywordComponent } from '../components/user-configured-keywords/user-configured-keywords.component';

// /**For ProductUI */
// const routes: Routes = [
//     {
//         path: '', component: AppComponentForConfig, children: [
//             { path: '', redirectTo: 'home', pathMatch: 'full' },
//             { path: 'home', component: ConfigHomeComponent },
//             { path: 'application-list', component: ConfigApplicationListComponent },
//             { path: 'tree-main/:dcId', component: ConfigTreeMainComponent },
//             { path: 'tree-main/topology/:topoId', component: ConfigTreeMainComponent },
//             { path: 'tree-main/topology/profile', component: ConfigProfileRoutingComponent, children: [
//                 { path: '', redirectTo: 'configuration/:profileId', pathMatch: 'full' },
//                 { path: 'configuration/:profileId', component: ConfigurationComponent },
//                 { path: 'general/:profileId/:tabId', component: GeneralComponent },
//                 { path: 'advance/:profileId/:tabId', component: AdvanceComponent },
//                 { path: 'instrumentation/:profileId/:tabId', component: InstrumentationComponent },
//                 { path: 'integration/:profileId/:tabId', component: ProductIntegrationComponent }
//             ] },
//             { path: 'tree-main/profile', component: ConfigProfileRoutingComponent, children: [
//                     { path: '', redirectTo: 'configuration/:profileId', pathMatch: 'full' },
//                     { path: 'configuration/:profileId', component: ConfigurationComponent },
//                     { path: 'general/:profileId/:tabId', component: GeneralComponent },
//                     { path: 'advance/:profileId/:tabId', component: AdvanceComponent },
//                     { path: 'instrumentation/:profileId/:tabId', component: InstrumentationComponent },
//                     { path: 'integration/:profileId/:tabId', component: ProductIntegrationComponent }
//                 ] },
//             {
//                 path: 'profile', component: ConfigProfileRoutingComponent, children: [
//                     { path: '', redirectTo: 'profile-list', pathMatch: 'full' },
//                     { path: 'profile-list', component: ConfigProfileListComponent },
//                     { path: 'configuration/:profileId', component: ConfigurationComponent },
//                     { path: 'general/:profileId/:tabId', component: GeneralComponent },
//                     { path: 'advance/:profileId/:tabId', component: AdvanceComponent },
//                     { path: 'instrumentation/:profileId/:tabId', component: InstrumentationComponent },
//                     { path: 'integration/:profileId/:tabId', component: ProductIntegrationComponent }
//                 ]
//             },
//             { path: 'topology-list', component: ConfigTopologyListComponent },
//             { path: 'nd-agent', component: ConfigNdAgentComponent },
//             { path: 'instrumentation-profile-maker', component: ConfigImportInstrProfileComponent },
//             { path: 'auto-discover', component: ConfigAutoDiscoverComponent },
//             { path: 'auto-discover-tree', component: ConfigAutoDiscoverTreeComponent },
// 	    { path: 'audit-log-view', component: ConfigViewAuditLogComponent },
// 	    { path: 'application-list/ndc-keywords-setting/:appId', component: ConfigNDCKeywordsSettingComponent },
//             { path: 'auto-instrumentation', component: ConfigAutoInstrumentationComponent },
//             { path: 'auto-discover/auto-instrumentation/:sessionFileName', component: ConfigEditAutoInstrumentationComponent },
//         ]
//     }
// ];

/**For local setup */
const routes: Routes = [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: ConfigHomeComponent },
            { path: 'application-list', component: ConfigApplicationListComponent },
            { path: 'tree-main/:dcId', component: ConfigTreeMainComponent },
            { path: 'tree-main/topology/:topoId', component: ConfigTreeMainComponent },
            { path: 'tree-main/topology/profile', component: ConfigProfileRoutingComponent, children: [
                { path: '', redirectTo: 'configuration/:profileId', pathMatch: 'full' },
                { path: 'configuration/:profileId', component: ConfigurationComponent },
                { path: 'general/:profileId/:tabId', component: GeneralComponent },
                { path: 'advance/:profileId/:tabId', component: AdvanceComponent },
                { path: 'instrumentation/:profileId/:tabId', component: InstrumentationComponent },
                { path: 'integration/:profileId/:tabId', component: ProductIntegrationComponent }
            ] },
            { path: 'tree-main/profile', component: ConfigProfileRoutingComponent, children: [
                    { path: '', redirectTo: 'configuration/:profileId', pathMatch: 'full' },
                    { path: 'configuration/:profileId', component: ConfigurationComponent },
                    { path: 'general/:profileId/:tabId', component: GeneralComponent },
                    { path: 'advance/:profileId/:tabId', component: AdvanceComponent },
                    { path: 'instrumentation/:profileId/:tabId', component: InstrumentationComponent },
                    { path: 'integration/:profileId/:tabId', component: ProductIntegrationComponent }
                ] },
            {
                path: 'profile', component: ConfigProfileRoutingComponent, children: [
                    { path: '', redirectTo: 'profile-list', pathMatch: 'full' },
                    { path: 'profile-list', component: ConfigProfileListComponent },
                    { path: 'configuration/:profileId', component: ConfigurationComponent },
                    { path: 'general/:profileId/:tabId', component: GeneralComponent },
                    { path: 'advance/:profileId/:tabId', component: AdvanceComponent },
                    { path: 'instrumentation/:profileId/:tabId', component: InstrumentationComponent },
                    { path: 'integration/:profileId/:tabId', component: ProductIntegrationComponent }
                ]
            },
            { path: 'topology-list', component: ConfigTopologyListComponent },
            { path: 'nd-agent', component: ConfigNdAgentComponent },
            { path: 'instrumentation-profile-maker', component: ConfigImportInstrProfileComponent },
            { path: 'auto-discover', component: ConfigAutoDiscoverComponent },
            { path: 'auto-discover-tree', component: ConfigAutoDiscoverTreeComponent },
        { path: 'audit-log-view', component: ConfigViewAuditLogComponent },
        { path: 'nde-cluster-config', component: NDEClusterConfiguration},
        { path: 'user-configured-keywords', component: UserConfiguredKeywordComponent},
	    { path: 'application-list/ndc-keywords-setting/:appId', component: ConfigNDCKeywordsSettingComponent },
            { path: 'auto-instrumentation', component: ConfigAutoInstrumentationComponent },
            { path: 'auto-discover/auto-instrumentation/:sessionFileName', component: ConfigEditAutoInstrumentationComponent },
];

@NgModule({
    //imports: [RouterModule.forChild(routes)],
     imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class ConfigRoutingModule {

}
