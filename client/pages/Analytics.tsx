import { useState, useEffect } from "react";
import { ProgressCharts } from "@/components/progress-charts";
import { HabitStorage, type Habit, type Mood } from "@/lib/storage";

export default function Analytics() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);

  useEffect(() => {
    const savedHabits = HabitStorage.getHabits();
    const savedMoods = HabitStorage.getMoods();
    
    setHabits(savedHabits);
    setMoods(savedMoods);
  }, []);

  return <ProgressCharts habits={habits} moods={moods} />;
}
