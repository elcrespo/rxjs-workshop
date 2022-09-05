import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RxjsWorkshopTableComponent } from './rxjs-workshop-table.component';

describe('RxjsWorkshopTableComponent', () => {
  let component: RxjsWorkshopTableComponent;
  let fixture: ComponentFixture<RxjsWorkshopTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RxjsWorkshopTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RxjsWorkshopTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
