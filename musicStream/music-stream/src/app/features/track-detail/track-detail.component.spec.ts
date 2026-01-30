import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDetailComponent } from './track-detail.component';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
     imports: [TrackDetailComponent, HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState: { tracks: { tracks: [], loading: false, error: null } } }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => '1' } }
          }
        }
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
