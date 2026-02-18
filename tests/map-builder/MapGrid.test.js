import { describe, it, expect } from 'vitest';
import { MapGrid } from '../../js/map-builder/MapGrid.js';

describe('MapGrid', () => {
    it('creates grid with default 20x20 dimensions', () => {
        const grid = new MapGrid();
        expect(grid.rows).toBe(20);
        expect(grid.cols).toBe(20);
        expect(grid.cells.length).toBe(20);
        expect(grid.cells[0].length).toBe(20);
    });

    it('creates grid with custom dimensions', () => {
        const grid = new MapGrid(10, 15);
        expect(grid.rows).toBe(10);
        expect(grid.cols).toBe(15);
        expect(grid.cells.length).toBe(10);
        expect(grid.cells[0].length).toBe(15);
    });

    it('initializes all cells with grass terrain and no token', () => {
        const grid = new MapGrid(3, 3);
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                expect(grid.cells[r][c].terrain).toBe('grass');
                expect(grid.cells[r][c].token).toBeNull();
            }
        }
    });

    describe('inBounds', () => {
        const grid = new MapGrid(10, 10);

        it('returns true for valid coordinates', () => {
            expect(grid.inBounds(0, 0)).toBe(true);
            expect(grid.inBounds(9, 9)).toBe(true);
            expect(grid.inBounds(5, 5)).toBe(true);
        });

        it('returns false for out-of-range coordinates', () => {
            expect(grid.inBounds(-1, 0)).toBe(false);
            expect(grid.inBounds(0, -1)).toBe(false);
            expect(grid.inBounds(10, 0)).toBe(false);
            expect(grid.inBounds(0, 10)).toBe(false);
        });
    });

    describe('setTerrain / getCell', () => {
        it('sets and retrieves terrain', () => {
            const grid = new MapGrid(5, 5);
            grid.setTerrain(2, 3, 'water');
            expect(grid.getCell(2, 3).terrain).toBe('water');
        });

        it('ignores out-of-bounds setTerrain', () => {
            const grid = new MapGrid(5, 5);
            grid.setTerrain(-1, 0, 'water');
            expect(grid.getCell(-1, 0)).toBeNull();
        });

        it('getCell returns null for out-of-bounds', () => {
            const grid = new MapGrid(5, 5);
            expect(grid.getCell(10, 10)).toBeNull();
        });
    });

    describe('token operations', () => {
        it('places and removes tokens', () => {
            const grid = new MapGrid(5, 5);
            const token = { type: 'player', label: 'P', color: '#fff' };
            grid.setToken(1, 1, token);
            expect(grid.getCell(1, 1).token).toEqual(token);
            grid.removeToken(1, 1);
            expect(grid.getCell(1, 1).token).toBeNull();
        });

        it('moves token between cells', () => {
            const grid = new MapGrid(5, 5);
            const token = { type: 'monster', label: 'M', color: '#f00' };
            grid.setToken(0, 0, token);
            const result = grid.moveToken(0, 0, 2, 2);
            expect(result).toBe(true);
            expect(grid.getCell(0, 0).token).toBeNull();
            expect(grid.getCell(2, 2).token).toEqual(token);
        });

        it('moveToken returns false when no token at source', () => {
            const grid = new MapGrid(5, 5);
            expect(grid.moveToken(0, 0, 1, 1)).toBe(false);
        });

        it('moveToken returns false for out-of-bounds', () => {
            const grid = new MapGrid(5, 5);
            grid.setToken(0, 0, { type: 'player', label: 'P', color: '#fff' });
            expect(grid.moveToken(0, 0, 10, 10)).toBe(false);
        });
    });

    describe('resize', () => {
        it('preserves existing cells when growing', () => {
            const grid = new MapGrid(5, 5);
            grid.setTerrain(2, 2, 'stone');
            grid.resize(10, 10);
            expect(grid.rows).toBe(10);
            expect(grid.cols).toBe(10);
            expect(grid.getCell(2, 2).terrain).toBe('stone');
        });

        it('truncates cells when shrinking', () => {
            const grid = new MapGrid(10, 10);
            grid.setTerrain(8, 8, 'lava');
            grid.resize(5, 5);
            expect(grid.rows).toBe(5);
            expect(grid.getCell(8, 8)).toBeNull();
        });

        it('new cells from growth have default terrain', () => {
            const grid = new MapGrid(3, 3);
            grid.resize(5, 5);
            expect(grid.getCell(4, 4).terrain).toBe('grass');
            expect(grid.getCell(4, 4).token).toBeNull();
        });
    });

    describe('serialization', () => {
        it('round-trips through toJSON / fromJSON', () => {
            const grid = new MapGrid(8, 6);
            grid.setTerrain(3, 4, 'forest');
            grid.setToken(1, 1, { type: 'player', label: 'A', color: '#00f' });

            const json = grid.toJSON();
            const restored = MapGrid.fromJSON(json);

            expect(restored.rows).toBe(8);
            expect(restored.cols).toBe(6);
            expect(restored.getCell(3, 4).terrain).toBe('forest');
            expect(restored.getCell(1, 1).token.label).toBe('A');
        });

        it('toJSON includes all dimensions', () => {
            const grid = new MapGrid(7, 3);
            const json = grid.toJSON();
            expect(json.rows).toBe(7);
            expect(json.cols).toBe(3);
            expect(json.cells.length).toBe(7);
        });
    });

    describe('clear', () => {
        it('resets all cells to defaults', () => {
            const grid = new MapGrid(5, 5);
            grid.setTerrain(0, 0, 'water');
            grid.setToken(1, 1, { type: 'player', label: 'X', color: '#0f0' });
            grid.clear();
            expect(grid.getCell(0, 0).terrain).toBe('grass');
            expect(grid.getCell(1, 1).token).toBeNull();
        });

        it('preserves grid dimensions after clear', () => {
            const grid = new MapGrid(8, 12);
            grid.clear();
            expect(grid.rows).toBe(8);
            expect(grid.cols).toBe(12);
        });
    });
});
