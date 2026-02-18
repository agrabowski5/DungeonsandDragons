import { MapGrid } from './MapGrid.js';
import { MapRenderer } from './MapRenderer.js';
import { MapToolbar } from './MapToolbar.js';
import { MapTokens } from './MapTokens.js';
import { MapIO } from './MapIO.js';
import { MapHistory } from './MapHistory.js';
import { getRectCells, getLineCells } from './MapShapes.js';
import { el, showModal } from '../utils/dom.js';

export class MapController {
    constructor(container) {
        this.container = container;

        this._buildLayout();

        this.grid = new MapGrid(20, 20);
        this.renderer = new MapRenderer(this.canvas, this.grid);
        this.toolbar = new MapToolbar(this.container);
        this.tokens = new MapTokens(this.canvas, this.grid, this.renderer, this.toolbar);
        this.history = new MapHistory();

        // State
        this.currentTool = 'paint';
        this.currentTerrain = 'grass';
        this.brushSize = 1;
        this.painting = false;
        this.panning = false;
        this.lastPanPos = null;
        this._pendingCells = new Map();
        this._shapeStart = null;
        this._rulerStart = null;
        this._lastButton = 0;

        this._bindToolbar();
        this._bindCanvas();
        this._bindResize();
        this._bindKeyboard();
        this._autoRestore();

        this.renderer.render();
    }

    _buildLayout() {
        const wrapper = el('div', { className: 'map-builder-layout' });
        const canvasContainer = el('div', { className: 'map-canvas-container' });
        this.canvas = el('canvas', { className: 'map-canvas' });
        canvasContainer.appendChild(this.canvas);
        wrapper.appendChild(canvasContainer);
        this.container.appendChild(wrapper);
        this.canvasContainer = canvasContainer;
    }

    _bindToolbar() {
        this.toolbar.onTerrainSelect = (key) => {
            this.currentTerrain = key;
        };

        this.toolbar.onToolChange = (tool) => {
            this.currentTool = tool;
            this._updateCursor();

            this.renderer.shapePreview = null;
            this.renderer.rulerOverlay = null;
            this._shapeStart = null;
            this._rulerStart = null;

            if (tool === 'token') {
                this.tokens.enable();
            } else {
                this.tokens.disable();
            }
            this.renderer.render();
        };

        this.toolbar.onBrushSizeChange = (size) => {
            this.brushSize = size;
        };

        this.toolbar.onGridResize = (rows, cols) => {
            this.grid.resize(rows, cols);
            this.history.clear();
            this.toolbar.updateUndoRedo(false, false);
            this.renderer.resizeCanvas();
            this.renderer.render();
            this._autosave();
        };

        this.toolbar.onZoomChange = (delta) => {
            const newZoom = this.renderer.zoom + delta;
            this.renderer.setZoom(newZoom);
            this.toolbar.updateZoomLabel(this.renderer.zoom);
        };

        this.toolbar.onGridToggle = () => {
            return this.renderer.toggleGrid();
        };

        this.toolbar.onFogToggle = () => {
            return this.renderer.toggleFogVisibility();
        };

        this.toolbar.onUndo = () => this._undo();
        this.toolbar.onRedo = () => this._redo();

        this.toolbar.onAction = (action) => this._handleAction(action);
    }

    _bindCanvas() {
        this.canvas.addEventListener('pointerdown', (e) => {
            if (this.currentTool === 'token') return;

            if (e.button === 0) {
                if (this.currentTool === 'pan') {
                    this.panning = true;
                    this.lastPanPos = { x: e.clientX, y: e.clientY };
                    this.canvas.style.cursor = 'grabbing';
                } else if (this.currentTool === 'rect' || this.currentTool === 'line') {
                    const pos = this.renderer.screenToGrid(e.clientX, e.clientY);
                    if (this.grid.inBounds(pos.row, pos.col)) {
                        this._shapeStart = pos;
                    }
                } else if (this.currentTool === 'ruler') {
                    const pos = this.renderer.screenToGrid(e.clientX, e.clientY);
                    if (this.grid.inBounds(pos.row, pos.col)) {
                        this._rulerStart = pos;
                    }
                } else if (this.currentTool === 'fill') {
                    const pos = this.renderer.screenToGrid(e.clientX, e.clientY);
                    if (this.grid.inBounds(pos.row, pos.col)) {
                        this._applyFloodFill(pos.row, pos.col);
                    }
                } else {
                    this.painting = true;
                    this._pendingCells.clear();
                    this._applyBrush(e, e.button);
                }
            } else if (e.button === 2 && this.currentTool === 'fog') {
                e.preventDefault();
                this.painting = true;
                this._pendingCells.clear();
                this._applyBrush(e, 2);
            }
        });

        this.canvas.addEventListener('contextmenu', (e) => {
            if (this.currentTool === 'fog') {
                e.preventDefault();
            }
        });

        this.canvas.addEventListener('pointermove', (e) => {
            // Always update hover coordinate
            const pos = this.renderer.screenToGrid(e.clientX, e.clientY);
            if (this.grid.inBounds(pos.row, pos.col)) {
                this.renderer.setHoverCell(pos.row, pos.col);
            } else {
                this.renderer.setHoverCell(null, null);
            }

            if (this.currentTool === 'token') return;

            if (this.painting) {
                this._applyBrush(e, this._lastButton);
            } else if (this.panning && this.lastPanPos) {
                const dx = (e.clientX - this.lastPanPos.x) / this.renderer.zoom;
                const dy = (e.clientY - this.lastPanPos.y) / this.renderer.zoom;
                this.renderer.offsetX += dx;
                this.renderer.offsetY += dy;
                this.lastPanPos = { x: e.clientX, y: e.clientY };
                this.renderer.render();
            } else if (this._shapeStart) {
                const end = this.renderer.screenToGrid(e.clientX, e.clientY);
                this.renderer.shapePreview = {
                    start: this._shapeStart,
                    end,
                    tool: this.currentTool,
                };
                this.renderer.render();
            } else if (this._rulerStart) {
                const end = this.renderer.screenToGrid(e.clientX, e.clientY);
                this.renderer.rulerOverlay = {
                    start: this._rulerStart,
                    end,
                };
                this.renderer.render();
            }
        });

        const endInteraction = () => {
            if (this.painting) {
                this.painting = false;
                this._commitPending();
                this._autosave();
            }
            if (this._shapeStart) {
                this._commitShape();
                this._shapeStart = null;
                this.renderer.shapePreview = null;
                this.renderer.render();
            }
            if (this._rulerStart) {
                this._rulerStart = null;
                this.renderer.rulerOverlay = null;
                this.renderer.render();
            }
            if (this.panning) {
                this.panning = false;
                this.lastPanPos = null;
                this.canvas.style.cursor = this.currentTool === 'pan' ? 'grab' : 'default';
            }
        };

        this.canvas.addEventListener('pointerup', endInteraction);
        this.canvas.addEventListener('pointerleave', (e) => {
            this.renderer.setHoverCell(null, null);
            endInteraction(e);
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            const newZoom = this.renderer.zoom + delta;
            this.renderer.setZoom(newZoom);
            this.toolbar.updateZoomLabel(this.renderer.zoom);
        }, { passive: false });
    }

    _bindResize() {
        const observer = new ResizeObserver(() => {
            this.renderer.resizeCanvas();
        });
        observer.observe(this.canvasContainer);
    }

    _bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            const mapTab = this.container.closest('[data-tab-content="maps"]');
            if (mapTab && mapTab.style.display === 'none') return;

            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this._undo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                this._redo();
            }
        });
    }

    _applyBrush(e, button) {
        this._lastButton = button;
        const center = this.renderer.screenToGrid(e.clientX, e.clientY);
        const half = Math.floor(this.brushSize / 2);

        for (let dr = 0; dr < this.brushSize; dr++) {
            for (let dc = 0; dc < this.brushSize; dc++) {
                const row = center.row - half + dr;
                const col = center.col - half + dc;
                if (!this.grid.inBounds(row, col)) continue;

                const key = `${row},${col}`;
                const cell = this.grid.cells[row][col];

                if (!this._pendingCells.has(key)) {
                    this._pendingCells.set(key, {
                        row, col,
                        before: { ...cell },
                        after: null,
                    });
                }

                if (this.currentTool === 'paint') {
                    this.grid.setTerrain(row, col, this.currentTerrain);
                } else if (this.currentTool === 'erase') {
                    this.grid.setTerrain(row, col, 'void');
                    this.grid.removeToken(row, col);
                } else if (this.currentTool === 'fog') {
                    this.grid.setFog(row, col, button !== 2);
                }

                this._pendingCells.get(key).after = { ...this.grid.cells[row][col] };
            }
        }
        this.renderer.render();
    }

    _commitPending() {
        if (this._pendingCells.size === 0) return;

        const cells = [];
        for (const entry of this._pendingCells.values()) {
            const b = entry.before;
            const a = entry.after;
            if (b.terrain !== a.terrain || b.fog !== a.fog || b.token !== a.token) {
                cells.push(entry);
            }
        }
        this._pendingCells.clear();

        if (cells.length === 0) return;

        this.history.push({ type: this.currentTool, cells });
        this.toolbar.updateUndoRedo(this.history.canUndo, this.history.canRedo);
    }

    _commitShape() {
        if (!this._shapeStart || !this.renderer.shapePreview) return;

        const { start, end, tool } = this.renderer.shapePreview;
        const shapeCells = tool === 'rect'
            ? getRectCells(start, end)
            : getLineCells(start, end);

        const cells = [];
        for (const { r, c } of shapeCells) {
            if (!this.grid.inBounds(r, c)) continue;
            const before = { ...this.grid.cells[r][c] };
            this.grid.setTerrain(r, c, this.currentTerrain);
            const after = { ...this.grid.cells[r][c] };
            if (before.terrain !== after.terrain) {
                cells.push({ row: r, col: c, before, after });
            }
        }

        if (cells.length > 0) {
            this.history.push({ type: 'shape', cells });
            this.toolbar.updateUndoRedo(this.history.canUndo, this.history.canRedo);
            this._autosave();
        }
        this.renderer.render();
    }

    _applyFloodFill(row, col) {
        const changed = this.grid.floodFill(row, col, this.currentTerrain);
        if (changed.length > 0) {
            this.history.push({ type: 'fill', cells: changed });
            this.toolbar.updateUndoRedo(this.history.canUndo, this.history.canRedo);
            this.renderer.render();
            this._autosave();
        }
    }

    _undo() {
        if (this.history.undo(this.grid)) {
            this.toolbar.updateUndoRedo(this.history.canUndo, this.history.canRedo);
            this.renderer.render();
            this._autosave();
        }
    }

    _redo() {
        if (this.history.redo(this.grid)) {
            this.toolbar.updateUndoRedo(this.history.canUndo, this.history.canRedo);
            this.renderer.render();
            this._autosave();
        }
    }

    _updateCursor() {
        switch (this.currentTool) {
            case 'paint': this.canvas.style.cursor = 'crosshair'; break;
            case 'fill': this.canvas.style.cursor = 'cell'; break;
            case 'erase': this.canvas.style.cursor = 'crosshair'; break;
            case 'token': this.canvas.style.cursor = 'crosshair'; break;
            case 'rect': this.canvas.style.cursor = 'crosshair'; break;
            case 'line': this.canvas.style.cursor = 'crosshair'; break;
            case 'fog': this.canvas.style.cursor = 'crosshair'; break;
            case 'ruler': this.canvas.style.cursor = 'crosshair'; break;
            case 'pan': this.canvas.style.cursor = 'grab'; break;
            default: this.canvas.style.cursor = 'default';
        }
    }

    _handleAction(action) {
        switch (action) {
            case 'save': this._showSaveDialog(); break;
            case 'load': this._showLoadDialog(); break;
            case 'export': MapIO.exportJSON(this.grid); break;
            case 'png': MapIO.exportPNG(this.grid, this.renderer); break;
            case 'import': this._triggerImport(); break;
            case 'clear': this._confirmClear(); break;
        }
    }

    _showSaveDialog() {
        const input = el('input', {
            className: 'input',
            type: 'text',
            placeholder: 'Enter map name...',
        });
        const wrapper = el('div', { className: 'form-group' }, [
            el('label', { className: 'label', textContent: 'Map Name' }),
            input,
        ]);

        showModal('Save Map', wrapper, () => {
            const name = input.value.trim();
            if (name) {
                MapIO.save(name, this.grid);
            }
        });

        setTimeout(() => input.focus(), 100);
    }

    _showLoadDialog() {
        const saved = MapIO.listSaved();
        if (saved.length === 0) {
            const msg = el('p', { textContent: 'No saved maps found.', className: 'color-muted' });
            showModal('Load Map', msg);
            return;
        }

        const list = el('div', { className: 'save-list' });
        for (const name of saved) {
            const row = el('div', { className: 'save-list__item' }, [
                el('span', { textContent: name, className: 'save-list__name' }),
                el('button', {
                    className: 'btn btn--sm btn--primary',
                    textContent: 'Load',
                    onClick: () => {
                        const loaded = MapIO.load(name);
                        if (loaded) {
                            this._loadGrid(loaded);
                        }
                        document.querySelector('.modal-overlay')?.remove();
                    },
                }),
                el('button', {
                    className: 'btn btn--sm btn--danger',
                    textContent: 'Del',
                    onClick: () => {
                        MapIO.delete(name);
                        row.remove();
                    },
                }),
            ]);
            list.appendChild(row);
        }

        showModal('Load Map', list);
    }

    _triggerImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', async () => {
            if (input.files.length === 0) return;
            try {
                const loaded = await MapIO.importJSON(input.files[0]);
                this._loadGrid(loaded);
            } catch (err) {
                console.error('Import failed:', err);
            }
        });
        input.click();
    }

    _loadGrid(grid) {
        this.grid = grid;
        this.renderer.grid = grid;
        this.tokens.grid = grid;
        this.toolbar.updateGridSize(grid.rows, grid.cols);
        this.history.clear();
        this.toolbar.updateUndoRedo(false, false);
        this.renderer.resizeCanvas();
        this.renderer.render();
    }

    _confirmClear() {
        const msg = el('p', { textContent: 'This will erase the entire map. Are you sure?' });
        showModal('Clear Map', msg, () => {
            this.grid.clear();
            this.history.clear();
            this.toolbar.updateUndoRedo(false, false);
            this.renderer.render();
            this._autosave();
        });
    }

    _autosave() {
        MapIO.autosave(this.grid);
    }

    _autoRestore() {
        const saved = MapIO.loadAutosave();
        if (saved) {
            this.grid = saved;
            this.renderer.grid = saved;
            this.tokens.grid = saved;
            this.toolbar.updateGridSize(saved.rows, saved.cols);
        }
    }

    onTabActivated() {
        this.renderer.resizeCanvas();
    }
}
