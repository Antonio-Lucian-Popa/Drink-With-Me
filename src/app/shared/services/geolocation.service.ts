import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  URL_LINK = environment.apiUrl + '/api/v1';

  userAddress: any = {};

  constructor(private http: HttpClient) { }

  getCityAndCountry(): Promise<{ city: string | null, country: string | null }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;

            this.http.get(url).subscribe({
              next: (data: any) => {
                const address = data.address;
                const city = address.city || address.town || address.village;
                const country = address.country;
                resolve({ city, country });
              },
              error: (error) => {
                reject('Error retrieving city and country information: ' + error);
              }
            });
          },
          error => reject('Geolocation error: ' + error.message)
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  getCounty(): Observable<any> {
    const url = `${this.URL_LINK}/locations/counties`;
    return this.http.get(url);
  }

  getLocation(countyId: string): Observable<any> {
    const url = `${this.URL_LINK}/locations/by-county/${countyId}`;
    return this.http.get(url);
  }
}
