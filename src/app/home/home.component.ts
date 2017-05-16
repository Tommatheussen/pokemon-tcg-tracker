import { Component, OnInit } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

import { MdlDefaultTableModel } from '@angular-mdl/core';

import { SetService } from '../set.service';

@Component({
  selector: 'pokemon-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public sets;
  public cards;
  public selectedSet: string;

  seed(): void {
	  this.setService.seed();
	}

  constructor(private setService: SetService) {

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

	  this.setService.get()
		  .subscribe(sets => {
			  console.log(sets);
			  this.sets = sets
		  });
      //.map((res: Response) => res.json())
      //.subscribe(sets => this.sets = sets);
  }

  /*setSelected(set): void {
    let params = new URLSearchParams();
    params.append('setCode', set.code);

    this.selectedSet = set.name;

    this.http.get('/api/cards', { search: params })
      .map((res: Response) => res.json())
      .subscribe(cards => {
        this.tableModel.data = cards.cards;
      });

    this.http.get('/api/collection', { search: params })
      .map((res: Response) => res.json())
      .subscribe(collected => {

        console.log(collected);
      });
  }*/
}