import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Sort, SortDirection} from "@angular/material/sort";

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
  limit?: number;
  offset?: number;
  apikey?: string;
  sort?: Sort;
}

@Injectable({
  providedIn: 'root'
})
export class RxjsWorkshopTableService {

  constructor(private _httpClient: HttpClient) {}
  baseUrl = 'http://gateway.marvel.com/v1/public/';

  getMarvelCharacters(queryParams: MarvelQueryParams = {}): Observable<MarvelApi> {
    const apikey = '282bf23e6ebfd35ce4499d33d021bb19';
    const { sort, ...mQueryParams} = queryParams;
    const orderBy = sort?.direction === 'desc'? `-${sort.active}` : sort?.active || 'name';
    const requestUrl = `${this.baseUrl}characters`;
    return this._httpClient.get<MarvelApi>(requestUrl, {params: {...mQueryParams, orderBy, apikey}})
  }
}
