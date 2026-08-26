import { db, auth } from "../lib/firebase";
import { ref, push, get, set } from "firebase/database";

import { getSessionForJoin } from "./session";
//backend parameter
export interface Queue {
  key?: string;
  uid: string;
  name: string;          
  age: string;           
  complaint: string;     
  phone: string;
  priorityReason?: string;
  queueNumber: number;
  status: "registered" | "waiting" | "in-progress" | "done"; 
  type: "normal" | "emergency"; 
  createdAt: number;
}
//frontend parameter
export interface PatientData {
  patientName: string;
  patientAge: string;
  complaint: string;
  priorityReason?: string;
}
//main function
export const joinQueue = async (type: "normal" | "emergency" = "normal", 
  uid: string,
patientData: PatientData) => {
 
  const userSnapshot = await get(ref(db, "users/" + uid));

  if (!userSnapshot.exists()) {
    throw new Error("Data user tidak ditemukan");
  }
  const sessionKey = await getSessionForJoin();
   if (!sessionKey) {
    throw new Error("Session tidak valid");
  }


  const userData = userSnapshot.val();

  const queueRef = ref(db, `queues/${sessionKey}/active`);
  const snapshot = await get(queueRef);

  let nextNumber = 1;

  if (snapshot.exists()) {
    const queues = snapshot.val();
    const queueArray = Object.values(queues) as Queue[];

    nextNumber = Math.max(...queueArray.map(q => q.queueNumber)) + 1;

    const alreadyQueued = queueArray.find(
      (q: any) => q.uid === uid && q.status !== "done"
    );

    if (alreadyQueued) {
      throw new Error("Kamu sudah mengambil nomor antrian");
    }
  }

  const newRef = push(queueRef);

  await set(newRef, {
    uid: uid,
    name: patientData.patientName,    
    age: patientData.patientAge,      
    complaint: patientData.complaint, 
    phone: userData.phone ?? "",      // fallback agar tidak undefined
    priorityReason: patientData.priorityReason ?? "",
    queueNumber: nextNumber,
    status: "registered",            
    type: type,                      
    createdAt: Date.now(),
  });

  return nextNumber;
};