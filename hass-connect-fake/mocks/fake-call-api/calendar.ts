interface Event {
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  summary: string;
  description: string;
  location: string;
  uid: string;
  recurrence_id: string;
  rrule: null;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const eventDescription = `──────────\n\nXXX is inviting you to a scheduled Zoom meeting.\n\nJoin Zoom Meeting\nhttps://apple.zoom.us/j/92780837478?pwd=Y09jbWko0UVU2eF0dkNXddz09\n\nMeeting ID: 651 3733 2422\nPasscode: 615\nOne tap mobile\n+981984984,,984864# US (Tacoma)\n+13017158592,,984864# US (Washington DC)\n\nDial by your location\n        +6 +655 564 929 US (Tacoma)\n        +1 654 658 489  US (Washington DC)\n        +4 818 849 974 US\n        +44 8484 8288 US (Chicago)\n        +5 5454 546 US (Houston)\n        +1 654 987 321 US\n        +1 654 654 654 US\n        +1 654 987 987 US (New York)\n        +1 321 654 987  US\n        +1 324 657 987 US\n        +1 456 789 123 US (San Jose)\n        +1 258 147 369 US\n        357 689 214 US Toll-free\n        159 489 789 US Toll-free\n        123 654 987 US Toll-free\n        159 489 7856 US Toll-free\nMeeting ID: 651 3733 8088\nFind your local number: https://apple.zoom.us/u/rvr3aFZa\n\n\n\n──────────`;

const _cache: Record<string, Event[]> = {};

export function generateEvents(endpoint: string): Event[] {
  const urlParams = new URLSearchParams(endpoint.split('?')[1]);
  const startParam = urlParams.get('start');
  const endParam = urlParams.get('end');

  if (!startParam || !endParam) {
    throw new Error('Missing start or end param in endpoint');
  }

  const startDate = new Date(startParam);
  const endDate = new Date(endParam);

  const events: Event[] = [];
  if (_cache[startDate.toISOString()]) {
    return _cache[startDate.toISOString()];
  }

  for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
    const numEvents = getRandomInt(0, 3);
    for (let i = 0; i < numEvents; i++) {
      const hour = getRandomInt(0, 23);
      const minute = getRandomInt(0, 3) * 15;
      const eventStart = new Date(day);
      eventStart.setHours(hour, minute);

      const duration = getRandomInt(1, 12) * 15;  // Duration in minutes (15 to 180 minutes)
      const eventEnd = new Date(eventStart);
      eventEnd.setMinutes(eventStart.getMinutes() + duration);

      const event: Event = {
        start: { dateTime: eventStart.toISOString() },
        end: { dateTime: eventEnd.toISOString() },
        summary: `Sample Event ${i}`,
        description: eventDescription,
        location: "https://apple.zoom.us/j/984864?pwd=04444XdYWko0UVU2eFdTcTNFdz09",
        uid: 'uid-' + i,
        recurrence_id: 'recurrence-' + i,
        rrule: null,
      };

      events.push(event);
    }
  }
  _cache[startDate.toISOString()] = events;

  return events;
}