import { Component, OnInit } from '@angular/core';
import { GridWithStatus } from '../grid';

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const defaultGrid: GridWithStatus = {
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
      { word: 'unlicensed taxis', selected: false },
      { word: 'for a long ride', selected: false },
    ],
    [
      { word: 'objects', selected: false },
      { word: '', selected: false },
      { word: 'online', selected: false },
      { word: 'approved', selected: false },
      { word: 'private drivers', selected: false },
      { word: '', selected: false },
    ],
  ],
};

function combos(list: string[][], n = 0, result = [], current = []) {
  if (n === list.length) result.push(current);
  else list[n].forEach(item => combos(list, n + 1, result, [...current, item]));

  return result;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss'],
})
export class SimpleComponent implements OnInit {
  toggles = {
    showInstructions: false,
    isEditing: false,
    isAutomaticModeEnabled: false,
  };

  grid: GridWithStatus = defaultGrid;
  savedCombinations: { combinationKey: number[]; words: string[] }[] = [];
  private randomCombinations: number[][] = [];

  constructor() {
  }

  ngOnInit() {
    this.loadCurrentGrid();
    this.generateRandomCombinations();
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
        .filter(item => item.selected),
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

  makeEmpty() {
    if (confirm('Are you sure?')) {
      this.grid.columns.forEach(column => column.forEach(item => {
        item.selected = false;
        item.word = '';
      }));
    }
  }

  reset() {
    if (confirm('Are you sure?')) {
      this.grid = defaultGrid;
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
    this.generateRandomCombinations();
    this.saveCurrentGrid();
    this.resetSavedCombinations();
  }

  transpose(array: any[]) {
    return array[0].map((col, i) => array.map(column => column[i]));
  }

  getNumberOfCombinations(): number {
    const rows = this.transpose(this.grid.columns);
    return rows.reduce((acc, row) => acc * row.length, 1);
  }

  generateRandomCombinations(): void {
    this.randomCombinations = shuffle(combos(this.transpose(this.grid.columns).map(row => row.filter(item => item.word !== '').map((_, index) => index))));
  }

  pickRandom(): void {
    if (this.randomCombinations.length === 0) {
      alert('No more mutations available');
      return;
    }
    const row = this.randomCombinations.shift();
    row.forEach((columnIndex, wordIndex) => {
      this.selectWord(columnIndex, wordIndex);
    });
  }

  loadCurrentGrid(): any {
    const savedGrid = localStorage.getItem('grid');
    if (savedGrid) {
      this.grid = JSON.parse(savedGrid);
    }
  }

  saveCurrentGrid(): void {
    localStorage.setItem('grid', JSON.stringify(this.grid))
  }

  saveCombination(): void {
    const alreadySaved = this.savedCombinations.some(combination => combination.combinationKey.join('') === this.getSelectedIndexes().join(''))
    if (alreadySaved) {
      alert('Mutation already saved.');
      return;
    }
    this.savedCombinations.push({ combinationKey: this.getSelectedIndexes(), words: this.getSelectedWords() });
  }

  resetSavedCombinations(): void {
    this.savedCombinations = [];
  }

  exportAsCsv(): void {
    const currentGridAsCsv = this.grid.columns.map((column, index) => `${column.map(item => item.word !== '' ? index + 1 : 'x').join('')},${column.map(item => item.word).join(',')}`).join('\n');
    const savedRowsAsCsv = this.savedCombinations.map(combination => `${combination.combinationKey.join('')},${combination.words.join(',')}`).join('\n');
    download('mutation-game-saved-combinations.csv', `${currentGridAsCsv}\n\n${savedRowsAsCsv}`);
  }
}
