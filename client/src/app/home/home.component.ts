import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/map';

import { SelectionModel } from '@angular/cdk/collections';
import { Component, NgZone, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { CardPreviewOverlayRef } from '../card-preview/card-preview-overlay.ref';
import { CardPreviewOverlayService } from '../card-preview/card-preview.service';
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
    private _electronService: ElectronService,
    private _zone: NgZone,
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

    this._electronService.ipcRenderer.send('sets:load');

    this.displayedColumns = this.defaultColumns.slice();
  }

  collect(event, cardId) {
    event.stopPropagation();
    this.collectCard(cardId);
  }

  collectCard(cardId) {
    this._electronService.ipcRenderer.send('collection:new', {
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
  }

  selectSet(set: Set) {
    if (!this.selectedSet || this.selectedSet.code !== set.code) {
      this.cards$.next(null);
      this.selectedSet = set;
      if (this.editing) {
        this.switchMode();
      }
      this._electronService.ipcRenderer.send('cards:load', {
        setCode: set.code
      });
      this._electronService.ipcRenderer.send('collection:load', {
        setCode: set.code
      });

      this._electronService.ipcRenderer.once(
        `sets:symbol:${set.code}`,
        (event, args) => {
          this.img$.next(`data:image/png;base64,${args}`);
        }
      );

      this._electronService.ipcRenderer.send('sets:load:symbol', {
        setCode: set.code
      });
    }
  }

  private _setupSetlistHandler() {
    this._electronService.ipcRenderer.once(
      'sets:list',
      (event, sets: Set[]) => {
        this.sets.next(
          sets.sort((setA, setB) => {
            return new Date(setA.releaseDate) < new Date(setB.releaseDate)
              ? -1
              : 1;
          })
        );
      }
    );
  }

  private _setupCardlistHandler() {
    this._electronService.ipcRenderer.on(
      'cards:list',
      (event, cards: Card[]) => {
        this._zone.run(() => {
          this.cards$.next(
            cards.sort((cardA, cardB) => {
              return cardA.number - cardB.number;
            })
          );
        });
      }
    );
  }

  private _setupCollectionListHandler() {
    this._electronService.ipcRenderer.on(
      'collection:list',
      (event, collection: Collection[]) => {
        this._zone.run(() => {
          this.collection = collection.reduce((accumulator, collectedCard) => {
            accumulator[collectedCard.cardId] = collectedCard.collectionDate;
            return accumulator;
          }, {});
        });
      }
    );
  }
}
