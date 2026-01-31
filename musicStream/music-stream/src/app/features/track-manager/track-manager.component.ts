import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { TrackService } from '../../core/services/track.service';
import { CreateTrackDTO, MusicCategory } from '../../core/models/track';
import { Title } from '@angular/platform-browser';
import { getAudioDuration } from '../../shared/utils/audio-file.utils';
import { Store } from '@ngrx/store';
import { addTrack, updateTrack } from '../../core/store/track.actions';
import { selectError, selectIsLoading } from '../../core/store/track.selectors';
@Component({
  selector: 'app-track-manager',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './track-manager.component.html',
  styleUrl: './track-manager.component.scss'
})
export class TrackManagerComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  protected trackService = inject(TrackService);
  private store = inject(Store);

  categories: MusicCategory[] = ['Pop', 'Rock', 'Rap', 'Jazz', 'Classical', 'Electro', 'Other'];
  selectedAudioFile: File | null = null;
  selectedCoverFile: File | null = null;
  isEditMode = false;
  trackId: number | null = null;
  existingTrack: any = null;
  loading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectError);
  trackForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    artist: ['', [Validators.required]],
    category: ['pop' as MusicCategory, [Validators.required]],
    description: ['', [Validators.maxLength(200)]]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.trackId = Number(id);
      this.loadTrackData(this.trackId);
    }
  }

  loadTrackData(id: number) {
    this.trackService.getTrackById(id).subscribe({
      next: (track) => {
        if (track) {
          this.existingTrack = track;
          this.trackForm.patchValue({
            title: track.title,
            artist: track.artist,
            category: track.category,
            description: track.description,
          });
        }
      },
    });
  }

  onAudioFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAudioFile = input.files[0];
    }
  }
  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedCoverFile = input.files[0];
    }
  }

  async onSubmit(): Promise<void> {
    if (this.trackForm.invalid) return;
    
    if (!this.isEditMode && !this.selectedAudioFile) {
      alert('Veuillez sélectionner un fichier audio.');
      return;
    }

    const formValue = this.trackForm.value;

    try {
      if (this.isEditMode) {
        const formData = new FormData();

        formData.append('title', formValue.title!);
        formData.append('artist', formValue.artist!);
        formData.append('category', formValue.category!);
        formData.append('description', formValue.description || '');

        if (this.selectedAudioFile) {
          formData.append('file', this.selectedAudioFile);
          const duration = await getAudioDuration(this.selectedAudioFile);
          formData.append('duration', duration.toString());
        }

        if (this.selectedCoverFile) {
          formData.append('cover', this.selectedCoverFile);
        }

        this.store.dispatch(updateTrack({ 
          trackId: this.trackId!, 
          formData: formData 
        }));

      } else {
        
        let duration = 0;
        if (this.selectedAudioFile) {
             duration = await getAudioDuration(this.selectedAudioFile);
        }

        const metadata: CreateTrackDTO = {
          title: formValue.title!,
          artist: formValue.artist!,
          category: formValue.category as MusicCategory,
          description: formValue.description || '',
          file: this.selectedAudioFile!,
          cover: this.selectedCoverFile || undefined
        };

        this.store.dispatch(addTrack({
          file: this.selectedAudioFile!,
          metadata
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la soumission', error);
    }
  }


}
