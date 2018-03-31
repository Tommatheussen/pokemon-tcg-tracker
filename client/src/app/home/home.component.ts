import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/map';

import { Component, NgZone, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { Card } from '../models/card.interface';
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
    private _electronService: ElectronService,
    private _zone: NgZone
  ) {}

  ngOnInit(): void {
    this._setupSetlistHandler();
    this._setupCardlistHandler();

    this._electronService.ipcRenderer.send('sets:load');
  }

  collect(code) {
    this.collection[code] = new Date();
  }

  selectSet(set: Set) {
    if (this.selectedSet !== set.code) {
      this.cards$.next();
      this.selectedSet = set.code;
      this._electronService.ipcRenderer.send('cards:load', {
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
}
