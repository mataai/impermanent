import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Track } from '../track.dto';

@Component({
  selector: 'app-listen',
  template: `
    <button (click)="onPlay()">></button>
    <div>
      <h3>{{ trackInfo.title }}</h3>
      <p>{{ trackInfo.artiste }}</p>
    </div>
    <audio
      controls
      [src]="'https://matai-backend.impermanent.sandbox.cedille.club/stream/' + trackId + '.mp3'"
      style="display:none;"
    >
      <source
        [src]="'https://matai-backend.impermanent.sandbox.cedille.club/stream/' + trackId + '.mp3'"
        type="audio/mpeg"
      />
    </audio>
  `,
  styles: [
    `
      button {
        font-size: 2rem;
        width: 4rem;
        border-color: transparent;
        background-color: rgba(128, 128, 0, 0.5); /* olive with 50% opacity */
        border-radius: 50px;
        padding: 0.5rem;
        margin: auto;
        cursor: pointer;
      }
    `,
  ],
})
export class ListenPage implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);

  public trackId: string | null = null;
  public trackInfo!: Track;

  // Reference to audio element
  public audioElement?: HTMLAudioElement;

  ngOnInit() {
    this.trackId = this._activatedRoute.snapshot.paramMap.get('id');

    fetch(`https://matai-backend.impermanent.sandbox.cedille.club/track/${this.trackId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Track info:', data);
        this.trackInfo = data;
      })
      .catch((error) => {
        console.error('Error fetching track info:', error);
      });

    // Optionally fetch track info here if needed
    this.audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (this.audioElement) {
      this.audioElement.src = `https://matai-backend.impermanent.sandbox.cedille.club/stream/${this.trackId}`;
      this.audioElement.load();
    }
  }

  public onPlay() {
    if (!this.trackId) {
      console.error('No track ID found');
      return;
    }
    if (!this.audioElement) {
      console.error('Audio element not found');
      return;
    }
    this.audioElement.play();
  }
}
