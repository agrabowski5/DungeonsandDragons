export class MapTokens {
    constructor(canvas, mapGrid, renderer, toolbar) {
        this.canvas = canvas;
        this.grid = mapGrid;
        this.renderer = renderer;
        this.toolbar = toolbar || null;

        this.tokenTemplate = { type: 'player', label: 'P', color: '#4a90d9', size: 1 };
        this.dragging = null;
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
        if (e.button === 2) return;
        const { row, col } = this.renderer.screenToGrid(e.clientX, e.clientY);
        if (!this.grid.inBounds(row, col)) return;

        const hit = this.grid.getTokenAt(row, col);
        if (hit) {
            this.dragging = {
                row: hit.anchorRow,
                col: hit.anchorCol,
                token: hit.token,
                offsetRow: row - hit.anchorRow,
                offsetCol: col - hit.anchorCol,
            };
            this.canvas.style.cursor = 'grabbing';
        } else {
            const config = this.toolbar
                ? this.toolbar.getTokenConfig()
                : this.tokenTemplate;
            const size = config.size || 1;
            if (!this.grid.isTokenPlacementBlocked(row, col, size)) {
                this.grid.setToken(row, col, { ...config });
                this.renderer.render();
            }
        }
    }

    _onPointerMove(_e) {
        if (!this.dragging) return;
        this.canvas.style.cursor = 'grabbing';
    }

    _onPointerUp(e) {
        if (!this.dragging) return;

        const { row, col } = this.renderer.screenToGrid(e.clientX, e.clientY);
        const newAnchorRow = row - (this.dragging.offsetRow || 0);
        const newAnchorCol = col - (this.dragging.offsetCol || 0);

        if (this.grid.inBounds(newAnchorRow, newAnchorCol) &&
            (newAnchorRow !== this.dragging.row || newAnchorCol !== this.dragging.col)) {
            this.grid.moveToken(this.dragging.row, this.dragging.col, newAnchorRow, newAnchorCol);
        }

        this.dragging = null;
        this.canvas.style.cursor = 'crosshair';
        this.renderer.render();
    }

    _onContextMenu(e) {
        e.preventDefault();
        const { row, col } = this.renderer.screenToGrid(e.clientX, e.clientY);
        if (!this.grid.inBounds(row, col)) return;

        const hit = this.grid.getTokenAt(row, col);
        if (hit) {
            this.grid.removeToken(hit.anchorRow, hit.anchorCol);
            this.renderer.render();
        }
    }
}
