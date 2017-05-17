import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

import { MdlDefaultTableModel, IMdlTableModelItem } from '@angular-mdl/core';

import { SetService } from '../set.service';
import { CardService } from '../card.service';

import { Observable } from 'rxjs';
import { Set } from '../set.interface';
import { Card } from '../card.interface';

@Component({
  selector: 'pokemon-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements AfterViewInit {
  @Input() set: Set;
  @Output() selectSet = new EventEmitter<Set>();

	public count: number = 0;

  constructor(private setService: SetService, private cardService: CardService) {  }

  tableData = [
    { name: 'Test', id: 1, selected: true },
    { name: 'Tom', id: 3 , selected: false}
  ];

  public tableModel = new MdlDefaultTableModel([
    { key: 'name', name: 'Name', sortable: true },
    { key: 'id', name: 'Pokedex', sortable: true }
  ]);

  ngAfterViewInit(): void {
	  this.cardService.countCollected(this.set.code)
		  .subscribe(count => {
			  this.count = count;
		  });
  }

  select() {
    this.selectSet.emit(this.set);
  }
}