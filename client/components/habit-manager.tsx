import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus } from "lucide-react";

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

interface HabitManagerProps {
  habits: Habit[];
  onHabitsChange: (habits: Habit[]) => void;
}

const HABIT_EMOJIS = [
  '💧', '📚', '🏃‍♂️', '🧘‍♀️', '🍎', '💤', '🎵', '📝', '🧽', '🌱',
  '💊', '🚶‍♀️', '🎨', '🍳', '☕', '📱', '🌞', '🛁', '🧴', '🦷',
  '👥', '📞', '💡', '🎯', '🏠', '🧠', '💝', '🌿', '⚡', '🎮'
];

const CATEGORIES = [
  'Health', 'Fitness', 'Learning', 'Wellness', 'Productivity', 
  'Social', 'Mindfulness', 'Creativity', 'Lifestyle', 'Personal Care'
];

export function HabitManager({ habits, onHabitsChange }: HabitManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🎯',
    category: 'Health',
    target: 1
  });

  const resetForm = () => {
    setFormData({
      name: '',
      emoji: '🎯',
      category: 'Health',
      target: 1
    });
    setEditingHabit(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    if (editingHabit) {
      // Update existing habit
      const updatedHabits = habits.map(habit =>
        habit.id === editingHabit.id
          ? { ...habit, ...formData }
          : habit
      );
      onHabitsChange(updatedHabits);
    } else {
      // Create new habit
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: formData.name,
        emoji: formData.emoji,
        category: formData.category,
        target: formData.target,
        streak: 0,
        lastCompleted: null,
        totalCompleted: 0
      };
      onHabitsChange([...habits, newHabit]);
    }

    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      emoji: habit.emoji,
      category: habit.category,
      target: habit.target
    });
    setIsOpen(true);
  };

  const handleDelete = (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    onHabitsChange(updatedHabits);
  };

  const openAddDialog = () => {
    resetForm();
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Habits</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="gradient-primary border-0 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingHabit ? 'Edit Habit' : 'Add New Habit'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Habit Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Drink Water"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emoji">Choose Emoji</Label>
                <div className="grid grid-cols-6 gap-2 p-2 border rounded-md max-h-32 overflow-y-auto">
                  {HABIT_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`p-2 text-xl hover:bg-accent rounded transition-colors ${
                        formData.emoji === emoji ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Daily Target</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.target}
                  onChange={(e) => setFormData(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 gradient-primary border-0 text-white">
                  {editingHabit ? 'Update Habit' : 'Create Habit'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Habit List for Management */}
      <div className="space-y-2">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{habit.emoji}</span>
              <div>
                <h3 className="font-medium">{habit.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {habit.category} • {habit.streak} day streak • {habit.totalCompleted} total
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(habit)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(habit.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {habits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No habits yet. Create your first habit to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
