import { drawTerrainPattern } from '../data/terrains.js';

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
        this._rafId = null;

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

        // Draw terrain
        for (let r = 0; r < this.grid.rows; r++) {
            for (let c = 0; c < this.grid.cols; c++) {
                const cell = this.grid.cells[r][c];
                const x = c * this.cellSize;
                const y = r * this.cellSize;
                drawTerrainPattern(ctx, x, y, this.cellSize, cell.terrain);
            }
        }

        // Draw grid lines
        if (this.showGrid) {
            this._drawGridLines(ctx);
        }

        // Draw tokens
        for (let r = 0; r < this.grid.rows; r++) {
            for (let c = 0; c < this.grid.cols; c++) {
                const cell = this.grid.cells[r][c];
                if (cell.token) {
                    this._drawToken(ctx, r, c, cell.token);
                }
            }
        }

        ctx.restore();
        ctx.restore();
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
        const x = col * this.cellSize + this.cellSize / 2;
        const y = row * this.cellSize + this.cellSize / 2;
        const radius = this.cellSize * 0.38;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(x + 1, y + 1, radius, 0, Math.PI * 2);
        ctx.fill();

        // Circle
        ctx.fillStyle = token.color || (token.type === 'player' ? '#4a90d9' : '#d94a4a');
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        if (token.label) {
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${Math.floor(this.cellSize * 0.4)}px Cinzel, serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(token.label.charAt(0).toUpperCase(), x, y + 1);
        }
    }

    screenToGrid(screenX, screenY) {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        const px = (screenX - rect.left);
        const py = (screenY - rect.top);

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
