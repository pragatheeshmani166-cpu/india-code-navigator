import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client lazily / safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Please add your key in the Secrets panel in Settings.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API ROUTES BEFORE VITE MIDDLEWARE

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. AI Legal Search & Synthesis Memorandum
app.post('/api/legal/search', async (req, res) => {
  try {
    const { query, activeCategory, curatedActsContext } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an elite legal research counsel specializing in Indian Jurisprudence (including the Constitution of India, Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), Bharatiya Sakshya Adhiniyam (BSA), Contract Act, and IT Act).
Your objective is to draft a formal, high-quality, and highly organized "Legal Memorandum" responding to the user's inquiry, grounded in the provided legal provisions if available, and supplementing with general Indian legal standards where needed.

Structure your response strictly as a structured JSON object with the following schema:
- summary: A one-sentence, punchy Executive Summary of the legal standing.
- memo: A detailed, professional Legal Memorandum in clean Markdown format with sections:
  1. STATEMENT OF INQUIRY
  2. EXECUTIVE SUMMARY & ANALYSIS (with clear headers)
  3. APPLICABLE PROVISIONS & DOCTRINES (explaining relevant sections)
  4. PROCEDURAL WORKFLOW (step-by-step guidance on how to act, e.g., how to file FIR, invoke damages, or appeal)
  5. RISKS & COUNSEL GUIDANCE
- citedSectionIds: An array of section ID strings (matching the IDs of the sections provided in the context) that are directly relevant to your analysis.

Make your tone scholarly, objective, and authoritative. Do not refer to yourself as an AI.`;

    // Construct context description
    const contextText = curatedActsContext && Array.isArray(curatedActsContext)
      ? curatedActsContext.map((act: any) => {
          return `ACT: ${act.title} (${act.year}) [ID: ${act.id}]\n` +
            act.chapters.map((ch: any) => {
              return `  CHAPTER: ${ch.number} - ${ch.title}\n` +
                ch.sections.map((sec: any) => {
                  return `    SECTION: ${sec.number} - ${sec.title} [ID: ${sec.id}]\n` +
                    `    TEXT: ${sec.text}\n` +
                    (sec.oldSectionMapping ? `    OLD MAPPING: ${sec.oldSectionMapping}\n` : '') +
                    `    KEYWORDS: ${sec.keywords.join(', ')}\n`;
                }).join('\n');
            }).join('\n');
        }).join('\n\n')
      : "No curated local acts provided in context.";

    const prompt = `USER INQUIRY: ${query}
${activeCategory ? `FILTERING CATEGORY: ${activeCategory}` : ''}

CURATED LOCAL INDIA CODE SECTIONS PROVIDED FOR REFERENCE:
---
${contextText}
---

Please analyze the inquiry. Identify which of the provided curated sections apply, synthesize them, and write the Legal Memorandum. Use the specified JSON output format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A single concise sentence summarizing the main legal conclusion."
            },
            memo: {
              type: Type.STRING,
              description: "The complete legal memorandum written in professional Markdown."
            },
            citedSectionIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The IDs of curated sections that directly apply to this research."
            }
          },
          required: ["summary", "memo", "citedSectionIds"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }

    const data = JSON.parse(resultText.trim());
    res.json(data);

  } catch (error: any) {
    console.error("AI Search Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during AI analysis." });
  }
});

// 2. Section Explanation & Contextual Analysis
app.post('/api/legal/explain', async (req, res) => {
  try {
    const { sectionId, sectionNumber, actTitle, sectionText, oldSectionMapping, mode } = req.body;
    if (!sectionId || !sectionNumber || !actTitle || !sectionText) {
      return res.status(400).json({ error: "Missing required section details" });
    }

    const ai = getGeminiClient();

    let systemInstruction = "";
    let prompt = "";

    if (mode === 'plain') {
      systemInstruction = "You are a legal educator who makes Indian laws simple, clear, and highly accessible to the general public. Explain the section in simple layman's language using structured bullet points, bolding, and no complex legal jargon. Explain the objective of the section and what it means for an ordinary citizen.";
      prompt = `Act: ${actTitle}
Section: ${sectionNumber} - ${req.body.title || ''}
${oldSectionMapping ? `Old Law Equivalent: ${oldSectionMapping}` : ''}
Text of the law:
"${sectionText}"

Please explain this section in plain language.`;
    } else if (mode === 'case-law') {
      systemInstruction = "You are an expert litigator and legal scholar in India. Analyze this section and provide practical application contexts, hypothetical scenarios illustrating its use, and outline the general benchmarks, judicial tests, or historic case law categories associated with this provision (or its IPC/CrPC equivalents). Format in clean Markdown.";
      prompt = `Act: ${actTitle}
Section: ${sectionNumber} - ${req.body.title || ''}
${oldSectionMapping ? `Old Law Equivalent: ${oldSectionMapping}` : ''}
Text of the law:
"${sectionText}"

Please provide a detailed practical application and litigation analysis of this section.`;
    } else {
      // mode === 'comparison'
      systemInstruction = "You are a legal historian and procedural expert specializing in the 2023 Indian Legal reforms (BNS, BNSS, BSA). Analyze this section and explain the key changes, transitions, vocabulary shifts, or procedural updates from the old law (IPC, CrPC, or Evidence Act) to the new 2023 Act. Highlight what legal practitioners and police officers need to know about this transition. Format in clean Markdown.";
      prompt = `Act: ${actTitle}
Section: ${sectionNumber} - ${req.body.title || ''}
Old Law Equivalent: ${oldSectionMapping || 'Not specified'}
Text of the law:
"${sectionText}"

Please write a comparative transition analysis between the old law and the new 2023 provision.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { systemInstruction }
    });

    res.json({ explanation: response.text });

  } catch (error: any) {
    console.error("AI Explain Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during AI analysis." });
  }
});

// 3. Central-State Interaction Analysis
app.post('/api/legal/cross-reference', async (req, res) => {
  try {
    const { centralSectionId, stateName, centralText, amendmentText } = req.body;
    if (!centralSectionId || !stateName || !centralText || !amendmentText) {
      return res.status(400).json({ error: "Missing required parameters for cross-reference analysis" });
    }

    const ai = getGeminiClient();

    const systemInstruction = "You are a constitutional law expert in India, specializing in the Seventh Schedule, the Concurrent List, and the doctrine of repugnancy (Article 254). Your role is to analyze how specific State amendments or State Acts interact, overlap, modify, or conflict with Central Acts. Format in clean, high-contrast professional Markdown.";
    const prompt = `CENTRAL ACT PROVISION:
"${centralText}"

STATE AMENDMENT/ACT (${stateName}):
"${amendmentText}"

Please analyze this interaction:
1. Summarize the key difference or addition introduced by the State.
2. Explain whether this amendment expands, restricts, or details the Central procedure.
3. Discuss any potential constitutional or litigation implications of this cross-referenced interaction (e.g., how the police or courts resolve this in ${stateName}).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { systemInstruction }
    });

    res.json({ analysis: response.text });

  } catch (error: any) {
    console.error("AI Cross-Reference Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during AI analysis." });
  }
});


// VITE DEVELOPMENT OR PRODUCTION SERVING SETUP
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite dev server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production static files...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`India Code Navigator Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer();
