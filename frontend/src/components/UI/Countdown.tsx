import { useState, useEffect } from 'react';

interface CountdownProps {
  targetHours?: number;
}

export default function Countdown({ targetHours = 12 }: CountdownProps) {
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      {[
        { label: 'Hrs', value: time.h },
        { label: 'Min', value: time.m },
        { label: 'Sec', value: time.s }
      ].map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="bg-white text-neutral-900 px-3 py-2 rounded-lg font-mono font-bold text-lg min-w-[52px] text-center">
            {pad(item.value)}
          </div>
          <span className="text-xs uppercase text-neutral-500">{item.label}</span>
          {idx < 2 && <span className="text-neutral-400 font-bold">:</span>}
        </div>
      ))}
    </div>
  );
}
