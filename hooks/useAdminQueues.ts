import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../lib/firebase";
import { getCurrentSession } from "../lib/session";
import { Queue } from "../lib/queueService"; 

export const useAdminQueues = () => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loadingData, setLoadingData] = useState(true); 

  useEffect(() => {
    let unsubscribe: any;

    // oberving sesion
    getCurrentSession().then((sessionKey) => {
      if (!sessionKey) {
        setLoadingData(false);
        return;
      }

      const queueRef = ref(db, `queues/${sessionKey}/active`);

      // observing firbase
      unsubscribe = onValue(queueRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.entries(data).map(([key, value]: any) => ({
            key, 
            ...value,
          }));
          setQueues(list);
        } else {
          setQueues([]);
        }
        setLoadingData(false); 
      });
    });

    // disable obeserver
    return () => { 
      if (unsubscribe) unsubscribe(); 
    };
  }, []);

 
  return { queues, loadingData };
};