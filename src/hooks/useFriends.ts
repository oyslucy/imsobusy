import { useCallback, useEffect, useState } from "react";
import { api, type ApiFriend, type ApiFriendRequest, type ApiSharedTask } from "@/lib/api";

export function useFriends(token: string) {
  const [friends, setFriends] = useState<ApiFriend[]>([]);
  const [requests, setRequests] = useState<ApiFriendRequest[]>([]);
  const [inbox, setInbox] = useState<ApiSharedTask[]>([]);

  const refresh = useCallback(async () => {
    try {
      const [nextFriends, nextRequests, nextInbox] = await Promise.all([
        api.listFriends(token),
        api.listFriendRequests(token),
        api.listSharedInbox(token),
      ]);
      setFriends(nextFriends);
      setRequests(nextRequests);
      setInbox(nextInbox);
    } catch (err) {
      console.error("친구 정보를 불러오지 못했어요", err);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function sendFriendRequest(email: string) {
    await api.sendFriendRequest(token, email);
    // The request may have auto-accepted a pending one from them, so reload.
    await refresh();
  }

  async function acceptRequest(id: string) {
    await api.acceptFriendRequest(token, id);
    await refresh();
  }

  async function declineRequest(id: string) {
    await api.declineFriendRequest(token, id);
    setRequests((prev) => prev.filter((req) => req.id !== id));
  }

  async function removeFriend(friendId: string) {
    await api.removeFriend(token, friendId);
    setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
  }

  async function shareTask(taskId: string, recipientId: string) {
    await api.shareTask(token, taskId, recipientId);
  }

  async function acceptShared(id: string, categoryId: string) {
    const task = await api.acceptSharedTask(token, id, categoryId);
    setInbox((prev) => prev.filter((item) => item.id !== id));
    return task;
  }

  async function declineShared(id: string) {
    await api.declineSharedTask(token, id);
    setInbox((prev) => prev.filter((item) => item.id !== id));
  }

  return {
    friends,
    requests,
    inbox,
    refresh,
    sendFriendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
    shareTask,
    acceptShared,
    declineShared,
  };
}
