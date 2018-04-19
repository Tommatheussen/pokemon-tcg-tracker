import { SelectionModel } from '@angular/cdk/collections';
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

  defaultColumns: string[] = [
    'number',
    'name',
    'rarity',
    'supertype',
    'collected'
  ];

  displayedColumns: string[];

  selection = new SelectionModel<Card>(true, []);

  editing = false;

  public sets: BehaviorSubject<Set[]> = new BehaviorSubject(null);
  public selectedSet: Set;

  public cards$: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>(null);
  img$: Subject<string> = new Subject<string>();

  constructor(
    private _ipcService: IpcService,
    private _cardPreviewOverlayService: CardPreviewOverlayService
  ) {}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.cards$.getValue().length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.cards$.getValue().forEach(row => this.selection.select(row));
  }

  switchMode() {
    this.editing = !this.editing;
    if (this.editing) {
      this.displayedColumns.unshift('select');
    } else {
      this.selection.clear();
      this.displayedColumns = this.defaultColumns.slice();
    }
  }
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

    this.displayedColumns = this.defaultColumns.slice();
  }

  collect(event, cardId) {
    event.stopPropagation();
    this.collectCard(cardId);
  }

  collectCard(cardId) {
    this._ipcService.sendMessage('collection:new', {
      setCode: this.selectedSet.code,
      cardId: cardId
    });

    this.collection[cardId] = new Date();
  }

  collectAll() {
    this.selection.selected.forEach((card: Card) => {
      if (!this.collection[card.id]) {
        this.collectCard(card.id);
      }
    });
    this.switchMode();
  }

  selectSet(set: Set) {
    if (!this.selectedSet || this.selectedSet.code !== set.code) {
      this.cards$.next(null);
      this.selectedSet = set;
      if (this.editing) {
        this.switchMode();
      }
      this._ipcService.sendMessage('cards:load', {
        setCode: set.code
      });
      this._ipcService.sendMessage('collection:load', {
        setCode: set.code
      });

      this._ipcService.setupIpcListenerOnce(
        `sets:symbol:${set.code}`,
        (event, args) => {
          this.img$.next(`data:image/png;base64,${args}`);
        }
      );

      this._ipcService.sendMessage('sets:load:symbol', {
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
