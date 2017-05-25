import { Component, Inject } from '@angular/core';

import { NOTES } from './notes.class';

@Component({
  selector: 'dialog-component',
  templateUrl: './dialog.component.html'
})
export class DialogComponent {
  constructor(@Inject(NOTES) notes: string) {
    console.log(notes);
  }
}