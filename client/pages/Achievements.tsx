import { useState, useEffect } from "react";
import { Achievements as AchievementsComponent } from "@/components/achievements";
import { HabitStorage, type Habit, type UserStats } from "@/lib/storage";

export default function Achievements() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(HabitStorage.getUserStats());

  useEffect(() => {
    const savedHabits = HabitStorage.getHabits();
    setHabits(savedHabits);
    setUserStats(HabitStorage.getUserStats());
  }, []);

  const handleBadgeUnlocked = (badge: string) => {
    const currentStats = HabitStorage.getUserStats();
    if (!currentStats.badges.includes(badge)) {
      const newStats = {
        ...currentStats,
        badges: [...currentStats.badges, badge]
      };
      HabitStorage.saveUserStats(newStats);
      setUserStats(newStats);
    }
  };

  return (
    <AchievementsComponent 
      habits={habits} 
      userStats={userStats} 
      onBadgeUnlocked={handleBadgeUnlocked}
    />
  );
}
