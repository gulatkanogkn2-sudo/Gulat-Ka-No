import { StoreConfig, DayOfWeek } from '../types/systemSettings';

export interface StoreStatusResult {
  isOpen: boolean;
  statusLabel: 'OPEN' | 'CLOSED';
  reason: string;
  nextScheduleText?: string;
}

export function getEffectiveStoreStatus(storeConfig?: StoreConfig): StoreStatusResult {
  if (!storeConfig) {
    return {
      isOpen: true,
      statusLabel: 'OPEN',
      reason: 'Store is active.',
    };
  }

  // 1. Overall Store Enabled Check
  if (!storeConfig.enabled || storeConfig.status === 'Inactive') {
    return {
      isOpen: false,
      statusLabel: 'CLOSED',
      reason: 'Store is disabled by administrator.',
    };
  }

  const caps = storeConfig.capabilities;
  const avail = storeConfig.availability;

  // 2. If Store Open/Close Control is OFF:
  if (!caps?.openCloseControl || !avail?.openCloseControlEnabled) {
    const isManualOpen = avail ? avail.manualStatus !== 'CLOSED' : storeConfig.enabled;
    return {
      isOpen: isManualOpen,
      statusLabel: isManualOpen ? 'OPEN' : 'CLOSED',
      reason: isManualOpen ? 'Store is open.' : 'Store is closed by administrator.',
    };
  }

  // 3. Open/Close Control is ON
  // Check Manual Temporary Override first
  if (avail.override === 'TEMPORARY_OPEN') {
    return {
      isOpen: true,
      statusLabel: 'OPEN',
      reason: 'Manual temporary open override active.',
    };
  }
  if (avail.override === 'TEMPORARY_CLOSED') {
    return {
      isOpen: false,
      statusLabel: 'CLOSED',
      reason: 'Manual temporary closed override active.',
    };
  }

  // Check Schedule Mode
  const mode = avail.scheduleMode || 'manual';

  if (mode === 'manual') {
    const isMOpen = avail.manualStatus === 'OPEN';
    return {
      isOpen: isMOpen,
      statusLabel: isMOpen ? 'OPEN' : 'CLOSED',
      reason: isMOpen ? 'Manual status set to OPEN.' : 'Manual status set to CLOSED.',
    };
  }

  // Get current Date & Time in Store Timezone or Default
  const now = new Date();
  const tz = avail.timezone || 'Asia/Manila';

  let currentDayOfWeek: DayOfWeek = 'monday';
  let currentTimeHHMM = '00:00';
  let currentDateYYYYMMDD = '2026-08-08';
  let currentDateTimeStr = '2026-08-08 00:00';

  try {
    const dayFormatter = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'long' });
    currentDayOfWeek = dayFormatter.format(now).toLowerCase() as DayOfWeek;

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const timeParts = timeFormatter.formatToParts(now);
    const hour = timeParts.find((p) => p.type === 'hour')?.value.padStart(2, '0') || '00';
    const minute = timeParts.find((p) => p.type === 'minute')?.value.padStart(2, '0') || '00';
    currentTimeHHMM = `${hour}:${minute}`;

    const dateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: tz });
    currentDateYYYYMMDD = dateFormatter.format(now);
    currentDateTimeStr = `${currentDateYYYYMMDD} ${currentTimeHHMM}`;
  } catch (err) {
    const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    currentDayOfWeek = days[now.getDay()];
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    currentTimeHHMM = `${h}:${m}`;
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    currentDateYYYYMMDD = `${yyyy}-${mm}-${dd}`;
    currentDateTimeStr = `${currentDateYYYYMMDD} ${currentTimeHHMM}`;
  }

  // MODE: Weekly Schedule
  if (mode === 'weekly') {
    const dayConfig = avail.weeklySchedule?.[currentDayOfWeek];
    if (!dayConfig || !dayConfig.enabled) {
      return {
        isOpen: false,
        statusLabel: 'CLOSED',
        reason: `Store closed on ${currentDayOfWeek.toUpperCase()} (Weekly Schedule).`,
      };
    }

    const openT = dayConfig.openTime || '09:00';
    const closeT = dayConfig.closeTime || '18:00';

    if (currentTimeHHMM >= openT && currentTimeHHMM <= closeT) {
      return {
        isOpen: true,
        statusLabel: 'OPEN',
        reason: `Weekly Schedule: Open today (${openT} – ${closeT} ${tz}).`,
        nextScheduleText: `Next closing: Today, ${closeT}`,
      };
    } else if (currentTimeHHMM < openT) {
      return {
        isOpen: false,
        statusLabel: 'CLOSED',
        reason: `Store opens at ${openT} today (${tz}).`,
        nextScheduleText: `Next opening: Today, ${openT}`,
      };
    } else {
      return {
        isOpen: false,
        statusLabel: 'CLOSED',
        reason: `Store closed at ${closeT} today (${tz}).`,
        nextScheduleText: `Next opening: Tomorrow`,
      };
    }
  }

  // MODE: Specific Days
  if (mode === 'specific_days') {
    const spec = avail.specificDays;
    if (!spec || !spec.days || !spec.days.includes(currentDayOfWeek)) {
      return {
        isOpen: false,
        statusLabel: 'CLOSED',
        reason: `Store is closed on ${currentDayOfWeek.toUpperCase()} in Specific Days mode.`,
      };
    }

    const openT = spec.openTime || '09:00';
    const closeT = spec.closeTime || '18:00';

    if (currentTimeHHMM >= openT && currentTimeHHMM <= closeT) {
      return {
        isOpen: true,
        statusLabel: 'OPEN',
        reason: `Open today (${openT} – ${closeT} ${tz}).`,
        nextScheduleText: `Next closing: Today, ${closeT}`,
      };
    } else {
      return {
        isOpen: false,
        statusLabel: 'CLOSED',
        reason: `Closed outside operational hours (${openT} – ${closeT}).`,
      };
    }
  }

  // MODE: Specific Date Ranges
  if (mode === 'specific_dates') {
    const ranges = avail.specificDateRanges || [];
    let isMatchingRange = false;
    let activeRangeLabel = '';

    for (const r of ranges) {
      const startStr = `${r.startDate} ${r.startTime || '00:00'}`;
      const endStr = `${r.endDate} ${r.endTime || '23:59'}`;

      if (currentDateTimeStr >= startStr && currentDateTimeStr <= endStr) {
        isMatchingRange = true;
        activeRangeLabel = r.label || `${startStr} to ${endStr}`;
        break;
      }
    }

    if (isMatchingRange) {
      return {
        isOpen: true,
        statusLabel: 'OPEN',
        reason: `Open under scheduled range: ${activeRangeLabel}`,
      };
    } else {
      return {
        isOpen: false,
        statusLabel: 'CLOSED',
        reason: 'Outside scheduled date range windows.',
      };
    }
  }

  return {
    isOpen: true,
    statusLabel: 'OPEN',
    reason: 'Store is active.',
  };
}
