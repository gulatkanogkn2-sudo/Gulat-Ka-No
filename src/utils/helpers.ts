import { systemSettingsService } from '../services/systemSettingsService';

export function formatDate(dateInput: string | Date | number, overrideFormat?: string): string {
  if (!dateInput) return 'N/A';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'N/A';

  try {
    const settings = systemSettingsService.getSettings();
    const formatPattern = overrideFormat || settings.general?.dateFormat || 'YYYY-MM-DD HH:mm';
    
    let tz = settings.general?.timezone || 'Asia/Manila';
    if (tz.includes(' (')) {
      tz = tz.split(' (')[0];
    }

    if (formatPattern === 'ISO 8601') {
      return date.toISOString();
    }

    const options: Intl.DateTimeFormatOptions = {
      timeZone: tz.startsWith('UTC') ? 'UTC' : tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: formatPattern.includes('hh') || formatPattern.includes('AM'),
    };

    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
    const partMap: Record<string, string> = {};
    parts.forEach((p) => {
      partMap[p.type] = p.value;
    });

    const YYYY = partMap.year || '';
    const MM = partMap.month || '';
    const DD = partMap.day || '';
    const HH = partMap.hour || '';
    const mm = partMap.minute || '';
    const dayPeriod = partMap.dayPeriod ? ` ${partMap.dayPeriod.toUpperCase()}` : '';

    if (formatPattern.includes('DD/MM/YYYY')) {
      return `${DD}/${MM}/${YYYY} ${HH}:${mm}`;
    } else if (formatPattern.includes('MM/DD/YYYY')) {
      return `${MM}/${DD}/${YYYY} ${HH}:${mm}${dayPeriod}`;
    } else if (formatPattern.includes('YYYY-MM-DD')) {
      return `${YYYY}-${MM}-${DD} ${HH}:${mm}`;
    }
  } catch {
    // Fallback if formatting fails
  }

  return date.toLocaleDateString();
}

export function formatCurrency(amount: number, currency?: string): string {
  const settings = systemSettingsService.getSettings();
  const selectedCurrency = currency || settings.general?.currency || 'PHP';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency === 'USDT' ? 'USD' : selectedCurrency,
    }).format(amount);
  } catch {
    return `${selectedCurrency} ${amount.toFixed(2)}`;
  }
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
