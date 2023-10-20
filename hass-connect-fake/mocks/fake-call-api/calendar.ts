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

export function generateEvents(): Event[] {
  const events: Event[] = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const numEventsToday = getRandomInt(1, 4);

    for (let i = 0; i < numEventsToday; i++) {
      const startTime = new Date(Date.UTC(currentYear, currentMonth, day, getRandomInt(0, 23), getRandomInt(0, 59), getRandomInt(0, 59)));
      const durationInMinutes = getRandomInt(15, 180); // 15 mins to 3 hours
      const endTime = new Date(startTime.getTime() + durationInMinutes * 60 * 1000);

      const event: Event = {
        start: {
          dateTime: startTime.toISOString(),
        },
        end: {
          dateTime: endTime.toISOString(),
        },
        summary: `An event ${i + 1}`,
        description: eventDescription,
        location: "https://apple.zoom.us/j/984864?pwd=04444XdYWko0UVU2eFdTcTNFdz09",
        uid: "c1eoj2ki6p1k1bd7cah1vdajve_R20230807T000000@google.com",
        recurrence_id: "c1eoj2ki6pe_202310011k1bd7cah1vdajvT230000Z",
        rrule: null
      };

      events.push(event);
    }
  }

  return events;
}