import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { GeolocationService } from './shared/services/geolocation.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, filter, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from './shared/services/user.service';
import { WebSocketService } from './shared/components/notification-card/services/web-socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, RouterModule, CommonModule],
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

  showSidebarAndNavbar: boolean = true;

  constructor(
    private geolocationService: GeolocationService,
    private elementRef: ElementRef,
    private router: Router,
    private userService: UserService,
    private webSocketService: WebSocketService
  ) {}

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

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLayout();
    });

    // Initial check in case the app starts on a sign-up/sign-in route
    this.updateLayout();

    this.searchControl.valueChanges
    .pipe(
      debounceTime(300), // Wait for 300ms pause in events
      filter(term => term === '' || (term && term.length > 0 )), // Ensure non-empty or reset
      switchMap(term => {
        if (term) {
          return this.userService.searchUsers(term);
        } else {
          // Immediately return an empty array when the term is empty
          return of([]);
        }
      })
    )
    .subscribe((results: any[]) => {
      if (results.length > 0) {
        this.searchResults = results;
        this.showDropdown = true;
      } else {
        this.showDropdown = false;
        this.searchResults = [];
      }
    });

    this.webSocketService.newNotifications.subscribe((notification: any) => {
      this.isNewNotifications = true;
    });
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

  private updateLayout(): void {
    const currentRoute = this.router.url;
    if (currentRoute.startsWith('/sign-in') || currentRoute.startsWith('/sign-up')) {
      this.showSidebarAndNavbar = false;
    } else {
      this.showSidebarAndNavbar = true;
    }
  }
}
