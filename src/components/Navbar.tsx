import React from 'react';
import { Flame, Sparkles, Gift, Compass, User, Bell, Award, BookOpen } from 'lucide-react';
import { UserTasteProfile } from '../types';

interface NavbarProps {
  userProfile: UserTasteProfile;
  activeTab: 'decider' | 'catalogue' | 'perks' | 'profile' | 'community' | 'digest';
  setActiveTab: (tab: 'decider' | 'catalogue' | 'perks' | 'profile' | 'community' | 'digest') => void;
  onOpenNudge: () => void;
  onOpenDigest: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  activeTab,
  setActiveTab,
  onOpenNudge,
  onOpenDigest,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fbfbf9]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('decider')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-orange-900/10 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-editorial text-2xl font-bold tracking-tight text-stone-900 block leading-tight">
                  BiteMatch
                </span>
                <span className="text-[11px] font-medium tracking-wider uppercase text-stone-700 block -mt-0.5">
                  Smart Food Engine
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-stone-200">
              <button
                onClick={() => setActiveTab('decider')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'decider'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                10s Decider
              </button>
              <button
                onClick={() => setActiveTab('catalogue')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'catalogue'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Compass className="w-4 h-4" />
                Food Catalogue
              </button>
              <button
                onClick={() => setActiveTab('perks')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'perks'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Gift className="w-4 h-4 text-orange-500" />
                Perks & Offers
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'community'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Hidden Gems
              </button>
            </nav>
          </div>

          {/* Right Action Bar: Streak, Points, Weekly Digest */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mealtime Nudge Trigger */}
            <button
              onClick={onOpenNudge}
              title="Simulate Mealtime Alert"
              className="p-2 text-stone-600 hover:text-orange-600 hover:bg-stone-100 rounded-lg transition-colors relative"
              aria-label="Mealtime Nudge"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
            </button>

            {/* Meal Streak Indicator */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/80 border border-amber-200/60 rounded-lg text-amber-900 text-xs font-semibold"
              title="Continuous meal decision streak"
            >
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500 animate-bounce" />
              <span>{userProfile.streakDays}-Day Streak</span>
            </div>

            {/* BitePoints Balance */}
            <button
              onClick={() => setActiveTab('perks')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-orange-900 text-xs font-bold hover:bg-orange-100 transition-colors"
              title="Click to view reward perks"
            >
              <Award className="w-4 h-4 text-orange-600" />
              <span>{userProfile.points} pts</span>
            </button>

            {/* Weekly Digest Button */}
            <button
              onClick={onOpenDigest}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:border-stone-400 transition-colors shadow-2xs"
            >
              <span>Weekly Digest</span>
            </button>

            {/* Taste Profile Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
              }`}
              title="Taste Profile & Engine"
            >
              <User className="w-4 h-4" />
              <span className="text-xs font-semibold hidden sm:inline">
                {userProfile.algorithmAccuracy}% Calibrated
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-100 text-xs font-medium overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('decider')}
            className={`py-1.5 px-3 rounded-md whitespace-nowrap ${
              activeTab === 'decider' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            ⚡ 10s Decider
          </button>
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`py-1.5 px-3 rounded-md whitespace-nowrap ${
              activeTab === 'catalogue' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Catalogue
          </button>
          <button
            onClick={() => setActiveTab('perks')}
            className={`py-1.5 px-3 rounded-md whitespace-nowrap ${
              activeTab === 'perks' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Perks
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`py-1.5 px-3 rounded-md whitespace-nowrap ${
              activeTab === 'community' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Hidden Gems
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-1.5 px-3 rounded-md whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Profile
          </button>
        </div>
      </div>
    </header>
  );
};
