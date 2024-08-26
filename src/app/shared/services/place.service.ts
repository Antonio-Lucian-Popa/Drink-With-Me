import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place } from '../interfaces/place';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  URL_LINK = environment.apiUrl + '/api/v1/places';

  constructor(private http: HttpClient) { }

  // Method to fetch places near a specific location
  getPlacesAround(coords: [number, number]): Observable<Place[]> {
    const params = new HttpParams()
      .set('latitude', coords[0].toString())
      .set('longitude', coords[1].toString());

    return this.http.get<Place[]>(`${this.URL_LINK}/around`, { params });
  }

  // Method to search places by location
  searchPlaces(query: string): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.URL_LINK}/search`, {
      params: {
        query
      }
    });
  }


}
