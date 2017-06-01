import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from '@angular-mdl/core';
import { Settings } from '../models/setting.interface';

import { FormGroup } from '@angular/forms';

import { SETTINGS } from '../models/settings.token';

@Component({
  selector: 'pokemon-settings-dialog-component',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
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
