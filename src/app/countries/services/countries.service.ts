import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private apiUrl = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountry: { term: '', countries: [] },
    byRegion: { countries: [] },
  }

  constructor(private http: HttpClient) {
    this.getFromLocalStorage();
  }
  
  private saveToLocalStorage(): void {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private getFromLocalStorage(): void {
    const cacheStore = localStorage.getItem('cacheStore');
    if (cacheStore) {
      this.cacheStore = JSON.parse(cacheStore);
    }
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url).pipe(catchError((error) => of([])));
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url: string = `${this.apiUrl}/alpha/${code}`;

    return this.http.get<Country[]>(url).pipe(
      map((countries) => (countries.length > 0 ? countries[0] : null)),
      catchError(() => of(null))
    );
  }

  searchCapital(term: string): Observable<Country[]> {
    const url: string = `${this.apiUrl}/capital/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byCapital = { term, countries }),
      tap(() => this.saveToLocalStorage())
    );
  }

  searchCountry(term: string): Observable<Country[]> {
    const url: string = `${this.apiUrl}/name/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byCountry = { term, countries }),
      tap(() => this.saveToLocalStorage())
    );
  }

  searchRegion(term: Region): Observable<Country[]> {
    const url: string = `${this.apiUrl}/region/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byRegion = { region: term, countries }),
      tap(() => this.saveToLocalStorage())
    );
  }
}
