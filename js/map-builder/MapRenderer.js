import { drawTerrainPattern } from '../data/terrains.js';
import { getRectCells, getLineCells } from './MapShapes.js';

export class MapRenderer {
    constructor(canvas, mapGrid) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = mapGrid;
        this.cellSize = 32;
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 1.0;
        this.showGrid = true;
        this.showFog = true;
        this._rafId = null;

        this.shapePreview = null;
        this.rulerOverlay = null;
        this.hoverCell = null;

        this.resizeCanvas();
    }

    render() {
        if (this._rafId) cancelAnimationFrame(this._rafId);
        this._rafId = requestAnimationFrame(() => this._draw());
    }

    _draw() {
        const ctx = this.ctx;
        const dpr = window.devicePixelRatio || 1;

        ctx.save();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.scale(dpr, dpr);
        ctx.save();
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(this.offsetX, this.offsetY);

        for (let r = 0; r < this.grid.rows; r++) {
            for (let c = 0; c < this.grid.cols; c++) {
                const cell = this.grid.cells[r][c];
                drawTerrainPattern(ctx, c * this.cellSize, r * this.cellSize, this.cellSize, cell.terrain);
            }
        }

        if (this.showGrid) {
            this._drawGridLines(ctx);
        }

        for (let r = 0; r < this.grid.rows; r++) {
            for (let c = 0; c < this.grid.cols; c++) {
                if (this.grid.cells[r][c].token) {
                    this._drawToken(ctx, r, c, this.grid.cells[r][c].token);
                }
            }
        }

        if (this.showFog) {
            this._drawFog(ctx);
        }

        if (this.shapePreview) {
            this._drawShapePreview(ctx);
        }

        if (this.rulerOverlay) {
            this._drawRuler(ctx);
        }

        ctx.restore();
        ctx.restore();

        if (this.hoverCell) {
            this._drawCoordOverlay();
        }
    }

    _drawGridLines(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 0.5;
        const totalW = this.grid.cols * this.cellSize;
        const totalH = this.grid.rows * this.cellSize;

        ctx.beginPath();
        for (let r = 0; r <= this.grid.rows; r++) {
            const y = r * this.cellSize;
            ctx.moveTo(0, y);
            ctx.lineTo(totalW, y);
        }
        for (let c = 0; c <= this.grid.cols; c++) {
            const x = c * this.cellSize;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, totalH);
        }
        ctx.stroke();
    }

    _drawToken(ctx, row, col, token) {
        const size = token.size || 1;
        const cs = this.cellSize;
        const x = col * cs;
        const y = row * cs;
        const w = size * cs;
        const h = size * cs;
        const cx = x + w / 2;
        const cy = y + h / 2;

        if (size === 1) {
            const radius = cs * 0.38;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.arc(cx + 1, cy + 1, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = token.color || (token.type === 'player' ? '#4a90d9' : '#d94a4a');
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        } else {
            const borderR = Math.min(w, h) * 0.12;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this._roundRect(ctx, x + 2, y + 2, w - 4, h - 4, borderR);
            ctx.fill();

            ctx.fillStyle = token.color || (token.type === 'player' ? '#4a90d9' : '#d94a4a');
            this._roundRect(ctx, x + 2, y + 2, w - 4, h - 4, borderR);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        if (token.label) {
            const fontSize = size === 1
                ? Math.floor(cs * 0.4)
                : Math.floor(cs * 0.4 * Math.sqrt(size));
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${fontSize}px Cinzel, serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const text = size === 1
                ? token.label.charAt(0).toUpperCase()
                : token.label.toUpperCase().slice(0, 3);
            ctx.fillText(text, cx, cy + 1);
        }

        if (size > 1) {
            const badges = { 2: 'L', 3: 'H', 4: 'G' };
            ctx.font = `bold ${Math.floor(cs * 0.28)}px Cinzel, serif`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText(badges[size] || '', x + w - 4, y + h - 3);
        }
    }

    _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    _drawFog(ctx) {
        for (let r = 0; r < this.grid.rows; r++) {
            for (let c = 0; c < this.grid.cols; c++) {
                if (this.grid.cells[r][c].fog) {
                    ctx.fillStyle = 'rgba(5, 5, 10, 0.85)';
                    ctx.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }
    }

    _drawShapePreview(ctx) {
        const { start, end, tool } = this.shapePreview;
        const cells = tool === 'rect'
            ? getRectCells(start, end)
            : getLineCells(start, end);

        ctx.fillStyle = 'rgba(212, 160, 23, 0.3)';
        ctx.strokeStyle = 'rgba(212, 160, 23, 0.6)';
        ctx.lineWidth = 1;

        for (const { r, c } of cells) {
            if (r >= 0 && r < this.grid.rows && c >= 0 && c < this.grid.cols) {
                ctx.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
                ctx.strokeRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }

    _drawRuler(ctx) {
        const { start, end } = this.rulerOverlay;
        const cs = this.cellSize;
        const x1 = start.col * cs + cs / 2;
        const y1 = start.row * cs + cs / 2;
        const x2 = end.col * cs + cs / 2;
        const y2 = end.row * cs + cs / 2;

        ctx.strokeStyle = 'rgba(240, 192, 64, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(240, 192, 64, 0.6)';
        ctx.beginPath();
        ctx.arc(x1, y1, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x2, y2, 4, 0, Math.PI * 2);
        ctx.fill();

        const dRow = Math.abs(end.row - start.row);
        const dCol = Math.abs(end.col - start.col);
        const gridDist = Math.max(dRow, dCol);
        const ftDist = gridDist * 5;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const label = `${gridDist} sq / ${ftDist} ft`;

        ctx.font = 'bold 11px Cinzel, serif';
        const textWidth = ctx.measureText(label).width;
        const pad = 6;

        ctx.fillStyle = 'rgba(10, 10, 20, 0.9)';
        ctx.fillRect(mx - textWidth / 2 - pad, my - 9, textWidth + pad * 2, 18);
        ctx.strokeStyle = 'rgba(212, 160, 23, 0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(mx - textWidth / 2 - pad, my - 9, textWidth + pad * 2, 18);

        ctx.fillStyle = '#f0c040';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, mx, my);
    }

    _drawCoordOverlay() {
        const { row, col } = this.hoverCell;
        if (!this.grid.inBounds(row, col)) return;

        const colLabel = this._colToLetter(col);
        const label = `${colLabel}${row + 1}`;
        const dpr = window.devicePixelRatio || 1;
        const ctx = this.ctx;

        ctx.save();
        ctx.scale(dpr, dpr);

        ctx.font = 'bold 11px Cinzel, serif';
        const textWidth = ctx.measureText(label).width;
        const pad = 6;
        const boxW = textWidth + pad * 2;
        const boxH = 18;
        const cssW = this.canvas.width / dpr;
        const cssH = this.canvas.height / dpr;
        const x = cssW - boxW - 8;
        const y = cssH - boxH - 8;

        ctx.fillStyle = 'rgba(10, 10, 20, 0.85)';
        ctx.strokeStyle = 'rgba(212, 160, 23, 0.6)';
        ctx.lineWidth = 1;
        ctx.fillRect(x, y, boxW, boxH);
        ctx.strokeRect(x, y, boxW, boxH);

        ctx.fillStyle = '#f0c040';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + boxW / 2, y + boxH / 2);

        ctx.restore();
    }

    _colToLetter(col) {
        let label = '';
        let n = col;
        do {
            label = String.fromCharCode(65 + (n % 26)) + label;
            n = Math.floor(n / 26) - 1;
        } while (n >= 0);
        return label;
    }

    setHoverCell(row, col) {
        const newCell = (row !== null && col !== null) ? { row, col } : null;
        const changed = (this.hoverCell?.row !== newCell?.row ||
                         this.hoverCell?.col !== newCell?.col);
        this.hoverCell = newCell;
        if (changed) this.render();
    }

    screenToGrid(screenX, screenY) {
        const rect = this.canvas.getBoundingClientRect();
        const px = screenX - rect.left;
        const py = screenY - rect.top;
        const x = (px / this.zoom) - this.offsetX;
        const y = (py / this.zoom) - this.offsetY;
        return {
            col: Math.floor(x / this.cellSize),
            row: Math.floor(y / this.cellSize),
        };
    }

    setZoom(level) {
        this.zoom = Math.max(0.3, Math.min(3, level));
        this.render();
    }

    toggleGrid() {
        this.showGrid = !this.showGrid;
        this.render();
        return this.showGrid;
    }

    toggleFogVisibility() {
        this.showFog = !this.showFog;
        this.render();
        return this.showFog;
    }

    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const parent = this.canvas.parentElement;
        if (!parent) return;
        const w = parent.clientWidth;
        const h = parent.clientHeight || 500;
        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.render();
    }

    getGridPixelSize() {
        return {
            width: this.grid.cols * this.cellSize,
            height: this.grid.rows * this.cellSize,
        };
    }
}
