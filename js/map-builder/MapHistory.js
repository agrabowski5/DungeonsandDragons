export class MapHistory {
    constructor(maxSize = 50) {
        this.undoStack = [];
        this.redoStack = [];
        this.maxSize = maxSize;
    }

    /**
     * Record an action.
     * @param {{ type: string, cells: Array<{ row: number, col: number, before: object, after: object }> }} action
     */
    push(action) {
        this.undoStack.push(action);
        if (this.undoStack.length > this.maxSize) {
            this.undoStack.shift();
        }
        this.redoStack = [];
    }

    undo(grid) {
        const action = this.undoStack.pop();
        if (!action) return false;
        for (const cell of action.cells) {
            if (grid.inBounds(cell.row, cell.col)) {
                grid.cells[cell.row][cell.col] = { ...cell.before };
            }
        }
        this.redoStack.push(action);
        return true;
    }

    redo(grid) {
        const action = this.redoStack.pop();
        if (!action) return false;
        for (const cell of action.cells) {
            if (grid.inBounds(cell.row, cell.col)) {
                grid.cells[cell.row][cell.col] = { ...cell.after };
            }
        }
        this.undoStack.push(action);
        return true;
    }

    get canUndo() { return this.undoStack.length > 0; }
    get canRedo() { return this.redoStack.length > 0; }

    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }
}
