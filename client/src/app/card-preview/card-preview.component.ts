import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs/Subject';

import { CardPreviewOverlayRef } from './card-preview-overlay.ref';
import { CARD_PREVIEW_OVERLAY_DATA, CardData } from './card-preview-overlay.tokens';

@Component({
  selector: 'card-preview-overlay',
  template: `<img *ngIf="img$ | async as img" [src]="img">`,
  styles: [
    `
    :host {
      display: block;
      background: white;
    }

    h1 {
      margin: 0;
      padding: 1em;
    }
  `
  ]
})
export class CardPreviewOverlayComponent implements OnInit {
  img$: Subject<string> = new Subject<string>();

  constructor(
    public dialogRef: CardPreviewOverlayRef,
    @Inject(CARD_PREVIEW_OVERLAY_DATA) public cardData: CardData,
    private _electronService: ElectronService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log(this.cardData);
    this._electronService.ipcRenderer.once(
      `cards:image:${this.cardData.setCode}-${this.cardData.cardNumber}`,
      (event, args) => {
        this.img$.next(`data:image/png;base64,${args}`);
        this._cd.detectChanges();
      }
    );
    this._electronService.ipcRenderer.send('cards:load:image', {
      setCode: this.cardData.setCode,
      cardNumber: this.cardData.cardNumber
    });
  }
}
