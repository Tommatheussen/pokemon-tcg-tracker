import { Component } from '@angular/core';

import { SettingsService } from './settings/settings.service';
import { UpdaterService } from './update/updater.service';

@Component({
  selector: 'pokemon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private _updaterService: UpdaterService,
    private _settingsService: SettingsService
  ) {
    this._updaterService.setupHandlers();
    this._settingsService.setupHandlers();
  }
}
