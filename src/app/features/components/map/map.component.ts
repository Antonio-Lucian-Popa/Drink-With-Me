import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Place } from '../../../shared/interfaces/place';
import { PlaceService } from '../../../shared/services/place.service';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  places$!: Observable<Place[]>;

  private map!: L.Map;
  private userMarker!: L.Marker;
  private placesLayerGroup = L.layerGroup();

  isLoading = true;

  constructor(private placeService: PlaceService) {}

  ngOnInit(): void {
    this.initializeMap();
    this.getUserLocation();
    this.isLoading = false;

     // Set up the search with debounce
     this.places$ = this.searchControl.valueChanges.pipe(
      debounceTime(300), // Wait for 300ms pause in events
      distinctUntilChanged(), // Only emit if value is different from before
      switchMap((query) => this.placeService.searchPlaces(query)) // Switch to new search observable
    );

    // Subscribe to search results and update the map
    this.places$.subscribe((places) => {
      this.placesLayerGroup.clearLayers();
        places.forEach((place) => {
          const marker = L.marker([place.location.latitude, place.location.longitude])
            .addTo(this.placesLayerGroup)
            .bindPopup(`<b>${place.name}</b><br>${place.location.street}`);
        });
        this.placesLayerGroup.addTo(this.map);
    });
  }

  private initializeMap(): void {
    this.map = L.map('map').setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private getUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords: L.LatLngExpression = [position.coords.latitude, position.coords.longitude];
        this.map.setView(userCoords, 13);

        this.userMarker = L.marker(userCoords).addTo(this.map)
          .bindPopup('You are here.')
          .openPopup();

        this.fetchPlacesAround(userCoords);
      },
      (error) => {
        console.error('Error getting user location', error);
      }
    );
  }

  private fetchPlacesAround(userCoords: L.LatLngExpression): void {
    // Check if userCoords is an instance of L.LatLng or an array
    const coordsArray: [number, number] = Array.isArray(userCoords)
        ? [userCoords[0], userCoords[1]]
        : [userCoords.lat, userCoords.lng];

    this.placeService.getPlacesAround(coordsArray).subscribe(
      (places) => {
        this.placesLayerGroup.clearLayers();
        places.forEach((place) => {
          const marker = L.marker([place.location.latitude, place.location.longitude])
            .addTo(this.placesLayerGroup)
            .bindPopup(`<b>${place.name}</b><br>${place.location.street}`);
        });
        this.placesLayerGroup.addTo(this.map);
      },
      (error) => {
        console.error('Error fetching places', error);
      }
    );
}

  }
