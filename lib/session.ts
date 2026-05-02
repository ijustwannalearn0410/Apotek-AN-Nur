
const OPEN_HOUR = 9;
const CLOSE_HOUR = 21;
let fakeNow: Date | null = null;

export const setFakeTime = (date: Date) => {
  fakeNow = date;
};
setFakeTime(new Date("2026-03-27T10:00:00"));
export const clearFakeTime = () => {
  fakeNow = null;
};

export const getNow = () => {
  return fakeNow ?? new Date();
};


const getLocalDate = (date: Date) => {
  return date.toLocaleDateString("sv-SE"); 
};


export const isWithinOperatingHours = () => {
  const now = getNow();
  const hour = now.getHours();

  return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
};

export const getSessionForJoin = async () => {
  const now = getNow();
  const hour = now.getHours();

  let sessionDate = new Date(now);

 
  if (!(hour >= OPEN_HOUR && hour < CLOSE_HOUR)) {
    sessionDate.setDate(sessionDate.getDate() + 1);
  }

  return getLocalDate(sessionDate);
};


export const getCurrentSession = async () => {
  const now = getNow();
  const hour = now.getHours();

  if (!(hour >= OPEN_HOUR && hour < CLOSE_HOUR)) {
   return null;
  }

  return getLocalDate(now);
};