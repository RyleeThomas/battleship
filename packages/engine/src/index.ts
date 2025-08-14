export type Cell = { x: number; y: number };
export type Ship = { name: string; size: number; cells: Cell[]; sunk?: boolean };
export type Board = { width: number; height: number; ships: Ship[]; hits: Cell[]; misses: Cell[] };
export type MoveResult = { result: 'hit' | 'miss' | 'sink'; shipName?: string };

export function createEmptyBoard(size = 10): Board {
  return { width: size, height: size, ships: [], hits: [], misses: [] };
}

export function placeShip(board: Board, ship: Omit<Ship,'cells'>, start: Cell, horizontal=true): Board {
  const cells: Cell[] = [];
  for (let i=0;i<ship.size;i++) {
    cells.push({ x: start.x + (horizontal? i : 0), y: start.y + (horizontal? 0 : i) });
  }
  // bounds & overlap checks
  if (cells.some(c => c.x<0 || c.y<0 || c.x>=board.width || c.y>=board.height)) {
    throw new Error('Ship out of bounds');
  }
  const occupied = new Set(board.ships.flatMap(s=>s.cells).map(c=>`${c.x},${c.y}`));
  if (cells.some(c => occupied.has(`${c.x},${c.y}`))) throw new Error('Overlap');
  return { ...board, ships: [...board.ships, { ...ship, cells }] };
}

export function applyMove(board: Board, move: Cell): MoveResult {
  const key = `${move.x},${move.y}`;
  const wasTried = new Set([...board.hits, ...board.misses].map(c=>`${c.x},${c.y}`));
  if (wasTried.has(key)) throw new Error('Duplicate move');

  for (const ship of board.ships) {
    if (ship.cells.some(c => c.x===move.x && c.y===move.y)) {
      board.hits.push(move);
      const hitsOnShip = board.hits.filter(h=>ship.cells.some(c=>c.x===h.x && c.y===h.y)).length;
      const sunk = hitsOnShip === ship.size;
      ship.sunk = sunk;
      return { result: sunk ? 'sink' : 'hit', shipName: ship.name };
    }
  }
  board.misses.push(move);
  return { result: 'miss' };
}

/** Basic heuristic AI: hunt/target using a parity scan and focus around last hit. */
export function aiChooseMove(boardView: { width:number;height:number; tried:Set<string>; lastHit?: Cell }): Cell {
  // If there was a last hit, probe its neighbors first
  const neigh = boardView.lastHit
    ? [
        {x:boardView.lastHit.x+1,y:boardView.lastHit.y},
        {x:boardView.lastHit.x-1,y:boardView.lastHit.y},
        {x:boardView.lastHit.x,y:boardView.lastHit.y+1},
        {x:boardView.lastHit.x,y:boardView.lastHit.y-1},
      ].filter(c=>c.x>=0 && c.y>=0 && c.x<boardView.width && c.y<boardView.height && !boardView.tried.has(`${c.x},${c.y}`))
    : [];
  if (neigh.length) return neigh[Math.floor(Math.random()*neigh.length)];
  // Parity hunt: only even-sum cells
  for (let y=0;y<boardView.height;y++){
    for (let x=(y%2); x<boardView.width; x+=2){
      const k = `${x},${y}`;
      if (!boardView.tried.has(k)) return {x,y};
    }
  }
  // fallback
  for (let y=0;y<boardView.height;y++){
    for (let x=0; x<boardView.width; x++){
      const k = `${x},${y}`;
      if (!boardView.tried.has(k)) return {x,y};
    }
  }
  throw new Error('No available moves');
}