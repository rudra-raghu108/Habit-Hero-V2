import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Award, Star, Flame, Crown, Zap, Target, TrendingUp, Calendar, Share } from "lucide-react";
import type { Habit, UserStats } from "@/lib/storage";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  requirement: number;
  category: 'streak' | 'completion' | 'level' | 'consistency' | 'variety';
  unlocked: boolean;
  progress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsProps {
  habits: Habit[];
  userStats: UserStats;
  onBadgeUnlocked: (badge: string) => void;
}

const ACHIEVEMENTS_CONFIG: Omit<Achievement, 'unlocked' | 'progress'>[] = [
  // Streak Achievements
  { id: 'first-streak', title: 'Getting Started', description: 'Complete your first habit', icon: '🌱', badge: '🌱', requirement: 1, category: 'streak', rarity: 'common' },
  { id: 'week-warrior', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', badge: '🔥', requirement: 7, category: 'streak', rarity: 'common' },
  { id: 'fortnight-hero', title: 'Fortnight Hero', description: 'Maintain a 14-day streak', icon: '⚡', badge: '⚡', requirement: 14, category: 'streak', rarity: 'rare' },
  { id: 'month-master', title: 'Month Master', description: 'Maintain a 30-day streak', icon: '💎', badge: '💎', requirement: 30, category: 'streak', rarity: 'epic' },
  { id: 'century-champion', title: 'Century Champion', description: 'Maintain a 100-day streak', icon: '👑', badge: '👑', requirement: 100, category: 'streak', rarity: 'legendary' },
  
  // Level Achievements
  { id: 'level-up', title: 'Level Up', description: 'Reach level 5', icon: '⭐', badge: '⭐', requirement: 5, category: 'level', rarity: 'common' },
  { id: 'experienced', title: 'Experienced', description: 'Reach level 10', icon: '🌟', badge: '🌟', requirement: 10, category: 'level', rarity: 'rare' },
  { id: 'expert', title: 'Expert', description: 'Reach level 20', icon: '💫', badge: '💫', requirement: 20, category: 'level', rarity: 'epic' },
  { id: 'master', title: 'Master', description: 'Reach level 50', icon: '🏆', badge: '🏆', requirement: 50, category: 'level', rarity: 'legendary' },
  
  // Completion Achievements
  { id: 'first-hundred', title: 'First Hundred', description: 'Complete 100 habits total', icon: '💯', badge: '💯', requirement: 100, category: 'completion', rarity: 'common' },
  { id: 'five-hundred', title: 'Five Hundred Club', description: 'Complete 500 habits total', icon: '🎯', badge: '🎯', requirement: 500, category: 'completion', rarity: 'rare' },
  { id: 'thousand', title: 'Thousand Strong', description: 'Complete 1000 habits total', icon: '🚀', badge: '🚀', requirement: 1000, category: 'completion', rarity: 'epic' },
  
  // Consistency Achievements
  { id: 'perfect-week', title: 'Perfect Week', description: 'Complete all habits for 7 days straight', icon: '🎪', badge: '🎪', requirement: 7, category: 'consistency', rarity: 'rare' },
  { id: 'perfect-month', title: 'Perfect Month', description: 'Complete all habits for 30 days straight', icon: '🎭', badge: '🎭', requirement: 30, category: 'consistency', rarity: 'legendary' },
  
  // Variety Achievements
  { id: 'diversified', title: 'Diversified', description: 'Create habits in 5 different categories', icon: '🌈', badge: '🌈', requirement: 5, category: 'variety', rarity: 'rare' },
  { id: 'habit-collector', title: 'Habit Collector', description: 'Create 20 different habits', icon: '📚', badge: '📚', requirement: 20, category: 'variety', rarity: 'epic' },
];

export function Achievements({ habits, userStats, onBadgeUnlocked }: AchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const updatedAchievements = ACHIEVEMENTS_CONFIG.map(config => {
      const progress = calculateProgress(config, habits, userStats);
      const unlocked = progress >= config.requirement;
      
      return {
        ...config,
        progress,
        unlocked
      };
    });

    // Check for newly unlocked achievements
    const previouslyUnlocked = achievements.filter(a => a.unlocked).map(a => a.id);
    const currentlyUnlocked = updatedAchievements.filter(a => a.unlocked).map(a => a.id);
    const newUnlocks = updatedAchievements.filter(a => 
      a.unlocked && !previouslyUnlocked.includes(a.id)
    );

    if (newUnlocks.length > 0) {
      setNewlyUnlocked(newUnlocks);
      setShowCelebration(true);
      
      // Award badges for new achievements
      newUnlocks.forEach(achievement => {
        onBadgeUnlocked(achievement.badge);
      });
    }

    setAchievements(updatedAchievements);
  }, [habits, userStats]);

  const calculateProgress = (config: Omit<Achievement, 'unlocked' | 'progress'>, habits: Habit[], userStats: UserStats): number => {
    switch (config.category) {
      case 'streak':
        return Math.max(...habits.map(h => h.streak), 0);
      
      case 'level':
        return userStats.level;
      
      case 'completion':
        return habits.reduce((sum, habit) => sum + habit.totalCompleted, 0);
      
      case 'consistency':
        // Calculate consecutive days of completing all habits
        return calculateConsistencyStreak(habits);
      
      case 'variety':
        if (config.id === 'diversified') {
          return new Set(habits.map(h => h.category)).size;
        }
        if (config.id === 'habit-collector') {
          return habits.length;
        }
        return 0;
      
      default:
        return 0;
    }
  };

  const calculateConsistencyStreak = (habits: Habit[]): number => {
    if (habits.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      const completedHabits = habits.filter(habit => 
        habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === dateStr
      ).length;
      
      if (completedHabits === habits.length) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
    }
  };

  const getRarityBadgeColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const shareAchievements = () => {
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const shareText = `🏆 My Habit Hero Achievements!\n\n${Math.round(completionPercentage)}% Complete (${unlockedCount}/${totalCount})\n\nRecent Unlocks:\n${unlockedAchievements.slice(-3).map(a => `${a.icon} ${a.title}`).join('\n')}\n\nLevel up your habits with Habit Hero! 🎮`;

    if (navigator.share) {
      navigator.share({
        title: 'My Habit Hero Achievements',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Achievements
          </h2>
          <p className="text-muted-foreground">
            {unlockedCount} of {totalCount} achievements unlocked
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => shareAchievements()}
            className="flex items-center gap-2"
          >
            <Share className="w-4 h-4" />
            Share Progress
          </Button>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{Math.round(completionPercentage)}%</div>
            <Progress value={completionPercentage} className="w-24 mt-1" />
          </div>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="grid gap-6">
        {['streak', 'level', 'completion', 'consistency', 'variety'].map(category => {
          const categoryAchievements = achievements.filter(a => a.category === category);
          const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length;
          
          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg capitalize flex items-center justify-between">
                  <span>{category} Achievements</span>
                  <Badge variant="outline">
                    {categoryUnlocked}/{categoryAchievements.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {categoryAchievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        achievement.unlocked 
                          ? getRarityColor(achievement.rarity)
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div>
                            <h3 className={`font-medium ${achievement.unlocked ? '' : 'text-gray-500'}`}>
                              {achievement.title}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getRarityBadgeColor(achievement.rarity)}`}
                            >
                              {achievement.rarity}
                            </Badge>
                          </div>
                        </div>
                        {achievement.unlocked && (
                          <div className="text-green-500">
                            <Star className="w-5 h-5 fill-current" />
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-foreground' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{Math.min(achievement.progress, achievement.requirement)} / {achievement.requirement}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.requirement) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Celebration Dialog */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center justify-center gap-2">
              <Award className="w-8 h-8 text-yellow-500" />
              Achievement Unlocked!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {newlyUnlocked.map(achievement => (
              <div key={achievement.id} className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h3 className="font-bold text-lg">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                <Badge className={`mt-2 ${getRarityBadgeColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </Badge>
              </div>
            ))}
          </div>
          <Button onClick={() => setShowCelebration(false)} className="gradient-primary border-0 text-white">
            Awesome! 🎉
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
