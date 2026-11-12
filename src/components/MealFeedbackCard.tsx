import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, ThumbsDown, Sparkles, Check, Flame, ArrowUpRight } from 'lucide-react';
import { Restaurant, UserTasteProfile } from '../types';

interface MealFeedbackCardProps {
  lastAcceptedRestaurant: Restaurant | null;
  userProfile: UserTasteProfile;
  onSubmitFeedback: (restaurantId: string, liked: boolean, tags: string[]) => void;
  onDismiss: () => void;
}

const FEEDBACK_TAGS = [
  'Spot-on spice level 🔥',
  'Rich umami baseline 🍜',
  'Great portion & value 💵',
  'Cozy atmosphere ✨',
  'Super fast service ⏱️',
  'A bit too heavy / rich',
  'Wanted more kick / heat',
];

export const MealFeedbackCard: React.FC<MealFeedbackCardProps> = ({
  lastAcceptedRestaurant,
  userProfile,
  onSubmitFeedback,
  onDismiss,
}) => {
  const [liked, setLiked] = useState<boolean | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!lastAcceptedRestaurant) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (liked === null) return;
    setSubmitted(true);
    onSubmitFeedback(lastAcceptedRestaurant.id, liked, selectedTags);
    setTimeout(() => {
      onDismiss();
    }, 2800);
  };

  return (
    <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-7 border border-stone-800 shadow-xl max-w-xl mx-auto my-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Smarter With Every Bite
          </span>
        </div>
        <span className="text-xs text-stone-400">
          Engine accuracy: <strong className="text-white">{userProfile.algorithmAccuracy}%</strong>
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="feedback-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="font-editorial text-xl font-bold mb-1">
              Did {lastAcceptedRestaurant.name} satisfy your craving?
            </h3>
            <p className="text-stone-400 text-xs mb-5">
              Your feedback directly tunes your future recommendations and unlocks +15 BitePoints.
            </p>

            {/* Thumbs selection */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setLiked(true)}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-all cursor-pointer ${
                  liked === true
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:border-stone-500'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${liked === true ? 'text-emerald-400' : ''}`} />
                <span>Hit the spot!</span>
              </button>

              <button
                onClick={() => setLiked(false)}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-all cursor-pointer ${
                  liked === false
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:border-stone-500'
                }`}
              >
                <ThumbsDown className={`w-4 h-4 ${liked === false ? 'text-rose-400' : ''}`} />
                <span>Not quite right</span>
              </button>
            </div>

            {/* Flavor Tag Toggles */}
            {liked !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-5"
              >
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  What contributed most to this rating?
                </label>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_TAGS.map((t) => {
                    const active = selectedTags.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleTag(t)}
                        className={`text-xs py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                          active
                            ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                            : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-800">
              <button
                onClick={onDismiss}
                className="text-xs text-stone-500 hover:text-stone-300 cursor-pointer"
              >
                Skip for now
              </button>

              <button
                onClick={handleSubmit}
                disabled={liked === null}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Submit & Tune Engine (+15 pts)</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="feedback-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-white mb-1">
              Taste Engine Calibrated!
            </h4>
            <p className="text-xs text-stone-400 mb-3">
              Accuracy increased to <span className="text-emerald-400 font-bold">{userProfile.algorithmAccuracy + 2}%</span>. +15 BitePoints awarded.
            </p>
            <div className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-700/50 px-3 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Streak alive! Tomorrow's lunch pick will be even sharper.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
