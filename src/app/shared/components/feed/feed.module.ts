import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { SharedModule } from '../../shared.module';
import { FeedComponent } from './feed.component';


@NgModule({
  declarations: [
    FeedComponent
  ],
  imports: [
    CommonModule,
    FeedRoutingModule,
    SharedModule
  ]
})
export class FeedModule { }
