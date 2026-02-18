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
                token: null,
                fog: false,
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

    setFog(row, col, fogged) {
        if (!this.inBounds(row, col)) return;
        this.cells[row][col].fog = fogged;
    }

    getTokenAt(row, col) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const t = this.cells[r][c].token;
                if (!t) continue;
                const size = t.size || 1;
                if (row >= r && row < r + size && col >= c && col < c + size) {
                    return { token: t, anchorRow: r, anchorCol: c };
                }
            }
        }
        return null;
    }

    isTokenPlacementBlocked(row, col, size, excludeAnchor = null) {
        for (let dr = 0; dr < size; dr++) {
            for (let dc = 0; dc < size; dc++) {
                const r = row + dr;
                const c = col + dc;
                if (!this.inBounds(r, c)) return true;
                const existing = this.getTokenAt(r, c);
                if (existing) {
                    if (!excludeAnchor) return true;
                    if (existing.anchorRow !== excludeAnchor.row ||
                        existing.anchorCol !== excludeAnchor.col) return true;
                }
            }
        }
        return false;
    }

    moveToken(fromRow, fromCol, toRow, toCol) {
        if (!this.inBounds(fromRow, fromCol) || !this.inBounds(toRow, toCol)) return false;
        const token = this.cells[fromRow][fromCol].token;
        if (!token) return false;
        const size = token.size || 1;
        if (this.isTokenPlacementBlocked(toRow, toCol, size, { row: fromRow, col: fromCol })) {
            return false;
        }
        this.cells[fromRow][fromCol].token = null;
        this.cells[toRow][toCol].token = token;
        return true;
    }

    floodFill(row, col, newTerrain) {
        if (!this.inBounds(row, col)) return [];
        const targetTerrain = this.cells[row][col].terrain;
        if (targetTerrain === newTerrain) return [];

        const changed = [];
        const visited = new Set();
        const queue = [{ row, col }];

        while (queue.length > 0) {
            const { row: r, col: c } = queue.shift();
            const key = `${r},${c}`;
            if (visited.has(key)) continue;
            if (!this.inBounds(r, c)) continue;
            if (this.cells[r][c].terrain !== targetTerrain) continue;

            visited.add(key);
            const before = { ...this.cells[r][c] };
            this.cells[r][c].terrain = newTerrain;
            const after = { ...this.cells[r][c] };
            changed.push({ row: r, col: c, before, after });

            queue.push({ row: r - 1, col: c });
            queue.push({ row: r + 1, col: c });
            queue.push({ row: r, col: c - 1 });
            queue.push({ row: r, col: c + 1 });
        }

        return changed;
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
        grid.cells = json.cells.map(row =>
            row.map(cell => ({
                terrain: cell.terrain,
                token: cell.token,
                fog: cell.fog || false,
            }))
        );
        return grid;
    }
}
