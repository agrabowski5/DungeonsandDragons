import { TERRAINS, DEFAULT_TERRAIN } from '../data/terrains.js';
import { el } from '../utils/dom.js';

export class MapToolbar {
    constructor(container) {
        this.container = container;
        this.toolbarEl = null;

        // Callbacks
        this.onTerrainSelect = null;
        this.onToolChange = null;
        this.onTokenConfig = null;
        this.onGridResize = null;
        this.onAction = null;
        this.onZoomChange = null;
        this.onGridToggle = null;
        this.onFogToggle = null;
        this.onBrushSizeChange = null;
        this.onUndo = null;
        this.onRedo = null;

        // State
        this.currentTerrain = DEFAULT_TERRAIN;
        this.currentTool = 'paint';
        this.brushSize = 1;

        this._build();
    }

    _build() {
        this.toolbarEl = el('div', { className: 'map-toolbar' });

        this._buildToolSelector();
        this._buildBrushSize();
        this._buildTerrainPalette();
        this._buildTokenConfig();
        this._buildHistoryButtons();
        this._buildGridControls();
        this._buildZoomControls();
        this._buildActionButtons();

        this.container.prepend(this.toolbarEl);
        this._updateToolVisibility();
    }

    _buildToolSelector() {
        const section = el('div', { className: 'toolbar-section' });
        section.appendChild(el('div', { className: 'toolbar-section__title', textContent: 'Tools' }));

        const tools = [
            { id: 'paint', label: 'Paint', icon: '\u{1F58C}' },
            { id: 'fill', label: 'Fill', icon: '\u{1FAA3}' },
            { id: 'rect', label: 'Rect', icon: '\u{25AD}' },
            { id: 'line', label: 'Line', icon: '\u{2571}' },
            { id: 'token', label: 'Token', icon: '\u{1F3AF}' },
            { id: 'erase', label: 'Erase', icon: '\u{1F6AB}' },
            { id: 'fog', label: 'Fog', icon: '\u{1F32B}' },
            { id: 'ruler', label: 'Ruler', icon: '\u{1F4CF}' },
            { id: 'pan', label: 'Pan', icon: '\u{270B}' },
        ];

        const row = el('div', { className: 'toolbar-tools' });
        for (const tool of tools) {
            const btn = el('button', {
                className: `btn btn--sm toolbar-tool-btn ${tool.id === this.currentTool ? 'btn--active' : ''}`,
                textContent: `${tool.icon} ${tool.label}`,
                'data-tool': tool.id,
                onClick: () => this._selectTool(tool.id),
            });
            row.appendChild(btn);
        }
        section.appendChild(row);
        this.toolbarEl.appendChild(section);
    }

    _buildBrushSize() {
        const section = el('div', { className: 'toolbar-section toolbar-brush-section' });
        section.appendChild(el('div', { className: 'toolbar-section__title', textContent: 'Brush' }));

        const row = el('div', { className: 'toolbar-tools' });
        const sizes = [
            { size: 1, label: '1x1' },
            { size: 2, label: '2x2' },
            { size: 3, label: '3x3' },
        ];

        for (const s of sizes) {
            const btn = el('button', {
                className: `btn btn--sm toolbar-brush-btn ${s.size === this.brushSize ? 'btn--active' : ''}`,
                textContent: s.label,
                'data-brush': String(s.size),
                onClick: () => this._selectBrushSize(s.size),
            });
            row.appendChild(btn);
        }
        section.appendChild(row);
        this.toolbarEl.appendChild(section);
    }

    _buildTerrainPalette() {
        const section = el('div', { className: 'toolbar-section toolbar-terrain-section' });
        section.appendChild(el('div', { className: 'toolbar-section__title', textContent: 'Terrain' }));

        const palette = el('div', { className: 'terrain-palette' });
        for (const [key, terrain] of Object.entries(TERRAINS)) {
            const swatch = el('button', {
                className: `terrain-swatch ${key === this.currentTerrain ? 'terrain-swatch--active' : ''}`,
                'data-terrain': key,
                'data-tooltip': terrain.label,
                onClick: () => this._selectTerrain(key),
            }, [
                el('span', { className: 'terrain-swatch__color', style: `background-color: ${terrain.color}` }),
                el('span', { className: 'terrain-swatch__label', textContent: terrain.label }),
            ]);
            palette.appendChild(swatch);
        }
        section.appendChild(palette);
        this.toolbarEl.appendChild(section);
    }

    _buildTokenConfig() {
        const section = el('div', { className: 'toolbar-section toolbar-token-section' });
        section.appendChild(el('div', { className: 'toolbar-section__title', textContent: 'Token' }));

        const typeRow = el('div', { className: 'form-row' });
        this._tokenTypeSelect = el('select', { className: 'select input--sm' }, [
            el('option', { value: 'player', textContent: 'Player' }),
            el('option', { value: 'monster', textContent: 'Monster' }),
        ]);
        typeRow.appendChild(el('label', { className: 'label', textContent: 'Type' }));
        typeRow.appendChild(this._tokenTypeSelect);
        section.appendChild(typeRow);

        const labelRow = el('div', { className: 'form-row' });
        this._tokenLabelInput = el('input', {
            className: 'input input--sm',
            type: 'text',
            placeholder: 'Label (e.g. P1)',
            maxlength: '3',
        });
        labelRow.appendChild(el('label', { className: 'label', textContent: 'Label' }));
        labelRow.appendChild(this._tokenLabelInput);
        section.appendChild(labelRow);

        const colorRow = el('div', { className: 'form-row' });
        this._tokenColorInput = el('input', {
            className: 'input--sm',
            type: 'color',
            value: '#4a90d9',
        });
        colorRow.appendChild(el('label', { className: 'label', textContent: 'Color' }));
        colorRow.appendChild(this._tokenColorInput);
        section.appendChild(colorRow);

        const sizeRow = el('div', { className: 'form-row' });
        this._tokenSizeSelect = el('select', { className: 'select input--sm' }, [
            el('option', { value: '1', textContent: 'Medium (1x1)' }),
            el('option', { value: '2', textContent: 'Large (2x2)' }),
            el('option', { value: '3', textContent: 'Huge (3x3)' }),
            el('option', { value: '4', textContent: 'Gargantuan (4x4)' }),
        ]);
        sizeRow.appendChild(el('label', { className: 'label', textContent: 'Size' }));
        sizeRow.appendChild(this._tokenSizeSelect);
        section.appendChild(sizeRow);

        this._tokenTypeSelect.addEventListener('change', () => {
            this._tokenColorInput.value = this._tokenTypeSelect.value === 'player' ? '#4a90d9' : '#d94a4a';
        });

        this.toolbarEl.appendChild(section);
    }

    _buildHistoryButtons() {
        const section = el('div', { className: 'toolbar-section' });
        section.appendChild(el('div', { className: 'toolbar-section__title', textContent: 'History' }));

        const row = el('div', { className: 'toolbar-tools' });
        this._undoBtn = el('button', {
            className: 'btn btn--sm',
            textContent: '\u{21A9} Undo',
            disabled: true,
            onClick: () => { if (this.onUndo) this.onUndo(); },
        });
        this._redoBtn = el('button', {
            className: 'btn btn--sm',
            textContent: '\u{21AA} Redo',
            disabled: true,
            onClick: () => { if (this.onRedo) this.onRedo(); },
        });

        row.appendChild(this._undoBtn);
        row.appendChild(this._redoBtn);
        section.appendChild(row);
        this.toolbarEl.appendChild(section);
    }

    _buildGridControls() {
        const section = el('div', { className: 'toolbar-section' });
        section.appendChild(el('div', { className: 'toolbar-section__title', textContent: 'Grid Size' }));

        const row = el('div', { className: 'form-row' });
        this._rowsInput = el('input', { className: 'input input--sm', type: 'number', value: '20', min: '5', max: '100' });
        this._colsInput = el('input', { className: 'input input--sm', type: 'number', value: '20', min: '5', max: '100' });

        row.appendChild(el('label', { className: 'label', textContent: 'R' }));
        row.appendChild(this._rowsInput);
        row.appendChild(el('label', { className: 'label', textContent: 'C' }));
        row.appendChild(this._colsInput);

        const applyBtn = el('button', {
            className: 'btn btn--sm btn--primary',
            textContent: 'Apply',
            onClick: () => {
                const rows = parseInt(this._rowsInput.value) || 20;
                const cols = parseInt(this._colsInput.value) || 20;
                if (this.onGridResize) this.onGridResize(
                    Math.max(5, Math.min(100, rows)),
                    Math.max(5, Math.min(100, cols))
                );
            },
        });
        row.appendChild(applyBtn);

        section.appendChild(row);
        this.toolbarEl.appendChild(section);
    }

    _buildZoomControls() {
        const section = el('div', { className: 'toolbar-section' });
        section.appendChild(el('div', { className: 'toolbar-section__title', textContent: 'View' }));

        const row = el('div', { className: 'form-row' });

        row.appendChild(el('button', {
            className: 'btn btn--sm btn--icon',
            textContent: '-',
            onClick: () => { if (this.onZoomChange) this.onZoomChange(-0.2); },
        }));

        this._zoomLabel = el('span', { className: 'toolbar-zoom-label', textContent: '100%' });
        row.appendChild(this._zoomLabel);

        row.appendChild(el('button', {
            className: 'btn btn--sm btn--icon',
            textContent: '+',
            onClick: () => { if (this.onZoomChange) this.onZoomChange(0.2); },
        }));

        const gridBtn = el('button', {
            className: 'btn btn--sm btn--active',
            textContent: 'Grid',
            onClick: () => {
                const visible = this.onGridToggle ? this.onGridToggle() : true;
                gridBtn.classList.toggle('btn--active', visible);
            },
        });
        row.appendChild(gridBtn);

        this._fogToggleBtn = el('button', {
            className: 'btn btn--sm btn--active',
            textContent: 'Fog',
            onClick: () => {
                const visible = this.onFogToggle ? this.onFogToggle() : true;
                this._fogToggleBtn.classList.toggle('btn--active', visible);
            },
        });
        row.appendChild(this._fogToggleBtn);

        section.appendChild(row);
        this.toolbarEl.appendChild(section);
    }

    _buildActionButtons() {
        const section = el('div', { className: 'toolbar-section' });
        section.appendChild(el('div', { className: 'toolbar-section__title', textContent: 'Actions' }));

        const actions = [
            { id: 'save', label: 'Save', cls: 'btn--primary' },
            { id: 'load', label: 'Load', cls: '' },
            { id: 'export', label: 'Export', cls: '' },
            { id: 'png', label: 'PNG', cls: '' },
            { id: 'import', label: 'Import', cls: '' },
            { id: 'clear', label: 'Clear', cls: 'btn--danger' },
        ];

        const row = el('div', { className: 'toolbar-actions' });
        for (const action of actions) {
            row.appendChild(el('button', {
                className: `btn btn--sm ${action.cls}`,
                textContent: action.label,
                onClick: () => { if (this.onAction) this.onAction(action.id); },
            }));
        }
        section.appendChild(row);
        this.toolbarEl.appendChild(section);
    }

    _selectTool(toolId) {
        this.currentTool = toolId;
        const btns = this.toolbarEl.querySelectorAll('.toolbar-tool-btn');
        for (const btn of btns) {
            btn.classList.toggle('btn--active', btn.dataset.tool === toolId);
        }
        this._updateToolVisibility();
        if (this.onToolChange) this.onToolChange(toolId);
    }

    _selectTerrain(key) {
        this.currentTerrain = key;
        const swatches = this.toolbarEl.querySelectorAll('.terrain-swatch');
        for (const s of swatches) {
            s.classList.toggle('terrain-swatch--active', s.dataset.terrain === key);
        }
        if (this.onTerrainSelect) this.onTerrainSelect(key);
    }

    _selectBrushSize(size) {
        this.brushSize = size;
        const btns = this.toolbarEl.querySelectorAll('.toolbar-brush-btn');
        for (const btn of btns) {
            btn.classList.toggle('btn--active', parseInt(btn.dataset.brush) === size);
        }
        if (this.onBrushSizeChange) this.onBrushSizeChange(size);
    }

    _updateToolVisibility() {
        const terrainSection = this.toolbarEl.querySelector('.toolbar-terrain-section');
        const tokenSection = this.toolbarEl.querySelector('.toolbar-token-section');
        const brushSection = this.toolbarEl.querySelector('.toolbar-brush-section');

        const showTerrain = ['paint', 'rect', 'line', 'fill'].includes(this.currentTool);
        const showBrush = ['paint', 'erase', 'fog'].includes(this.currentTool);

        if (terrainSection) terrainSection.style.display = showTerrain ? '' : 'none';
        if (tokenSection) tokenSection.style.display = (this.currentTool === 'token') ? '' : 'none';
        if (brushSection) brushSection.style.display = showBrush ? '' : 'none';
    }

    getTokenConfig() {
        return {
            type: this._tokenTypeSelect.value,
            label: this._tokenLabelInput.value || this._tokenTypeSelect.value.charAt(0).toUpperCase(),
            color: this._tokenColorInput.value,
            size: parseInt(this._tokenSizeSelect.value) || 1,
        };
    }

    updateUndoRedo(canUndo, canRedo) {
        if (this._undoBtn) this._undoBtn.disabled = !canUndo;
        if (this._redoBtn) this._redoBtn.disabled = !canRedo;
    }

    updateZoomLabel(zoom) {
        if (this._zoomLabel) {
            this._zoomLabel.textContent = Math.round(zoom * 100) + '%';
        }
    }

    updateGridSize(rows, cols) {
        if (this._rowsInput) this._rowsInput.value = rows;
        if (this._colsInput) this._colsInput.value = cols;
    }
}
