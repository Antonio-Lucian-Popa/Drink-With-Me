import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { GeolocationService } from '../../services/geolocation.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-feed',
  standalone: false,
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit{

  user: User | null = null;

  counties: any[] = [];
  cities: any[] = [];

  countyForm: FormGroup;

  selectedCounty: string = '';
  selectedCity: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private locationService: GeolocationService,
    private fb: FormBuilder
  ) {
    this.countyForm = this.fb.group({
      county: [''],
      city: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
   // Get user ID from JWT
   this.authService.getUserId().then(userId => {
    if (userId) {
      // Fetch user profile info using the user ID
      this.userService.getUserProfileInfo(userId).subscribe(
        userInfo => {
          console.log('User Info:', userInfo);
          this.user = userInfo; // Store the user info in a component variable
        },
        error => {
          console.error('Failed to fetch user info:', error);
        }
      );
    } else {
      console.log('No user ID found. User might not be logged in.');
    }
  });

    this.locationService.getCounty().subscribe({
      next: (counties) => {
        console.log('Counties:', counties);
        this.counties = counties;
      },
      error: (error) => {
        console.error('Error fetching location:', error);
      }
    });

    // Listen for changes in the county select
    this.countyForm.get('county')?.valueChanges.subscribe(selectedCounty => {
      if (selectedCounty) {
        this.selectedCounty = selectedCounty;
        // Fetch the cities for the selected county
        this.locationService.getLocation(selectedCounty).subscribe({
          next: (cities) => {
            this.cities = cities;
            this.countyForm.get('city')?.enable(); // Enable city select
          },
          error: (error) => {
            console.error('Error fetching cities:', error);
            this.cities = [];
            this.countyForm.get('city')?.disable(); // Disable city select
          }
        });
      } else {
        this.cities = [];
        this.countyForm.get('city')?.disable(); // Disable city select if no county is selected
      }

      // Reset the city select to its initial placeholder
      this.countyForm.get('city')?.reset({ value: '', disabled: !this.cities.length });
    });

    this.countyForm.get('city')?.valueChanges.subscribe(selectedCity => {
      if(selectedCity) {
        this.selectedCity = selectedCity;
      }
    });
  }

  fetchCitiesForCounty(countyId: string): void {
    // Example fetch logic, replace with your actual data fetching logic
    this.locationService.getLocation(countyId).subscribe({
      next: (cities) => {
        this.cities = cities;
        if (this.cities.length > 0) {
          this.countyForm.get('city')?.enable();
        } else {
          this.countyForm.get('city')?.disable();
        }
      },
      error: (error) => {
        console.error('Error fetching cities:', error);
        this.cities = [];
        this.countyForm.get('city')?.disable();
      }
    });
  }
}
