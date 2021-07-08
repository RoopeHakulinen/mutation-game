import { Component, OnInit } from '@angular/core';
import { GridWithStatus } from '../grid';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'dialog-content-example-dialog',
  template: `
    <mat-dialog-content>
      <div class="instructions">
        <p style="text-align: left; margin-left: 20px;">Follow these 6 instructions & play the Mutation Game!</p>
        <ul>
          <li><b>Craft a Description:</b> toggle the edit mode, pick a meaningful string of 5 to 8 components that describe in
            one sentence the object to mutate, and write these in column 1. A component can contain more than one word when
            appropriate, e.g. ”for a short ride”, although one word is best. The empty button clears the grid on screen, and
            the restore button shows our default example (the London taxi industry).
          </li>
          <li><b>Generate Alternative Components:</b> generate a grid of alternative components, with 2 to 4 alternatives for
            each of the components in the initial description sentence. First add columns, write 5 or 6 alternative components
            for each row, shrink back to your preferred 2 to 4, and then remove unnecessary columns when you’re done. A square
            grid is best (i.e. without empty boxes). Toggle back the edit mode to secure your chosen grid.
          </li>
          <li><b>Pick Mutations & Generate Ideas:</b> a mutation is a sentence arrived at by selecting 1 component per row.
            Each mutation gets a unique number, made by listing the column numbers of the components it contains (nb: the
            mutation number of the initial description is a long string of “1”). Go through c. 50 mutations, spending 10 to 20
            seconds per mutation, to trigger creative ideas. You can have more than one idea per mutation, and many mutations
            can give rise to the same idea. Move on to a next mutation if drawing blank at any time.
          </li>
          <li><b>Choose Manual or Automatic mode:</b> in the manual mode, you have to construct each mutation yourself, by
            intentionally selecting 1 component per row by hand. The automatic mode is more like a Las Vegas slot machine,
            showing you a different randomly-generated mutation every time you press the random button. Automatic mode is a
            lot a fun, and sometimes yield revolutionary ideas. Manual mode is smarter, and always trigger great evolutionary
            ideas.
          </li>
          <li><b>Save and Review:</b> press the save button every time you see a mutation you like, and that mutation’s
            details (words + number) will be stored in a CSV file. Press the review button to download the file, with all your
            saved mutations. A new CSV file is restarted every time you edit a new grid.
          </li>
          <li><b>Package your Best Ideas:</b> summarize your best ideas in 2 to 4 words each, to convey them crisply and
            clearly. Add the unique mutation number of the mutation that triggered the idea for future recollection.
          </li>
        </ul>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
})
export class DialogContentExampleDialog {}

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
    isGenerationModeEnabled: false,
  };

  grid: GridWithStatus = defaultGrid;
  savedCombinations: { combinationKey: number[]; words: string[] }[] = [];
  generatedCombinations: number[][] = [];
  private randomCombinations: number[][] = [];

  constructor(private dialog: MatDialog, private httpClient: HttpClient) {
  }

  ngOnInit() {
    // Only used to kick up the sleeping Heroku backend
    this.makeRequestForGenerated('', 0).subscribe();
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
      this.grid = JSON.parse(JSON.stringify(defaultGrid));
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
    this.toggles.isAutomaticModeEnabled = false;
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

  nextGenerated(): void {
    if (this.generatedCombinations.length === 0) {
      alert('No more mutations available');
      return;
    }
    const row = this.generatedCombinations.shift();
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
    download('mutation-game-saved-mutations.csv', `${currentGridAsCsv}\n\n${savedRowsAsCsv}`);
  }

  showInstructions(): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  fetchGenerated(): void {
    this.generatedCombinations = [];
    const combinations = this.transpose(this.grid.columns).map(array => array.map(item => item.word).join(',').replace(',\n', '\n')).join('\n');
    const distance = this.transpose(this.grid.columns).reduce((acc, row) => acc + row.length - 1, 0) / 2;
    this.makeRequestForGenerated(combinations, distance)
      .subscribe(response => this.generatedCombinations = eval(response.replaceAll('(', '[').replaceAll(')', ']')));
  }

  makeRequestForGenerated(combinations: string, distance: number): Observable<string> {
    const host = 'https://mutation-game-backend.herokuapp.com/';
    // Local dev:
    // const host = 'http://localhost:8000/';
    return this.httpClient.get(`${host}?combinations=${encodeURIComponent(combinations)}&distance=${distance}`,
      { responseType: 'text' })
  }
}
