'use client';

import type { PinConnection } from '@/types/project';

const WIRE_COLOR_MAP: Record<string, { bg: string; label: string }> = {
  red:    { bg: 'bg-red-500',    label: 'אדום'   },
  black:  { bg: 'bg-gray-800',   label: 'שחור'   },
  yellow: { bg: 'bg-yellow-400', label: 'צהוב'   },
  green:  { bg: 'bg-green-500',  label: 'ירוק'   },
  blue:   { bg: 'bg-blue-500',   label: 'כחול'   },
  orange: { bg: 'bg-orange-500', label: 'כתום'   },
  white:  { bg: 'bg-gray-200 border border-gray-400', label: 'לבן' },
};

interface Props {
  connections: PinConnection[];
  wiringTextHe?: string;
}

export function WiringGuide({ connections, wiringTextHe }: Props) {
  if ((!connections || connections.length === 0) && !wiringTextHe) return null;

  return (
    <div className="space-y-4">
      {wiringTextHe && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 leading-relaxed">
          <div className="flex gap-2 items-start">
            <span className="text-xl flex-shrink-0">📌</span>
            <p>{wiringTextHe}</p>
          </div>
        </div>
      )}

      {connections && connections.length > 0 && <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-1">
          <thead>
            <tr>
              <th className="text-right px-3 py-2 text-xs font-bold text-gray-400 uppercase">חוט</th>
              <th className="text-right px-3 py-2 text-xs font-bold text-gray-400 uppercase">מ...</th>
              <th className="text-right px-3 py-2 text-xs font-bold text-gray-400 uppercase">→</th>
              <th className="text-right px-3 py-2 text-xs font-bold text-gray-400 uppercase">אל...</th>
            </tr>
          </thead>
          <tbody>
            {connections.map((conn, i) => {
              const color = WIRE_COLOR_MAP[conn.wireColor] ?? { bg: 'bg-gray-400', label: conn.wireColor };
              return (
                <tr key={i} className="bg-white rounded-xl shadow-sm">
                  <td className="px-3 py-2.5 rounded-r-xl">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${color.bg}`} />
                      <span className="text-gray-500 text-xs">{color.label}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div>
                      <span className="font-semibold text-gray-800">{conn.fromComponent}</span>
                      <span className="text-gray-400 mx-1">·</span>
                      <span className="text-indigo-600 font-mono text-xs">{conn.fromPin}</span>
                    </div>
                    {conn.labelHe && <div className="text-xs text-gray-400">{conn.labelHe}</div>}
                  </td>
                  <td className="px-2 py-2.5 text-gray-400">→</td>
                  <td className="px-3 py-2.5 rounded-l-xl">
                    <span className="font-semibold text-gray-800">{conn.toComponent}</span>
                    <span className="text-gray-400 mx-1">·</span>
                    <span className="text-indigo-600 font-mono text-xs">{conn.toPin}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>}

      {/* Safety notice */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 text-xs text-red-700">
        <span className="flex-shrink-0">⚠️</span>
        <span>
          <strong>בטיחות:</strong> אל תחבר יותר מ-3.3V לפיני ה-ESP32. תמיד השתמש בנגד עם LED.
          בדוק את החיבורים לפני חיבור לחשמל.
        </span>
      </div>
    </div>
  );
}
