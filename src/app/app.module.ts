import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

/**Import material module */
import { MaterialModule } from '@angular/material';

/**Import primeng module  */
import { InputTextModule, DataTableModule, BreadcrumbModule, MenuModule, DropdownModule, TreeModule, ButtonModule, DialogModule, GrowlModule, ConfirmationService, ConfirmDialogModule } from 'primeng/primeng';

import 'hammerjs';

/** Routing Module */
import { ConfigRoutingModule } from './modules/config-ui/routes/config-routing.module'

/**Config UI services */
import {ConfigApplicationService} from './modules/config-ui/services/config-application.service';
import {ConfigProfileService} from './modules/config-ui/services/config-profile.service';
import {ConfigTopologyService} from './modules/config-ui/services/config-topology.service';
import {ConfigNdAgentService} from './modules/config-ui/services/config-nd-agent.service';
import {ConfigRestApiService} from './modules/config-ui/services/config-rest-api.service';
import {ConfigBreadcrumbService} from './modules/config-ui/services/config-breadcrumb.service';
import {ConfigUtilityService} from './modules/config-ui/services/config-utility.service';
import {ConfigHomeService} from './modules/config-ui/services/config-home.service';

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
    ConfigTreeMainComponent
  ],
  imports: [
  BrowserModule,
    FormsModule,
    HttpModule,
    ConfigRoutingModule,
    MaterialModule.forRoot(),
    InputTextModule,
    DataTableModule,
    BreadcrumbModule,
    MenuModule,
    DropdownModule,
    TreeModule,
    ButtonModule,
    DialogModule,
    GrowlModule,
    ConfirmDialogModule

  ],
  providers: [ConfigApplicationService, ConfigProfileService, ConfigTopologyService, ConfigNdAgentService, ConfigBreadcrumbService, ConfigRestApiService, ConfigUtilityService, ConfirmationService, ConfigHomeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
