import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackDetailComponent } from './track-detail.component';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TrackService } from '../../core/services/track.service';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { Store } from '@ngrx/store';
import { deleteTrack } from '../../core/store/track.actions';
import { MusicCategory, Track } from '../../core/models/track';

describe('TrackDetailComponent', () => {
  let component: TrackDetailComponent;
  let fixture: ComponentFixture<TrackDetailComponent>;
  let trackServiceMock: any;
  let playerServiceMock: any;
  let router: Router;

  const mockTrack: Track = { 
    id: 1, 
    title: 'Test Song', 
    artist: 'Artist', 
    coverUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    category: 'Pop' as MusicCategory, 
    addedDate: '2026-02-02T10:00:00Z',
    streamUrl: 'http://...',
    description: 'Test'
  };

  beforeEach(async () => {
    trackServiceMock = {
      getTrackById: jasmine.createSpy('getTrackById').and.returnValue(of(mockTrack))
    };
    
    playerServiceMock = {
      playTrack: jasmine.createSpy('playTrack'),
      currentTrack: jasmine.createSpy('currentTrack').and.returnValue(of(mockTrack)) 
    };

   
    await TestBed.configureTestingModule({
      imports: [TrackDetailComponent, HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState: { tracks: { tracks: [], loading: false, error: null } } }),
        { provide: TrackService, useValue: trackServiceMock },
        { provide: AudioPlayerService, useValue: playerServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => '1' } }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TrackDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load track data on init', () => {
    expect(trackServiceMock.getTrackById).toHaveBeenCalledWith(1);
    expect(component.track).toEqual(mockTrack);
  });

  it('should call playerService when play is clicked', () => {
    component.track = mockTrack;
    component.play();
    expect(playerServiceMock.playTrack).toHaveBeenCalledWith(mockTrack, [mockTrack]);
  });

  it('should navigate to library if track not found', () => {
    const navigateSpy = spyOn(router, 'navigate');
    trackServiceMock.getTrackById.and.returnValue(of(null)); 
    
    component.ngOnInit(); 
    
    expect(navigateSpy).toHaveBeenCalledWith(['/library']);
  });

  it('should dispatch deleteTrack action when confirmed', () => {
    const store = TestBed.inject(Store);
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(window, 'confirm').and.returnValue(true); 
    const navigateSpy = spyOn(router, 'navigate');

    component.track = mockTrack;
    component.delete();

    expect(dispatchSpy).toHaveBeenCalledWith(deleteTrack({ id: mockTrack.id }));
    expect(navigateSpy).toHaveBeenCalledWith(['/library']);
  });

});