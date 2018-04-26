import { AfterViewInit, Component, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IpcService } from '../ipc.service';
import { CardPreviewOverlayRef } from './card-preview-overlay.ref';
import {
  CARD_PREVIEW_OVERLAY_DATA,
  CardData
} from './card-preview-overlay.tokens';

@Component({
  selector: 'card-preview-overlay',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.css']
})
export class CardPreviewOverlayComponent implements AfterViewInit {
  img$: Subject<string> = new Subject<string>();

  constructor(
    public dialogRef: CardPreviewOverlayRef,
    @Inject(CARD_PREVIEW_OVERLAY_DATA) public cardData: CardData,
    private _ipcService: IpcService
  ) {}

  ngAfterViewInit() {
    this._ipcService.setupIpcListenerOnce(
      `cards:image:${this.cardData.setCode}-${this.cardData.cardNumber}`,
      (event, args) => {
        this.img$.next(`data:image/png;base64,${args}`);
      }
    );
    this._ipcService.sendMessage('cards:load:image', {
      setCode: this.cardData.setCode,
      cardNumber: this.cardData.cardNumber
    });
  }
}
