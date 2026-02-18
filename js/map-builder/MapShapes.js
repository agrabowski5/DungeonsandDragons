/**
 * Get all grid cells forming a filled rectangle between two corners.
 * @param {{ row: number, col: number }} start
 * @param {{ row: number, col: number }} end
 * @returns {Array<{ r: number, c: number }>}
 */
export function getRectCells(start, end) {
    const cells = [];
    const minR = Math.min(start.row, end.row);
    const maxR = Math.max(start.row, end.row);
    const minC = Math.min(start.col, end.col);
    const maxC = Math.max(start.col, end.col);
    for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
            cells.push({ r, c });
        }
    }
    return cells;
}

/**
 * Get all grid cells along a line using Bresenham's algorithm.
 * @param {{ row: number, col: number }} start
 * @param {{ row: number, col: number }} end
 * @returns {Array<{ r: number, c: number }>}
 */
export function getLineCells(start, end) {
    const cells = [];
    let x0 = start.col, y0 = start.row;
    const x1 = end.col, y1 = end.row;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
        cells.push({ r: y0, c: x0 });
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
    return cells;
}
