import { Component, OnInit } from '@angular/core';
import { GridWithStatus } from '../grid';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss']
})
export class SimpleComponent implements OnInit {
  toggles = {
    showInstructions: false,
    isEditing: false
  };

  grid: GridWithStatus = {
    columns: [
      [
        { word: 'individuals', selected: true },
        { word: 'hailing', selected: true },
        { word: 'in the street', selected: true },
        { word: 'random', selected: true },
        { word: 'licensed taxis', selected: true },
        { word: 'for a short ride', selected: true },
      ],
      [
        { word: 'groups', selected: false },
        { word: 'booking ahead', selected: false },
        { word: 'on the phone', selected: false },
        { word: 'known', selected: false },
        { word: 'unlicensed', selected: false },
        { word: 'for a long ride', selected: false }
      ],
      [
        { word: 'companies', selected: false },
        { word: '', selected: false },
        { word: 'online', selected: false },
        { word: 'approved', selected: false },
        { word: 'private drivers', selected: false },
        { word: '', selected: false },
      ]
    ]
  };

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

  getSelected() {
    return this.transpose(this.grid.columns)
      .map(row => row
        .map((item, index) => ({ word: item.word, index, selected: item.selected }))
        .filter(item => item.selected)
      ).map(items => items[0]).filter(item => item && item.word && item.word.length);
  }

  getSelectedWords() {
    return this.getSelected().map(item => item.word);
  }

  getSelectedIndexes() {
    return this.getSelected().map(item => item.index + 1);
  }

  addRow() {
    this.grid.columns.forEach((column, index) => column.push({ word: '', selected: index === 0 }));
  }

  addColumn() {
    this.grid.columns.push(Array(this.grid.columns[0].length).fill('').map(() => ({ word: '', selected: false })));
  }

  deleteColumn() {
    if (this.grid.columns.length === 1) {
      return;
    }
    this.grid.columns.splice(-1, 1);
  }

  deleteRow() {
    if (this.grid.columns[0].length === 1) {
      return;
    }
    this.grid.columns.forEach(column => column.splice(-1, 1));
  }

  reset() {
    if (confirm('Are you sure?')) {
      this.grid.columns.forEach(column => column.forEach(item => {
        item.selected = false;
        item.word = '';
      }));
    }
  }

  resetSelected() {
    this.grid.columns.forEach((column, currentColumnIndex) =>
      column.forEach((item) => {
        item.selected = currentColumnIndex === 0;
      }));
  }

  toggleEdit() {
    this.toggles.isEditing = !this.toggles.isEditing;
    this.resetSelected();
  }

  transpose(array: any[]) {
    return array[0].map((col, i) => array.map(column => column[i]));
  }

  getNumberOfCombinations(): number {
    const rows = this.transpose(this.grid.columns);
    return rows.reduce((acc, row) => acc * row.length, 1);
  }
}
