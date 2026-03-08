import type { SessionContext } from '@/types/session';
import type { ProjectStep } from '@/types/project';

const COMPONENT_NAMES_HE: Record<string, string> = {
  'esp32': 'לוח ESP32',
  'led-red': 'נורת LED אדומה',
  'led-green': 'נורת LED ירוקה',
  'led-blue': 'נורת LED כחולה',
  'led-yellow': 'נורת LED צהובה',
  'button': 'כפתור לחיצה',
  'resistor-220': 'נגד 220 אוהם',
  'resistor-330': 'נגד 330 אוהם',
  'resistor-10k': 'נגד 10K אוהם',
  'breadboard': 'לוח ניסויים (breadboard)',
  'oled-ssd1306': 'מסך OLED SSD1306',
  'buzzer': 'זמזם (buzzer)',
  'dht22': 'חיישן טמפרטורה DHT22',
  'ultrasonic-hcsr04': 'חיישן מרחק אולטראסוני HC-SR04',
  'potentiometer': 'פוטנציומטר',
  'servo': 'מנוע סרוו',
  'neopixel': 'LED RGB WS2812 (NeoPixel)',
  'pir-sensor': 'חיישן תנועה PIR',
  'photoresistor': 'נגד אור (LDR)',
  'jumper-wires': 'חוטי חיבור',
};

export function buildSuggestSystemPrompt(): string {
  return `אתה "ספארק" – רובוט מורה חביב ומלהיב לילדים בגילאי 8-14 שלומדים אלקטרוניקה ותכנות עם לוח ESP32 ו-MicroPython.
אתה מדבר עברית פשוטה וברורה. אתה מלהיב, סבלני, ומשבח כל הצלחה קטנה.

חזור תמיד בפורמט JSON בלבד, ללא טקסט נוסף, כך:
\`\`\`json
[
  {
    "id": "מזהה-קצר-בלועזית",
    "titleHe": "שם הפרויקט",
    "descriptionHe": "תיאור קצר ומרגש בשתי-שלוש משפטים",
    "difficulty": "beginner",
    "requiredComponents": ["esp32", "led-red"],
    "estimatedMinutes": 30,
    "emoji": "💡"
  }
]
\`\`\`
difficulty יכול להיות: beginner, intermediate, advanced
החזר בדיוק 3 הצעות שונות.`;
}

export function buildSuggestUserMessage(components: string[], difficulty: string): string {
  const compNames = components.map((c) => COMPONENT_NAMES_HE[c] ?? c).join(', ');
  return `הרכיבים שיש לי: ${compNames}
רמת הקושי שאני רוצה: ${difficulty === 'beginner' ? 'מתחיל' : difficulty === 'intermediate' ? 'בינוני' : 'מתקדם'}
הצע לי 3 פרויקטים מגניבים שאוכל לבנות עם הרכיבים האלה.`;
}

export function buildPlanSystemPrompt(): string {
  return `אתה "ספארק" – רובוט מורה מומחה ל-ESP32 עם MicroPython לילדים בגילאי 8-14.

חוקים:
- צור 4-5 שלבים בלבד (לא יותר!)
- כל שדה טקסט: עד 2 משפטים קצרים
- קוד: רק את הקוד הרלוונטי לשלב, לא קוד מלא. השתמש ב-MicroPython בלבד!
- lineExplanations: לכל היותר 3 שורות מרכזיות
- hintsHe: רמז אחד בלבד לכל שלב
- בטיחות: רק בשלב הראשון לציין "לא מעל 3.3V"

החזר JSON בלבד, בתוך \`\`\`json ... \`\`\`:
\`\`\`json
{
  "id": "project-id",
  "titleHe": "שם קצר",
  "descriptionHe": "תיאור במשפט אחד",
  "difficulty": "beginner",
  "requiredComponents": ["esp32", "led-red", "resistor-220"],
  "steps": [
    {
      "id": "step-1",
      "stepNumber": 1,
      "titleHe": "שם השלב",
      "descriptionHe": "מה עושים",
      "connections": [
        {"fromComponent": "esp32", "fromPin": "GPIO4", "toComponent": "resistor1", "toPin": "כניסה", "wireColor": "yellow"}
      ],
      "wiringTextHe": "חבר את הנגד לפין GPIO4",
      "code": {
        "filename": "main.py",
        "code": "from machine import Pin\\nimport time\\n\\nled = Pin(4, Pin.OUT)\\nwhile True:\\n    led.on()\\n    time.sleep(0.5)\\n    led.off()\\n    time.sleep(0.5)",
        "explanationHe": "הקוד מהבהב את הנורה",
        "lineExplanations": {"1": "ייבוא מחלקת Pin מספריית machine"}
      },
      "successCriteriaHe": "הנורה מהבהבת",
      "hintsHe": ["ודא שהנגד מחובר"],
      "estimatedMinutes": 15
    }
  ]
}
\`\`\``;
}

export function buildPlanUserMessage(
  projectIdea: string,
  components: string[],
  difficulty: string,
  childName?: string
): string {
  const compNames = components.map((c) => COMPONENT_NAMES_HE[c] ?? c).join(', ');
  const nameStr = childName ? `שם הילד: ${childName}\n` : '';
  return `${nameStr}רעיון הפרויקט: ${projectIdea}
רכיבים זמינים: ${compNames}
רמת קושי: ${difficulty === 'beginner' ? 'מתחיל' : difficulty === 'intermediate' ? 'בינוני' : 'מתקדם'}
צור תוכנית פרויקט מלאה.`;
}

export function buildTutorSystemPrompt(session: SessionContext): string {
  const currentStep = session.projectPlan?.steps[session.currentStepIndex] as ProjectStep | undefined;
  const totalSteps = session.projectPlan?.steps.length ?? 0;
  const compNames = session.availableComponents
    .map((c) => COMPONENT_NAMES_HE[c] ?? c)
    .join(', ');
  const currentCode = Object.entries(session.code)
    .map(([f, c]) => `// ${f}\n${c}`)
    .join('\n\n');

  return `אתה "ספארק" – רובוט מורה חביב ומלהיב לילדים בגילאי 8-14 שלומדים ESP32 עם MicroPython.
אתה מדבר עברית פשוטה, מעודד ומשבח הצלחות.

===== הקשר נוכחי =====
${session.childName ? `שם הילד: ${session.childName}` : ''}
פרויקט: ${session.projectPlan?.titleHe ?? 'לא נבחר'}
שלב נוכחי: ${currentStep ? `${session.currentStepIndex + 1} מתוך ${totalSteps} – ${currentStep.titleHe}` : 'טרם התחיל'}
${currentStep ? `מטרת השלב: ${currentStep.descriptionHe}` : ''}
${currentStep?.wiringTextHe ? `חיבורים בשלב זה: ${currentStep.wiringTextHe}` : ''}
רכיבים זמינים: ${compNames}
${currentCode ? `קוד נוכחי:\n${currentCode}` : ''}

===== כללי מענה =====
- הסבר: עד 120 מילה. מענה קצר: עד 40 מילה.
- קוד: MicroPython בלבד, עם הסבר לכל שורה אחרי הקוד.
- בטיחות: תזכיר שלא לחבר מעל 3.3V לפיני ESP32, תמיד להשתמש בנגד עם LED.
- אם הילד תקוע: תן רמזים בהדרגה, לא את כל הפתרון מיד.
- חגוג הצלחות!
- אם שואלים שאלה לא קשורה ל-ESP32/MicroPython/אלקטרוניקה, הסבר בנועם שאתה מתמחה בנושאים אלה.`;
}
