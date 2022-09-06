import { TestBed } from '@angular/core/testing';

import { RxjsWorkshopTableService } from './rxjs-workshop-table.service';

describe('RxjsWorkshopTableServiceTsService', () => {
  let service: RxjsWorkshopTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxjsWorkshopTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
