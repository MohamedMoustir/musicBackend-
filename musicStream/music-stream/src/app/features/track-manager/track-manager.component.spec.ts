import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackManagerComponent } from './track-manager.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('TrackManagerComponent', () => {
  let component: TrackManagerComponent;
  let fixture: ComponentFixture<TrackManagerComponent>;
  const initialState = {
    tracks: {
      tracks: [],
      loading: false,
      error: null
    }
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackManagerComponent],
      providers: [
        provideMockStore({initialState})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrackManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
