// TODO zustand
import ReactSpeedometer from "react-d3-speedometer/slim"
import { useEffect, useState, memo, useRef } from "react";
import { create as zustand_create } from "zustand";

// let EV_RANDOM_COLORS = false;

const randomHex = () => 
  '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');

const randInt = (min, max) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

//#region STORE
const useStore = zustand_create((set) => ({
  randomColorEnabled: false,
  setRandomColorEnabled(enabled) {
    set({randomColorEnabled: enabled});
  },
  randomColor: null,
  randomColorIndex: -1,
  setRandomColor(val, index) {
    set({randomColor: val, randomColorIndex: index});
  },
  initCount: 0,
  addInitCount() {
    set((state) => ({ initCount: Math.min(100, state.initCount + 1) }));
  },
  effectCount: 0,
  addEffectCount() {
    set((state) => ({ effectCount: Math.min(100, state.effectCount + 1) }));
  },
  decrementCount() {
    set((state) => {
      let effectCount = Math.max(0, state.effectCount - 110);
      let initCount   = Math.max(0, state.initCount - 110);
      return { effectCount, initCount }
    });
  }
}));
const useStoreArg = (name) => useStore(state => state[name]);

function useStore_init() {
  setInterval(() => {
    const {randomColorEnabled, setRandomColor} = useStore.getState();
    if (randomColorEnabled) {
      setRandomColor(randomHex(), randInt(0, 24));
    }
  }, 1000);
  setInterval(() => {
    useStore.getState().decrementCount();
  }, 3000);
}
useStore_init();
//#endregion

function ChessItem({text, color, index}) {
  const addInitCount   = useStoreArg('addInitCount');
  const addEffectCount = useStoreArg('addEffectCount');
  const itemColorValue = useRef(null);
  const itemColor = useStore(state => {
    if (state.randomColorIndex === index) {
      itemColorValue.current = state.randomColor;
      return state.randomColor;
    } else {
      return itemColorValue.current;
    }
  });
  addInitCount();
  useEffect(() => {
    addEffectCount();
  });
  return (
    <div className="w-[40px] h-[40px] p-3 flex items-center" 
    style={{backgroundColor: itemColor ? itemColor : color}} >
      {text}
    </div>
  )
}

const MemoChessItem = memo(ChessItem);

function PageChess2_ReactSpeedometer({valueName}) {
  const value = useStoreArg(valueName);
  return (
   <ReactSpeedometer
    value={value}
    minValue="0" 
    maxValue="100"
    width={200} height={110}
    startColor="#7bf1a8"
    segments={10}
    endColor="#9f0712"
    />
  )
}

const MemoReactSpeedometer = memo(PageChess2_ReactSpeedometer);

export function PageChess2() {
  console.log(Date.now(), 'PageChess1 init');
  const [pColor, setPColor] = useState(false);
  const [pMemoDisabled, setPMemoDisabled] = useState(false);
  const setRandomColorEnabled = useStoreArg('setRandomColorEnabled');
  useEffect(() => {
    console.log(Date.now(), 'PageChess1 effect');
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
          <MemoReactSpeedometer valueName={'initCount'} />
        </div>
        <div>
          EFFECT
          <MemoReactSpeedometer valueName={'effectCount'} />
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
          setRandomColorEnabled(ev.target.checked);
        }} />Random colors</label>
      </div>
    </div>
    </>
  );
}