import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/map';

import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Card } from '../models/card.interface';
import { Set } from '../models/set.interface';

@Component({
  selector: 'pokemon-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public sets: BehaviorSubject<Set[]> = new BehaviorSubject([]);
  public selectedSet: string;

  public cards: Card[];

  constructor(private _electronService: ElectronService) {}

  ngOnInit(): void {
    this._setupSetlistHandler();
    this._setupCardlistHandler();

    this._electronService.ipcRenderer.send('sets:load');
  }

  selectSet(set: Set) {
    if (this.selectedSet !== set.code) {
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
        console.log(cards);
      }
    );
  }
}
