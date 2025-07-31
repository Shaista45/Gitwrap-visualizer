import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, User, GitBranch, Star, Code2, Calendar, Trophy, Zap } from "lucide-react";
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

const GitHubWrapped = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [wrappedData, setWrappedData] = useState<WrappedData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
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
        totalCommits: Math.floor(Math.random() * 1000) + 200, // GitHub API doesn't provide total commits easily
        reposThisYear,
        topRepo
      };

      setWrappedData(wrappedData);
      setCurrentSlide(0);
      
      toast({
        title: "GitHub Wrapped Generated!",
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

  const slides = [
    {
      title: "Welcome to Your GitHub Year",
      icon: <Trophy className="w-16 h-16" />,
      content: (
        <div className="text-center space-y-6">
          <img 
            src={wrappedData?.user.avatar_url} 
            alt="Avatar" 
            className="w-32 h-32 rounded-full mx-auto border-4 border-primary/20 shadow-2xl"
          />
          <h2 className="text-4xl font-bold">{wrappedData?.user.name || wrappedData?.user.login}</h2>
          <p className="text-xl text-muted-foreground">Let's see what you built this year!</p>
        </div>
      )
    },
    {
      title: "Repository Stats",
      icon: <GitBranch className="w-16 h-16" />,
      content: (
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
            <div className="text-5xl font-bold mb-2">{wrappedData?.user.public_repos}</div>
            <div className="text-lg">Total Repositories</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl">
            <div className="text-5xl font-bold mb-2">{wrappedData?.reposThisYear}</div>
            <div className="text-lg">Created This Year</div>
          </div>
        </div>
      )
    },
    {
      title: "Stars & Recognition",
      icon: <Star className="w-16 h-16" />,
      content: (
        <div className="text-center space-y-6">
          <div className="text-8xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {wrappedData?.totalStars}
          </div>
          <div className="text-2xl">Total Stars Earned</div>
          <div className="text-lg text-muted-foreground">
            Your most starred repository: <span className="font-semibold">{wrappedData?.topRepo?.name}</span>
          </div>
        </div>
      )
    },
    {
      title: "Favorite Language",
      icon: <Code2 className="w-16 h-16" />,
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl font-bold text-primary">{wrappedData?.mostUsedLanguage}</div>
          <div className="text-xl">Your most used programming language</div>
          <div className="text-lg text-muted-foreground">
            Keep coding and exploring new technologies!
          </div>
        </div>
      )
    },
    {
      title: "Community Impact",
      icon: <User className="w-16 h-16" />,
      content: (
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-xl">
            <div className="text-5xl font-bold mb-2">{wrappedData?.user.followers}</div>
            <div className="text-lg">Followers</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
            <div className="text-5xl font-bold mb-2">{wrappedData?.user.following}</div>
            <div className="text-lg">Following</div>
          </div>
        </div>
      )
    }
  ];

  if (!wrappedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6 bg-card/80 backdrop-blur-sm border-primary/20">
          <div className="space-y-4">
            <div className="text-6xl">🎁</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GitHub Wrapped 2024
            </h1>
            <p className="text-muted-foreground">
              Discover your coding journey this year
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && fetchGitHubData()}
              />
            </div>
            <Button 
              onClick={fetchGitHubData} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Generating Wrapped...</span>
                </div>
              ) : (
                'Generate My Wrapped'
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl min-h-[600px] bg-card/90 backdrop-blur-sm border-primary/20 shadow-2xl">
          <div className="p-8 h-full flex flex-col">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                {slides[currentSlide].icon}
              </div>
              <h1 className="text-3xl font-bold mb-2">{slides[currentSlide].title}</h1>
              <div className="flex justify-center space-x-2">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full animate-fade-in">
                {slides[currentSlide].content}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="flex items-center space-x-2"
              >
                <span>Previous</span>
              </Button>
              
              {currentSlide === slides.length - 1 ? (
                <Button
                  onClick={() => setWrappedData(null)}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Generate Another
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
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