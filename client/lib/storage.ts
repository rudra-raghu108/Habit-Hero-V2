interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  lastCompleted: string | null;
  totalCompleted: number;
  target: number;
  category: string;
}

interface Mood {
  date: string;
  mood: 'happy' | 'neutral' | 'sad';
  note?: string;
}

interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  totalXP: number;
  badges: string[];
  joinDate: string;
}

interface AppData {
  habits: Habit[];
  moods: Mood[];
  userStats: UserStats;
  lastUpdated: string;
}

const STORAGE_KEY = 'habit-hero-data';

const DEFAULT_DATA: AppData = {
  habits: [
    { id: '1', name: 'Drink Water', emoji: '💧', streak: 0, lastCompleted: null, totalCompleted: 0, target: 8, category: 'Health' },
    { id: '2', name: 'Read Books', emoji: '📚', streak: 0, lastCompleted: null, totalCompleted: 0, target: 1, category: 'Learning' },
    { id: '3', name: 'Exercise', emoji: '🏃‍♂️', streak: 0, lastCompleted: null, totalCompleted: 0, target: 1, category: 'Fitness' },
    { id: '4', name: 'Meditate', emoji: '🧘‍♀️', streak: 0, lastCompleted: null, totalCompleted: 0, target: 1, category: 'Wellness' },
  ],
  moods: [],
  userStats: {
    level: 1,
    xp: 0,
    xpToNext: 1000,
    totalXP: 0,
    badges: [],
    joinDate: new Date().toISOString()
  },
  lastUpdated: new Date().toISOString()
};

export class HabitStorage {
  static getData(): AppData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.saveData(DEFAULT_DATA);
        return DEFAULT_DATA;
      }
      
      const data = JSON.parse(stored) as AppData;
      
      // Migrate old data if needed
      if (!data.userStats?.joinDate) {
        data.userStats = { ...DEFAULT_DATA.userStats, ...data.userStats };
      }
      
      return data;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return DEFAULT_DATA;
    }
  }

  static saveData(data: AppData): void {
    try {
      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static getHabits(): Habit[] {
    return this.getData().habits;
  }

  static saveHabits(habits: Habit[]): void {
    const data = this.getData();
    this.saveData({ ...data, habits });
  }

  static getMoods(): Mood[] {
    return this.getData().moods;
  }

  static saveMoods(moods: Mood[]): void {
    const data = this.getData();
    this.saveData({ ...data, moods });
  }

  static getUserStats(): UserStats {
    return this.getData().userStats;
  }

  static saveUserStats(userStats: UserStats): void {
    const data = this.getData();
    this.saveData({ ...data, userStats });
  }

  static addMood(mood: Mood): void {
    const moods = this.getMoods();
    const existingIndex = moods.findIndex(m => m.date === mood.date);
    
    if (existingIndex >= 0) {
      moods[existingIndex] = mood;
    } else {
      moods.push(mood);
    }
    
    this.saveMoods(moods);
  }

  static getTodayMood(): Mood | null {
    const today = new Date().toDateString();
    const moods = this.getMoods();
    return moods.find(m => new Date(m.date).toDateString() === today) || null;
  }

  static calculateStreaks(habits: Habit[]): Habit[] {
    const today = new Date();
    
    return habits.map(habit => {
      if (!habit.lastCompleted) {
        return { ...habit, streak: 0 };
      }

      const lastCompletedDate = new Date(habit.lastCompleted);
      const daysDiff = Math.floor((today.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If last completed was today or yesterday, maintain streak
      if (daysDiff <= 1) {
        return habit;
      }
      
      // If more than 1 day ago, reset streak
      return { ...habit, streak: 0 };
    });
  }

  static awardXP(amount: number): { newStats: UserStats; leveledUp: boolean } {
    const currentStats = this.getUserStats();
    const newTotalXP = currentStats.totalXP + amount;
    const newLevel = Math.floor(newTotalXP / 1000) + 1;
    const leveledUp = newLevel > currentStats.level;
    
    const newStats: UserStats = {
      ...currentStats,
      totalXP: newTotalXP,
      level: newLevel,
      xp: newTotalXP % 1000,
      xpToNext: 1000 - (newTotalXP % 1000)
    };

    // Award badges for milestones
    if (leveledUp) {
      if (newLevel === 5 && !newStats.badges.includes('🌟')) {
        newStats.badges.push('🌟');
      }
      if (newLevel === 10 && !newStats.badges.includes('💎')) {
        newStats.badges.push('💎');
      }
      if (newLevel === 20 && !newStats.badges.includes('🏆')) {
        newStats.badges.push('🏆');
      }
    }

    this.saveUserStats(newStats);
    return { newStats, leveledUp };
  }

  static checkStreakBadges(habit: Habit): string[] {
    const badges: string[] = [];
    
    if (habit.streak >= 7 && !this.getUserStats().badges.includes('🔥')) {
      badges.push('🔥');
    }
    if (habit.streak >= 30 && !this.getUserStats().badges.includes('⚡')) {
      badges.push('⚡');
    }
    if (habit.streak >= 100 && !this.getUserStats().badges.includes('👑')) {
      badges.push('👑');
    }
    
    return badges;
  }

  static clearData(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static exportData(): string {
    return JSON.stringify(this.getData(), null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as AppData;
      this.saveData(data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export type { Habit, Mood, UserStats, AppData };
