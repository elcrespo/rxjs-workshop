import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, combineLatest, debounceTime, map, Observable, shareReplay, switchMap, tap} from "rxjs";
import {Sort} from "@angular/material/sort";
import {PageEvent} from "@angular/material/paginator";

export interface MarvelResults {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  isSelected: boolean;
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
  limit?: number;
  offset?: number;
  apikey?: string;
  sort?: Sort;
}

export const initialRowState: MarvelResults = {
  id: 0,
  name: '',
  description: '',
  modified: '',
  thumbnail: {
    path: '',
    extension: '',
  },
  isSelected: false
};

@Injectable({
  providedIn: 'root'
})
export class RxjsWorkshopTableService {
  private baseUrl = 'http://gateway.marvel.com/v1/public/';
  private sortSubject: BehaviorSubject<Sort> = new BehaviorSubject<Sort>({active: 'name', direction: 'asc'});
  private paginatorSubject: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>({pageIndex: 0, pageSize: 10, length: 20});
  private filterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private isLoadingDataSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private selectAllSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private selectRowSubject: BehaviorSubject<MarvelResults> = new BehaviorSubject<MarvelResults>(initialRowState);

  sort$: Observable<Sort> = this.sortSubject.asObservable();
  paginator$: Observable<PageEvent> = this.paginatorSubject.asObservable();
  filter$: Observable<string> = this.filterSubject.asObservable().pipe(
    debounceTime(500)
  );
  isLoadingData$ = this.isLoadingDataSubject.asObservable();
  areAllSelected$: Observable<boolean> = this.selectAllSubject.asObservable();

  marvelQueryParams$: Observable<MarvelQueryParams> = combineLatest(
    [this.sort$, this.paginator$, this.filter$]
  ).pipe(
    map(([sort, paginator, filter]) => {
      const nameStartsWith = filter;
      const offset = paginator.pageIndex * paginator.pageSize;
      const limit = (paginator.pageSize * paginator.pageIndex) || paginator.pageSize;
      return {
        ...(nameStartsWith.length) && {nameStartsWith},
        offset,
        limit,
        sort
      }
    })
  );

  data$: Observable<MarvelApi> = this.marvelQueryParams$.pipe(
    tap(() => this.isLoadingDataSubject.next(true)),
    switchMap((queryParams) => this.getMarvelCharacters(queryParams)),
    tap(() => this.isLoadingDataSubject.next(false)),
    shareReplay(1)
  );

  results$: Observable<MarvelResults[]> = combineLatest([this.data$, this.areAllSelected$]).pipe(
    map(([response, areAllSelected]) => {
      return response.data.results.map(item => {
        return {
          ...item,
          isSelected: areAllSelected
        }
      });
    })
  );

  total$: Observable<number> = this.data$.pipe(
    map(response => response.data.total)
  );

  constructor(private _httpClient: HttpClient) {}

  /*Este método pertenecería a otro tipo de servicio*/
  getMarvelCharacters(queryParams: MarvelQueryParams = {}): Observable<MarvelApi> {
    const apikey = '282bf23e6ebfd35ce4499d33d021bb19';
    const { sort, ...mQueryParams} = queryParams;
    const orderBy = sort?.direction === 'desc'? `-${sort.active}` : sort?.active || 'name';
    const requestUrl = `${this.baseUrl}characters`;
    return this._httpClient.get<MarvelApi>(requestUrl, {params: {...mQueryParams, orderBy, apikey}})
  }

  setSort(sort: Sort) {
    this.sortSubject.next(sort);
  }

  setPaginator(paginator: PageEvent) {
    this.paginatorSubject.next(paginator);
  }

  setFilter(filter: string) {
    this.filterSubject.next(filter);
  }

  setSelectAll(checked: boolean): void {
    this.selectAllSubject.next(checked);
  }

  setSelectRow(item: MarvelResults): void {
    this.selectRowSubject.next(item);
  }
}
