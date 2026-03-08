/**
 * Translates common AI provider errors to user-friendly Hebrew messages.
 */
export function translateAIError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);

  if (msg.includes('credit balance is too low') || msg.includes('insufficient_quota') || msg.includes('billing')) {
    return 'אין מספיק קרדיט בחשבון ה-AI. יש להוסיף קרדיט בהגדרות החשבון.';
  }
  if (msg.includes('invalid_api_key') || msg.includes('Incorrect API key') || msg.includes('API key')) {
    return 'מפתח ה-API אינו תקין. בדוק את הגדרות ה-.env.local.';
  }
  if (msg.includes('rate_limit') || msg.includes('rate limit') || msg.includes('429')) {
    return 'חריגה ממגבלת הקצב. המתן מספר שניות ונסה שוב.';
  }
  if (msg.includes('overloaded') || msg.includes('503') || msg.includes('529')) {
    return 'השרת עמוס כרגע. נסה שוב בעוד רגע.';
  }
  if (msg.includes('context_length') || msg.includes('max_tokens')) {
    return 'הבקשה ארוכה מדי. נסה לקצר את תיאור הפרויקט.';
  }

  return `שגיאה: ${msg.slice(0, 120)}`;
}
