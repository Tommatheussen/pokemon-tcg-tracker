import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';

import { CardPreviewOverlayRef } from './card-preview-overlay.ref';
import { CARD_PREVIEW_OVERLAY_DATA, CardData } from './card-preview-overlay.tokens';
import { CardPreviewOverlayComponent } from './card-preview.component';

const DEFAULT_CONFIG: CardPreviewOverlayConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'ptcgt-card-preview-overlay-panel'
};

interface CardPreviewOverlayConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  data?: CardData;
}

@Injectable()
export class CardPreviewOverlayService {
  constructor(private _overlay: Overlay, private _injector: Injector) {}

  open(config: CardPreviewOverlayConfig = {}) {
    const overlayConfig = { ...DEFAULT_CONFIG, ...config };

    const overlayRef = this._createOverlay(overlayConfig);

    const dialogRef = new CardPreviewOverlayRef(overlayRef);

    const overlayComponent = this._attachDialogContainer(
      overlayRef,
      overlayConfig,
      dialogRef
    );

    overlayRef.backdropClick().subscribe(_ => dialogRef.close());

    return dialogRef;
  }

  private _createOverlay(config: CardPreviewOverlayConfig) {
    const overlayConfig = this._getOverlayConfig(config);

    return this._overlay.create(overlayConfig);
  }

  private _getOverlayConfig(config: CardPreviewOverlayConfig): OverlayConfig {
    const positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }

  private _attachDialogContainer(
    overlayRef: OverlayRef,
    config: CardPreviewOverlayConfig,
    dialogRef: CardPreviewOverlayRef
  ) {
    const injector = this._createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(
      CardPreviewOverlayComponent,
      null,
      injector
    );

    const containerRef: ComponentRef<
      CardPreviewOverlayComponent
    > = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private _createInjector(
    config: CardPreviewOverlayConfig,
    dialogRef: CardPreviewOverlayRef
  ): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(CardPreviewOverlayRef, dialogRef);
    injectionTokens.set(CARD_PREVIEW_OVERLAY_DATA, config.data);

    return new PortalInjector(this._injector, injectionTokens);
  }
}
