import { useState } from "react";
import { Brand } from "@/components/Brand";
import { Greeting } from "@/components/Greeting";
import { CalendarCard } from "@/components/CalendarCard";
import { ProgressCard } from "@/components/ProgressCard";
import { FilterTabs } from "@/components/FilterTabs";
import { TaskList } from "@/components/TaskList";
import { AddTaskForm } from "@/components/AddTaskForm";
import { Navbar } from "@/components/Navbar";
import { usePlanner } from "@/hooks/usePlanner";
import { toISODate } from "@/lib/calendar";

export default function App() {
  const {
    today,
    viewDate,
    selectedDate,
    filter,
    setFilter,
    tasksByDate,
    visibleTasks,
    doneCount,
    totalCount,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    selectDate,
    goToMonth,
  } = usePlanner();

  const [isAdding, setIsAdding] = useState(false);

  function handleSelectDate(date: Date) {
    setIsAdding(false);
    selectDate(date);
  }

  function handleAddTask(input: Parameters<typeof addTask>[0]) {
    addTask(input);
    setIsAdding(false);
  }

  const pendingToday = (tasksByDate.get(toISODate(today)) ?? []).filter(
    (t) => !t.done,
  ).length;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#dcdcdc] p-6">
      <div className="flex w-full max-w-[1100px] overflow-hidden rounded-2xl border border-black shadow-2xl">
        <div className="flex-[1.15] bg-cream p-7">
          <Brand />
          <Greeting name="수아" remaining={pendingToday} />
          <CalendarCard
            viewDate={viewDate}
            today={today}
            selectedDate={selectedDate}
            tasksByDate={tasksByDate}
            onSelectDate={handleSelectDate}
            onGoToMonth={goToMonth}
          />
        </div>

        <div className="flex flex-1 flex-col bg-panel p-7">
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
          <FilterTabs active={filter} onChange={setFilter} />
          <TaskList
            tasks={visibleTasks}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />

          {isAdding ? (
            <AddTaskForm onAdd={handleAddTask} onCancel={() => setIsAdding(false)} />
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="mt-3 rounded-2xl border-2 border-dashed border-ink py-3.5 text-center text-[13.5px] font-bold text-neutral-700"
            >
              + 일정 추가하기
            </button>
          )}

          <Navbar />
        </div>
      </div>
    </div>
  );
}

