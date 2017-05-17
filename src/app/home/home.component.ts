import { Component, OnInit } from '@angular/core';

import { MdlDefaultTableModel } from '@angular-mdl/core';

import { SetService } from '../set.service';
import { CardService } from '../card.service';

import { Observable } from 'rxjs';
import { Set } from '../set.interface';
import { Card } from '../card.interface';

@Component({
  selector: 'pokemon-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public sets: Observable<Set[]>;
  public cards: Observable<Card[]>;
  public selectedSet: string;

  constructor(private setService: SetService, private cardService: CardService) { }

  public columns = [{
    name: 'Name'
  }, {
    name: 'Number'
  }, {
    name: 'Rarity'
  }, {
    name: 'Series'
  }, {
    name: 'Set'
  }];

  public tableModel = new MdlDefaultTableModel([
    { key: 'name', name: 'Name', sortable: true },
    { key: 'number', name: 'Number', sortable: true },
    { key: 'rarity', name: 'Rarity', sortable: true },
    { key: 'series', name: 'Series', sortable: true },
    { key: 'set', name: 'Set', sortable: true }
  ]);

  ngOnInit(): void {
    this.getSets();
  }

  getSets() {
    this.sets = this.setService.get()
      .map((sets: Set[]) => {
        return sets.sort((a: Set, b: Set) => {
          if (new Date(b.releaseDate) < new Date(a.releaseDate)) return 1;
          else if (new Date(b.releaseDate) > new Date(a.releaseDate)) return -1;
          return 0;
        });
      });
  }

  selectSet(set: Set) {
    this.selectedSet = set.name;

    this.cards = this.cardService.get(set)
      .map(cards => {
        cards.sort((a: Card, b: Card) => {
          return a.number - b.number;
        });
        return cards;
      });
      /*.subscribe(cards => {
        cards.sort((a: Card, b: Card) => {
          return a.number - b.number;
        });

        //TODO: Load collection
        this.tableModel.data = cards;
      });*/
  }

  /*
      this.http.get('/api/collection', { search: params })
        .map((res: Response) => res.json())
        .subscribe(collected => {

          console.log(collected);

      if (this.cards && this.collected) {
        this.collected.forEach(collectedEntry => {
          var foundCard = this.cards.find(function (card) {
            return card.id == collectedEntry.card;
          });

          foundCard.collected = true;
        });
      }

      if (this.cards) {
        this.cards.sort(function (a, b) {
          return a.number - b.number;
        })

        this.tableModel.data = this.cards;
      }

      console.log(this.cards);
        });*/
}