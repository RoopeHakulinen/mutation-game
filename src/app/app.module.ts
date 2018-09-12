import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatSlideToggleModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ContenteditableModule } from 'ng-contenteditable';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GridComponent } from './grid/grid.component';
import { SimpleComponent } from './simple/simple.component';

export const routes = [
  {
    path: '',
    component: SimpleComponent
  },
  {
    path: 'mutation-game',
    component: GridComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GridComponent,
    SimpleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FlexLayoutModule,
    ContenteditableModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
