import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/**Import material module */
import { MaterialModule } from '@angular/material';

/**Import primeng module  */
import {InputTextModule, DataTableModule} from 'primeng/primeng';

import 'hammerjs';

/**Config UI services */
import { ConfigUiDataService } from './modules/config-ui/services/config-ui-data.service';

/**Config UI Component */
import { AppComponent } from './app.component';
import { ConfigUiMainComponent } from './modules/config-ui/components/config-ui-main/config-ui-main.component';
import { ConfigUiApplicationComponent } from './modules/config-ui/components/config-ui-application/config-ui-application.component';
import { ConfigUiTopologyComponent } from './modules/config-ui/components/config-ui-topology/config-ui-topology.component';
import { ConfigUiProfileComponent } from './modules/config-ui/components/config-ui-profile/config-ui-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    ConfigUiMainComponent,
    ConfigUiApplicationComponent,
    ConfigUiTopologyComponent,
    ConfigUiProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    InputTextModule,
    DataTableModule
  ],
  providers: [ ConfigUiDataService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
