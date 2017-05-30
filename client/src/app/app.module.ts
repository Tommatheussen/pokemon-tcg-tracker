import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdlModule } from '@angular-mdl/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { SetService } from './database/set.service';
import { CardService } from './database/card.service';
import { CollectionService } from './database/collection.service';
import { MenuItemComponent } from './menu-item/menu-item.component';

import { UpdaterService } from './update/updater.service';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { NgxElectronModule } from 'ngx-electron';

import { SettingsService } from './settings/settings.service';

import { UpdateAvailableDialogComponent } from './update/update-available-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuItemComponent,
    UpdateAvailableDialogComponent
  ],
  imports: [
    NgxElectronModule,
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    MdlModule,
    NgxDatatableModule
  ],
  providers: [
    SettingsService,
    UpdaterService,
    SetService,
    CardService,
    CollectionService,
    {
      provide: APP_INITIALIZER,
      useFactory: (settingsService: SettingsService) => () => settingsService.init(),
      deps: [SettingsService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UpdateAvailableDialogComponent
  ]
})
export class AppModule { }
