export function dateFromPocketbaseToReadableFormat(isoDate: string): string {
  const date = new Date(isoDate)
  return `
    ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}
