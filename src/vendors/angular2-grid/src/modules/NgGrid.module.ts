import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgGrid } from '../directives/NgGrid';
import { NgGridItem } from'../directives/NgGridItem';
import { NgGridPlaceholder } from'../components/NgGridPlaceholder';
import { NgGridItemConfig } from'../interfaces/INgGrid';

@NgModule({
  declarations:     [ NgGrid, NgGridItem, NgGridPlaceholder ],
  entryComponents:  [ NgGridPlaceholder ],
  exports:          [ NgGrid, NgGridItem ]
})
export class NgGridModule {

};
