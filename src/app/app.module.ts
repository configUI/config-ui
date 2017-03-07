import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/**Import material module */
import { MaterialModule } from '@angular/material';

/**Import primeng module  */
import {InputTextModule} from 'primeng/primeng';

import 'hammerjs';

import { AppComponent } from './app.component';
import { ConfigUiMainComponent } from './modules/config-ui/components/config-ui-main/config-ui-main.component';


@NgModule({
  declarations: [
    AppComponent,
    ConfigUiMainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    InputTextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
