import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';

import { MdlDefaultTableModel } from '@angular-mdl/core';

import { SetService } from '../set.service';
import { CardService } from '../card.service';
import { CollectionService } from '../collection.service';

import { Observable } from 'rxjs';
import { Set } from '../set.interface';
import { Card } from '../card.interface';
import { Collection } from '../collection.interface';

@Component({
  selector: 'pokemon-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  @ViewChild('collectionTmpl') collectionTmpl: TemplateRef<any>;

  public sets: Observable<Set[]>;
  public selectedSet: string;

  public columns = [];

  public cards: Card[];

  constructor(
    private setService: SetService,
    private cardService: CardService,
    private collectionService: CollectionService
  ) { }

  ngOnInit(): void {
    this.getSets();

    this.columns = [
      { name: 'Number' },
      { name: 'Name' },
      { name: 'Rarity' },
      { name: 'Series' },
      { name: 'Set' },
      {
        name: 'Collected',
        cellTemplate: this.collectionTmpl,
        comparator: this.dateComparator.bind(this)
      }
    ];
  }

  dateComparator(dateA: Date, dateB: Date) {
    if (dateB < dateA) return 1;
    else if (dateB > dateA) return -1;
    return 0;
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

  getRowClass(row) {
    return {
      'collected': row.collected != null
    }
  }

  collectCard(card) {
    this.collectionService.collectCard(card)
      .subscribe((collection) => {
        card.collected = new Date();
      });
  }

  selectSet(set: Set) {
    this.selectedSet = set.name;

    Observable.zip(
      this.cardService.get(set)
        .map(cards => {
          cards.sort((a: Card, b: Card) => {
            return a.number - b.number;
          });
          return cards;
        }),
      this.collectionService.get(set.code)
    )
      .subscribe(([cards, collection]) => {
        this.cards = cards;
        collection.forEach(collectedEntry => {
          var foundCard = cards.find(function (card) {
            return card.id == collectedEntry.card;
          });

          foundCard.collected = collectedEntry.collected;
        });
      });
  }
}