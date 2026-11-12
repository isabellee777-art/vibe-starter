import React, { useState } from 'react';
import {
  X,
  Bell,
  Clock,
  Check,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Restaurant } from '../types';

interface MealtimeNudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDeciderForMeal: (mealType: 'lunch' | 'dinner') => void;
  restaurants: Restaurant[];
}

export const MealtimeNudgeModal: React.FC<MealtimeNudgeModalProps> = ({
  isOpen,
  onClose,
  onLaunchDeciderForMeal,
  restaurants,
}) => {
  const [optInLunch, setOptInLunch] = useState(true);
  const [optInDinner, setOptInDinner] = useState(true);
  const [nudgeTime, setNudgeTime] = useState<'12:30 PM' | '7:00 PM'>('12:30 PM');
  const [savedSettings, setSavedSettings] = useState(false);

  if (!isOpen) return null;

  const sampleSpot = restaurants[0] || null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative my-auto p-6 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
            Smart Mealtime Nudges
          </span>
        </div>

        <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-1">
          Never Wonder "What Should I Eat?"
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed mb-6">
          Opt-in smart nudges right when lunch or dinner decisions start. Useful, timely, never spammy.
        </p>

        {/* Live Simulator Preview */}
        <div className="bg-stone-900 text-white rounded-2xl p-4.5 border border-stone-800 shadow-md mb-6">
          <div className="flex items-center justify-between text-[11px] text-stone-400 pb-2 border-b border-stone-800 mb-3">
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Simulated Mealtime Notification
            </span>
            <span>12:32 PM · BiteMatch</span>
          </div>

          <p className="font-editorial text-base font-bold text-white mb-1">
            "Rainy lunch alert near Old Mill District 🍜"
          </p>
          <p className="text-xs text-stone-300 leading-relaxed mb-3">
            {sampleSpot?.name} has a 14-min walk and your favorite {sampleSpot?.signatureDish}. 15% off perk waiting!
          </p>

          <button
            onClick={() => {
              onLaunchDeciderForMeal('lunch');
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Launch Instant 10s Decision</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preferences Toggles */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
            Nudge Schedule Preferences
          </label>

          <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <p className="text-xs font-bold text-stone-900">Midday Lunch Nudge</p>
              <p className="text-[11px] text-stone-500">Sent between 12:00 PM – 1:00 PM</p>
            </div>
            <button
              onClick={() => setOptInLunch(!optInLunch)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                optInLunch ? 'bg-orange-600 justify-end' : 'bg-stone-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <p className="text-xs font-bold text-stone-900">Evening Dinner Nudge</p>
              <p className="text-[11px] text-stone-500">Sent between 6:30 PM – 7:30 PM</p>
            </div>
            <button
              onClick={() => setOptInDinner(!optInDinner)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                optInDinner ? 'bg-orange-600 justify-end' : 'bg-stone-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
            </button>
          </div>
        </div>

        {/* Footer save */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Never third-party ads</span>
          </div>

          <button
            onClick={() => {
              setSavedSettings(true);
              setTimeout(() => {
                setSavedSettings(false);
                onClose();
              }, 1200);
            }}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {savedSettings ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save Schedule</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
