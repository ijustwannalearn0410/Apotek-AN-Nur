const OPEN_HOUR = 9;
const CLOSE_HOUR = 21;

const getLocalDate = (date: Date) => {
  return date.toLocaleDateString("sv-SE"); 
};

export const isWithinOperatingHours = () => {
  const now = new Date();
  const hour = now.getHours();

  return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
};

export const getSessionForJoin = async () => {
  const now = new Date();
  const hour = now.getHours();

  let sessionDate = new Date(now);

  if (!(hour >= OPEN_HOUR && hour < CLOSE_HOUR)) {
    sessionDate.setDate(sessionDate.getDate() + 1);
  }

  return getLocalDate(sessionDate);
};

export const getCurrentSession = async () => {
  const now = new Date();
  const hour = now.getHours();

  if (!(hour >= OPEN_HOUR && hour < CLOSE_HOUR)) {
    return null;
  }

  return getLocalDate(now);
};