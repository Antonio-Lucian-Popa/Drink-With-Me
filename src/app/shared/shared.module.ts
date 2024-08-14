import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import { PostCreateInputComponent } from './components/post-create-input/post-create-input.component';
import { PostComponent } from './components/post-list/post/post.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TimeAgoPipe } from "./pipe/time-ago.pipe";

const NB_COMPONENTS: any[] = [
  PostCreateInputComponent,
  PostComponent,
  PostListComponent
];

const NB_MODULES: any[] = [
  MatDividerModule,
  MatDialogModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
];


@NgModule({
  declarations: [...NB_COMPONENTS],
  imports: [
    CommonModule,
    ...NB_MODULES,
    TimeAgoPipe
],
  exports: [...NB_COMPONENTS, ...NB_MODULES, TimeAgoPipe]
})
export class SharedModule { }
