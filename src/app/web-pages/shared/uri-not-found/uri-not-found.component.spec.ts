import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UriNotFoundComponent } from './uri-not-found.component';

describe('UriNotFoundComponent', () => {
  let component: UriNotFoundComponent;
  let fixture: ComponentFixture<UriNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UriNotFoundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UriNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
