import { DEFAULT_TERRAIN } from '../data/terrains.js';

export class MapGrid {
    constructor(rows = 20, cols = 20) {
        this.rows = rows;
        this.cols = cols;
        this.cells = [];
        this._init();
    }

    _init() {
        this.cells = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => ({
                terrain: DEFAULT_TERRAIN,
                token: null
            }))
        );
    }

    inBounds(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    getCell(row, col) {
        if (!this.inBounds(row, col)) return null;
        return this.cells[row][col];
    }

    setTerrain(row, col, terrainKey) {
        if (!this.inBounds(row, col)) return;
        this.cells[row][col].terrain = terrainKey;
    }

    setToken(row, col, token) {
        if (!this.inBounds(row, col)) return;
        this.cells[row][col].token = token;
    }

    removeToken(row, col) {
        if (!this.inBounds(row, col)) return;
        this.cells[row][col].token = null;
    }

    moveToken(fromRow, fromCol, toRow, toCol) {
        if (!this.inBounds(fromRow, fromCol) || !this.inBounds(toRow, toCol)) return false;
        const token = this.cells[fromRow][fromCol].token;
        if (!token) return false;
        this.cells[fromRow][fromCol].token = null;
        this.cells[toRow][toCol].token = token;
        return true;
    }

    resize(newRows, newCols) {
        const oldCells = this.cells;
        const oldRows = this.rows;
        const oldCols = this.cols;

        this.rows = newRows;
        this.cols = newCols;
        this._init();

        const copyRows = Math.min(oldRows, newRows);
        const copyCols = Math.min(oldCols, newCols);
        for (let r = 0; r < copyRows; r++) {
            for (let c = 0; c < copyCols; c++) {
                this.cells[r][c] = oldCells[r][c];
            }
        }
    }

    clear() {
        this._init();
    }

    toJSON() {
        return {
            rows: this.rows,
            cols: this.cols,
            cells: this.cells
        };
    }

    static fromJSON(json) {
        const grid = new MapGrid(json.rows, json.cols);
        grid.cells = json.cells;
        return grid;
    }
}
