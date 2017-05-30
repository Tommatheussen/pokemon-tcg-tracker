import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdlModule } from '@angular-mdl/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { SetService } from './set.service';
import { CardService } from './card.service';
import { CollectionService } from './collection.service';
import { MenuItemComponent } from './menu-item/menu-item.component';

import { UpdaterService } from './updater.service';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { NgxElectronModule } from 'ngx-electron';

import { UpdateAvailableDialogComponent } from './dialog/update-available-dialog.component';

import { RouterModule } from '@angular/router';

import { TestrouteComponent } from './testroute.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuItemComponent,
    TestrouteComponent,
    UpdateAvailableDialogComponent
  ],
  imports: [
    NgxElectronModule,
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    MdlModule,
    NgxDatatableModule,
    RouterModule.forRoot([
      {
        path: 'test-route',
        component: TestrouteComponent
      },
      {
        path: 'home',
        component: HomeComponent
      }
    ])
  ],
  providers: [
    UpdaterService,
    SetService,
    CardService,
    CollectionService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UpdateAvailableDialogComponent
  ]
})
export class AppModule { }