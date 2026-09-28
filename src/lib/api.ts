const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail ?? "요청에 실패했어요");
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  avatar_emoji: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface ProfilePatch {
  name?: string;
  email?: string;
  bio?: string;
  avatar_emoji?: string;
  current_password?: string;
  new_password?: string;
}

export interface ApiCategory {
  id: string;
  label: string;
  bg: string;
  text: string;
}

export interface ApiCategoryCreate {
  label: string;
  bg: string;
  text: string;
}

export interface ApiTask {
  id: string;
  title: string;
  location: string | null;
  time: string | null;
  category_id: string;
  done: boolean;
  date: string;
  position: number;
}

export interface ApiTaskCreate {
  title: string;
  location?: string | null;
  time?: string | null;
  category_id: string;
  date: string;
}

export interface ApiTaskPatch {
  title?: string;
  location?: string | null;
  time?: string | null;
  category_id?: string;
  done?: boolean;
  date?: string;
}

export interface ApiFriend {
  id: string;
  name: string;
  email: string;
  avatar_emoji: string;
}

export interface ApiFriendRequest {
  id: string;
  requester: ApiFriend;
  created_at: string;
}

export interface ApiSharedTask {
  id: string;
  sender: ApiFriend;
  title: string;
  location: string | null;
  time: string | null;
  date: string;
  created_at: string;
}

export const api = {
  signup: (input: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  login: (input: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  me: (token: string) => request<AuthUser>("/users/me", {}, token),

  updateMe: (token: string, patch: ProfilePatch) =>
    request<AuthUser>(
      "/users/me",
      { method: "PATCH", body: JSON.stringify(patch) },
      token,
    ),

  listCategories: (token: string) => request<ApiCategory[]>("/categories", {}, token),

  createCategory: (token: string, input: ApiCategoryCreate) =>
    request<ApiCategory>(
      "/categories",
      { method: "POST", body: JSON.stringify(input) },
      token,
    ),

  listTasks: (token: string) => request<ApiTask[]>("/tasks", {}, token),

  createTask: (token: string, input: ApiTaskCreate) =>
    request<ApiTask>("/tasks", { method: "POST", body: JSON.stringify(input) }, token),

  updateTask: (token: string, id: string, patch: ApiTaskPatch) =>
    request<ApiTask>(
      `/tasks/${id}`,
      { method: "PATCH", body: JSON.stringify(patch) },
      token,
    ),

  deleteTask: (token: string, id: string) =>
    request<void>(`/tasks/${id}`, { method: "DELETE" }, token),

  reorderTasks: (token: string, taskIds: string[]) =>
    request<ApiTask[]>(
      "/tasks/reorder",
      { method: "PATCH", body: JSON.stringify({ task_ids: taskIds }) },
      token,
    ),

  moveTasks: (token: string, taskIds: string[], date: string) =>
    request<ApiTask[]>(
      "/tasks/move",
      { method: "PATCH", body: JSON.stringify({ task_ids: taskIds, date }) },
      token,
    ),

  listFriends: (token: string) => request<ApiFriend[]>("/friends", {}, token),

  listFriendRequests: (token: string) =>
    request<ApiFriendRequest[]>("/friends/requests", {}, token),

  sendFriendRequest: (token: string, email: string) =>
    request<void>(
      "/friends/requests",
      { method: "POST", body: JSON.stringify({ email }) },
      token,
    ),

  acceptFriendRequest: (token: string, id: string) =>
    request<void>(`/friends/requests/${id}/accept`, { method: "POST" }, token),

  declineFriendRequest: (token: string, id: string) =>
    request<void>(`/friends/requests/${id}/decline`, { method: "POST" }, token),

  removeFriend: (token: string, friendId: string) =>
    request<void>(`/friends/${friendId}`, { method: "DELETE" }, token),

  shareTask: (token: string, taskId: string, recipientId: string) =>
    request<void>(
      "/shared-tasks",
      { method: "POST", body: JSON.stringify({ task_id: taskId, recipient_id: recipientId }) },
      token,
    ),

  listSharedInbox: (token: string) => request<ApiSharedTask[]>("/shared-tasks/inbox", {}, token),

  acceptSharedTask: (token: string, id: string, categoryId: string) =>
    request<ApiTask>(
      `/shared-tasks/${id}/accept`,
      { method: "POST", body: JSON.stringify({ category_id: categoryId }) },
      token,
    ),

  declineSharedTask: (token: string, id: string) =>
    request<void>(`/shared-tasks/${id}/decline`, { method: "POST" }, token),
};
