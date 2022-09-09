import {Component, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {MarvelResults, RxjsWorkshopTableService} from "./rxjs-workshop-table.service";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-rxjs-workshop-table',
  templateUrl: './rxjs-workshop-table.component.html',
  styleUrls: ['./rxjs-workshop-table.component.css']
})
export class RxjsWorkshopTableComponent implements OnInit {
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['select', 'name', 'description','image', 'modified'];
  data: MarvelResults[] = [];
  isLoadingResults = true;
  isRateLimitReached = false;
  results$ = this.rxjsWorkshopTableService.results$;
  total$ = this.rxjsWorkshopTableService.total$;
  isLoadingData$ = this.rxjsWorkshopTableService.isLoadingData$;
  constructor(private rxjsWorkshopTableService: RxjsWorkshopTableService) {}

  ngOnInit() {
    this.rxjsWorkshopTableService.getMarvelCharacters().subscribe(
      results => {
        this.isLoadingResults = false;
        this.data = results.data.results;
      }
    )
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = ($event.target as HTMLInputElement).value;
    console.log('filter', filterValue);
    this.rxjsWorkshopTableService.setFilter(filterValue);
  }

  paginatorEvent($event: PageEvent) {
    console.log('paginatorEvent', $event);
    this.rxjsWorkshopTableService.setPaginator($event);
  }

  onSortChange($event: Sort) {
    console.log('sort change', $event);
    this.rxjsWorkshopTableService.setSort($event);
  }

  selectAll($event: MatCheckboxChange) {
    console.log('select all', $event);
  }

  onSelectRow(row: MarvelResults) {
    console.log('row selected', row);
  }
}
