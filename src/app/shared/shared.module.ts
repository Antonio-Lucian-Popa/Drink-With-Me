import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';

const NB_COMPONENTS: any[] = [];

const NB_MODULES: any[] = [
  MatDividerModule
];


@NgModule({
  declarations: [...NB_COMPONENTS],
  imports: [
    CommonModule,
    ...NB_MODULES
  ],
  exports: [...NB_COMPONENTS, ...NB_MODULES]
})
export class SharedModule { }
