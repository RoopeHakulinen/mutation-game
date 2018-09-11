import { Component, Input, OnInit } from '@angular/core';
import { Grid } from '../grid';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @Input() grid: Grid;

  currentMutation: string[];
  likedMutations: string[][] = [];
  variation = 2;

  constructor() {
  }

  ngOnInit() {
  }

  addRow() {
    if (this.likedMutations.length && !confirm('Adding a row will clear liked mutations. Do you want to proceed?')) {
      return;
    }
    this.grid.columns.forEach(column => column.push(''));
    this.clearLikedMutations();
  }

  addColumn() {
    if (this.likedMutations.length && !confirm('Adding a column will clear liked mutations. Do you want to proceed?')) {
      return;
    }
    this.grid.columns.push(Array(this.grid.columns[0].length).fill(''));
    this.clearLikedMutations();
  }

  clearLikedMutations() {
    this.likedMutations.length = 0;
  }

  canMutate() {
    return !(this.isAnyValueEmptyInGrid() || this.hasDuplicateWordsInRow());
  }

  isAnyValueEmptyInGrid() {
    return this.grid.columns.some(column => column.some(word => word === ''));
  }

  hasDuplicateWordsInRow() {
    return this.transpose(this.grid.columns).some(column => column.length !== Array.from(new Set(column) as any).length);
  }

  mutate() {
    if (this.possibleMutationCount() === this.likedMutations.length) {
      alert('No more mutations left.');
      return;
    }
    let newMutation;
    do {
      newMutation = this.createMutation();
    } while (this.alreadyInLikedMutations(newMutation) || (this.currentMutation && this.arraysEqual(this.currentMutation, newMutation)));
    this.currentMutation = newMutation;
  }

  createMutation() {
    const indexes = this.generateUniqueRandomNumbers(this.grid.columns[0].length, this.variation);
    return this.transpose(this.grid.columns).map((words, i) => {
      if (indexes.includes(i)) { // If random row, choose randomly from other values
        const rand = Math.floor(Math.random() * (words.length - 1)) + 1;
        const randomIndex = Math.min(rand, words.length - 1);
        console.log(rand, randomIndex);
        return words[randomIndex];
      } else { // Otherwise select the original
        return words[0];
      }
    });
  }

  generateUniqueRandomNumbers(max: number, count: number) {
    const result = [];
    while (result.length < count) {
      const randomNumber = Math.floor(Math.random() * max);
      if (!result.includes(randomNumber)) {
        result.push(randomNumber);
      }
    }
    return result;
  }

  transpose(array: any[]) {
    return array[0].map((col, i) => array.map(column => column[i]));
  }

  isWordSelected(word: string, index: number) {
    if (!this.currentMutation) {
      return false;
    }
    return this.currentMutation.indexOf(word) === index;
  }

  possibleMutationCount() {
    const rows = this.grid.columns[0].length;
    const columns = this.grid.columns.length;
    const randomRows = this.variation;
    const constantRows = rows - this.variation;
    console.log(randomRows, constantRows);
    // TODO: Fix logic here
    return ((columns - 1) ** randomRows) + constantRows;
  }

  alreadyInLikedMutations(mutation: string[]) {
    return this.likedMutations.some(likedMutation => this.arraysEqual(likedMutation, mutation));
  }

  likeMutation() {
    this.likedMutations.push(this.currentMutation);
  }

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  canIncreaseVariation() {
    return this.variation < this.grid.columns[0].length;
  }

  increaseVariation() {
    if (!this.canIncreaseVariation()) {
      return;
    }
    this.variation++;
  }

  decreaseVariation() {
    if (this.variation === 1) {
      return;
    }
    this.variation--;
  }
}
