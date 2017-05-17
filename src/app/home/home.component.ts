import { Component, OnInit } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

import { MdlDefaultTableModel, IMdlTableModelItem } from '@angular-mdl/core';

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

  public loading: Boolean = true;

  constructor(private setService: SetService, private cardService: CardService) { }

  public tableModel = new MdlDefaultTableModel([
    { key: 'name', name: 'Name', sortable: true },
    { key: 'id', name: 'Pokedex', sortable: true }
  ]);

  ngOnInit(): void {
    this.getSets();
    //this.tableModel.addAll(this.tableData);
    //this.tableModel.data = this.tableData;
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

    this.cards = this.cardService.get(set.code);
  }

  setSelected(set): void {
    /*this.cards.subscribe(cards => {
      this.tableModel.data = <IMdlTableModelItem[]>cards;
    })*/

/*
    this.http.get('/api/cards', { search: params })
      .map((res: Response) => res.json())
      .subscribe(cards => {
        this.tableModel.data = cards.cards;
      });

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
}