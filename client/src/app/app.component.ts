import { Component, OnInit } from '@angular/core';

import { UpdaterService } from './update/updater.service';

@Component({
  selector: 'pokemon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private _updaterService: UpdaterService) {
    this._updaterService.setupHandlers();
  }

  ngOnInit() {}
}
