import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, Share } from "lucide-react";

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

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
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

  const shareAchievement = () => {
    const shareText = `🏆 Achievement Unlocked!\n\n${achievement.icon} ${achievement.title}\n${achievement.description}\n\nHabit Hero - Level up your life! 🎮`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Achievement Unlocked!',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <Card
      className={`transition-all duration-200 ${
        achievement.unlocked 
          ? `${getRarityColor(achievement.rarity)} hover:scale-105 shadow-md` 
          : 'border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{achievement.icon}</span>
            <div>
              <h3 className={`font-semibold ${achievement.unlocked ? 'text-black' : 'text-gray-500'}`}>
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
          <div className="flex items-center gap-2">
            {achievement.unlocked && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={shareAchievement}
                  className="h-8 w-8 p-0"
                >
                  <Share className="w-3 h-3" />
                </Button>
                <div className="text-green-500">
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </>
            )}
          </div>
        </div>
        
        <p className={`text-sm ${achievement.unlocked ? 'text-gray-700' : 'text-gray-500'}`}>
          {achievement.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{Math.min(achievement.progress, achievement.requirement)} / {achievement.requirement}</span>
          </div>
          <div className="bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full progress-gradient transition-all duration-300"
              style={{ width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
