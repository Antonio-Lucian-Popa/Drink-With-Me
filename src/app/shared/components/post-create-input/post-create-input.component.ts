import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostDialogComponent } from './create-post-dialog/create-post-dialog.component';

@Component({
  selector: 'app-post-create-input',
  standalone: false,
  templateUrl: './post-create-input.component.html',
  styleUrl: './post-create-input.component.scss'
})
export class PostCreateInputComponent {

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {
      width: '500px',
      data: { /* pass any data if necessary */ }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // handle the result if needed
    });
  }
}
