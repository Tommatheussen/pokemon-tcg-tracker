import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

import { CardService } from '../card.service';

import { Set } from '../set.interface';

@Component({
  selector: 'pokemon-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements AfterViewInit {
  @Input() set: Set;
  @Output() selectSet = new EventEmitter<Set>();

	public count: number = 0;

  constructor(private cardService: CardService) {  }

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