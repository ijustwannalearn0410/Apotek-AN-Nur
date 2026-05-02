
import { ref, push, get, child,  update,  } from "firebase/database";
import { db } from "./firebase";
import { getCurrentSession } from "./session";
export const callNextQueue = async () => {
  const sessionKey = await getCurrentSession();
     if (!sessionKey) {
      throw new Error("Session tidak valid");
    }
  const snapshot = await get(ref(db, `queues/${sessionKey}/active`));

  if (!snapshot.exists()) return;

  const queues = snapshot.val();

  const queueList = Object.entries(queues).map(([key, value]: any) => ({
    key,
    ...value,
  }));
  const historySnapshot = await get(ref(db, `history/${sessionKey}/finished/`));
const current = queueList.find((q) => q.status === "in-progress");
//algoritma
let normalCount = 0;
let usedEmergencySlots = 0;

if (historySnapshot.exists()) {
  const history = Object.values(historySnapshot.val()) as any[];

  for (let i = 0; i < history.length; i++) {
    const h = history[i];

    if (h.type === "normal") {
      normalCount++;
    }

    if (h.type === "emergency") {
      const expectedSlots = Math.floor(normalCount / 3);

      if (usedEmergencySlots < expectedSlots) {
        usedEmergencySlots++;
      }
    }
  }
}
if (current) {
  if (current.type === "normal") {
    normalCount++;
  }

  if (current.type === "emergency") {
    const expectedSlots = Math.floor(normalCount / 3);

    if (usedEmergencySlots < expectedSlots) {
      usedEmergencySlots++;
    }
  }
}
const expectedEmergencySlots = Math.floor(normalCount / 3);

const emergencySlotOpen =
  normalCount >= 3 &&
  usedEmergencySlots < expectedEmergencySlots;//??

  

  const waitingQueues = queueList
  .filter((q) => q.status === "checked-in")
  .sort((a, b) => a.queueNumber - b.queueNumber);

let next = null;

const nextEmergency = waitingQueues.find(q => q.type === "emergency");

if (emergencySlotOpen && nextEmergency) {
  next = nextEmergency;
} else {
  next = waitingQueues[0];
}
   const updates: any = {};
 if (current) {
    const historyKey = push(ref(db, `history/${sessionKey}/finished`)).key;

    const historyData = {
  ...current,
  status: "done",
  finishedAt: Date.now(),
  session: sessionKey, 
};
updates[`history/${sessionKey}/finished/${historyKey}`] = historyData;
updates[`historyByUser/${current.uid}/${historyKey}`] = historyData;

   updates[`queues/${sessionKey}/active/${current.key}`] = null;
  }



  if (next) {
    updates[`queues/${sessionKey}/active/${next.key}/status`] = "in-progress";
    console.log("servedNormalCount:", normalCount);
console.log("emergencySlotOpen:", emergencySlotOpen);
console.log("waitingQueues:", waitingQueues);
console.log("expected emergency:", expectedEmergencySlots);
console.log("served emergency:", usedEmergencySlots);
  }

  await update(ref(db), updates);
};
export const checkInQueue = async (key: string) => {
  const sessionKey = await getCurrentSession();
     if (!sessionKey) {
      throw new Error("Session tidak valid");
    }
  await update(ref(db, `queues/${sessionKey}/active/${key}`), {
    status: "checked-in",
  });
};
//