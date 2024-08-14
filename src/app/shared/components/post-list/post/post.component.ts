import { Component } from '@angular/core';

@Component({
  selector: 'app-post',
  standalone: false,
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  participate() {
    console.log('User has clicked participate');
    // You can implement the participation logic here
    // e.g., increment the participation count, send data to the server, etc.
  }
}
