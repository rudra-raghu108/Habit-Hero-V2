import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Flame,
  Target,
  Activity
} from "lucide-react";
import type { Habit, Mood } from "@/lib/storage";

interface ProgressChartsProps {
  habits: Habit[];
  moods: Mood[];
}

interface DailyData {
  date: string;
  completed: number;
  total: number;
  mood?: 'happy' | 'neutral' | 'sad';
}

export function ProgressCharts({ habits, moods }: ProgressChartsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  // Generate daily data for the selected time range
  const dailyData = useMemo(() => {
    const days = timeRange === 'week' ? 7 : 30;
    const data: DailyData[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const completed = habits.filter(habit => {
        return habit.lastCompleted && 
               new Date(habit.lastCompleted).toDateString() === dateStr;
      }).length;
      
      const mood = moods.find(m => 
        new Date(m.date).toDateString() === dateStr
      )?.mood;
      
      data.push({
        date: dateStr,
        completed,
        total: habits.length,
        mood
      });
    }
    
    return data;
  }, [habits, moods, timeRange]);

  // Calculate streak statistics
  const streakStats = useMemo(() => {
    const streaks = habits.map(h => h.streak);
    return {
      totalStreaks: streaks.reduce((sum, streak) => sum + streak, 0),
      averageStreak: streaks.length > 0 ? Math.round(streaks.reduce((sum, streak) => sum + streak, 0) / streaks.length) : 0,
      longestStreak: Math.max(...streaks, 0),
      activeStreaks: streaks.filter(s => s > 0).length
    };
  }, [habits]);

  // Calculate completion rate
  const completionRate = useMemo(() => {
    const totalPossible = dailyData.length * habits.length;
    const totalCompleted = dailyData.reduce((sum, day) => sum + day.completed, 0);
    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  }, [dailyData, habits.length]);

  // Category breakdown
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number }> = {};
    
    habits.forEach(habit => {
      if (!stats[habit.category]) {
        stats[habit.category] = { total: 0, completed: 0 };
      }
      stats[habit.category].total++;
      if (habit.lastCompleted && 
          new Date(habit.lastCompleted).toDateString() === new Date().toDateString()) {
        stats[habit.category].completed++;
      }
    });
    
    return Object.entries(stats).map(([category, data]) => ({
      category,
      ...data,
      percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
    }));
  }, [habits]);

  const getMoodColor = (mood?: 'happy' | 'neutral' | 'sad') => {
    switch (mood) {
      case 'happy': return 'bg-green-500';
      case 'neutral': return 'bg-yellow-500';
      case 'sad': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getMoodEmoji = (mood?: 'happy' | 'neutral' | 'sad') => {
    switch (mood) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      default: return '🤔';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Progress Analytics</h2>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            30 Days
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Trend</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="moods">Moods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{completionRate}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-streak">{streakStats.totalStreaks}</div>
                <div className="text-sm text-muted-foreground">Total Streaks</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-warning">{streakStats.longestStreak}</div>
                <div className="text-sm text-muted-foreground">Longest Streak</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-xp">{streakStats.activeStreaks}</div>
                <div className="text-sm text-muted-foreground">Active Streaks</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyData.slice(-7).map((day, index) => {
                  const percentage = day.total > 0 ? (day.completed / day.total) * 100 : 0;
                  const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                  
                  return (
                    <div key={day.date} className="flex items-center gap-3">
                      <div className="w-12 text-sm font-medium">{dayName}</div>
                      <div className="flex-1">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <div className="w-16 text-sm text-muted-foreground">
                        {day.completed}/{day.total}
                      </div>
                      <div className="w-6 text-center">
                        {getMoodEmoji(day.mood)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Daily Completion Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-48 p-4">
                {dailyData.map((day, index) => {
                  const percentage = day.total > 0 ? (day.completed / day.total) * 100 : 0;
                  const height = Math.max(percentage * 1.6, 8); // Min height of 8px
                  const dayLabel = new Date(day.date).getDate();
                  
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                        <span>{day.completed}</span>
                        <div 
                          className={`w-full rounded-t-md transition-all duration-300 ${
                            percentage === 100 ? 'bg-success' : 
                            percentage >= 50 ? 'bg-warning' : 'bg-muted'
                          }`}
                          style={{ height: `${height}px` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{dayLabel}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-4">
            {categoryStats.map((stat) => (
              <Card key={stat.category}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{stat.category}</h3>
                    <Badge variant="outline">{stat.percentage}%</Badge>
                  </div>
                  <div className="space-y-2">
                    <Progress value={stat.percentage} />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{stat.completed} completed</span>
                      <span>{stat.total} total</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="moods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Mood Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {dailyData.slice(-14).reverse().map((day) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  });
                  
                  return (
                    <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getMoodColor(day.mood)}`} />
                        <span className="font-medium">{dayName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMoodEmoji(day.mood)}</span>
                        <Badge variant="outline">
                          {day.completed}/{day.total} habits
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
