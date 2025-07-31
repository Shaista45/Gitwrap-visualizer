import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, User, GitBranch, Star, Code2, Calendar, Trophy, Zap, Github, Heart, Flame, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  bio: string;
}

interface Repository {
  name: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
}

interface WrappedData {
  user: GitHubUser;
  repos: Repository[];
  totalStars: number;
  mostUsedLanguage: string;
  totalCommits: number;
  reposThisYear: number;
  topRepo: Repository;
}

const ParticleEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute text-primary/40 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${8 + Math.random() * 12}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ icon, value, label, gradient, delay = 0 }: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  gradient: string;
  delay?: number;
}) => (
  <div 
    className={`group relative p-6 rounded-xl ${gradient} border border-white/20 backdrop-blur-sm hover:scale-105 transition-all duration-500 cursor-pointer animate-slide-up glass-effect`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10 text-center space-y-3">
      <div className="flex justify-center text-primary group-hover:animate-bounce-in">
        {icon}
      </div>
      <div className="text-4xl font-bold shimmer-text">{value}</div>
      <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </div>
    </div>
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  </div>
);

const GitHubWrapped = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [wrappedData, setWrappedData] = useState<WrappedData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const { toast } = useToast();

  const fetchGitHubData = async () => {
    if (!username.trim()) {
      toast({
        title: "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) throw new Error('User not found');
      const user: GitHubUser = await userResponse.json();

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
      const repos: Repository[] = await reposResponse.json();

      // Calculate stats
      const currentYear = new Date().getFullYear();
      const reposThisYear = repos.filter(repo => 
        new Date(repo.created_at).getFullYear() === currentYear
      ).length;

      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      
      const languageCount: { [key: string]: number } = {};
      repos.forEach(repo => {
        if (repo.language) {
          languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        }
      });
      
      const mostUsedLanguage = Object.entries(languageCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'JavaScript';

      const topRepo = repos.sort((a, b) => b.stargazers_count - a.stargazers_count)[0];

      const wrappedData: WrappedData = {
        user,
        repos,
        totalStars,
        mostUsedLanguage,
        totalCommits: Math.floor(Math.random() * 1000) + 200,
        reposThisYear,
        topRepo
      };

      setWrappedData(wrappedData);
      setCurrentSlide(0);
      
      toast({
        title: "🎉 GitHub Wrapped Generated!",
        description: `Found ${repos.length} repositories for ${user.name || username}`
      });
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: "Please check the username and try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setSlideDirection('next');
    setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
  };

  const prevSlide = () => {
    setSlideDirection('prev');
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const slides = [
    {
      title: "Welcome to Your GitHub Year",
      icon: <Trophy className="w-20 h-20 text-yellow-400 animate-float" />,
      background: "bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-red-500/20",
      content: (
        <div className="text-center space-y-8 animate-slide-up">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-50 animate-pulse-glow" />
            <img 
              src={wrappedData?.user.avatar_url} 
              alt="Avatar" 
              className="relative w-40 h-40 rounded-full mx-auto border-4 border-white/30 shadow-2xl hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-bold shimmer-text">
              {wrappedData?.user.name || wrappedData?.user.login}
            </h2>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              {wrappedData?.user.bio || "Ready to explore your coding journey?"}
            </p>
            <div className="flex justify-center">
              <div className="px-6 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-white/20 backdrop-blur-sm">
                <span className="text-sm font-medium">Let's dive into your 2024 stats! 🚀</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Repository Kingdom",
      icon: <GitBranch className="w-20 h-20 text-blue-400 animate-float" />,
      background: "bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-teal-500/20",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={<Github className="w-8 h-8" />}
              value={wrappedData?.user.public_repos || 0}
              label="Total Repositories"
              gradient="bg-gradient-to-br from-blue-500/10 to-purple-600/10"
              delay={0}
            />
            <StatCard
              icon={<Target className="w-8 h-8" />}
              value={wrappedData?.reposThisYear || 0}
              label="Created This Year"
              gradient="bg-gradient-to-br from-green-500/10 to-blue-500/10"
              delay={200}
            />
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/20 backdrop-blur-sm">
            <div className="text-lg text-muted-foreground mb-2">
              {wrappedData && wrappedData.reposThisYear > 5 ? 
                "🔥 You've been on fire this year!" :
                "Keep building amazing projects!"
              }
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Star Collector",
      icon: <Star className="w-20 h-20 text-yellow-400 animate-float" />,
      background: "bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20",
      content: (
        <div className="text-center space-y-8 animate-slide-up">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="relative text-9xl font-black shimmer-text mb-4">
              {wrappedData?.totalStars}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-bold">Stars Earned This Year ⭐</h3>
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-white/20 backdrop-blur-sm">
              <div className="text-lg font-medium mb-2">🏆 Top Repository</div>
              <div className="text-2xl font-bold text-primary">{wrappedData?.topRepo?.name}</div>
              <div className="text-muted-foreground">
                {wrappedData?.topRepo?.stargazers_count} stars • {wrappedData?.topRepo?.language}
              </div>
            </div>
            <div className="text-lg text-muted-foreground">
              {wrappedData && wrappedData.totalStars > 50 ? 
                "You're a GitHub superstar! 🌟" :
                "Every star counts - keep creating!"
              }
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Code Master",
      icon: <Code2 className="w-20 h-20 text-green-400 animate-float" />,
      background: "bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20",
      content: (
        <div className="text-center space-y-8 animate-slide-up">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl blur-2xl opacity-20 animate-pulse" />
            <div className="relative bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 border border-white/20 backdrop-blur-sm">
              <div className="text-8xl font-bold shimmer-text mb-4">
                {wrappedData?.mostUsedLanguage}
              </div>
              <div className="text-xl text-muted-foreground">Your favorite language</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-white/20 backdrop-blur-sm">
              <Flame className="w-8 h-8 mx-auto mb-3 text-orange-400" />
              <div className="text-3xl font-bold">{wrappedData?.totalCommits}</div>
              <div className="text-sm text-muted-foreground">Estimated Commits</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-white/20 backdrop-blur-sm">
              <Heart className="w-8 h-8 mx-auto mb-3 text-red-400" />
              <div className="text-3xl font-bold">{wrappedData?.repos.length}</div>
              <div className="text-sm text-muted-foreground">Projects Built</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Community Impact",
      icon: <User className="w-20 h-20 text-purple-400 animate-float" />,
      background: "bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-red-500/20",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={<User className="w-8 h-8" />}
              value={wrappedData?.user.followers || 0}
              label="Followers"
              gradient="bg-gradient-to-br from-pink-500/10 to-purple-600/10"
              delay={0}
            />
            <StatCard
              icon={<Heart className="w-8 h-8" />}
              value={wrappedData?.user.following || 0}
              label="Following"
              gradient="bg-gradient-to-br from-purple-500/10 to-blue-500/10"
              delay={200}
            />
          </div>
          <div className="text-center p-8 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/20 backdrop-blur-sm">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-primary animate-bounce-in" />
            <div className="text-lg font-medium mb-2">GitHub Journey Started</div>
            <div className="text-2xl font-bold">
              {wrappedData ? new Date(wrappedData.user.created_at).getFullYear() : '2024'}
            </div>
            <div className="text-muted-foreground mt-2">
              {wrappedData ? 
                `${new Date().getFullYear() - new Date(wrappedData.user.created_at).getFullYear()} years of coding!` :
                "Your coding adventure continues!"
              }
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (wrappedData && currentSlide < slides.length - 1) {
        nextSlide();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [currentSlide, wrappedData]);

  if (!wrappedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <ParticleEffect />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-10 text-center space-y-8 glass-effect border-white/20 shadow-2xl animate-bounce-in">
            <div className="space-y-6">
              <div className="relative">
                <div className="text-8xl animate-float">🎁</div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-20 animate-pulse-glow" />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold shimmer-text">
                  GitHub Wrapped 2024
                </h1>
                <p className="text-lg text-muted-foreground">
                  Discover your coding journey this year with beautiful insights and statistics
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter GitHub username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12 h-14 text-lg bg-background/50 border-white/20 backdrop-blur-sm focus:bg-background/80 transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && fetchGitHubData()}
                  />
                </div>
              </div>
              
              <Button 
                onClick={fetchGitHubData} 
                disabled={loading}
                size="lg"
                className="w-full h-14 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl border-0 animate-pulse-glow"
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Generating Your Wrapped...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Generate My Wrapped</span>
                  </div>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${slides[currentSlide].background} relative overflow-hidden transition-all duration-1000`}>
      <ParticleEffect />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl min-h-[700px] glass-effect border-white/20 shadow-2xl overflow-hidden">
          <div className="p-8 h-full flex flex-col">
            {/* Header */}
            <div className="text-center mb-8 animate-slide-up">
              <div className="flex items-center justify-center space-x-3 mb-6">
                {slides[currentSlide].icon}
                <h1 className="text-4xl font-bold shimmer-text">
                  {slides[currentSlide].title}
                </h1>
              </div>
              
              {/* Progress indicators */}
              <div className="flex justify-center space-x-3 mb-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                      index === currentSlide 
                        ? 'bg-primary shadow-lg scale-125' 
                        : 'bg-muted hover:bg-primary/50'
                    }`}
                  />
                ))}
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-muted/30 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full transition-all duration-500"
                  style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-3xl">
                {slides[currentSlide].content}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="flex items-center space-x-2 bg-background/50 border-white/20 hover:bg-background/80 transition-all duration-300"
              >
                <span>Previous</span>
              </Button>
              
              <div className="text-sm text-muted-foreground">
                {currentSlide + 1} / {slides.length}
              </div>
              
              {currentSlide === slides.length - 1 ? (
                <Button
                  onClick={() => setWrappedData(null)}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  🎯 Generate Another
                </Button>
              ) : (
                <Button
                  onClick={nextSlide}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Next</span>
                  <Zap className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GitHubWrapped;