'use client';

import { cn } from '@/lib/utils/cn';

interface ComponentDef {
  id: string;
  nameHe: string;
  emoji: string;
  category: 'core' | 'output' | 'input' | 'sensor' | 'power';
}

const COMPONENTS: ComponentDef[] = [
  // Core
  { id: 'esp32',             nameHe: 'לוח ESP32',           emoji: '🟢', category: 'core' },
  { id: 'breadboard',        nameHe: 'לוח ניסויים',         emoji: '🔲', category: 'core' },
  { id: 'jumper-wires',      nameHe: 'חוטי חיבור',          emoji: '🔗', category: 'core' },
  // Output
  { id: 'led-red',           nameHe: 'LED אדומה',           emoji: '🔴', category: 'output' },
  { id: 'led-green',         nameHe: 'LED ירוקה',           emoji: '🟢', category: 'output' },
  { id: 'led-blue',          nameHe: 'LED כחולה',           emoji: '🔵', category: 'output' },
  { id: 'led-yellow',        nameHe: 'LED צהובה',           emoji: '🟡', category: 'output' },
  { id: 'oled-ssd1306',      nameHe: 'מסך OLED',            emoji: '📺', category: 'output' },
  { id: 'buzzer',            nameHe: 'זמזם',                emoji: '🔔', category: 'output' },
  { id: 'neopixel',          nameHe: 'LED RGB WS2812',      emoji: '🌈', category: 'output' },
  { id: 'servo',             nameHe: 'מנוע סרוו',           emoji: '⚙️', category: 'output' },
  // Input
  { id: 'button',            nameHe: 'כפתור לחיצה',         emoji: '🔘', category: 'input' },
  { id: 'potentiometer',     nameHe: 'פוטנציומטר',          emoji: '🎛️', category: 'input' },
  { id: 'photoresistor',     nameHe: 'נגד אור (LDR)',       emoji: '☀️', category: 'input' },
  // Sensors
  { id: 'dht22',             nameHe: 'חיישן טמפרטורה DHT22',emoji: '🌡️', category: 'sensor' },
  { id: 'ultrasonic-hcsr04', nameHe: 'חיישן מרחק אולטרסוני', emoji: '📡', category: 'sensor' },
  { id: 'pir-sensor',        nameHe: 'חיישן תנועה PIR',     emoji: '👁️', category: 'sensor' },
  // Power
  { id: 'resistor-220',      nameHe: 'נגד 220Ω',            emoji: '〰️', category: 'power' },
  { id: 'resistor-330',      nameHe: 'נגד 330Ω',            emoji: '〰️', category: 'power' },
  { id: 'resistor-10k',      nameHe: 'נגד 10kΩ',            emoji: '〰️', category: 'power' },
];

const PRESETS = [
  {
    nameHe: 'ערכת מתחילים',
    ids: ['esp32', 'breadboard', 'jumper-wires', 'led-red', 'led-green', 'button', 'resistor-220', 'resistor-330'],
  },
  {
    nameHe: 'ערכת מסך',
    ids: ['esp32', 'breadboard', 'jumper-wires', 'led-red', 'button', 'oled-ssd1306', 'resistor-220'],
  },
  {
    nameHe: 'ערכת חיישנים',
    ids: ['esp32', 'breadboard', 'jumper-wires', 'dht22', 'ultrasonic-hcsr04', 'oled-ssd1306', 'button'],
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  core: '🔧 חומרה בסיסית',
  output: '💡 פלטים',
  input: '🖱️ קלטים',
  sensor: '📡 חיישנים',
  power: '〰️ נגדים',
};

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function ComponentInventory({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const applyPreset = (ids: string[]) => onChange(ids);

  const categories = Array.from(new Set(COMPONENTS.map((c) => c.category)));

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-2">בחר ערכה מוכנה:</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.nameHe}
              onClick={() => applyPreset(p.ids)}
              className="px-3 py-1.5 text-sm rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {p.nameHe}
            </button>
          ))}
        </div>
      </div>

      {/* Component grid by category */}
      {categories.map((cat) => (
        <div key={cat}>
          <p className="text-sm font-semibold text-gray-500 mb-2">{CATEGORY_LABELS[cat]}</p>
          <div className="flex flex-wrap gap-2">
            {COMPONENTS.filter((c) => c.category === cat).map((comp) => {
              const isSelected = selected.includes(comp.id);
              return (
                <button
                  key={comp.id}
                  onClick={() => toggle(comp.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-150',
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                  )}
                >
                  <span>{comp.emoji}</span>
                  <span>{comp.nameHe}</span>
                  {isSelected && <span className="mr-1">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selected count */}
      {selected.length > 0 && (
        <p className="text-sm text-indigo-600 font-medium">
          נבחרו {selected.length} רכיבים
        </p>
      )}
    </div>
  );
}
