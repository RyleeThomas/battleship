'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';
import type { Cell } from '@battleship/engine';
import { createEmptyBoard, placeShip, applyMove } from '@battleship/engine';

const supabase = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  : null as any;

export default function Home() {
  const [log, setLog] = useState<string[]>([]);
  const board = useMemo(()=>{
    let b = createEmptyBoard(10);
    b = placeShip(b, { name:'Destroyer', size:2 }, {x:0,y:0}, true);
    return b;
  }, []);

  function handleMove(x:number,y:number){
    const res = applyMove(board, {x,y});
    setLog(l => [`Move ${x},${y} -> ${res.result}${res.shipName? ' ' + res.shipName : ''}`, ...l]);
  }

  useEffect(()=>{
    // Example Supabase Realtime subscription scaffold
    if (!supabase) return;
    const channel = supabase.channel('moves').on('broadcast',
      { event: 'move' },
      (payload) => setLog(l=>[`(Realtime) ${JSON.stringify(payload)}`, ...l])
    ).subscribe();
    return ()=> { supabase.removeChannel(channel); };
  }, []);

  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Hello, Commander</h1>
      <p>This is a starter UI. Click cells to simulate moves and see the engine respond.</p>
      <div style={{ display:'grid', gridTemplateColumns: 'repeat(10, 32px)', gap: 4, marginTop: 16 }}>
        {Array.from({ length: 100 }).map((_,i)=>{
          const x = i % 10, y = Math.floor(i/10);
          return (
            <button key={i} onClick={()=>handleMove(x,y)} style={{ width:32, height:32, border:'1px solid #ccc', background:'#fafafa' }} />
          );
        })}
      </div>
      <h3 style={{ marginTop: 24 }}>Event Log</h3>
      <ul>
        {log.map((l,idx)=>(<li key={idx}>{l}</li>))}
      </ul>
    </section>
  );
}