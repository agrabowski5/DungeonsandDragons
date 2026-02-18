import { describe, it, expect } from 'vitest';
import { MapHistory } from '../../js/map-builder/MapHistory.js';
import { MapGrid } from '../../js/map-builder/MapGrid.js';

describe('MapHistory', () => {
    function makeAction(grid, row, col, newTerrain) {
        const before = { ...grid.cells[row][col] };
        grid.setTerrain(row, col, newTerrain);
        const after = { ...grid.cells[row][col] };
        return { type: 'paint', cells: [{ row, col, before, after }] };
    }

    it('starts empty with no undo/redo', () => {
        const history = new MapHistory();
        expect(history.canUndo).toBe(false);
        expect(history.canRedo).toBe(false);
    });

    it('push enables undo', () => {
        const history = new MapHistory();
        const grid = new MapGrid(5, 5);
        const action = makeAction(grid, 0, 0, 'water');
        history.push(action);
        expect(history.canUndo).toBe(true);
        expect(history.canRedo).toBe(false);
    });

    it('undo restores previous cell state', () => {
        const history = new MapHistory();
        const grid = new MapGrid(5, 5);
        const action = makeAction(grid, 2, 3, 'stone');
        history.push(action);

        expect(grid.getCell(2, 3).terrain).toBe('stone');
        history.undo(grid);
        expect(grid.getCell(2, 3).terrain).toBe('grass');
    });

    it('redo re-applies the undone action', () => {
        const history = new MapHistory();
        const grid = new MapGrid(5, 5);
        const action = makeAction(grid, 1, 1, 'lava');
        history.push(action);

        history.undo(grid);
        expect(grid.getCell(1, 1).terrain).toBe('grass');

        history.redo(grid);
        expect(grid.getCell(1, 1).terrain).toBe('lava');
    });

    it('push after undo clears redo stack', () => {
        const history = new MapHistory();
        const grid = new MapGrid(5, 5);

        history.push(makeAction(grid, 0, 0, 'water'));
        history.undo(grid);
        expect(history.canRedo).toBe(true);

        history.push(makeAction(grid, 1, 1, 'forest'));
        expect(history.canRedo).toBe(false);
    });

    it('undo returns false when stack is empty', () => {
        const history = new MapHistory();
        const grid = new MapGrid(5, 5);
        expect(history.undo(grid)).toBe(false);
    });

    it('redo returns false when stack is empty', () => {
        const history = new MapHistory();
        const grid = new MapGrid(5, 5);
        expect(history.redo(grid)).toBe(false);
    });

    it('respects maxSize by evicting oldest entries', () => {
        const history = new MapHistory(3);
        const grid = new MapGrid(5, 5);

        history.push(makeAction(grid, 0, 0, 'water'));
        history.push(makeAction(grid, 0, 1, 'stone'));
        history.push(makeAction(grid, 0, 2, 'lava'));
        history.push(makeAction(grid, 0, 3, 'ice'));

        expect(history.undoStack.length).toBe(3);
        // First action (water) was evicted
        history.undo(grid);
        history.undo(grid);
        history.undo(grid);
        expect(history.canUndo).toBe(false);
    });

    it('handles multi-cell actions', () => {
        const history = new MapHistory();
        const grid = new MapGrid(5, 5);

        const cells = [];
        for (let c = 0; c < 3; c++) {
            const before = { ...grid.cells[0][c] };
            grid.setTerrain(0, c, 'water');
            const after = { ...grid.cells[0][c] };
            cells.push({ row: 0, col: c, before, after });
        }
        history.push({ type: 'paint', cells });

        // All 3 cells are water
        for (let c = 0; c < 3; c++) {
            expect(grid.getCell(0, c).terrain).toBe('water');
        }

        // Undo restores all 3 to grass
        history.undo(grid);
        for (let c = 0; c < 3; c++) {
            expect(grid.getCell(0, c).terrain).toBe('grass');
        }
    });

    it('clear empties both stacks', () => {
        const history = new MapHistory();
        const grid = new MapGrid(5, 5);

        history.push(makeAction(grid, 0, 0, 'water'));
        history.undo(grid);
        expect(history.canRedo).toBe(true);

        history.clear();
        expect(history.canUndo).toBe(false);
        expect(history.canRedo).toBe(false);
    });
});
