import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MarvelResults, RxjsWorkshopTableService} from "./rxjs-workshop-table.service";

@Component({
  selector: 'app-rxjs-workshop-table',
  templateUrl: './rxjs-workshop-table.component.html',
  styleUrls: ['./rxjs-workshop-table.component.css']
})
export class RxjsWorkshopTableComponent implements AfterViewInit, OnInit {
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['select', 'name', 'description','image', 'modified'];
  data: MarvelResults[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rxjsWorkshopTableService: RxjsWorkshopTableService) {}

  ngOnInit() {
    this.rxjsWorkshopTableService.getMarvelCharaters().subscribe(
      results => {
        this.isLoadingResults = false;
        this.data = results.data.results;
      }
    )
  }

  ngAfterViewInit() {
  }
}
