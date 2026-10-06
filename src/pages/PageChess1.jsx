import ReactSpeedometer from "react-d3-speedometer/slim"
import EventEmitter3 from "eventemitter3";
import { useEffect, useState, memo } from "react";

const EV = new EventEmitter3();
let EV_RANDOM_COLORS = false;


const randomHex = () => 
  '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');

const randInt = (min, max) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

function initEV() {
  let evs = [];
  setInterval(() => {
    if (EV_RANDOM_COLORS) {
      let color = randomHex();
      let index = randInt(0, 24);
      EV.emit('R_RANDOM_COLOR', {color, index});
    }
  }, 1000);
  setInterval(() => {
    let initCount = evs.filter(v => v === 'init').length;
    let effectCount = evs.filter(v => v === 'effect').length;
    evs = [];
    EV.emit('R_STAT', {initCount, effectCount});
    console.log('TICK', {initCount, effectCount});
  }, 3000);
  EV.on('R_RENDER', (name) => {
    evs.push(name);
  });
}

function ChessItem({text, color, index}) {
  const [itemColor, setItemColor] = useState(null);
  EV.emit('R_RENDER', 'init');
  useEffect(() => {
    EV.emit('R_RENDER', 'effect');
    const fn = (ctx) => {
      if (ctx.index === index) {
        setItemColor(ctx.color);
      }
    };
    EV.on('R_RANDOM_COLOR', fn);
    return () => {
      EV.off('R_RANDOM_COLOR', fn);
    }
  });
  return (
    <div className="w-[40px] h-[40px] p-3 flex items-center" 
    style={{backgroundColor: itemColor ? itemColor : color}} >
      {text}
    </div>
  )
}

const MemoChessItem = memo(ChessItem);
const MemoReactSpeedometer = memo(ReactSpeedometer);

export function PageChess1() {
  if (!initEV._run) {
    initEV._run = true;
    initEV();
  }
  console.log('PageChess1 init');
  const [m1, setM1] = useState(0);
  const [m2, setM2] = useState(0);
  const [pColor, setPColor] = useState(false);
  const [pMemoDisabled, setPMemoDisabled] = useState(false);
  useEffect(() => {
    console.log('PageChess1 effect');
    const fn1 = (stat) => {
      setM1(Math.min(stat.initCount, 100));
      setM2(Math.min(stat.effectCount, 100));
    };
    EV.on('R_STAT', fn1);
    return () => {
      EV.off('R_STAT', fn1);
    };
  });
  return (
    <>
    <div>SEE BROWSER TERMINAL</div>
    <div className="bg-mist-800 p-2 flex gap-5">
      <div className="w-[250px] flex flex-wrap gap-3">
        {
          (() => {
            let items = [];
            let ComponentName = MemoChessItem;
            if (pMemoDisabled) {
              ComponentName = ChessItem;
            }
            for (let i=0; i<25; i++) {
              items.push(<ComponentName 
                key={`k${i}`} 
                text={i} 
                color={pColor ? (i%2 === 0 ? 'black' : 'white') : 'black'} 
                index={i}
              />)
            }
            return items;
          })()
        }
      </div>
      <div className="flex flex-col gap-2">
        <div>
          INIT
          <MemoReactSpeedometer 
            value={m1}
            minValue="0" 
            maxValue="100"
            width={200} height={110}
            startColor="#7bf1a8"
            segments={10}
            endColor="#9f0712"
          />
        </div>
        <div>
          EFFECT
          <MemoReactSpeedometer
            value={m2}
            minValue="0" 
            maxValue="100"
            width={200} height={110}
            startColor="#7bf1a8"
            segments={10}
            endColor="#9f0712"
          />
        </div>
      </div>
      <div>
        <label><input className="mr-2" type="checkbox" onChange={(ev) => {
          setPColor(ev.target.checked)
        }} />Chess color</label><br />
        <label><input className="mr-2" type="checkbox" onChange={(ev) => {
          setPMemoDisabled(ev.target.checked)
        }} />Disable memo</label><br />
        <label><input className="mr-2" type="checkbox" onChange={(ev) => {
          EV_RANDOM_COLORS = ev.target.checked;
        }} />Random colors</label>
      </div>
    </div>
    </>
  );
}