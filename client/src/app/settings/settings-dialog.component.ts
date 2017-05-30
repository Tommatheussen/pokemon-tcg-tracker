import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from '@angular-mdl/core';

@Component({
  selector: 'pokemon-settings-dialog-component',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent {
  constructor(private dialog: MdlDialogReference){ }

  public cancel(): void {
    this.dialog.hide(false);
  }

  public save(): void {
    //TODO: save
    //this.dialog.hide(true);
  }
}
