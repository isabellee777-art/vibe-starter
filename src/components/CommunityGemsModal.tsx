import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  ThumbsUp,
  PlusCircle,
  Award,
  CheckCircle2,
  Send,
  X,
  Share2
} from 'lucide-react';
import { CommunityPost, Restaurant } from '../types';

interface CommunityGemsModalProps {
  posts: CommunityPost[];
  restaurants: Restaurant[];
  onUpvotePost: (postId: string) => void;
  onSubmitNewGem: (newPost: Partial<CommunityPost>, newRestaurant?: Partial<Restaurant>) => void;
  onViewRestaurant: (restaurant: Restaurant) => void;
}

export const CommunityGemsModal: React.FC<CommunityGemsModalProps> = ({
  posts,
  restaurants,
  onUpvotePost,
  onSubmitNewGem,
  onViewRestaurant,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [gemName, setGemName] = useState('');
  const [gemNeighborhood, setGemNeighborhood] = useState('');
  const [gemCuisine, setGemCuisine] = useState('');
  const [gemDish, setGemDish] = useState('');
  const [gemTip, setGemTip] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gemName.trim() || !gemDish.trim() || !gemTip.trim()) return;

    onSubmitNewGem(
      {
        restaurantName: gemName,
        dishName: gemDish,
        review: gemTip,
        badge: 'Community Submitted',
      },
      {
        name: gemName,
        neighborhood: gemNeighborhood || 'Downtown District',
        cuisine: gemCuisine || 'Local Fusion',
        signatureDish: gemDish,
        tagline: gemTip.slice(0, 70) + '...',
      }
    );

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowSubmitModal(false);
      setGemName('');
      setGemNeighborhood('');
      setGemCuisine('');
      setGemDish('');
      setGemTip('');
    }, 2000);
  };

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Crowdsourced & Influencer Insider Tips</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900">
            Hidden Gem Community Feed
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Off-menu hacks, secret dipping sauces, and verified discoveries shared by local eaters.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-5 py-2.5 bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>Submit a Gem (+50 pts)</span>
        </button>
      </div>

      {/* Community Posts Feed */}
      <div className="space-y-4">
        {posts.map((p) => {
          const matchedRest = restaurants.find(
            (r) => r.id === p.restaurantId || r.name.toLowerCase() === p.restaurantName.toLowerCase()
          );

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Author row */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatar}
                      alt={p.author}
                      className="w-9 h-9 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{p.author}</span>
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                          {p.authorRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400">{p.timestamp}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                    {p.badge}
                  </span>
                </div>

                {/* Spot & Dish Title */}
                <div className="mb-2">
                  <h3 className="font-editorial text-xl font-bold text-stone-900">
                    {p.restaurantName}
                  </h3>
                  <p className="text-xs font-bold text-stone-700 mt-0.5">
                    Recommended Order: <span className="text-orange-700">{p.dishName}</span>
                  </p>
                </div>

                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  "{p.review}"
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => onUpvotePost(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    p.hasUpvoted
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  <ThumbsUp
                    className={`w-3.5 h-3.5 ${p.hasUpvoted ? 'fill-orange-600 text-orange-600' : ''}`}
                  />
                  <span>{p.upvotes} Foodies found this helpful</span>
                </button>

                {matchedRest && (
                  <button
                    onClick={() => onViewRestaurant(matchedRest)}
                    className="text-xs font-semibold text-stone-700 hover:text-stone-900 underline cursor-pointer"
                  >
                    View Restaurant
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Hidden Gem Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative my-auto p-6 sm:p-7">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Community Curator</span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-1">
              Recommend a Neighborhood Gem
            </h3>
            <p className="text-xs text-stone-600 mb-6">
              Know an unpretentious counter or hole-in-the-wall? Share your tip and claim +50 BitePoints!
            </p>

            {submittedSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="font-editorial text-xl font-bold text-stone-900 mb-1">
                  Gem Submitted to BiteMatch!
                </h4>
                <p className="text-xs text-stone-600 mb-4">
                  +50 BitePoints added to your Perks wallet.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Restaurant or Counter Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={gemName}
                    onChange={(e) => setGemName(e.target.value)}
                    placeholder="e.g. Tacos El Pastorcito"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/30 text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Neighborhood
                    </label>
                    <input
                      type="text"
                      value={gemNeighborhood}
                      onChange={(e) => setGemNeighborhood(e.target.value)}
                      placeholder="e.g. Westside Alley"
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/30 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Cuisine Style
                    </label>
                    <input
                      type="text"
                      value={gemCuisine}
                      onChange={(e) => setGemCuisine(e.target.value)}
                      placeholder="e.g. Oaxacan Street Food"
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/30 text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Signature Dish to Order *
                  </label>
                  <input
                    type="text"
                    required
                    value={gemDish}
                    onChange={(e) => setGemDish(e.target.value)}
                    placeholder="e.g. Al Pastor Tacos with charred pineapple"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/30 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Your Insider Tip or Secret Order *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={gemTip}
                    onChange={(e) => setGemTip(e.target.value)}
                    placeholder="e.g. Ask for the spicy green salsa and double tortillas. Best eaten right by the counter."
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/30 text-stone-900"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Publish Gem (+50 pts)</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
