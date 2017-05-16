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

  seed(): void {
	  this.setService.seed();
	}

  constructor(private setService: SetService, private cardService: CardService) {
    this.getSets();
   }

  tableData = [
    { name: 'Test', id: 1, selected: true },
    { name: 'Tom', id: 3 , selected: false}
  ];

  public tableModel = new MdlDefaultTableModel([
    { key: 'name', name: 'Name', sortable: true },
    { key: 'id', name: 'Pokedex', sortable: true }
  ]);

  ngOnInit(): void {
    //this.tableModel.addAll(this.tableData);
    //this.tableModel.data = this.tableData;

    /*let set = this.setService.get();

    set.subscribe(sets => {
      this.sets = sets;
      console.log(sets);
    }, error => console.log(error), () => {
      console.log('finished');
      this.loading = false
    });*/
      //.subscribe((sets, err, finished) => this.sets = sets);
		 // .subscribe(sets => this.sets = sets );
      //.map((res: Response) => res.json())
      //.subscribe(sets => this.sets = sets);
    
    //this.getSets();
  }

  getSets() {
    /*Observable.bindNodeCallback(this.setService._sets.find({}).exec)()
      .subscribe(sets => {
        console.log(sets);
        this.sets = sets;
      })*/

    
   this.sets = this.setService.get()
      /*.subscribe(setlist => {
        console.log(setlist);
        this.sets = setlist
      });*/
  }

  setSelected(set): void {
    this.selectedSet = set.name;

    this.cards = this.cardService.get(set.code);
    this.cards.subscribe(cards => {
      this.tableModel.data = <IMdlTableModelItem[]>cards;
    })
   
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