import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

/**Import material module */
import { MaterialModule } from '@angular/material';

/**Import primeng module  */
import { InputTextModule, DataTableModule, BreadcrumbModule, MenuItem, MenuModule, DropdownModule } from 'primeng/primeng';

import 'hammerjs';

/** Routing Module */
import { APP_ROUTES_CONFIG_UI } from './modules/config-ui/routes/config-ui-routes';

/**Config UI services */
import { ConfigUiDataService } from './modules/config-ui/services/config-ui-data.service';
import { ConfigUiMainDataService } from './modules/config-ui/services/config-ui-main-data.service';
import { ConfigUiBreadcrumbService } from './modules/config-ui/services/config-ui-breadcrumb.service';

/**Config UI Component */
import { AppComponent } from './app.component';
import { ConfigUiMainComponent } from './modules/config-ui/components/config-ui-main/config-ui-main.component';
import { ConfigUiApplicationComponent } from './modules/config-ui/components/config-ui-application/config-ui-application.component';
import { ConfigUiTopologyComponent } from './modules/config-ui/components/config-ui-topology/config-ui-topology.component';
import { ConfigUiProfileComponent } from './modules/config-ui/components/config-ui-profile/config-ui-profile.component';
import { ConfigUiBreadcrumbComponent } from './modules/config-ui/components/config-ui-breadcrumb/config-ui-breadcrumb.component';
import { ConfigUiRightMainComponent } from './modules/config-ui/components/config-ui-right-main/config-ui-right-main.component';
import { ConfigUiTopologyDetailComponent } from './modules/config-ui/components/config-ui-topology-detail/config-ui-topology-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    ConfigUiMainComponent,
    ConfigUiApplicationComponent,
    ConfigUiTopologyComponent,
    ConfigUiProfileComponent,
    ConfigUiBreadcrumbComponent,
    ConfigUiRightMainComponent,
    ConfigUiTopologyDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(APP_ROUTES_CONFIG_UI),
    InputTextModule,
    DataTableModule,
    BreadcrumbModule,
    MenuModule,
    DropdownModule

  ],
  providers: [ConfigUiDataService, ConfigUiMainDataService, ConfigUiBreadcrumbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
