import { AfterViewInit, Component } from '@angular/core';
import { UpdaterService } from './update/updater.service';

@Component({
  selector: 'pokemon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constructor(private _updaterService: UpdaterService) {}

  ngAfterViewInit() {
    this._updaterService.setupHandlers();
  }
}
