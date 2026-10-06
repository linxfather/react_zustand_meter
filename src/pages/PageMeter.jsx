import { useState } from "react";
import ReactSpeedometer from "react-d3-speedometer/slim"

export function PageMeter() {
  const [degree, setDegree] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      <div>
        <ReactSpeedometer 
          minValue="0" 
          maxValue="100" value={degree} 
          width={200} height={110}
          startColor="green"
          segments={5}
          endColor="red"
        />
      </div>
      <button className="bg-black p-3 cursor-pointer" onClick={setDegree.bind(null, v => v + 20)}>UP</button>
      <button className="bg-black p-3 cursor-pointer" onClick={setDegree.bind(null, v => v - 20)}>DOWN</button>
    </div>
  );
}