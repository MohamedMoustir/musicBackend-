import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDetailComponent } from './track-detail.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('TrackDetailComponent', () => {
  let component: TrackDetailComponent;
  let fixture: ComponentFixture<TrackDetailComponent>;
const initialState = {
    tracks: {
      tracks: [],
      loading: false,
      error: null
    }
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackDetailComponent],
      providers: [
        provideMockStore({initialState})
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
