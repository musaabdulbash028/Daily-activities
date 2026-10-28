import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// AI Life Coach endpoint
app.post('/api/ai/coach', async (req: Request, res: Response) => {
  try {
    const { message, history, profile, scheduleSummary } = req.body;

    if (!ai) {
      // Fallback smart response when API key is not yet set
      const fallbackResponses = [
        `I noticed your current daily goals! A great approach is to tackle your high-energy study block right after your morning routine, followed by a 10-minute movement break. Remember, consistency beats intensity every time!`,
        `Looking at your schedule, ensure you protect at least 8 hours of sleep opportunity tonight. Adequate rest directly improves synaptic plasticity and memory retention for tomorrow's work.`,
        `For your study targets, try the 25/5 Pomodoro method with active recall rather than passive re-reading. Test yourself without looking at notes first!`,
        `Don't forget to take a 5-minute hydration and screen-rest pause. Step outside for natural daylight if possible to reinforce your circadian rhythm.`,
      ];
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return res.json({
        reply: `[Offline/Demo Mode] ${randomFallback}\n\n(Tip: When you connect a Gemini API key in Secrets, LifeOS Coach provides deeply personalized multi-turn coaching tailored directly to your live stats!)`,
      });
    }

    const systemInstruction = `You are "LifeOS Coach", an empathetic, highly knowledgeable personal life optimizer, fitness advisor, and academic performance mentor.
Your user context:
- Goals: ${profile?.goals?.join(', ') || 'General productivity & balance'}
- Wake Time: ${profile?.wakeTime || '07:00'} | Bedtime: ${profile?.bedTime || '23:00'}
- Focus/Study Preference: ${profile?.studyHoursPreference || '2 hours/day'}
- Fitness Level: ${profile?.fitnessLevel || 'Beginner'} with equipment: ${profile?.equipment || 'Bodyweight'}
- Recent Schedule Overview: ${JSON.stringify(scheduleSummary || {})}

Guidelines:
1. Provide warm, encouraging, pragmatic, and evidence-based advice.
2. Emphasize realistic scheduling, non-negotiable sleep (8-10h for students/teens), regular breaks, hydration, and safe physical exercise.
3. Help break down large tasks, prevent burnout, and celebrate small wins.
4. Never shame users for missed days or incomplete tasks.
5. Format responses cleanly with brief bullet points or paragraphs. Keep it under 250 words unless deep detail is requested.`;

    const chatContext = (history || []).slice(-6).map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'User' : 'Coach'}: ${h.text}`).join('\n');
    const prompt = `${chatContext}\nUser: ${message}\nCoach:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm here to help you optimize your day. Let's make steady progress today!";
    return res.json({ reply });
  } catch (err: unknown) {
    console.error('Gemini coach error:', err);
    return res.json({
      reply: "I'm having a momentary connection glitch, but keep moving forward! Prioritize your top task for today, stay hydrated, and take a quick stretch.",
    });
  }
});

// AI Smart Day Generator endpoint
app.post('/api/ai/generate-day', async (req: Request, res: Response) => {
  try {
    const { profile, fixedCommitments, tasks } = req.body;

    const wakeTime = profile?.wakeTime || '07:00';
    const bedTime = profile?.bedTime || '23:00';
    const fitnessLevel = profile?.fitnessLevel || 'Beginner';

    if (!ai) {
      // Algorithmic smart day generator fallback
      const defaultBlocks = [
        { id: 'block-1', title: 'Morning Rise & Hydration', category: 'routine', startTime: wakeTime, endTime: '07:45', priority: 'medium', completed: false, notes: 'Drink water, get natural sunlight, gentle stretch' },
        { id: 'block-2', title: 'Healthy Breakfast & Planning', category: 'meals', startTime: '07:45', endTime: '08:30', priority: 'medium', completed: false, notes: 'Nutritious fuel and review top 3 priorities' },
        { id: 'block-3', title: 'Deep Work / Focus Study Session 1', category: 'study', startTime: '09:00', endTime: '10:30', priority: 'high', completed: false, notes: 'Active recall & high cognitive load tasks' },
        { id: 'block-4', title: 'Mindful Walk & Hydration Break', category: 'breaks', startTime: '10:30', endTime: '10:50', priority: 'low', completed: false, notes: 'Step away from all screens' },
        { id: 'block-5', title: 'Core Study Session 2 / Assignments', category: 'study', startTime: '11:00', endTime: '12:30', priority: 'high', completed: false, notes: 'Problem sets and flashcard review' },
        { id: 'block-6', title: 'Balanced Lunch & Digestion', category: 'meals', startTime: '12:30', endTime: '13:30', priority: 'medium', completed: false, notes: 'Whole foods and relaxed pacing' },
        { id: 'block-7', title: 'Productivity & Daily Tasks', category: 'tasks', startTime: '14:00', endTime: '15:30', priority: 'medium', completed: false, notes: 'Emails, admin, and organization' },
        { id: 'block-8', title: `Smart Fitness (${fitnessLevel})`, category: 'workout', startTime: '16:00', endTime: '16:45', priority: 'high', completed: false, notes: 'Dynamic warm-up, strength/mobility, gentle cooldown' },
        { id: 'block-9', title: 'Meditation & Breathwork', category: 'meditation', startTime: '17:00', endTime: '17:15', priority: 'medium', completed: false, notes: '4-7-8 relaxing breath or body scan' },
        { id: 'block-10', title: 'Dinner & Leisure Social Time', category: 'meals', startTime: '18:30', endTime: '19:45', priority: 'low', completed: false, notes: 'Unwind with family/friends or reading' },
        { id: 'block-11', title: 'Evening Wind-Down & Digital Sunset', category: 'sleep', startTime: '22:00', endTime: bedTime, priority: 'high', completed: false, notes: 'Dim lights, screen off, journaling, gratitude' },
      ];
      return res.json({ blocks: defaultBlocks, note: 'Generated using LifeOS Circadian Rule Engine' });
    }

    const systemInstruction = `You are an expert circadian rhythm and daily schedule optimizer.
Generate an optimal daily time-block schedule in strict JSON format.
Respect:
- Wake time: ${wakeTime}
- Bedtime: ${bedTime} (Do NOT schedule anything past bedtime)
- Protect 8 hours of sleep
- Fixed commitments: ${JSON.stringify(fixedCommitments || [])}
- User Tasks: ${JSON.stringify(tasks || [])}
- Include: morning routine, 2 focused study/work blocks, exercise session, meditation/breathing, meals, breaks, evening wind-down.
Output MUST be an array of objects:
[
  {
    "id": "gen-1",
    "title": "Title",
    "category": "study" | "workout" | "meditation" | "routine" | "meals" | "breaks" | "tasks" | "sleep",
    "startTime": "HH:MM",
    "endTime": "HH:MM",
    "priority": "high" | "medium" | "low",
    "notes": "Short helpful tip"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Generate my balanced, healthy daily schedule.',
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({ blocks: parsed, note: 'AI-tailored to your circadian rhythms & goals' });
  } catch (err: unknown) {
    console.error('Generate day error:', err);
    return res.status(500).json({ error: 'Failed to generate plan' });
  }
});

// AI Study Concept Explainer
app.post('/api/ai/study-explain', async (req: Request, res: Response) => {
  try {
    const { subject, topic, level } = req.body;

    if (!ai) {
      return res.json({
        explanation: `### Core Concept: ${topic} (${subject})\n\n**The Big Idea (ELI5):** Think of ${topic} like an everyday system where each component works together to create a predictable outcome.\n\n**Key Principles:**\n1. **Core Foundation:** Understand the fundamental definitions before memorizing formulas.\n2. **Common Pitfall:** Don't confuse active understanding with passive recognition.\n3. **Practical Analogy:** Imagine building with blocks—each layer needs a sturdy base.\n\n**Active Recall Challenge:** Close your eyes and explain ${topic} in 2 sentences to a friend!`,
      });
    }

    const prompt = `Explain the following topic for a student:
Subject: ${subject}
Topic: ${topic}
Target Level: ${level || 'High School / Undergraduate'}

Please structure your response with:
1. 💡 **Simple Analogy (ELI5)**
2. 🎯 **Core Mechanism & Key Definitions**
3. ⚠️ **Common Misconceptions**
4. 🧠 **Quick Active Recall Question (with answer hidden below)**
Keep the tone encouraging, concise, and crystal clear.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ explanation: response.text });
  } catch (err: unknown) {
    console.error('Study explain error:', err);
    return res.json({
      explanation: "Unable to generate explanation right now. Review your core notes and test yourself on key definitions!",
    });
  }
});

// AI Quiz Generator
app.post('/api/ai/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { subject, topic } = req.body;

    if (!ai) {
      const fallbackQuestions = [
        {
          question: `Which study technique has the highest empirical evidence for long-term memory retention in ${topic || subject}?`,
          options: ["Passive re-reading", "Active recall & Spaced testing", "Highlighter coloring", "Cramming the night before"],
          correctIndex: 1,
          explanation: "Active recall forces cognitive retrieval, creating stronger synaptic connections compared to passive review.",
        },
        {
          question: `What is the primary benefit of interleaving different topics within ${subject}?`,
          options: ["It reduces brain effort", "It trains the brain to discriminate between problem types", "It eliminates the need for rest", "It makes studying faster"],
          correctIndex: 1,
          explanation: "Interleaving enhances transfer learning by training you to identify which strategy applies to which problem.",
        },
        {
          question: `How does adequate sleep support learning ${topic || subject}?`,
          options: ["It erases unnecessary facts", "Slow-wave sleep consolidates declarative memories from the hippocampus to the cortex", "It replaces studying", "It only rests physical muscles"],
          correctIndex: 1,
          explanation: "During deep sleep and REM phases, memories are consolidated into long-term neocortical networks.",
        },
      ];
      return res.json({ questions: fallbackQuestions });
    }

    const prompt = `Generate 3 high-quality multiple choice practice questions for the subject "${subject}" and topic "${topic}".
Output must be a JSON array of objects:
[
  {
    "question": "string",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": number (0-3),
    "explanation": "Brief explanation of why this answer is correct"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const questions = JSON.parse(response.text || '[]');
    return res.json({ questions });
  } catch (err: unknown) {
    console.error('Generate quiz error:', err);
    return res.status(500).json({ error: 'Quiz generation failed' });
  }
});

// AI Task Breakdown
app.post('/api/ai/breakdown-task', async (req: Request, res: Response) => {
  try {
    const { taskTitle, timeAvailable } = req.body;

    if (!ai) {
      return res.json({
        subtasks: [
          { title: `Clarify objective and collect required materials for ${taskTitle}`, duration: '15 min' },
          { title: 'Draft outline and core bullet points', duration: '25 min' },
          { title: 'Take a 5-minute movement break', duration: '5 min' },
          { title: 'Execute the most difficult section first (Eat the Frog)', duration: '35 min' },
          { title: 'Final review, proofread, and tidy up submission', duration: '15 min' },
        ],
      });
    }

    const prompt = `Break down this big task into 4-6 manageable, actionable subtasks with reasonable durations:
Task: "${taskTitle}"
Estimated Available Time: ${timeAvailable || '2 hours'}

Output MUST be a JSON array of objects:
[
  { "title": "Subtask title", "duration": "e.g. 20 min" }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const subtasks = JSON.parse(response.text || '[]');
    return res.json({ subtasks });
  } catch (err: unknown) {
    console.error('Breakdown task error:', err);
    return res.status(500).json({ error: 'Task breakdown failed' });
  }
});

// Vite Middleware integration in dev, or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LifeOS server running on http://localhost:${PORT}`);
  });
}

startServer();
