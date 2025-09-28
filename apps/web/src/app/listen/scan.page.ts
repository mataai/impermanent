import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-scan',
  imports: [ZXingScannerModule],
  template: `
    <h1>Scan Page</h1>
    <p>This is the scan page content.</p>
    @if (errorMessage){
    <p style="color: red;">{{ errorMessage }}</p>
    }
    <zxing-scanner (scanSuccess)="scan($event)"></zxing-scanner>
  `,
  styles: `
    h1 {
      color: blue;
    }
  `,
})
export class ScanPage {
  private readonly _router = inject(Router);
  public errorMessage: string | null = null;
  public scan(qrContents: string) {
    try {
      const url = new URL(qrContents);
      const isListenUrl =
        url.host === window.location.host &&
        url.pathname.startsWith('/listen/');
      if (isListenUrl) {
        const id = url.pathname.split('/').pop();
        this._router.navigate(['/listen', id], {
          replaceUrl: true,
          state: { scanned: true }
        });
        this.errorMessage = null;
      } else {
        if (this.errorMessage == null) {
          this.errorMessage = 'Scanned QR code is not a valid listen URL.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Invalid URL scanned:', qrContents);
    }
  }
}
