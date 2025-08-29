import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Download, 
  Upload, 
  Trash2,
  Sun,
  Moon,
  Monitor,
  User,
  Database,
  Bell
} from "lucide-react";
import { HabitStorage } from "@/lib/storage";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [userName, setUserName] = useState("Hero");
  const [exportData, setExportData] = useState("");

  useEffect(() => {
    // Check current theme
    setDarkMode(document.documentElement.classList.contains('dark'));
    
    // Load user preferences
    const userStats = HabitStorage.getUserStats();
    // You could store user name in userStats or create a separate preferences object
  }, []);

  const toggleTheme = (isDark: boolean) => {
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const handleExportData = () => {
    const data = HabitStorage.exportData();
    setExportData(data);
    
    // Create and download file
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-hero-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = HabitStorage.importData(jsonData);
        if (success) {
          // Reload the page to reflect imported data
          window.location.reload();
        } else {
          alert('Failed to import data. Please check the file format.');
        }
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    HabitStorage.clearData();
    window.location.reload();
  };

  const appData = HabitStorage.getData();
  const dataSize = new Blob([JSON.stringify(appData)]).size;
  const dataSizeKB = Math.round(dataSize / 1024 * 100) / 100;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <SettingsIcon className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">Customize your Habit Hero experience</p>
      </div>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Display Name</Label>
            <Input
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="gradient-primary border-0 text-white">
              Level {appData.userStats.level}
            </Badge>
            <Badge variant="outline">
              {appData.userStats.totalXP} Total XP
            </Badge>
            <Badge variant="outline">
              {appData.habits.length} Habits
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Member since: {new Date(appData.userStats.joinDate).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Dark Mode</div>
              <div className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={toggleTheme}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className={`cursor-pointer border-2 ${!darkMode ? 'border-primary' : 'border-border'}`}>
              <CardContent className="p-4 text-center">
                <Sun className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-medium">Light</div>
              </CardContent>
            </Card>
            
            <Card className={`cursor-pointer border-2 ${darkMode ? 'border-primary' : 'border-border'}`}>
              <CardContent className="p-4 text-center">
                <Moon className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-medium">Dark</div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer border-2 border-border opacity-50">
              <CardContent className="p-4 text-center">
                <Monitor className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-medium">Auto</div>
                <div className="text-xs text-muted-foreground mt-1">Coming soon</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Daily Reminders</div>
              <div className="text-sm text-muted-foreground">
                Get notified about your daily habits
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            💡 Tip: Enable browser notifications for the best experience
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">Storage Used</div>
              <div className="text-sm text-muted-foreground">{dataSizeKB} KB of local storage</div>
            </div>
            <Badge variant="outline">{appData.habits.length} habits</Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <Button onClick={handleExportData} className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
          </div>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full justify-start">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your habits, 
                  progress, achievements, and user data from this device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData} className="bg-destructive text-destructive-foreground">
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About Habit Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Habit Hero is a gamified habit tracker that makes building positive habits fun and engaging.
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Version 1.0.0</Badge>
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Made with ❤️ for habit builders everywhere
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
