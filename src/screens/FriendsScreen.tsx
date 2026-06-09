import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { colors, shadow } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function FriendsScreen({ navigation }: any) {
  const { currentUser, currentProfile } = useAuth();

  const [tab, setTab] = useState("Friends");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const allUsers = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setUsers(allUsers.filter((user: any) => user.uid !== currentUser?.uid));
    });

    const unsubscribeRequests = onSnapshot(collection(db, "friendRequests"), (snapshot) => {
      const allRequests = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setRequests(allRequests);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeRequests();
    };
  }, [currentUser?.uid]);

  const acceptedRequests = requests.filter(
    (request: any) =>
      request.status === "accepted" &&
      (request.fromUid === currentUser?.uid || request.toUid === currentUser?.uid)
  );

  const friends = acceptedRequests
    .map((request: any) => {
      const friendUid =
        request.fromUid === currentUser?.uid ? request.toUid : request.fromUid;
      return users.find((user: any) => user.uid === friendUid);
    })
    .filter(Boolean);

  const pendingIncoming = requests.filter(
    (request: any) => request.status === "pending" && request.toUid === currentUser?.uid
  );

  const sentRequestUids = requests
    .filter((request: any) => request.fromUid === currentUser?.uid && request.status === "pending")
    .map((request: any) => request.toUid);

  const friendUids = friends.map((friend: any) => friend.uid);

  const suggestions = users.filter((user: any) => {
    const searchable = `${user.name || ""} ${user.major || ""} ${user.bio || ""}`.toLowerCase();
    return searchable.includes(search.toLowerCase()) && !friendUids.includes(user.uid);
  });

  const getUserByUid = (uid: string) => {
    return users.find((user: any) => user.uid === uid);
  };

  const UserAvatar = ({ user, size = 52 }: any) => {
    if (user?.profilePhoto) {
      return (
        <Image
          source={{ uri: user.profilePhoto }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginRight: 14,
            backgroundColor: colors.cream,
          }}
        />
      );
    }

    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          marginRight: 14,
          backgroundColor: colors.dustyRose,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: size * 0.48 }}>👤</Text>
      </View>
    );
  };

  const sendRequest = async (student: any) => {
    if (!currentUser || !currentProfile) return;

    await addDoc(collection(db, "friendRequests"), {
      fromUid: currentUser.uid,
      fromName: currentProfile.name,
      fromPhoto: currentProfile.profilePhoto || "",
      toUid: student.uid,
      toName: student.name,
      toPhoto: student.profilePhoto || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    await addDoc(collection(db, "notifications"), {
      toUid: student.uid,
      fromUid: currentUser.uid,
      fromName: currentProfile.name,
      fromPhoto: currentProfile.profilePhoto || "",
      title: `${currentProfile.name} sent you a friend request`,
      detail: "Open Friends to respond.",
      icon: "👥",
      createdAt: new Date().toISOString(),
    });

    Alert.alert("Sent", `Friend request sent to ${student.name}.`);
  };

  const acceptRequest = async (request: any) => {
    await updateDoc(doc(db, "friendRequests", request.id), {
      status: "accepted",
      acceptedAt: new Date().toISOString(),
    });

    await addDoc(collection(db, "notifications"), {
      toUid: request.fromUid,
      fromUid: currentUser?.uid,
      fromName: currentProfile?.name,
      fromPhoto: currentProfile?.profilePhoto || "",
      title: `${currentProfile?.name} accepted your friend request`,
      detail: "You are now friends.",
      icon: "✅",
      createdAt: new Date().toISOString(),
    });
  };

  const declineRequest = async (request: any) => {
    await deleteDoc(doc(db, "friendRequests", request.id));
  };

  const unfriend = async (friendUid: string, friendName: string) => {
    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove ${friendName} as a friend?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unfriend",
          style: "destructive",
          onPress: async () => {
            const friendship = requests.find(
              (request: any) =>
                request.status === "accepted" &&
                ((request.fromUid === currentUser?.uid && request.toUid === friendUid) ||
                  (request.fromUid === friendUid && request.toUid === currentUser?.uid))
            );

            if (friendship) {
              await deleteDoc(doc(db, "friendRequests", friendship.id));

              await addDoc(collection(db, "notifications"), {
                toUid: friendUid,
                fromUid: currentUser?.uid,
                fromName: currentProfile?.name,
                fromPhoto: currentProfile?.profilePhoto || "",
                title: `${currentProfile?.name} removed you`,
                detail: "You are no longer friends on MealMate.",
                icon: "👋",
                createdAt: new Date().toISOString(),
              });
            }
          },
        },
      ]
    );
  };

  const TabButton = ({ label }: any) => (
    <TouchableOpacity
      onPress={() => setTab(label)}
      style={{
        backgroundColor: tab === label ? colors.terracotta : colors.white,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          color: tab === label ? "white" : colors.text,
          fontWeight: tab === label ? "800" : "500",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 120 }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={{ color: colors.oliveGreen, fontSize: 16 }}>← Home</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 34, fontWeight: "800", marginTop: 18, color: colors.oliveGreen }}>
        Friends
      </Text>

      <Text style={{ color: colors.muted, marginTop: 8, marginBottom: 18 }}>
        Find real MealMate users and meal buddies.
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 18 }}>
        <TabButton label="Friends" />
        <TabButton label="Find Students" />
        <TabButton label="Requests" />
      </View>

      {tab === "Friends" && (
        <>
          {friends.length === 0 ? (
            <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 20, ...shadow }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>No friends yet</Text>
              <Text style={{ color: colors.muted, marginTop: 6 }}>
                Send or accept requests to build your meal circle.
              </Text>
            </View>
          ) : (
            friends.map((friend: any) => (
              <View
                key={friend.uid}
                style={{
                  backgroundColor: colors.white,
                  borderRadius: 26,
                  padding: 18,
                  marginBottom: 16,
                  ...shadow,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <UserAvatar user={friend} />

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>
                      {friend.name}
                    </Text>
                    <Text style={{ color: colors.muted }}>{friend.major || "Student"}</Text>
                    <Text style={{ marginTop: 6, color: colors.text }}>
                      {friend.bio || "Looking for meal buddies"}
                    </Text>
                    <Text style={{ marginTop: 8, color: colors.oliveGreen, fontWeight: "800" }}>
                      Friend
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => unfriend(friend.uid, friend.name)}
                  style={{
                    marginTop: 14,
                    backgroundColor: "#E57373",
                    paddingVertical: 11,
                    borderRadius: 16,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "800" }}>
                    Unfriend
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </>
      )}

      {tab === "Find Students" && (
        <>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search real users by name, major, or bio"
            style={{
              backgroundColor: colors.white,
              borderRadius: 18,
              padding: 15,
              marginBottom: 18,
              borderWidth: 1,
              borderColor: colors.dustyRose,
            }}
          />

          {suggestions.map((student: any) => {
            const requestSent = sentRequestUids.includes(student.uid);

            return (
              <View
                key={student.uid}
                style={{
                  backgroundColor: colors.white,
                  borderRadius: 26,
                  padding: 18,
                  marginBottom: 16,
                  ...shadow,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <UserAvatar user={student} />

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>
                      {student.name}
                    </Text>
                    <Text style={{ color: colors.muted }}>
                      {student.major || "Student"} • Class of {student.year || "2026"}
                    </Text>
                    <Text style={{ color: colors.text, marginTop: 8, lineHeight: 20 }}>
                      {student.bio || "Ready to meet new people over meals."}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => sendRequest(student)}
                  disabled={requestSent}
                  style={{
                    backgroundColor: requestSent ? colors.sageFern : colors.terracotta,
                    borderRadius: 18,
                    paddingVertical: 12,
                    alignItems: "center",
                    marginTop: 16,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "800" }}>
                    {requestSent ? "Request Sent" : "Add Friend"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </>
      )}

      {tab === "Requests" && (
        <>
          {pendingIncoming.length === 0 ? (
            <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 20, ...shadow }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>
                No pending requests
              </Text>
              <Text style={{ color: colors.muted, marginTop: 6 }}>
                New friend requests will appear here.
              </Text>
            </View>
          ) : (
            pendingIncoming.map((request: any) => {
              const requester = getUserByUid(request.fromUid);

              return (
                <View
                  key={request.id}
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: 26,
                    padding: 18,
                    marginBottom: 16,
                    ...shadow,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <UserAvatar user={requester || { profilePhoto: request.fromPhoto }} />

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>
                        {request.fromName} wants to connect
                      </Text>
                      <Text style={{ color: colors.muted, marginTop: 6 }}>Friend request</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", marginTop: 16 }}>
                    <TouchableOpacity
                      onPress={() => acceptRequest(request)}
                      style={{
                        backgroundColor: colors.terracotta,
                        borderRadius: 18,
                        paddingVertical: 12,
                        alignItems: "center",
                        flex: 1,
                        marginRight: 8,
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "800" }}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => declineRequest(request)}
                      style={{
                        backgroundColor: colors.cream,
                        borderRadius: 18,
                        paddingVertical: 12,
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <Text style={{ color: colors.text, fontWeight: "800" }}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </>
      )}
    </ScrollView>
  );
}