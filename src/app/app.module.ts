import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


/**Import materiapl module */
import { MaterialModule } from '@angular/material';

/**Import primeng module  */

import { CheckboxModule, RadioButtonModule, InputTextModule, DataTableModule, BreadcrumbModule, MenuModule, DropdownModule, TreeModule, ButtonModule, DialogModule, GrowlModule, ConfirmationService, ConfirmDialogModule, TabViewModule, TooltipModule, InputSwitchModule, PanelModule ,SpinnerModule,
  MultiSelectModule,ToggleButtonModule} from 'primeng/primeng';

/**Perfect Scrollbar module */
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'angular2-perfect-scrollbar';

import 'hammerjs';

/** Routing Module */
import { ConfigRoutingModule } from './modules/config-ui/routes/config-routing.module'

/**Reducer */
import { keywordReducer } from './modules/config-ui/reducers/keyword-reducer';

/**Config UI services */

import { ConfigApplicationService } from './modules/config-ui/services/config-application.service';
import { ConfigProfileService } from './modules/config-ui/services/config-profile.service';
import { ConfigTopologyService } from './modules/config-ui/services/config-topology.service';
import { ConfigNdAgentService } from './modules/config-ui/services/config-nd-agent.service';
import { ConfigRestApiService } from './modules/config-ui/services/config-rest-api.service';
import { ConfigBreadcrumbService } from './modules/config-ui/services/config-breadcrumb.service';
import { ConfigUtilityService } from './modules/config-ui/services/config-utility.service';
import { ConfigHomeService } from './modules/config-ui/services/config-home.service';
import { ConfigKeywordsService } from './modules/config-ui/services/config-keywords.service';
import { ConfigBusinessTranService } from './modules/config-ui//services/config-business-trans-global-service';
/**Config UI Component */
import { AppComponent } from './app.component';
import { ConfigMainComponent } from './modules/config-ui/components/config-main/config-main.component';
import { ConfigLeftSideBarComponent } from './modules/config-ui/components/config-left-side-bar/config-left-side-bar.component';
import { ConfigTopNavBarComponent } from './modules/config-ui/components/config-top-nav-bar/config-top-nav-bar.component';
import { ConfigRightContentComponent } from './modules/config-ui/components/config-right-content/config-right-content.component';
import { ConfigHomeComponent } from './modules/config-ui/components/config-home/config-home.component';
import { ConfigApplicationListComponent } from './modules/config-ui/components/config-application-list/config-application-list.component';
import { ConfigTreeComponent } from './modules/config-ui/components/config-tree/config-tree.component';
import { ConfigTreeDetailComponent } from './modules/config-ui/components/config-tree-detail/config-tree-detail.component';
import { ConfigProfileListComponent } from './modules/config-ui/components/config-profile-list/config-profile-list.component';
import { ConfigurationComponent } from './modules/config-ui/components/config-profile/configuration/configuration.component';
import { GeneralComponent } from './modules/config-ui/components/config-profile/general/general.component';
import { InstrumentationComponent } from './modules/config-ui/components/config-profile/instrumentation/instrumentation.component';
import { AdvanceComponent } from './modules/config-ui/components/config-profile/advance/advance.component';
import { ProductIntegrationComponent } from './modules/config-ui/components/config-profile/product-integration/product-integration.component';
import { ConfigTopologyListComponent } from './modules/config-ui/components/config-topology-list/config-topology-list.component';
import { ConfigNdAgentComponent } from './modules/config-ui/components/config-nd-agent/config-nd-agent.component';
import { ConfigBreadcrumbComponent } from './modules/config-ui/components/config-breadcrumb/config-breadcrumb.component';
import { ConfigTreeMainComponent } from './modules/config-ui/components/config-tree-main/config-tree-main.component';
import { ServiceEntryPointComponent } from './modules/config-ui/components/config-profile/instrumentation/service-entry-point/service-entry-point.component';
import { IntegrationPtDetectionComponent } from './modules/config-ui/components/config-profile/instrumentation/integration-pt-detection/integration-pt-detection.component';
import { TransactionConfigurationComponent } from './modules/config-ui/components/config-profile/instrumentation/transaction-configuration/transaction-configuration.component';
import { InstrumentMonitorsComponent } from './modules/config-ui/components/config-profile/instrumentation/instrument-monitors/instrument-monitors.component';
import { ErrorDetectionComponent } from './modules/config-ui/components/config-profile/instrumentation/error-detection/error-detection.component';
import { ConfigProfileRoutingComponent } from './modules/config-ui/components/config-profile/config-profile-routing/config-profile-routing.component';
import { FlowpathComponent } from './modules/config-ui/components/config-profile/general/flowpath/flowpath.component';
import { HotspotComponent } from './modules/config-ui/components/config-profile/general/hotspot/hotspot.component';
import { ExceptionComponent } from './modules/config-ui/components/config-profile/general/exception/exception.component';
import { HeaderComponent } from './modules/config-ui/components/config-profile/general/header/header.component';
import { ThreadStatsComponent } from './modules/config-ui/components/config-profile/general/thread-stats/thread-stats.component';
import { InstrumentationProfilesComponent } from './modules/config-ui/components/config-profile/general/instrumentation-profiles/instrumentation-profiles.component';
import { HTTPBTConfigurationComponent } from './modules/config-ui/components/config-profile/instrumentation/transaction-configuration/http-bt-configuration/http-bt-configuration.component';
import { MethodBTConfigurationComponent } from './modules/config-ui/components/config-profile/instrumentation/transaction-configuration/method-bt-configuration/method-bt-configuration.component';
import { DebugComponent } from './modules/config-ui/components/config-profile/advance/debug/debug.component';
import { BackendMonitorsComponent } from './modules/config-ui/components/config-profile/advance/backend-monitors/backend-monitors.component';
import { MonitorsComponent } from './modules/config-ui/components/config-profile/advance/monitors/monitors.component';
import { DelayComponent } from './modules/config-ui/components/config-profile/advance/delay/delay.component';
import { GenerateExceptionComponent } from './modules/config-ui/components/config-profile/advance/generate-exception/generate-exception.component';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    ConfigMainComponent,
    ConfigLeftSideBarComponent,
    ConfigTopNavBarComponent,
    ConfigRightContentComponent,
    ConfigHomeComponent,
    ConfigApplicationListComponent,
    ConfigTreeComponent,
    ConfigTreeDetailComponent,
    ConfigProfileListComponent,
    ConfigurationComponent,
    GeneralComponent,
    InstrumentationComponent,
    AdvanceComponent,
    ProductIntegrationComponent,
    ConfigTopologyListComponent,
    ConfigNdAgentComponent,
    ConfigBreadcrumbComponent,
    ConfigTreeMainComponent,
    ServiceEntryPointComponent,
    IntegrationPtDetectionComponent,
    TransactionConfigurationComponent,
    InstrumentMonitorsComponent,
    ErrorDetectionComponent,
    ConfigProfileRoutingComponent,
    FlowpathComponent,
    HotspotComponent,
    ExceptionComponent,
    HeaderComponent,
    ThreadStatsComponent,
    InstrumentationProfilesComponent,
    HTTPBTConfigurationComponent,
    MethodBTConfigurationComponent,
    DebugComponent,
    BackendMonitorsComponent,
    MonitorsComponent,
    DelayComponent,
    GenerateExceptionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ConfigRoutingModule,
    MaterialModule.forRoot(),
    PerfectScrollbarModule.forRoot(),
   StoreModule.provideStore({ keywordData: keywordReducer }),
    InputTextModule,
    DataTableModule,
    BreadcrumbModule,
    MenuModule,
    DropdownModule,
    TreeModule,
    ButtonModule,
    DialogModule,
    GrowlModule,
    ConfirmDialogModule,
    TabViewModule,
    TooltipModule,
    SpinnerModule,
    InputSwitchModule,
    PanelModule,
    RadioButtonModule,
    CheckboxModule,
    MultiSelectModule,
    ToggleButtonModule
  ],
 
  providers: [ConfigBusinessTranService, ConfigApplicationService, ConfigProfileService, ConfigTopologyService, ConfigNdAgentService, ConfigBreadcrumbService, ConfigRestApiService, ConfigUtilityService, ConfirmationService, ConfigHomeService, ConfigKeywordsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

