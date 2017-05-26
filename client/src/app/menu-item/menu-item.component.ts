import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

import { CollectionService } from '../collection.service';

import { Set } from '../models/set.interface';

@Component({
  selector: 'pokemon-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements AfterViewInit {
  @Input() set: Set;
  @Input() selectedSet: string;
  @Output() selectSet = new EventEmitter<Set>();

  public count = 0;

  constructor(private collectionService: CollectionService) { }

  ngAfterViewInit(): void {
    this.collectionService.countCollected(this.set.code)
      .subscribe(count => {
        this.count = count;
      });
  }

  select() {
    this.selectSet.emit(this.set);
  }
}
