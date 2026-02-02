import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackManagerComponent } from './track-manager.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TrackService } from '../../core/services/track.service';
import { MusicCategory } from '../../core/models/track';

describe('TrackManagerComponent', () => {
  let component: TrackManagerComponent;
  let fixture: ComponentFixture<TrackManagerComponent>;
  let store: MockStore;
  let trackServiceMock: any;

  const initialState = {
    tracks: {
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    trackServiceMock = {
      getTrackById: jasmine.createSpy('getTrackById').and.returnValue(of(null))
    };

    await TestBed.configureTestingModule({
      imports: [
        TrackManagerComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: TrackService, useValue: trackServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } } 
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TrackManagerComponent);
    component = fixture.componentInstance;
    
    spyOn(store, 'dispatch');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent submission if form is invalid', async () => {
    component.trackForm.setValue({
      title: '', 
      artist: '',
      category: null,
      description: ''
    });

    await component.onSubmit();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

 
});