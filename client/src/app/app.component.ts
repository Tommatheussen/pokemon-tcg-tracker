import { Component } from '@angular/core';
import { UpdaterService } from './updater.service';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'pokemon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private updaterService: UpdaterService,
    private electronService: ElectronService
  ) { 
    this.electronService.ipcRenderer.on('about', () => {
      console.log('about');
    });
  }
}
