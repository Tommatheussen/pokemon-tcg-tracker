import { Component } from '@angular/core';
import { UpdaterService } from './update/updater.service';

import { Router } from '@angular/router';

@Component({
  selector: 'pokemon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private router: Router,
    private updaterService: UpdaterService
  ) {
    this.updaterService.setupHandlers();
  }

  public goToTest(): void {
    this.router.navigate(['/test']);
  }

  public goToHome(): void {
    this.router.navigate(['/home']);
  }
}
