import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDetailComponent } from './track-detail.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('TrackDetailComponent', () => {
  let component: TrackDetailComponent;
  let fixture: ComponentFixture<TrackDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackDetailComponent],
      providers: [
        provideMockStore({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
