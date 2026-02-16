export function formatTemp(temp: number): string {
  return `${Math.round(temp)}°`;
}

export function formatTime(dtTxt: string): string {
  const date = new Date(dtTxt);
  return `${date.getHours()}시`;
}
