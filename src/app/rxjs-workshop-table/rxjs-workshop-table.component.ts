import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-rxjs-workshop-table',
  templateUrl: './rxjs-workshop-table.component.html',
  styleUrls: ['./rxjs-workshop-table.component.css']
})
export class RxjsWorkshopTableComponent implements AfterViewInit {
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['select', 'name', 'description','image', 'modified'];
  // @ts-ignore
  exampleDatabase: ExampleHttpDatabase | null;
  data: MarvelResults[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _httpClient: HttpClient) {}

  ngAfterViewInit() {
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getMarvelCharaters()
            .pipe(catchError(() => observableOf(null)));
        }),
        map(response => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = response === null;

          if (response === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = response.data.total;
          return response.data.results;
        }),
      )
      .subscribe(data => (this.data = data));
  }
}

export interface MarvelResults {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  }
}
export interface MarvelApi {
 code: number;
 status: string;
 data: {
   offset: number;
   limit: number;
   total: number;
   count: number;
   results: MarvelResults[];
 }
}

export interface MarvelQueryParams {
  nameStartsWith?: string;
  orderBy?: string;
  limit?: number;
  offset?: number;
  apikey?: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {}
  baseUrl = 'http://gateway.marvel.com/v1/public/';

  getMarvelCharaters(queryParams: MarvelQueryParams = {}): Observable<MarvelApi> {
    const apikey = '282bf23e6ebfd35ce4499d33d021bb19';
    const requestUrl = `${this.baseUrl}characters`;
    return this._httpClient.get<MarvelApi>(requestUrl, {params: {...queryParams, apikey}})
  }
}
