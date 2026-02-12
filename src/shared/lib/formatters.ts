export function formatTime(dtTxt: string): string {
  const date = new Date(dtTxt);
  return `${date.getHours()}시`;
}
