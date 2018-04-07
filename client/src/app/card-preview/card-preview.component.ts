import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs/Subject';

import { CardPreviewOverlayRef } from './card-preview-overlay.ref';
import { CARD_PREVIEW_OVERLAY_DATA, CardData } from './card-preview-overlay.tokens';

@Component({
  selector: 'card-preview-overlay',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.css']
})
export class CardPreviewOverlayComponent implements OnInit {
  img$: Subject<string> = new Subject<string>();

  constructor(
    public dialogRef: CardPreviewOverlayRef,
    @Inject(CARD_PREVIEW_OVERLAY_DATA) public cardData: CardData,
    private _electronService: ElectronService,
    private _zone: NgZone
  ) {}

  ngOnInit() {
    this._electronService.ipcRenderer.once(
      `cards:image:${this.cardData.setCode}-${this.cardData.cardNumber}`,
      (event, args) => {
        this._zone.run(() => {
          this.img$.next(`data:image/png;base64,${args}`);
        });
      }
    );
    this._electronService.ipcRenderer.send('cards:load:image', {
      setCode: this.cardData.setCode,
      cardNumber: this.cardData.cardNumber
    });
  }
}
