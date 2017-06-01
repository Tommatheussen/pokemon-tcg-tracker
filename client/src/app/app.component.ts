import { Component } from '@angular/core';
import { UpdaterService } from './update/updater.service';

@Component({
  selector: 'pokemon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private updaterService: UpdaterService
  ) {
    this.updaterService.setupHandlers();
  }
}
