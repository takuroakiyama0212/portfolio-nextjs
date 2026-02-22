import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ChargingSpot } from "@/data/mockData";

const SPOTS_COLLECTION = "spots";

export interface FirestoreSpot {
  name: string;
  address: string;
  venueType: string;
  latitude: number;
  longitude: number;
  outletCount: number;
  outletTypes: string[];
  hasOutlets?: boolean | null;
  powerConfidence?: number;
  communityYesVotes?: number;
  communityNoVotes?: number;
  phone?: string;
  hours?: string;
  tips?: string[];
  createdAt: Timestamp;
  createdBy: string;
}

export async function addSpotToFirestore(spot: Omit<FirestoreSpot, "createdAt" | "createdBy">, userEmail: string) {
  try {
    const docRef = await addDoc(collection(db, SPOTS_COLLECTION), {
      ...spot,
      createdAt: Timestamp.now(),
      createdBy: userEmail,
    });
    return { ok: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding spot to Firestore:", error);
    return { ok: false, error: "Failed to save spot." };
  }
}

export async function getSpotsFromFirestore(state?: string) {
  try {
    const spotsRef = collection(db, SPOTS_COLLECTION);
    let q = query(spotsRef);

    if (state && state !== "ALL") {
      // Note: Firestore doesn't support case-insensitive queries directly
      // You might need to store a normalized state field or use a different approach
      q = query(spotsRef, where("address", ">=", state), where("address", "<=", state + "\uf8ff"));
    }

    const querySnapshot = await getDocs(q);
    const spots: FirestoreSpot[] = [];
    querySnapshot.forEach((doc) => {
      spots.push({ id: doc.id, ...doc.data() } as FirestoreSpot & { id: string });
    });
    return { ok: true, spots };
  } catch (error) {
    console.error("Error getting spots from Firestore:", error);
    return { ok: false, error: "Failed to fetch spots.", spots: [] };
  }
}



