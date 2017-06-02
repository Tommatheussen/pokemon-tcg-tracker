import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { HttpModule } from '@angular/http';

import { FormsModule } from '@angular/forms';


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
import { SettingsDialogComponent } from './settings/settings-dialog.component';

import { SettingsStore } from './database/settings.store';

import { settingsFactory } from './settings.factory';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuItemComponent,
    UpdateAvailableDialogComponent,
    SettingsDialogComponent
  ],
  imports: [
    NgxElectronModule,
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    MdlModule,
    NgxDatatableModule,
    FormsModule
  ],
  providers: [
    SettingsService,
    UpdaterService,
    SetService,
    CardService,
    CollectionService,
    SettingsStore,
    {
      provide: APP_INITIALIZER,
      useFactory: settingsFactory,
      deps: [SettingsStore],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UpdateAvailableDialogComponent,
    SettingsDialogComponent
  ]
})
export class AppModule { }
