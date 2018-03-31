import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { Settings } from '../models/setting.interface';

@Component({
  selector: 'pokemon-settings-dialog-component',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public settings: Settings) {}
  // public settings: Settings;
  // public settingsForm: FormGroup;

  // constructor(
  //   @Inject(SETTINGS) settings: Settings,
  //   private dialog: MdlDialogReference
  // ) {
  //   this.settings = settings;
  // }

  // public cancel(): void {
  //   this.dialog.hide(false);
  // }

  // public save(): void {
  //   this.dialog.hide(this.settings);
  // }
}
