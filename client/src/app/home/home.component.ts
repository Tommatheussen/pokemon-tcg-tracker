import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/map';
import { CardPreviewOverlayRef } from '../card-preview/card-preview-overlay.ref';
import { CardPreviewOverlayService } from '../card-preview/card-preview.service';
import { IpcService } from '../ipc.service';
import { Card } from '../models/card.interface';
import { Collection } from '../models/collection.interface';
import { Set } from '../models/set.interface';

@Component({
  selector: 'pokemon-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  collection = {};

  displayedColumns: string[] = [
    'number',
    'name',
    'rarity',
    'supertype',
    'collected'
  ];

  public sets: BehaviorSubject<Set[]> = new BehaviorSubject(null);
  public selectedSet: string;

  public cards$: Subject<Card[]> = new Subject<Card[]>();

  constructor(
    private _ipcService: IpcService,
    private _cardPreviewOverlayService: CardPreviewOverlayService
  ) {}

  openDialog(setCode: string, cardNumber: string) {
    let dialogRef: CardPreviewOverlayRef = this._cardPreviewOverlayService.open(
      {
        data: {
          cardNumber,
          setCode
        }
      }
    );
  }

  ngOnInit(): void {
    this._setupSetlistHandler();
    this._setupCardlistHandler();
    this._setupCollectionListHandler();

    this._ipcService.sendMessage('sets:load');
  }

  collect(event, cardId) {
    event.stopPropagation();
    this._ipcService.sendMessage('collection:new', {
      setCode: this.selectedSet,
      cardId: cardId
    });

    this.collection[cardId] = new Date();
  }

  selectSet(set: Set) {
    if (this.selectedSet !== set.code) {
      this.cards$.next();
      this.selectedSet = set.code;
      this._ipcService.sendMessage('cards:load', {
        setCode: set.code
      });
      this._ipcService.sendMessage('collection:load', {
        setCode: set.code
      });
    }
  }

  private _setupSetlistHandler() {
    this._ipcService.setupIpcListenerOnce('sets:list', (event, sets: Set[]) => {
      this.sets.next(
        sets.sort((setA, setB) => {
          return new Date(setA.releaseDate) < new Date(setB.releaseDate)
            ? -1
            : 1;
        })
      );
    });
  }

  private _setupCardlistHandler() {
    this._ipcService.setupIpcListener('cards:list', (event, cards: Card[]) => {
      this.cards$.next(
        cards.sort((cardA, cardB) => {
          return cardA.number - cardB.number;
        })
      );
    });
  }

  private _setupCollectionListHandler() {
    this._ipcService.setupIpcListener(
      'collection:list',
      (event, collection: Collection[]) => {
        this.collection = collection.reduce((accumulator, collectedCard) => {
          accumulator[collectedCard.cardId] = collectedCard.collectionDate;
          return accumulator;
        }, {});
      }
    );
  }
}
