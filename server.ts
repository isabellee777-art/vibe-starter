import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize Google Gen AI client:', err);
  }
}

// Check AI status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGemini: Boolean(aiClient),
  });
});

// AI Craving Matchmaker & Recommendation Rationale
app.post('/api/recommend-ai', async (req, res) => {
  try {
    const { mood, budget, dietary, weather, mealTime, customCraving, tasteProfile, candidateRestaurants } = req.body;

    if (!aiClient) {
      return res.json({
        available: false,
        message: 'No API key provided. Using local algorithmic match engine.',
      });
    }

    const prompt = `You are BiteMatch's Michelin-level culinary concierge and craving psychologist.
A hungry user needs a personalized food decision right now.
User Context:
- Current Mood: ${mood || 'Not specified'}
- Custom Craving / Notes: ${customCraving || 'Surprise me'}
- Meal Time: ${mealTime || 'Lunch'}
- Weather: ${weather || 'Mild'}
- Budget: ${budget || 'Any'}
- Dietary Restrictions: ${Array.isArray(dietary) ? dietary.join(', ') : dietary || 'None'}
- Taste Profile: Spice=${tasteProfile?.spiceTolerance || 3}/5, Sweet=${tasteProfile?.sweetTooth || 3}/5, Umami=${tasteProfile?.umamiLove || 4}/5, Health-conscious=${tasteProfile?.healthConscious || 3}/5

Available Restaurant Candidates in Catalogue:
${JSON.stringify((candidateRestaurants || []).slice(0, 10).map((r: any) => ({
  id: r.id,
  name: r.name,
  cuisine: r.cuisine,
  signatureDish: r.signatureDish,
  price: r.price,
  vibe: r.vibe,
  tags: r.tags,
  offer: r.offerDetails
})))}

Respond with STRICT JSON format with NO markdown code block or backticks:
{
  "bestMatchId": "id of best matching restaurant from candidate list",
  "matchScore": 98,
  "catchyHeadline": "Short 1-line catchy rationale (e.g. 'Golden Crispy Birria with Silky Consomé')",
  "whyItHitsTheSpot": "2 concise sentences explaining why this exact dish and spot perfectly answers their current mood, weather, and taste profile.",
  "secretOrderTip": "One insider tip for the best experience (e.g. 'Ask for the double cilantro crema on the side')",
  "pairingSuggestion": "A drink or side pairing that elevates this meal",
  "moodTone": "Comforting / Energizing / Indulgent / Refreshing"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text?.trim() || '{}';
    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      // Clean possible stray backticks
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json({
      available: true,
      result: parsed,
    });
  } catch (error: any) {
    console.error('AI recommendation error:', error);
    return res.status(500).json({
      available: false,
      error: error.message || 'Error generating AI recommendation',
    });
  }
});

// AI Weekly Food Personality Digest
app.post('/api/generate-digest', async (req, res) => {
  try {
    const { mealsLogged, favoriteCuisines, totalSpentSaved, streakDays } = req.body;

    if (!aiClient) {
      return res.json({
        available: false,
        digest: {
          foodiePersona: 'The Eclectic Flavour Explorer',
          weeklySummary: 'You balanced comforting umami-rich broths with fresh artisan crunch this week. Kept your streak alive and saved with local perks!',
          highlightBadge: 'Flame Keeper 🔥',
          nextCulinaryQuest: 'Try a hidden gem fermented spicy dish to level up your heat tolerance!',
        },
      });
    }

    const prompt = `Write a fun, highly motivating 'Your Week in Food' digest for a foodie app called BiteMatch.
Stats:
- Meals logged this week: ${mealsLogged || 5}
- Top cuisines enjoyed: ${Array.isArray(favoriteCuisines) ? favoriteCuisines.join(', ') : 'Japanese, Mexican, Thai'}
- Money saved with app perks: $${totalSpentSaved || '24.50'}
- Active meal streak: ${streakDays || 5} days

Return valid JSON with:
{
  "foodiePersona": "Creative title like 'The Umami Alchemist' or 'Street-Food Connoisseur'",
  "weeklySummary": "2-3 sentences of witty, encouraging culinary storytelling praising their palate and habits.",
  "highlightBadge": "Title of badge earned this week",
  "nextCulinaryQuest": "Fun challenge for next week to try an adventurous new spot"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json({
      available: true,
      digest: parsed,
    });
  } catch (err: any) {
    console.error('Digest generation error:', err);
    return res.status(500).json({ available: false, error: err.message });
  }
});

// Vite middleware in dev, static in production
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`BiteMatch server running at http://0.0.0.0:${port}`);
  });
}

startServer();
