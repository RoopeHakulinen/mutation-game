import { Component, OnInit } from '@angular/core';
import { GridWithStatus } from '../grid';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss']
})
export class SimpleComponent implements OnInit {
  grid: GridWithStatus = {
    columns: [
      [
        { word: 'Individuals', selected: false },
        { word: 'hailing', selected: false },
        { word: 'on the phone', selected: false }
      ],
      [
        { word: 'Groups', selected: false },
        { word: 'booking', selected: false },
        { word: 'in the street', selected: false }
      ],
      [
        { word: 'Companies', selected: false },
        { word: 'scheduling', selected: false },
        { word: 'online', selected: false }
      ]
    ]
  };
  isEditing = true;

  constructor() {
  }

  ngOnInit() {
  }

  selectWord(columnIndex: number, rowIndex: number) {
    this.grid.columns.forEach((column, currentColumnIndex) => column.forEach((item, currentRowIndex) => {
      if (currentRowIndex === rowIndex) {
        item.selected = currentColumnIndex === columnIndex;
      }
    }));
  }

  getSelectedWords() {
    return this.transpose(this.grid.columns)
      .map(row => row
        .filter(item => item.selected)
        .map(item => item.word)
      ).map(items => items[0]).filter(word => word && word.length);
  }

  addRow() {
    this.grid.columns.forEach(column => column.push({ word: '', selected: false }));
  }

  addColumn() {
    this.grid.columns.push(Array(this.grid.columns[0].length).fill(''));
  }

  reset() {
    if (confirm('Are you sure?')) {
      this.grid.columns.forEach(column => column.forEach(item => {
        item.selected = false;
        item.word = '';
      }));
    }
  }

  transpose(array: any[]) {
    return array[0].map((col, i) => array.map(column => column[i]));
  }
}
