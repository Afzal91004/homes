import { Component, inject, OnInit } from '@angular/core';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HousingLocation } from '../housing-location';
import { HousingService } from '../housing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HousingLocationComponent, CommonModule, FormsModule],
  template: `
    <section class="search-section">
      <h1>Find your housing location</h1>
      <form (submit)="filterLocations(); $event.preventDefault()">
        <input
          type="text"
          placeholder="Filter by city"
          [(ngModel)]="searchText"
          name="searchText"
        />
        <button class="primary" type="submit">
          <span class="search-icon">🔍</span>
          Search
        </button>
      </form>
    </section>
    <section class="results">
      <app-housing-location
        *ngFor="let housingLocation of filteredLocationList"
        [housingLocation]="housingLocation"
      >
      </app-housing-location>
    </section>
  `,
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  housingLocationList: HousingLocation[] = [];
  filteredLocationList: HousingLocation[] = [];
  searchText: string = '';
  housingService: HousingService = inject(HousingService);

  constructor() {}

  ngOnInit() {
    this.housingService
      .getAllHousingLocations()
      .then((housingLocationList: HousingLocation[]) => {
        this.housingLocationList = housingLocationList;
        this.filteredLocationList = housingLocationList;
      })
      .catch((error) => {
        console.error('Failed to fetch housing locations', error);
      });
  }

  filterLocations() {
    if (!this.searchText) {
      this.filteredLocationList = this.housingLocationList;
    } else {
      this.filteredLocationList = this.housingLocationList.filter((location) =>
        location.city.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }
}
