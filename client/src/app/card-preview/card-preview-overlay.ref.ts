import { OverlayRef } from '@angular/cdk/overlay';

export class CardPreviewOverlayRef {
  constructor(private _overlayRef: OverlayRef) {}

  close(): void {
    this._overlayRef.dispose();
  }
}
