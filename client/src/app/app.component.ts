import { Component } from '@angular/core';
import { UpdaterService } from './updater.service';
@Component({
  selector: 'pokemon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private updaterService: UpdaterService) { }
}
