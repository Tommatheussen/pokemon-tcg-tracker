import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Set } from '../models/set.interface';

@Component({
  selector: 'pokemon-set-item',
  templateUrl: './set-item.component.html',
  styleUrls: ['./set-item.component.scss']
})
export class SetItemComponent implements OnInit {
  @Input() set: Set;
  @Input() last: boolean;

  count: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private _electronService: ElectronService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._electronService.ipcRenderer.once(
      `collection:count:${this.set.code}`,
      (event, args) => {
        this.count.next(args);
        this._cd.detectChanges();
      }
    );

    this._electronService.ipcRenderer.on(
      `collection:added:${this.set.code}`,
      (event, args) => {
        let value = this.count.value;
        this.count.next(++value);
      }
    );

    this._electronService.ipcRenderer.send('collection:count', {
      setCode: this.set.code
    });
  }
}
