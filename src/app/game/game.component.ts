import { Component, OnInit } from '@angular/core';
import { Grid } from '../grid';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  grid: Grid = {
    columns: [
      ['Individuals', 'hailing', 'on the phone'],
      ['Groups', 'booking', 'in the street'],
      ['Companies', 'scheduling', 'online']
    ]
  };

  constructor() {
  }

  ngOnInit() {
  }

}
