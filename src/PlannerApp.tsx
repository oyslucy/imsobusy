import { useState } from "react";
import { Brand } from "@/components/Brand";
import { Greeting } from "@/components/Greeting";
import { CalendarCard } from "@/components/CalendarCard";
import { ProgressCard } from "@/components/ProgressCard";
import { FilterTabs } from "@/components/FilterTabs";
import { TaskList } from "@/components/TaskList";
import { AddTaskForm } from "@/components/AddTaskForm";
import { Navbar, type NavView } from "@/components/Navbar";
import { ProfileScreen } from "@/components/ProfileScreen";
import { BoardScreen } from "@/components/BoardScreen";
import { CarryOverScreen } from "@/components/CarryOverScreen";
import { AlertsScreen } from "@/components/AlertsScreen";
import { SendTaskDialog } from "@/components/SendTaskDialog";
import { usePlanner } from "@/hooks/usePlanner";
import { useFriends } from "@/hooks/useFriends";
import { toISODate } from "@/lib/calendar";
import type { AuthUser, ProfilePatch } from "@/lib/api";
import type { Task } from "@/types";

interface PlannerAppProps {
  user: AuthUser;
  token: string;
  onLogout: () => void;
  onUpdateProfile: (patch: ProfilePatch) => Promise<AuthUser>;
}

export function PlannerApp({ user, token, onLogout, onUpdateProfile }: PlannerAppProps) {
  const {
    today,
    viewDate,
    selectedDate,
    filter,
    setFilter,
    categories,
    tasksByDate,
    tasksForSelectedDay,
    visibleTasks,
    doneCount,
    totalCount,
    monthDoneCount,
    monthTotalCount,
    categoryStats,
    overdueTasks,
    isLoading,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    moveTasks,
    insertTask,
    addCategory,
    selectDate,
    goToMonth,
  } = usePlanner(token);

  const [isAdding, setIsAdding] = useState(false);
  const [view, setView] = useState<NavView>("home");
  const [sharingTask, setSharingTask] = useState<Task | null>(null);
  const friends = useFriends(token);

  function handleNavigate(next: NavView) {
    // Pick up requests and shared tasks that arrived since the last load.
    if (next === "alerts") friends.refresh();
    setView(next);
  }

  async function handleAcceptShared(id: string, categoryId: string) {
    insertTask(await friends.acceptShared(id, categoryId));
  }

  function handleSelectDate(date: Date) {
    setIsAdding(false);
    selectDate(date);
  }

  async function handleAddTask(input: Parameters<typeof addTask>[0]) {
    await addTask(input);
    setIsAdding(false);
  }

  const pendingToday = (tasksByDate.get(toISODate(today)) ?? []).filter(
    (t) => !t.done,
  ).length;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#dcdcdc] p-3 sm:p-6">
      <div className="flex w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl border border-black shadow-2xl md:h-[780px] md:flex-row">
        <div className="shrink-0 bg-cream p-4 sm:p-7 md:flex-[1.15] md:overflow-y-auto">
          <Brand />
          <Greeting name={user.name} remaining={pendingToday} />
          <CalendarCard
            viewDate={viewDate}
            today={today}
            selectedDate={selectedDate}
            categories={categories}
            tasksByDate={tasksByDate}
            onSelectDate={handleSelectDate}
            onGoToMonth={goToMonth}
          />
        </div>

        <div className="flex min-h-0 flex-col bg-panel p-4 sm:p-7 md:flex-1">
          {view === "home" ? (
            <>
              <div className="mb-1.5 flex items-baseline gap-3 font-serif">
                <div className="text-[52px] font-extrabold leading-none">
                  {selectedDate.getDate()}
                </div>
                <div className="text-[22px] font-extrabold text-[#4a3fa0]">
                  {selectedDate.toLocaleDateString("en-US", { month: "long" })}
                </div>
              </div>
              <div className="mb-[18px] text-[10.5px] font-bold tracking-[1.5px] text-[#8a83b8]">
                SELECTED
              </div>

              <ProgressCard done={doneCount} total={totalCount} />
              <FilterTabs categories={categories} active={filter} onChange={setFilter} />

              {isLoading ? (
                <div className="flex min-h-0 flex-1 items-center justify-center text-sm font-semibold text-neutral-400">
                  불러오는 중...
                </div>
              ) : (
                <TaskList
                  tasks={visibleTasks}
                  allTasks={tasksForSelectedDay}
                  categories={categories}
                  onToggle={toggleTask}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                  onShare={setSharingTask}
                  onCreateCategory={addCategory}
                  onReorder={reorderTasks}
                  canReorder
                />
              )}

              {!isLoading &&
                (isAdding ? (
                  <AddTaskForm
                    categories={categories}
                    onAdd={handleAddTask}
                    onCreateCategory={addCategory}
                    onCancel={() => setIsAdding(false)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="mt-3 rounded-2xl border-2 border-dashed border-ink py-3.5 text-center text-[13.5px] font-bold text-neutral-700"
                  >
                    + 일정 추가하기
                  </button>
                ))}
            </>
          ) : view === "board" ? (
            <BoardScreen
              viewDate={viewDate}
              doneCount={monthDoneCount}
              totalCount={monthTotalCount}
              categoryStats={categoryStats}
            />
          ) : view === "alerts" ? (
            <AlertsScreen
              friends={friends.friends}
              requests={friends.requests}
              inbox={friends.inbox}
              categories={categories}
              onSendRequest={friends.sendFriendRequest}
              onAcceptRequest={friends.acceptRequest}
              onDeclineRequest={friends.declineRequest}
              onRemoveFriend={friends.removeFriend}
              onAcceptShared={handleAcceptShared}
              onDeclineShared={friends.declineShared}
              onCreateCategory={addCategory}
            />
          ) : view === "carry" ? (
            <CarryOverScreen
              today={today}
              tasks={overdueTasks}
              categories={categories}
              onMove={moveTasks}
              onDelete={deleteTask}
            />
          ) : (
            <ProfileScreen user={user} onUpdate={onUpdateProfile} onLogout={onLogout} />
          )}

          <Navbar
            active={view}
            onNavigate={handleNavigate}
            badges={{
              alerts: friends.requests.length + friends.inbox.length,
              carry: overdueTasks.length,
            }}
          />
        </div>
      </div>

      {sharingTask && (
        <SendTaskDialog
          task={sharingTask}
          friends={friends.friends}
          onSend={friends.shareTask}
          onClose={() => setSharingTask(null)}
        />
      )}
    </div>
  );
}
