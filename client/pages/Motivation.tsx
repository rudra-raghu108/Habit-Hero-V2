import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Quote,
  TrendingUp,
  Calendar,
  Share,
  RefreshCw,
  Star,
  Flame,
  Target,
} from "lucide-react";
import { HabitStorage, type Habit, type Mood } from "@/lib/storage";

const MOTIVATIONAL_QUOTES = [
  "Every accomplishment starts with the decision to try.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Your only limit is your mind.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't wait for opportunity. Create it.",
  "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Believe you can and you're halfway there.",
  "Your limitation—it's only your imagination.",
];

const AFFIRMATIONS = [
  "I am building healthy habits that serve my highest good.",
  "Every small step I take leads to significant progress.",
  "I have the power to create positive change in my life.",
  "My commitment to growth strengthens me every day.",
  "I celebrate my progress, no matter how small.",
  "I am worthy of the goals I set for myself.",
  "Each habit I build is an investment in my future self.",
  "I choose progress over perfection.",
  "My consistency creates lasting transformation.",
  "I am becoming the person I want to be, one habit at a time.",
];

export default function Motivation() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [currentQuote, setCurrentQuote] = useState("");
  const [currentAffirmation, setCurrentAffirmation] = useState("");

  useEffect(() => {
    const savedHabits = HabitStorage.getHabits();
    const savedMoods = HabitStorage.getMoods();

    setHabits(savedHabits);
    setMoods(savedMoods);

    // Set daily quote and affirmation
    const today = new Date().toDateString();
    const quoteIndex =
      Math.abs(today.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) %
      MOTIVATIONAL_QUOTES.length;
    const affirmationIndex =
      Math.abs(today.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) %
      AFFIRMATIONS.length;

    setCurrentQuote(MOTIVATIONAL_QUOTES[quoteIndex]);
    setCurrentAffirmation(AFFIRMATIONS[affirmationIndex]);
  }, []);

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  };

  const getNewAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    setCurrentAffirmation(AFFIRMATIONS[randomIndex]);
  };

  // Calculate weekly stats
  const weeklyStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    let totalCompleted = 0;
    let totalPossible = 0;
    const dailyCompletions: { [key: string]: number } = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toDateString();

      const completedHabits = habits.filter(
        (habit) =>
          habit.lastCompleted &&
          new Date(habit.lastCompleted).toDateString() === dateStr,
      ).length;

      dailyCompletions[dateStr] = completedHabits;
      totalCompleted += completedHabits;
      totalPossible += habits.length;
    }

    const weeklyCompletionRate =
      totalPossible > 0
        ? Math.round((totalCompleted / totalPossible) * 100)
        : 0;
    const bestDay = Object.entries(dailyCompletions).reduce(
      (a, b) => (a[1] > b[1] ? a : b),
      ["", 0],
    );
    const averageDaily = Math.round(totalCompleted / 7);

    return {
      completionRate: weeklyCompletionRate,
      totalCompleted,
      bestDay: bestDay[0]
        ? new Date(bestDay[0]).toLocaleDateString("en-US", { weekday: "long" })
        : "N/A",
      bestDayCount: bestDay[1],
      averageDaily,
    };
  };

  const shareWeeklyReport = () => {
    const stats = weeklyStats();
    const reportText = `🎮 My Habit Hero Weekly Report:\n\n📊 ${stats.completionRate}% completion rate\n🔥 ${stats.totalCompleted} habits completed\n⭐ Best day: ${stats.bestDay} (${stats.bestDayCount} habits)\n📈 Daily average: ${stats.averageDaily} habits\n\nKeep building those habits! #HabitHero`;

    if (navigator.share) {
      navigator.share({
        title: "Habit Hero Weekly Report",
        text: reportText,
      });
    } else {
      navigator.clipboard.writeText(reportText);
      // Could show a toast notification here
    }
  };

  const stats = weeklyStats();
  const longestStreak = Math.max(...habits.map((h) => h.streak), 0);
  const totalHabits = habits.reduce(
    (sum, habit) => sum + habit.totalCompleted,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Motivation Center</h1>
        <p className="text-muted-foreground">
          Stay inspired and celebrate your progress
        </p>
      </div>

      {/* Daily Quote */}
      <Card className="gradient-motivation text-white border-0">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-white">
            <Quote className="w-6 h-6" />
            Daily Inspiration
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <blockquote className="text-lg italic">"{currentQuote}"</blockquote>
          <Button
            variant="outline"
            size="sm"
            onClick={getNewQuote}
            className="bg-white/20 border-white/20 text-white hover:bg-white/30"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Quote
          </Button>
        </CardContent>
      </Card>

      {/* Daily Affirmation */}
      <Card className="gradient-motivation text-white border-0">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-white">
            <Star className="w-6 h-6" />
            Personal Affirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg">{currentAffirmation}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={getNewAffirmation}
            className="bg-white/20 border-white/20 text-white hover:bg-white/30"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Affirmation
          </Button>
        </CardContent>
      </Card>

      {/* Weekly Report Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Weekly Report Card
          </CardTitle>
          <Button variant="outline" size="sm" onClick={shareWeeklyReport}>
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.completionRate}%
              </div>
              <div className="text-sm text-muted-foreground">
                Completion Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {stats.totalCompleted}
              </div>
              <div className="text-sm text-muted-foreground">
                Habits Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {stats.averageDaily}
              </div>
              <div className="text-sm text-muted-foreground">Daily Average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-streak">
                {stats.bestDayCount}
              </div>
              <div className="text-sm text-muted-foreground">Best Day</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Weekly Progress</span>
              <span className="text-sm text-muted-foreground">
                {stats.completionRate}%
              </span>
            </div>
            <div className="bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full progress-gradient transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-streak" />
              <div>
                <div className="font-medium">Longest Streak</div>
                <div className="text-sm text-muted-foreground">
                  {longestStreak} days
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Total Completions</div>
                <div className="text-sm text-muted-foreground">
                  {totalHabits} habits
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Messages Based on Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Your Progress Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.completionRate >= 80 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800">
                🌟 Outstanding Performance!
              </h3>
              <p className="text-green-700">
                You're crushing it this week! Your consistency is truly
                impressive.
              </p>
            </div>
          )}

          {stats.completionRate >= 50 && stats.completionRate < 80 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800">
                💪 Great Progress!
              </h3>
              <p className="text-blue-700">
                You're building strong momentum. Keep up the excellent work!
              </p>
            </div>
          )}

          {stats.completionRate < 50 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800">
                🚀 Every Step Counts!
              </h3>
              <p className="text-yellow-700">
                Remember, building habits is a journey. Focus on progress, not
                perfection!
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">💡 Tip of the Week</h4>
              <p className="text-sm text-muted-foreground">
                Try habit stacking: attach a new habit to an existing one. For
                example, "After I brush my teeth, I will meditate for 2
                minutes."
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">🎯 Challenge</h4>
              <p className="text-sm text-muted-foreground">
                Can you maintain all your habits for 3 consecutive days this
                week? Small wins lead to big victories!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
