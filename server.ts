import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI SDK with required telemetry header
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// API Route: Juggle Closet with AI
// ----------------------------------------------------
app.post('/api/gemini/juggle', async (req, res) => {
  try {
    const { wardrobe, occasion, stylePreference, weather, userPrompt } = req.body;

    if (!Array.isArray(wardrobe) || wardrobe.length === 0) {
      return res.status(400).json({ error: 'Wardrobe items are required' });
    }

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY configured; utilizing local fashion heuristic.',
      });
    }

    // Prepare concise wardrobe representation for Gemini
    const wardrobeSummary = wardrobe.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      color: item.color,
      style: item.style,
      season: item.season || 'All',
    }));

    const prompt = `
You are the AI fashion stylist behind "Outfit Juggle", an elite digital wardrobe assistant.
The user owns ONLY the clothes in this inventory:
${JSON.stringify(wardrobeSummary, null, 2)}

User Request / Constraints:
- Occasion: ${occasion || 'Casual'}
- Preferred Style: ${stylePreference || 'All'}
- Weather: ${weather || 'Mild'}
- Additional Prompt / Focus: ${userPrompt || 'None'}

RULES:
1. You MUST select items ONLY from the user's provided inventory IDs. Do NOT invent new clothes.
2. An outfit MUST consist of:
   - Either (1 top AND 1 trouser/shorts) OR (1 dress).
   - Plus exactly 1 pair of shoes.
   - Plus optional jacket, bag, or accessories if they enhance the look.
3. Calculate an AI match score between 85 and 99 reflecting how beautifully the colors, silhouettes, and occasion coordinate.
4. Give a creative luxury fashion outfit name, an explanation of why this combination works, and a concrete styling tip (e.g. cuffing, tucking, layering).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            selectedItemIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of item IDs selected strictly from the inventory',
            },
            outfitName: {
              type: Type.STRING,
              description: 'Chic, editorial title for this outfit',
            },
            style: {
              type: Type.STRING,
              description: 'Primary fashion aesthetic (e.g., Casual Chic, Minimalist, Romantic)',
            },
            matchScore: {
              type: Type.INTEGER,
              description: 'Match score between 85 and 99',
            },
            colorHarmonyScore: {
              type: Type.INTEGER,
              description: 'Color harmony score between 80 and 99',
            },
            occasionFitScore: {
              type: Type.INTEGER,
              description: 'Occasion fit score between 80 and 99',
            },
            styleSynergyScore: {
              type: Type.INTEGER,
              description: 'Style synergy score between 80 and 99',
            },
            stylistNote: {
              type: Type.STRING,
              description: 'Why this outfit combination works so well together',
            },
            stylingTip: {
              type: Type.STRING,
              description: 'Actionable styling tip for wearing the look',
            },
            colorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Names of dominant colors in this look',
            },
          },
          required: [
            'selectedItemIds',
            'outfitName',
            'style',
            'matchScore',
            'stylistNote',
            'stylingTip',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Gemini juggle API error (falling back to heuristic):', error?.message || error);
    return res.status(200).json({
      fallback: true,
      error: error?.message,
    });
  }
});

// ----------------------------------------------------
// API Route: AI Styling Assistant Chat
// ----------------------------------------------------
app.post('/api/gemini/stylist', async (req, res) => {
  try {
    const { query, wardrobe, chatHistory } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY configured; utilizing smart local stylist fallback.',
      });
    }

    const wardrobeSummary = (wardrobe || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      color: item.color,
      style: item.style,
    }));

    const prompt = `
You are the AI Stylist for "Outfit Juggle".
The user is asking: "${query}"

Here is their current digital wardrobe:
${JSON.stringify(wardrobeSummary, null, 2)}

TASK:
1. Provide an inspiring, warm, concise editorial stylist response.
2. Select a complete outfit chosen SOLELY from their wardrobe items.
3. If they asked to use a specific item (e.g. "Use my pink top"), make sure that exact item is in the selectedItemIds.
4. If their wardrobe is missing a key piece (for example, no suitable shoes for a wedding, or no jacket for chilly weather), advise them gently on what missing item they could add to their closet.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyMessage: {
              type: Type.STRING,
              description: 'Friendly, expert stylist response message',
            },
            selectedItemIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of item IDs chosen strictly from their wardrobe',
            },
            outfitName: {
              type: Type.STRING,
              description: 'Editorial outfit title',
            },
            occasion: {
              type: Type.STRING,
              description: 'Best matching occasion name',
            },
            style: {
              type: Type.STRING,
              description: 'Style vibe',
            },
            matchScore: {
              type: Type.INTEGER,
              description: 'Match score 85-99',
            },
            stylistNote: {
              type: Type.STRING,
              description: 'Why this combination works',
            },
            stylingTip: {
              type: Type.STRING,
              description: 'A quick trick or tip for wearing it',
            },
            missingItemAlert: {
              type: Type.STRING,
              description: 'Optional note if their wardrobe lacks a specific piece for this request',
            },
          },
          required: ['replyMessage', 'selectedItemIds', 'outfitName'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Gemini stylist API error (falling back):', error?.message || error);
    return res.status(200).json({
      fallback: true,
      error: error?.message,
    });
  }
});

// ----------------------------------------------------
// API Route: Analyze Uploaded Clothing Photo
// ----------------------------------------------------
app.post('/api/gemini/analyze-item', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64 || !ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No image or Gemini API key provided; skipping auto-detection',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          {
            text: `Analyze this clothing item photograph.
Identify:
1. A concise, stylish name (e.g. "Pastel Pink Ribbed Cardigan", "Tailored Pleated Trousers").
2. The exact category, chosen from: tops, trousers, dresses, shorts, shoes, bags, jackets, accessories.
3. The primary color, chosen from: White, Black, Cream, Pink, Red, Blue, Navy, Green, Sage, Beige, Brown, Yellow, Purple, Grey, Patterned, Gold, Silver.
4. The aesthetic style, chosen from: Casual, Chic, Streetwear, Minimalist, Boho, Sporty, Preppy, Formal, Vintage, Romantic.
5. 3-4 descriptive fashion tags.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            color: { type: Type.STRING },
            style: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['name', 'category', 'color', 'style'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Gemini analyze-item error:', error?.message || error);
    return res.status(200).json({ fallback: true, error: error?.message });
  }
});

// ----------------------------------------------------
// Setup Vite Middleware or Static Assets
// ----------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Outfit Juggle server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
