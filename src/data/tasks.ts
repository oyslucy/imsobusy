import type { Task } from "@/types";
import { addDays, toISODate } from "@/lib/calendar";

const today = new Date();

export const initialTasks: Task[] = [
  {
    id: "t1",
    title: "[TELE] 관련주 업데이트하기",
    time: "10:00",
    categoryId: "work",
    done: true,
    date: toISODate(today),
  },
  {
    id: "t2",
    title: "디자인 시스템 리뷰 미팅",
    time: "13:30",
    categoryId: "work",
    done: true,
    date: toISODate(today),
  },
  {
    id: "t3",
    title: "[기타] MCP 서버 연결할 프로젝트 찾아보기",
    time: "15:00",
    categoryId: "work",
    done: false,
    date: toISODate(today),
  },
  {
    id: "t4",
    title: "샌드위치 챙기기",
    time: "18:00",
    categoryId: "life",
    done: false,
    date: toISODate(today),
  },
  {
    id: "t5",
    title: "저녁 러닝 30분",
    time: "20:00",
    categoryId: "move",
    done: false,
    date: toISODate(today),
  },
  {
    id: "t6",
    title: "주간 회고 작성",
    time: "11:00",
    categoryId: "work",
    done: true,
    date: toISODate(addDays(today, -3)),
  },
  {
    id: "t7",
    title: "요가 클래스",
    time: "07:30",
    categoryId: "move",
    done: true,
    date: toISODate(addDays(today, -3)),
  },
  {
    id: "t8",
    title: "치과 예약",
    time: "09:30",
    categoryId: "life",
    done: false,
    date: toISODate(addDays(today, 1)),
  },
  {
    id: "t9",
    title: "팀 스프린트 플래닝",
    time: "14:00",
    categoryId: "work",
    done: false,
    date: toISODate(addDays(today, 1)),
  },
];
