import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BullkOrderFormComponent } from './bullk-order-form.component';

describe('BullkOrderFormComponent', () => {
  let component: BullkOrderFormComponent;
  let fixture: ComponentFixture<BullkOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BullkOrderFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BullkOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
