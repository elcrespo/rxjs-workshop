import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

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

@Injectable({
  providedIn: 'root'
})
export class RxjsWorkshopTableService {

  constructor(private _httpClient: HttpClient) {}
  baseUrl = 'http://gateway.marvel.com/v1/public/';

  getMarvelCharaters(queryParams: MarvelQueryParams = {}): Observable<MarvelApi> {
    const apikey = '282bf23e6ebfd35ce4499d33d021bb19';
    const requestUrl = `${this.baseUrl}characters`;
    return this._httpClient.get<MarvelApi>(requestUrl, {params: {...queryParams, apikey}})
  }
}
