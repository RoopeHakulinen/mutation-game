import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ContenteditableModule } from 'ng-contenteditable';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GridComponent } from './grid/grid.component';
import { DialogContentExampleDialog, SimpleComponent } from './simple/simple.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';

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
    SimpleComponent,
    DialogContentExampleDialog
  ],
  entryComponents: [DialogContentExampleDialog],
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
    MatButtonModule,
    MatDialogModule,
    MatSliderModule,
    HttpClientModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
