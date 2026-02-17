export class MapTokens {
    constructor(canvas, mapGrid, renderer) {
        this.canvas = canvas;
        this.grid = mapGrid;
        this.renderer = renderer;

        this.tokenTemplate = { type: 'player', label: 'P', color: '#4a90d9' };
        this.dragging = null; // { row, col, token }
        this.enabled = false;

        this._onPointerDown = this._onPointerDown.bind(this);
        this._onPointerMove = this._onPointerMove.bind(this);
        this._onPointerUp = this._onPointerUp.bind(this);
        this._onContextMenu = this._onContextMenu.bind(this);
    }

    enable() {
        if (this.enabled) return;
        this.enabled = true;
        this.canvas.addEventListener('pointerdown', this._onPointerDown);
        this.canvas.addEventListener('pointermove', this._onPointerMove);
        this.canvas.addEventListener('pointerup', this._onPointerUp);
        this.canvas.addEventListener('contextmenu', this._onContextMenu);
    }

    disable() {
        if (!this.enabled) return;
        this.enabled = false;
        this.dragging = null;
        this.canvas.removeEventListener('pointerdown', this._onPointerDown);
        this.canvas.removeEventListener('pointermove', this._onPointerMove);
        this.canvas.removeEventListener('pointerup', this._onPointerUp);
        this.canvas.removeEventListener('contextmenu', this._onContextMenu);
    }

    setTokenTemplate(template) {
        this.tokenTemplate = { ...template };
    }

    _onPointerDown(e) {
        if (e.button === 2) return; // right-click handled in contextmenu
        const { row, col } = this.renderer.screenToGrid(e.clientX, e.clientY);
        if (!this.grid.inBounds(row, col)) return;

        const cell = this.grid.getCell(row, col);
        if (cell.token) {
            // Start dragging existing token
            this.dragging = { row, col, token: cell.token };
            this.canvas.style.cursor = 'grabbing';
        } else {
            // Place new token
            this.grid.setToken(row, col, { ...this.tokenTemplate });
            this.renderer.render();
        }
    }

    _onPointerMove(e) {
        if (!this.dragging) return;
        this.canvas.style.cursor = 'grabbing';
    }

    _onPointerUp(e) {
        if (!this.dragging) return;

        const { row, col } = this.renderer.screenToGrid(e.clientX, e.clientY);
        if (this.grid.inBounds(row, col) && (row !== this.dragging.row || col !== this.dragging.col)) {
            const targetCell = this.grid.getCell(row, col);
            if (!targetCell.token) {
                this.grid.moveToken(this.dragging.row, this.dragging.col, row, col);
            }
        }

        this.dragging = null;
        this.canvas.style.cursor = 'crosshair';
        this.renderer.render();
    }

    _onContextMenu(e) {
        e.preventDefault();
        const { row, col } = this.renderer.screenToGrid(e.clientX, e.clientY);
        if (!this.grid.inBounds(row, col)) return;

        const cell = this.grid.getCell(row, col);
        if (cell.token) {
            this.grid.removeToken(row, col);
            this.renderer.render();
        }
    }
}
