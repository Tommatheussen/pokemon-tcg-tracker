import { InjectionToken } from '@angular/core';

export interface CardData {
  setCode: string;
  cardNumber: string;
}

export const CARD_PREVIEW_OVERLAY_DATA = new InjectionToken<CardData>(
  'CARD_PREVIEW_OVERLAY_DATA'
);
