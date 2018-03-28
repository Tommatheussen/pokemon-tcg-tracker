import { MdlDialogReference } from '@angular-mdl/core';
import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Settings } from '../models/setting.interface';
import { SETTINGS } from '../models/settings.token';

@Component({
  selector: 'pokemon-settings-dialog-component',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  public settings: Settings;
  public settingsForm: FormGroup;

  constructor(
    @Inject(SETTINGS) settings: Settings,
    private dialog: MdlDialogReference
  ) {
    this.settings = settings;
  }

  public cancel(): void {
    this.dialog.hide(false);
  }

  public save(): void {
    this.dialog.hide(this.settings);
  }
}
