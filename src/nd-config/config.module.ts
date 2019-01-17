import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
//Added for Preventing 404 error while reloading
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {ConfigExceptionFilterService} from './services/config-exceptionfilter.service';
import { AutofocusModule } from 'angular-autofocus-fix';

/**Import materiapl module */
import { MaterialModule } from '@angular/material';

/**Import primeng module  */

import {
  SplitButtonModule,
  CheckboxModule,
  RadioButtonModule,
  InputTextModule,
  DataTableModule,
  BreadcrumbModule,
  MenuModule,
  DropdownModule,
  TreeModule,
  ButtonModule,
  DialogModule,
  GrowlModule,
  ConfirmationService,
  ConfirmDialogModule,
  TabViewModule,
  TooltipModule,
  InputSwitchModule,
  PanelModule,
  SpinnerModule,
  MultiSelectModule,
  ToggleButtonModule,
  AccordionModule,
  FieldsetModule,
  ChipsModule,
  ToolbarModule,
  SliderModule,
  InputTextareaModule,
  ContextMenuModule,
  FileUploadModule
} from 'primeng/primeng';

import 'hammerjs';

/** Routing Module */
import { ConfigRoutingModule } from './routes/config-routing.module'

/**Reducer */
import { keywordReducer } from './reducers/keyword-reducer';
import { ndcKeywordReducer } from './reducers/ndc-keyword-reducer';

/**Config UI services */

import { ConfigApplicationService } from './services/config-application.service';
import { ConfigProfileService } from './services/config-profile.service';
import { ConfigTopologyService } from './services/config-topology.service';
import { ConfigNdAgentService } from './services/config-nd-agent.service';
import { ConfigRestApiService } from './services/config-rest-api.service';
import { ConfigBreadcrumbService } from './services/config-breadcrumb.service';
import { ConfigUtilityService } from './services/config-utility.service';
import { ConfigHomeService } from './services/config-home.service';
import { ConfigKeywordsService } from './services/config-keywords.service';
import { ConfigCustomDataService } from './services/config-customdata.service';
//import { ApiService } from '../file-explorer/services/api.service';

/**Config UI Component */
import { AppComponentForConfig } from './config.component';
import { ConfigMainComponent } from './components/config-main/config-main.component';
import { ConfigLeftSideBarComponent } from './components/config-left-side-bar/config-left-side-bar.component';
import { ConfigTopNavBarComponent } from './components/config-top-nav-bar/config-top-nav-bar.component';
import { ConfigTopHeaderNavBarComponent } from './components/config-header-top-nav-bar/config-header-top-nav-bar';
import { ConfigRightContentComponent } from './components/config-right-content/config-right-content.component';
import { ConfigHomeComponent } from './components/config-home/config-home.component';
import { ConfigApplicationListComponent } from './components/config-application-list/config-application-list.component';
import { ConfigTreeComponent } from './components/config-tree/config-tree.component';
import { ConfigTreeDetailComponent } from './components/config-tree-detail/config-tree-detail.component';
import { ConfigProfileListComponent } from './components/config-profile-list/config-profile-list.component';
import { ConfigurationComponent } from './components/config-profile/configuration/configuration.component';
import { GeneralComponent } from './components/config-profile/general/general.component';
import { InstrumentationComponent } from './components/config-profile/instrumentation/instrumentation.component';
import { AdvanceComponent } from './components/config-profile/advance/advance.component';
import { ProductIntegrationComponent } from './components/config-profile/product-integration/product-integration.component';
import { ConfigTopologyListComponent } from './components/config-topology-list/config-topology-list.component';
import { ConfigNdAgentComponent } from './components/config-nd-agent/config-nd-agent.component';
import { ConfigBreadcrumbComponent } from './components/config-breadcrumb/config-breadcrumb.component';
import { ConfigMetaDataComponent } from './components/config-meta-data/config-meta-data.component';
import { ConfigTreeMainComponent } from './components/config-tree-main/config-tree-main.component';
import { ServiceEntryPointComponent } from './components/config-profile/instrumentation/service-entry-point/service-entry-point.component';
import { IntegrationPtDetectionComponent } from './components/config-profile/instrumentation/integration-pt-detection/integration-pt-detection.component';
import { TransactionConfigurationComponent } from './components/config-profile/instrumentation/transaction-configuration/transaction-configuration.component';
import { InstrumentMonitorsComponent } from './components/config-profile/instrumentation/instrument-monitors/instrument-monitors.component';
import { ThreadStatsComponent } from './components/config-profile/instrumentation/instrument-monitors/thread-stats/thread-stats.component';
import { ErrorDetectionComponent } from './components/config-profile/instrumentation/error-detection/error-detection.component';
import { ConfigProfileRoutingComponent } from './components/config-profile/config-profile-routing/config-profile-routing.component';
import { FlowpathComponent } from './components/config-profile/general/flowpath/flowpath.component';
import { HotspotComponent } from './components/config-profile/general/hotspot/hotspot.component';
import { HeaderComponent } from './components/config-profile/general/header/header.component';
import { InstrumentationProfilesComponent } from './components/config-profile/general/instrumentation-profiles/instrumentation-profiles.component';
import { HTTPBTConfigurationComponent } from './components/config-profile/instrumentation/transaction-configuration/http-bt-configuration/http-bt-configuration.component';
import { MethodBTConfigurationComponent } from './components/config-profile/instrumentation/transaction-configuration/method-bt-configuration/method-bt-configuration.component';
import { DebugComponent } from './components/config-profile/advance/debug/debug.component';
import { BackendMonitorsComponent } from './components/config-profile/advance/backend-monitors/backend-monitors.component';
import { MonitorsComponent } from './components/config-profile/advance/monitors/monitors.component';
import { DelayComponent } from './components/config-profile/advance/delay/delay.component';
import { GenerateExceptionComponent } from './components/config-profile/advance/generate-exception/generate-exception.component';
import { CustomKeywordsComponent } from './components/config-profile/advance/custom-keywords/custom-keywords.component';
import { BTHTTPHeadersComponent} from './components/config-profile/instrumentation/transaction-configuration/bt-http-headers/bt-http-headers.component';
import { BTResponseHeadersComponent} from './components/config-profile/instrumentation/transaction-configuration/bt-response-headers/bt-response-headers.component';
import { BTHTTPBodyComponent, PipeForDataType} from './components/config-profile/instrumentation/transaction-configuration/bt-http-body/bt-http-body.component';

import { HttpHeaderComponent } from './components/config-profile/general/header/http-header/http-header.component';
import { CustomDataComponent } from './components/config-profile/general/custom-data/custom-data.component';
import { HttpRequestComponent } from './components/config-profile/general/custom-data/http-request/http-request.component';
import { SessionAttributeComponent } from './components/config-profile/general/custom-data/session-attribute/session-attribute.component';
import { JavaMethodComponent } from './components/config-profile/general/custom-data/java-method/java-method.component';
import { NVCookieComponent } from './components/config-profile/product-integration/nvcookie/nvcookie.component';
import { MethodMonitorsComponent } from './components/config-profile/instrumentation/instrument-monitors/method-monitors/method-monitors.component';
import { ExceptionMonitorsComponent } from './components/config-profile/instrumentation/instrument-monitors/exception-monitors/exception-monitors.component';
import { HttpStatsMonitorsComponent, PipeForFpDump } from './components/config-profile/instrumentation/instrument-monitors/http-stats-monitors/http-stats-monitors.component';

import { IntegrationPtComponent } from './components/config-profile/instrumentation/integration-pt-detection/integration-pt/integration-pt.component';
import { InterfaceEntryPointComponent } from './components/config-profile/instrumentation/integration-pt-detection/interface-entry-point/interface-entry-point.component';
import { UrlCapturingComponent } from './components/config-profile/instrumentation/integration-pt-detection/url-capturing/url-capturing.component';
import { ConfigImportInstrProfileComponent } from './components/config-import-instr-profile/config-import-instr-profile.component';
import { ConfigAutoDiscoverComponent } from './components/config-auto-discover/config-auto-discover.component';
import { ConfigAutoDiscoverTreeComponent } from './components/config-auto-discover/config-auto-discover-tree/config-auto-discover-tree.component';
import { ConfigAutoDiscoverMainComponent } from './components/config-auto-discover/config-auto-discover-main/config-auto-discover-main.component';
import { ConfigViewAuditLogComponent } from './components/config-view-audit-log/config-view-audit-log.component';
import { ConfigNDCKeywordsSettingComponent } from './components/config-ndc-keywords-setting/config-ndc-keywords-setting.component';
import { ConfigAutoInstrumentationComponent } from './components/config-auto-discover/config-auto-instrumentation/config-auto-instrumentation.component';
import { ConfigEditAutoInstrumentationComponent } from './components/config-auto-discover/config-edit-auto-instrumentation/config-edit-auto-instrumentation.component';
import { ExceptionCapturingComponent } from './components/config-profile/general/exception-capturing/exception-capturing.component';
import { HttpResponseComponent } from './components/config-profile/general/custom-data/http-response/http-response.component';
import {DynamicDiagnosticsComponent} from './components/dynamic-diagnostics/dynamic-diagnostics.component';
import { AsynchronousRuleComponent } from './components/config-profile/instrumentation/asynchronous-rule/asynchronous-rule.component';
// not commit in cvs
import { CavMenuNavigatorService } from './services/cav-menu-navigator.service';
import { AuthenticationService } from './services/authentication.service';
import {CavConfigService } from './services/cav-config.service';
import { CavDataApiService } from './services/cav-data-api.service';
import { CavTopPanelNavigationService } from './services/cav-top-panel-navigation.service';
import { TimerService } from './services/timer.service';
import { AlertConfigService } from './services/alert-config-service';

import { HelpComponent } from './components/config-help/config-help.component';
import { EventCorrelationComponent } from './components/config-profile/general/event-correlation/event-correlation.component';
import { NDEClusterConfiguration, PipeForObject } from './components/nde-cluster-configuration/nde-cluster-configuration.component';
import { UserConfiguredKeywordComponent } from './components/user-configured-keywords/user-configured-keywords.component';
import { PipeForType, FilterPipe, HighlightSearch } from './pipes/config-pipe.pipe';
import { NVAutoInjectConfiguration } from './components/config-profile/product-integration/nv-auto-inject/nv-auto-inject.component';
import { ConfigBCILogsComponent } from './components/config-bci-logs/config-bci-logs.component';

import { CavNdAgentComponent } from './components/cav-nd-agent/cav-nd-agent.component';

@NgModule({
  declarations: [
    AppComponentForConfig,
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
    ConfigMetaDataComponent,
    ConfigTreeMainComponent,
    ServiceEntryPointComponent,
    IntegrationPtDetectionComponent,
    TransactionConfigurationComponent,
    InstrumentMonitorsComponent,
    ErrorDetectionComponent,
    ConfigProfileRoutingComponent,
    FlowpathComponent,
    HotspotComponent,
    HeaderComponent,
    ThreadStatsComponent,
    InstrumentationProfilesComponent,
    HTTPBTConfigurationComponent,
    MethodBTConfigurationComponent,
    DebugComponent,
    BackendMonitorsComponent,
    MonitorsComponent,
    DelayComponent,
    GenerateExceptionComponent,
    HttpHeaderComponent,
    CustomDataComponent,
    HttpRequestComponent,
    SessionAttributeComponent,
    JavaMethodComponent,
    NVCookieComponent,
    MethodMonitorsComponent,
    HttpStatsMonitorsComponent,
    ConfigTopHeaderNavBarComponent,
    PipeForFpDump,
    CustomKeywordsComponent,
    ExceptionMonitorsComponent,
    BTHTTPHeadersComponent,
    IntegrationPtComponent,
    UrlCapturingComponent,
    ConfigImportInstrProfileComponent,
    ConfigAutoDiscoverComponent,
    ConfigAutoDiscoverMainComponent,
    ConfigAutoDiscoverTreeComponent,
    ConfigViewAuditLogComponent,
    ConfigNDCKeywordsSettingComponent,
    ConfigAutoInstrumentationComponent,
    ConfigEditAutoInstrumentationComponent,
    ExceptionCapturingComponent,
    HttpResponseComponent,
    BTResponseHeadersComponent,
    DynamicDiagnosticsComponent,
    AsynchronousRuleComponent,
    BTHTTPBodyComponent,
    PipeForDataType,
    HelpComponent,
    EventCorrelationComponent,
    NDEClusterConfiguration,
    PipeForObject,
    UserConfiguredKeywordComponent,
    PipeForType,
    InterfaceEntryPointComponent,
    NVAutoInjectConfiguration,
    ConfigBCILogsComponent,
    CavNdAgentComponent,
    FilterPipe,
    HighlightSearch
  ],
  imports: [
   // CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ConfigRoutingModule,
    MaterialModule,
    StoreModule.provideStore({ keywordData: keywordReducer, ndcKeywordData: ndcKeywordReducer }),
    InputTextModule,
    DataTableModule,
    BreadcrumbModule,
    MenuModule,
    ContextMenuModule,
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
    ToggleButtonModule,
    ChipsModule,
    AccordionModule,
    FieldsetModule,
    ToolbarModule,
    SliderModule,
    SplitButtonModule,
    InputTextareaModule,
    FileUploadModule,
    AutofocusModule
  ],

  providers: [
   // { provide: LoggerOptions, useValue: { level: LoggerLevel.DEBUG } }, Logger,
   AlertConfigService, TimerService, CavTopPanelNavigationService, CavDataApiService ,CavConfigService, AuthenticationService,CavMenuNavigatorService, ConfigApplicationService, ConfigProfileService, ConfigTopologyService, ConfigNdAgentService, ConfigBreadcrumbService, ConfigRestApiService, ConfigUtilityService, ConfirmationService, ConfigHomeService, ConfigKeywordsService,ConfigCustomDataService,ConfigExceptionFilterService,MethodBTConfigurationComponent,PipeForType, FilterPipe, HighlightSearch,
   // ApiService,
    { provide: LocationStrategy, useClass: HashLocationStrategy},],
    bootstrap: [AppComponentForConfig]
})
export class AppModuleForConfig { }