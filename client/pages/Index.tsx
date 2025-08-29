import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Flame, 
  Star, 
  TrendingUp, 
  Calendar,
  Zap,
  Target,
  Award,
  Smile,
  Meh,
  Frown
} from "lucide-react";

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
}

const SAMPLE_HABITS: Habit[] = [
  { id: '1', name: 'Drink Water', emoji: '💧', streak: 7, lastCompleted: new Date().toISOString(), totalCompleted: 42, target: 8, category: 'Health' },
  { id: '2', name: 'Read Books', emoji: '📚', streak: 3, lastCompleted: new Date().toISOString(), totalCompleted: 15, target: 1, category: 'Learning' },
  { id: '3', name: 'Exercise', emoji: '🏃‍♂️', streak: 12, lastCompleted: new Date().toISOString(), totalCompleted: 28, target: 1, category: 'Fitness' },
  { id: '4', name: 'Meditate', emoji: '🧘‍♀️', streak: 5, lastCompleted: new Date().toISOString(), totalCompleted: 20, target: 1, category: 'Wellness' },
];

const MOTIVATIONAL_QUOTES = [
  "Every accomplishment starts with the decision to try.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Your only limit is your mind."
];

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>(SAMPLE_HABITS);
  const [todayMood, setTodayMood] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 5,
    xp: 750,
    xpToNext: 250,
    totalXP: 1500,
    badges: ['🔥', '💪', '📚', '⭐']
  });
  const [dailyQuote] = useState(() => 
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  );

  const today = new Date().toDateString();
  const completedToday = habits.filter(h => 
    h.lastCompleted && new Date(h.lastCompleted).toDateString() === today
  ).length;

  const totalHabits = habits.length;
  const dailyProgress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCompletedToday = habit.lastCompleted && 
          new Date(habit.lastCompleted).toDateString() === today;
        
        if (isCompletedToday) {
          // Uncomplete habit
          return {
            ...habit,
            lastCompleted: null,
            streak: Math.max(0, habit.streak - 1),
            totalCompleted: Math.max(0, habit.totalCompleted - 1)
          };
        } else {
          // Complete habit
          return {
            ...habit,
            lastCompleted: new Date().toISOString(),
            streak: habit.streak + 1,
            totalCompleted: habit.totalCompleted + 1
          };
        }
      }
      return habit;
    }));

    // Add XP for completing habit
    setUserStats(prev => {
      const newXP = prev.xp + 25;
      const newLevel = Math.floor(newXP / 1000) + 1;
      return {
        ...prev,
        xp: newXP % 1000,
        level: newLevel,
        xpToNext: 1000 - (newXP % 1000),
        totalXP: prev.totalXP + 25
      };
    });
  };

  const getMoodIcon = (mood: 'happy' | 'neutral' | 'sad') => {
    switch (mood) {
      case 'happy': return <Smile className="w-6 h-6 text-green-500" />;
      case 'neutral': return <Meh className="w-6 h-6 text-yellow-500" />;
      case 'sad': return <Frown className="w-6 h-6 text-red-500" />;
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 14) return 'text-orange-600';
    if (streak >= 7) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🎮 Habit Hero
          </h1>
          <p className="text-muted-foreground text-lg">Level up your life, one habit at a time</p>
        </div>

        {/* User Stats & Daily Quote */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="gradient-primary text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="w-6 h-6" />
                Level {userStats.level} Hero
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/80">
                  <span>XP Progress</span>
                  <span>{userStats.xp}/{userStats.xp + userStats.xpToNext}</span>
                </div>
                <Progress 
                  value={(userStats.xp / (userStats.xp + userStats.xpToNext)) * 100} 
                  className="bg-white/20"
                />
              </div>
              <div className="flex gap-2">
                {userStats.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/20">
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Daily Motivation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 italic">"{dailyQuote}"</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">How are you feeling today?</p>
                <div className="flex gap-2">
                  {(['happy', 'neutral', 'sad'] as const).map((mood) => (
                    <Button
                      key={mood}
                      variant={todayMood === mood ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTodayMood(mood)}
                      className="px-3"
                    >
                      {getMoodIcon(mood)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {completedToday}/{totalHabits}
                </span>
                <span className="text-sm text-muted-foreground">habits completed</span>
              </div>
              <Progress value={dailyProgress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Math.round(dailyProgress)}% complete</span>
                <span>{totalHabits - completedToday} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habits Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Habits</h2>
            <Button className="gradient-primary border-0 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {habits.map((habit) => {
              const isCompletedToday = habit.lastCompleted && 
                new Date(habit.lastCompleted).toDateString() === today;
              
              return (
                <Card 
                  key={habit.id} 
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isCompletedToday ? 'ring-2 ring-success shadow-lg' : ''
                  }`}
                  onClick={() => toggleHabit(habit.id)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{habit.emoji}</span>
                      <Badge variant="outline" className={getStreakColor(habit.streak)}>
                        <Flame className="w-3 h-3 mr-1" />
                        {habit.streak}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">{habit.name}</h3>
                      <p className="text-sm text-muted-foreground">{habit.category}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{habit.totalCompleted} total</span>
                      </div>
                      
                      {isCompletedToday ? (
                        <div className="flex items-center gap-2 text-success font-medium">
                          <span className="w-2 h-2 bg-success rounded-full"></span>
                          Completed today!
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-streak">{habits.reduce((acc, h) => acc + h.streak, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Streaks</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-xp">{userStats.totalXP}</div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{habits.reduce((acc, h) => acc + h.totalCompleted, 0)}</div>
              <div className="text-sm text-muted-foreground">Completions</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{Math.max(...habits.map(h => h.streak))}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
