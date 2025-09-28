import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterModule],
  template: `
    <div class="container">
      <div class="card">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [``],
})
export class ShellComponent {}
