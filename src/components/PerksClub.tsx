import React, { useState } from 'react';
import {
  Gift,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Copy,
  Tag,
  ArrowRight,
  ExternalLink,
  Zap,
  Lock
} from 'lucide-react';
import { PerkItem, Badge, UserTasteProfile } from '../types';

interface PerksClubProps {
  userProfile: UserTasteProfile;
  availablePerks: PerkItem[];
  badges: Badge[];
  onRedeemPerk: (perk: PerkItem) => void;
  onDailyCheckIn: () => void;
  hasCheckedInToday: boolean;
}

export const PerksClub: React.FC<PerksClubProps> = ({
  userProfile,
  availablePerks,
  badges,
  onRedeemPerk,
  onDailyCheckIn,
  hasCheckedInToday,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="py-6 sm:py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
          <Gift className="w-3.5 h-3.5" />
          <span>Loyalty & Secret Dining Rewards</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900">
          BitePoints & Exclusive Offers
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-1">
          Every recommendation you act on and rate earns points. Trade them for real discounts and off-menu perks.
        </p>
      </div>

      {/* Points & Daily Check-In Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-br from-stone-900 to-stone-850 text-white rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-xl mb-10">
        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                Your BitePoints Balance
              </span>
              <span className="text-stone-500">·</span>
              <span className="text-xs text-stone-300">
                Tier: Epicurean Silver
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-editorial text-5xl font-bold tracking-tight text-white">
                {userProfile.points}
              </span>
              <span className="text-stone-400 text-sm font-medium">BitePoints</span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-md">
              Maintain your continuous meal streak to keep earning points with every lunch and dinner decision.
            </p>
          </div>

          {/* Point Earning Channels */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-4 border-t border-stone-800 text-[11px]">
            <div>
              <p className="text-stone-400">10s Decision</p>
              <p className="font-bold text-amber-300">+25 pts</p>
            </div>
            <div>
              <p className="text-stone-400">Meal Feedback</p>
              <p className="font-bold text-amber-300">+15 pts</p>
            </div>
            <div>
              <p className="text-stone-400">Daily Check-In</p>
              <p className="font-bold text-amber-300">+10 pts</p>
            </div>
            <div>
              <p className="text-stone-400">Share Gem</p>
              <p className="font-bold text-amber-300">+50 pts</p>
            </div>
          </div>
        </div>

        {/* Daily Check-In & Streak Widget */}
        <div className="md:col-span-5 bg-stone-800/70 rounded-xl p-5 border border-stone-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                <span>{userProfile.streakDays}-Day Foodie Streak</span>
              </div>
              <span className="text-[11px] text-stone-400 font-medium">Daily Goal: 1 meal</span>
            </div>
            <p className="text-xs text-stone-300 mb-4">
              Check in during meal times to keep your streak hot and claim today's bonus points!
            </p>
          </div>

          <button
            onClick={onDailyCheckIn}
            disabled={hasCheckedInToday}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              hasCheckedInToday
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md'
            }`}
          >
            {hasCheckedInToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Checked In Today (+10 pts Claimed)</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Claim Daily Check-In (+10 pts)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Available Rewards & Perks */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-editorial text-2xl font-bold text-stone-900">
            Redeemable Perks & Discounts
          </h3>
          <span className="text-xs text-stone-500">
            Show code to server or order in-app
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availablePerks.map((p) => {
            const isRedeemed = userProfile.redeemedPerkIds.includes(p.id);
            const canAfford = userProfile.points >= p.pointsCost;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  isRedeemed
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                      {p.badge}
                    </span>
                    <span className="text-xs font-bold text-stone-700">
                      {p.pointsCost} pts
                    </span>
                  </div>

                  <h4 className="font-editorial text-lg font-bold text-stone-900 leading-tight">
                    {p.title}
                  </h4>
                  <p className="text-xs font-bold text-emerald-700 mt-1">
                    {p.discountText}
                  </p>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100">
                  {isRedeemed ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-stone-100 px-3 py-2 rounded-lg border border-stone-200">
                        <span className="font-mono text-xs font-bold text-stone-900">
                          {p.code}
                        </span>
                        <button
                          onClick={() => handleCopy(p.code)}
                          className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedCode === p.code ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-500 text-center">
                        Active voucher · {p.expiry}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => onRedeemPerk(p)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        canAfford
                          ? 'bg-stone-900 hover:bg-orange-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <Tag className="w-3.5 h-3.5" />
                          <span>Redeem for {p.pointsCost} Points</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Needs {p.pointsCost - userProfile.points} more pts</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-stone-900">
              Your Foodie Streaks & Badges
            </h3>
            <p className="text-xs text-stone-500">
              Celebrate your culinary milestones and unlock secret app perks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                b.unlocked
                  ? 'bg-white border-amber-200/80 shadow-xs'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  b.unlocked
                    ? 'bg-amber-100 text-amber-700 font-bold'
                    : 'bg-stone-200 text-stone-400'
                }`}
              >
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-stone-900">{b.title}</h4>
                  <span
                    className={`text-[10px] font-semibold ${
                      b.unlocked ? 'text-emerald-700' : 'text-stone-500'
                    }`}
                  >
                    {b.progress}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
