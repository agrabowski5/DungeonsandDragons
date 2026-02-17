import { MapGrid } from './MapGrid.js';
import { MapRenderer } from './MapRenderer.js';
import { MapToolbar } from './MapToolbar.js';
import { MapTokens } from './MapTokens.js';
import { MapIO } from './MapIO.js';
import { el, showModal } from '../utils/dom.js';

export class MapController {
    constructor(container) {
        this.container = container;

        // Build DOM
        this._buildLayout();

        // Init model
        this.grid = new MapGrid(20, 20);

        // Init renderer
        this.renderer = new MapRenderer(this.canvas, this.grid);

        // Init toolbar
        this.toolbar = new MapToolbar(this.container);

        // Init token handler
        this.tokens = new MapTokens(this.canvas, this.grid, this.renderer);

        // State
        this.currentTool = 'paint';
        this.currentTerrain = 'grass';
        this.painting = false;
        this.panning = false;
        this.lastPanPos = null;

        this._bindToolbar();
        this._bindCanvas();
        this._bindResize();
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

            if (tool === 'token') {
                this.tokens.enable();
            } else {
                this.tokens.disable();
            }
        };

        this.toolbar.onGridResize = (rows, cols) => {
            this.grid.resize(rows, cols);
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

        this.toolbar.onAction = (action) => this._handleAction(action);
    }

    _bindCanvas() {
        this.canvas.addEventListener('pointerdown', (e) => {
            if (this.currentTool === 'token') return; // MapTokens handles this

            if (e.button === 0) {
                if (this.currentTool === 'pan') {
                    this.panning = true;
                    this.lastPanPos = { x: e.clientX, y: e.clientY };
                    this.canvas.style.cursor = 'grabbing';
                } else {
                    this.painting = true;
                    this._paintAt(e);
                }
            }
        });

        this.canvas.addEventListener('pointermove', (e) => {
            if (this.currentTool === 'token') return;

            if (this.painting) {
                this._paintAt(e);
            } else if (this.panning && this.lastPanPos) {
                const dx = (e.clientX - this.lastPanPos.x) / this.renderer.zoom;
                const dy = (e.clientY - this.lastPanPos.y) / this.renderer.zoom;
                this.renderer.offsetX += dx;
                this.renderer.offsetY += dy;
                this.lastPanPos = { x: e.clientX, y: e.clientY };
                this.renderer.render();
            }
        });

        const endPaint = () => {
            if (this.painting) {
                this.painting = false;
                this._autosave();
            }
            if (this.panning) {
                this.panning = false;
                this.lastPanPos = null;
                this.canvas.style.cursor = this.currentTool === 'pan' ? 'grab' : 'default';
            }
        };

        this.canvas.addEventListener('pointerup', endPaint);
        this.canvas.addEventListener('pointerleave', endPaint);

        // Zoom with mouse wheel
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

    _paintAt(e) {
        const { row, col } = this.renderer.screenToGrid(e.clientX, e.clientY);
        if (!this.grid.inBounds(row, col)) return;

        if (this.currentTool === 'paint') {
            this.grid.setTerrain(row, col, this.currentTerrain);
        } else if (this.currentTool === 'erase') {
            this.grid.setTerrain(row, col, 'void');
            this.grid.removeToken(row, col);
        }
        this.renderer.render();
    }

    _updateCursor() {
        switch (this.currentTool) {
            case 'paint': this.canvas.style.cursor = 'crosshair'; break;
            case 'erase': this.canvas.style.cursor = 'crosshair'; break;
            case 'token': this.canvas.style.cursor = 'crosshair'; break;
            case 'pan': this.canvas.style.cursor = 'grab'; break;
            default: this.canvas.style.cursor = 'default';
        }
    }

    _handleAction(action) {
        switch (action) {
            case 'save': this._showSaveDialog(); break;
            case 'load': this._showLoadDialog(); break;
            case 'export': MapIO.exportJSON(this.grid); break;
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
                            this.grid = loaded;
                            this.renderer.grid = loaded;
                            this.tokens.grid = loaded;
                            this.toolbar.updateGridSize(loaded.rows, loaded.cols);
                            this.renderer.resizeCanvas();
                            this.renderer.render();
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
                this.grid = loaded;
                this.renderer.grid = loaded;
                this.tokens.grid = loaded;
                this.toolbar.updateGridSize(loaded.rows, loaded.cols);
                this.renderer.resizeCanvas();
                this.renderer.render();
            } catch (err) {
                console.error('Import failed:', err);
            }
        });
        input.click();
    }

    _confirmClear() {
        const msg = el('p', { textContent: 'This will erase the entire map. Are you sure?' });
        showModal('Clear Map', msg, () => {
            this.grid.clear();
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
