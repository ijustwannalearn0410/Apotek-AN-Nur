"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "../../lib/firebase";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/Dashboard/Login");
      } else {
        try {
            //rolechecker
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists() && snapshot.val().role === "admin") {
            setLoading(false);
          } else {
            //rejecter
            alert("Akses ditolak: Anda bukan Admin.");
            router.push("/Login"); 
          }
        } catch (error) {
          console.error("Error checking role:", error);
          router.push("/Login");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <p>Memverifikasi Hak Akses Admin...</p>
    </div>
  );

  return <>{children}</>;
}