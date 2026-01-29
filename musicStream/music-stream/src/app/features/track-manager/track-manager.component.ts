import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { TrackService } from '../../core/services/track.service';
import { CreateTrackDTO, MusicCategory } from '../../core/models/track';
import { Title } from '@angular/platform-browser';
import { getAudioDuration } from '../../shared/utils/audio-file.utils';
@Component({
  selector: 'app-track-manager',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './track-manager.component.html',
  styleUrl: './track-manager.component.scss'
})
export class TrackManagerComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  protected trackService = inject(TrackService);


  categories: MusicCategory[] = ['Pop', 'Rock', 'Rap', 'Jazz', 'Classical', 'Electro', 'Other'];

  selectedAudioFile: File | null = null;
  selectedCoverFile: File | null = null;

  isEditMode = false;
  trackId: number | null = null;
  existingTrack: any = null;

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
        } else {
          this.router.navigate(['/library']);
        }
      },
      error: () => this.router.navigate(['/library'])
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
    if (this.trackForm.invalid || !this.selectedAudioFile) {
      this.trackForm.markAllAsTouched();
      return;
    }

    if (!this.isEditMode && !this.selectedAudioFile) {
      alert('Veuillez sélectionner un fichier audio.');
      return;
    }
    
    const formValue = this.trackForm.value;
    let duration = this.existingTrack?.duration || 0;
    if (this.selectedAudioFile) {
      duration = await getAudioDuration(this.selectedAudioFile);
    }

    try {

      if (this.isEditMode) {
        const updatedTrack: any = {
          id: this.trackId,
          title: formValue.title!,
          artist: formValue.artist!,
          category: formValue.category!,
          description: formValue.description || '',
          file: this.selectedAudioFile || this.existingTrack.file,
          cover: this.selectedCoverFile || this.existingTrack.cover,
          duration: duration,
          addedDate: this.existingTrack.addedDate
        };
        await this.trackService.updateTrack(updatedTrack);
        this.router.navigate(['/library']);

      } else {
        const metadata: CreateTrackDTO = {
          title: formValue.title!,
          artist: formValue.artist!,
          category: formValue.category as MusicCategory,
          description: formValue.description || '',
          cover: this.selectedCoverFile || undefined

        }
        await this.trackService.addTrack(this.selectedAudioFile, metadata);
        if (this.trackService.status() === 'success') {
          this.router.navigate(['/library']);
        }
      }
    } catch (error) {

    }


  }


}
