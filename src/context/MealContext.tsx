import { createContext, useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

const MealContext = createContext<any>(null);

export function MealProvider({ children }: any) {
  const { currentUser, currentProfile } = useAuth();

  const [meals, setMeals] = useState<any[]>([]);
  const [joinedMealIds, setJoinedMealIds] = useState<string[]>([]);
  const [friendUids, setFriendUids] = useState<string[]>([]);

  const getMealKey = (meal: any) => meal.firebaseId || String(meal.id);

  const isWithin24Hours = (createdAt: string) => {
    if (!createdAt) return false;
    const hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    return hours < 24;
  };

  useEffect(() => {
    const mealsQuery = query(collection(db, "meals"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(mealsQuery, (snapshot) => {
      const firebaseMeals = snapshot.docs.map((docSnap) => ({
        firebaseId: docSnap.id,
        ...docSnap.data(),
      }));

      const activeMeals = firebaseMeals.filter((meal: any) =>
        isWithin24Hours(meal.createdAt)
      );

      setMeals(activeMeals);

      if (currentUser?.uid) {
        const joinedIds = activeMeals
          .filter((meal: any) => (meal.attendeesUids || []).includes(currentUser.uid))
          .map((meal: any) => meal.firebaseId);

        setJoinedMealIds(joinedIds);
      }
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "friendRequests"), (snapshot) => {
      const allRequests = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      const accepted = allRequests.filter(
        (request: any) =>
          request.status === "accepted" &&
          (request.fromUid === currentUser?.uid || request.toUid === currentUser?.uid)
      );

      const uids = accepted.map((request: any) =>
        request.fromUid === currentUser?.uid ? request.toUid : request.fromUid
      );

      setFriendUids(uids);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const addMeal = async (newMeal: any) => {
    if (!currentUser || !currentProfile) return;

    await addDoc(collection(db, "meals"), {
      ...newMeal,
      creatorUid: currentUser.uid,
      creatorName: currentProfile.name,
      creatorEmail: currentProfile.email,
      creatorPhoto: currentProfile.profilePhoto || "",
      name: currentProfile.name,
      email: currentProfile.email,
      profilePhoto: currentProfile.profilePhoto || "",
      attendees: 0,
      attendeesList: [],
      attendeesUids: [],
      attendeesPhotos: [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  const joinMeal = async (meal: any) => {
    if (!currentUser || !currentProfile || !meal.firebaseId) return;
    if (joinedMealIds.includes(getMealKey(meal))) return;
    if (meal.creatorUid === currentUser.uid) return;

    const updatedList = [...(meal.attendeesList || []), currentProfile.name];
    const updatedUids = [...(meal.attendeesUids || []), currentUser.uid];
    const updatedPhotos = [
      ...(meal.attendeesPhotos || []),
      {
        uid: currentUser.uid,
        name: currentProfile.name,
        photo: currentProfile.profilePhoto || "",
      },
    ];

    await updateDoc(doc(db, "meals", meal.firebaseId), {
      attendees: updatedUids.length,
      attendeesList: updatedList,
      attendeesUids: updatedUids,
      attendeesPhotos: updatedPhotos,
    });

    await addDoc(collection(db, "notifications"), {
      toUid: meal.creatorUid,
      fromUid: currentUser.uid,
      fromName: currentProfile.name,
      fromPhoto: currentProfile.profilePhoto || "",
      title: `${currentProfile.name} joined your meal`,
      detail: `${meal.location} • ${meal.mealType} • ${meal.time}`,
      icon: "👥",
      createdAt: new Date().toISOString(),
    });
  };

  const leaveMeal = async (meal: any) => {
    if (!currentUser || !meal.firebaseId) return;
    if (!(meal.attendeesUids || []).includes(currentUser.uid)) return;

    const updatedUids = (meal.attendeesUids || []).filter((uid: string) => uid !== currentUser.uid);
    const updatedList = (meal.attendeesList || []).filter((name: string) => name !== currentProfile?.name);
    const updatedPhotos = (meal.attendeesPhotos || []).filter((person: any) => person.uid !== currentUser.uid);

    await updateDoc(doc(db, "meals", meal.firebaseId), {
      attendees: updatedUids.length,
      attendeesUids: updatedUids,
      attendeesList: updatedList,
      attendeesPhotos: updatedPhotos,
    });
  };

  const deleteMeal = async (meal: any) => {
    if (!currentUser || !meal.firebaseId) return;
    if (meal.creatorUid !== currentUser.uid) return;

    await deleteDoc(doc(db, "meals", meal.firebaseId));
  };

  return (
    <MealContext.Provider
      value={{
        meals,
        addMeal,
        joinMeal,
        leaveMeal,
        deleteMeal,
        joinedMealIds,
        friendUids,
        currentUserName: currentProfile?.name || "You",
      }}
    >
      {children}
    </MealContext.Provider>
  );
}

export function useMeals() {
  return useContext(MealContext);
}