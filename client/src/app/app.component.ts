import { Component } from '@angular/core';

import { UpdaterService } from './update/updater.service';

@Component({
  selector: 'pokemon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private _updaterService: UpdaterService) {
    this._updaterService.setupHandlers();
  }
}
