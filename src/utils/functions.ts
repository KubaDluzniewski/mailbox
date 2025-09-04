import dayjs from 'dayjs';

/// Funkcja formatująca datę na string w określonym formacie.
export function dateToString(date: Date, format: string = 'DD.MM.YYYY HH:mm'): string {
  return dayjs(date).format(format);
}
