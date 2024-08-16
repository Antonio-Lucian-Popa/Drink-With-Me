import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { GeolocationService } from './shared/services/geolocation.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeDropDownUser();
    }
  }

  sidebarOpen = false;
  location: { city: string | null, country: string | null } | null = null;
  error: string | null = null;

  isNotificationCardOpened: boolean = false;
  isNewNotifications = false;

  showDropdownUser: boolean = false;
  searchControl: FormControl = new FormControl('');
  showDropdown: boolean = false;
  searchResults: any[] = [];

  constructor(private geolocationService: GeolocationService, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.geolocationService.getCityAndCountry().then(
      location => {
        this.location = location;
        console.log('Location:', location);
      },
      error => {
        this.error = error;
      }
    );
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleNotificationCard(): void {
    this.isNotificationCardOpened = !this.isNotificationCardOpened;
    this.isNotificationCardOpened ? this.isNewNotifications = false : null;
  }

  logOut(): void {
    // this.authService.logout().subscribe(res => {
    //   this.router.navigate(['/log-in']);
    // });
  }

  toggleDropdown(): void {
    this.showDropdownUser = !this.showDropdownUser;
  }

  openUserProfile(userId?: string): void {
    this.closeDropDownUser();
    this.searchControl.reset();
    //this.router.navigate(['/user-profile',  userId ? userId : this.userInfo.id]);
  }

  closeDropDownUser(): void {
    this.showDropdown = false;
    this.showDropdownUser = false;
  }

  checkNotificationOpeningStatus(event: any): void {
    if (this.isNotificationCardOpened) {
      this.isNotificationCardOpened = false;
    }
  }
}
