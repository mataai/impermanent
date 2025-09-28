import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { QRCodeComponent } from 'angularx-qrcode';
@Component({
  selector: 'app-upload',
  imports: [FormsModule, ReactiveFormsModule, RouterModule, QRCodeComponent],
  template: `
    @if (!songId) {
      <form class="form" [formGroup]="formGroup">
        @switch (step) {
          @case (1) {
            <label for="artiste">Nom de l'auteur</label>
            <input formControlName="artiste" />
            @if (formGroup.controls.artiste.invalid && formGroup.controls.artiste.touched) {
              <div class="error">Ce champ est requis.</div>
            }
            <label for="title">Titre de la chanson</label>
            <input formControlName="title" />
            @if (formGroup.controls.title.invalid && formGroup.controls.title.touched) {
              <div class="error">Ce champ est requis.</div>
            }
            <label for="paroles">Paroles</label>
            <textarea formControlName="paroles"></textarea>
            @if (formGroup.controls.paroles.invalid && formGroup.controls.paroles.touched) {
              <div class="error">Ce champ est requis.</div>
            }
          }
          @case (2) {
            <input type="file" #filePicker (change)="onImagePicked($event)" />
            @if (formGroup.controls.file.invalid && formGroup.controls.file.touched) {
              <div class="error">Un fichier audio est requis.</div>
            }
          }
          @case (3) {
            <textarea
              formControlName="message"
              placeholder="Message"
            ></textarea>
            @if (formGroup.controls.message.invalid && formGroup.controls.message.touched) {
              <div class="error">Ce champ est requis.</div>
            }
          }
        }

        <button type="button" (click)="onNext()">
          @if (step < 3) {
            Next
          } @else {
            Generer le code
          }
        </button>
      </form>
    } @else {
      <h3>Upload successful! Your song ID is ready to go!</h3>
      <p>Share this QR code or link to let others listen to your track:</p>
      <qrcode
        [qrdata]="this.qrContent"
        [width]="256"
        [errorCorrectionLevel]="'M'"
      ></qrcode>
    }
  `,
  styles: [
    `
      h1 {
        color: green;
      }
      .form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 400px;
        align-items: center;
        justify-content: center;
        margin: auto;
      }
      button {
        border-radius: 1.5rem;
        padding: 0.5rem 2rem;
        border-color: transparent;
        background-color: white;
        transition: box-shadow 0.2s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }
      button:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }
      .error {
        color: red;
        font-size: 0.8rem;
      }
      label {
        align-self: flex-start;
      }
      input,
      textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
      }
      textarea {
        min-height: 100px;
        resize: vertical;
      }
    `,
  ],
})
export class UploadPage {
  public readonly formGroup = new FormGroup({
    title: new FormControl<string>('', { validators: [Validators.required] }),
    paroles: new FormControl<string>('', { validators: [Validators.required] }),
    artiste: new FormControl<string>('', { validators: [Validators.required] }),
    file: new FormControl<File | null>(null, {
      validators: [Validators.required],
    }),
    message: new FormControl<string>('', { validators: [Validators.required] }),
  });
  public step = 1;
  public songId?: string;

  public get qrContent() {
    return window.location.origin + `/listen/${this.songId}`;
  }

  public onNext() {
    // Handle the next action, e.g., form submission or navigation
    if (
      this.step == 1 &&
      this.formGroup.controls.title.valid &&
      this.formGroup.controls.paroles.valid &&
      this.formGroup.controls.artiste.valid
    ) {
      this.step++;
    } else if (this.step == 2 && this.formGroup.controls.file.valid) {
      this.step++;
    } else if (this.step == 3 && this.formGroup.controls.message.valid) {
      if (!this.formGroup.valid) {
        console.error('Form is invalid', this.formGroup.errors);
        return;
      }
      // Post form to backend using FormData
      const formData = new FormData();
      const value = this.formGroup.value;
      formData.append('title', value.title ?? '');
      formData.append('paroles', value.paroles ?? '');
      formData.append('artiste', value.artiste ?? '');
      formData.append('message', value.message ?? '');
      // file should be appended as 'audio'
      if (value.file) {
        formData.append('audio', value.file);
      }
      fetch('http://localhost:3000/track', {
        method: 'POST',
        body: formData,
      })
        .then(async (data) => {
          this.songId = ((await data.json()) as { id: string }).id; // Replace with actual ID from response
        })
        .catch((err) => {
          console.error('Upload failed', err);
        });
    }
  }
  onImagePicked(event: Event) {
    const target = event!.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];

    this.formGroup.patchValue({ file: file });
  }
}
