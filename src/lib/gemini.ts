import { ChatMessage } from "../types";

export async function callGemini(prompt: string, sytemPrompt?: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey === "") {
    return simulateFallbackResponse(prompt, sytemPrompt);
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

  const requestPayload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40
    },
    ...(sytemPrompt ? {
      systemInstruction: {
        parts: [{ text: sytemPrompt }]
      }
    } : {})
  };

  try {
    const rawResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload)
    });

    if (!rawResponse.ok) {
      throw new Error(`Gemini HTTP Error: ${rawResponse.status}`);
    }

    const payload = await rawResponse.json();
    const textResult = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textResult) {
      return textResult;
    }
    throw new Error("No text returned in Gemini response candidates.");
  } catch (error) {
    console.error("Gemini live execution failed. Shifting to responsive simulation fallback:", error);
    return simulateFallbackResponse(prompt, sytemPrompt);
  }
}

function simulateFallbackResponse(prompt: string, systemPrompt?: string): string {
  const text = prompt.toLowerCase();

  if (systemPrompt && systemPrompt.includes("document generator")) {
    if (systemPrompt.includes("CV")) {
      return `[SIMULATED COMPREHENSIVE CV TEMPLATE]
--------------------------------------------------
PORTFOLIO SUMMARY:
A dynamic professional seeking high-impact international career mobility.

ACADEMIC WORK HISTORY & CREDENTIALS:
* Ported user profile details safely.
* Core competencies: Software solutions, collaborative research, international communications.

STRENGTHS & SKILLS:
* Swift cross-device systems syncing
* Analytical tracking with Firebase and Google Cloud Suite

RECOMMENDED NEXT ACTIONS:
* Tailor this draft text buffer in the web editor panel.
* Complete all dashboard fields to maximize credentials matching.
--------------------------------------------------`;
    }

    if (systemPrompt.includes("Cover Letter")) {
      return `Dear Global Opportunities Selection Committee,

Please accept this enthusiastic application regarding the position. 

Armed with a highly aligned background and academic competencies, I am enthusiastic to bring my multi-faceted experience and skills to your organization. Having researched your operations and target country pathways, I am confident this fellowship serves as the ultimate catalyst for my professional goals.

I look forward to contributing immediately to your global programs.

Sincerely,
[Applied Candidate via Global Opportunities Hub]`;
    }

    return `[SIMULATED SCHOLARSHIP ESSAY]
--------------------------------------------------
MOTIVATION & INTENDED IMPACTS:
As an aspiring global scholar, I am driven by a deep ambition to solve real-world challenges through continuous knowledge acquisition. The chosen international pathway represents the ideal environment to hone my qualifications.

MY PREPAREDNESS:
My academic degrees and work experience have pre-conditioned me for intense research, intercultural teamwork, and disciplined project completion.

GLOBAL OUTLOOK:
Upon completion, I intend to leverage these acquired competencies to advance digital inclusion, economic development, and international cooperation.
--------------------------------------------------`;
  }

  // General advisor responses
  if (text.includes("chancenkarte") || text.includes("opportunity card")) {
    return "Germany's Chancenkarte (Opportunity Card) was introduced in June 2024. It operates on a points system based on language skills (German or English), age, professional qualifications, work experience, and ties to Germany. You need at least 6 points to qualify, and this permits enter-to-seek employment for up to 1 year.";
  }
  if (text.includes("daad")) {
    return "The DAAD (German Academic Exchange Service) scholarships are fully funded awards. Key guidelines for cover letters involve stating clear academic goals, explaining your choice of host university, demonstrating how the program aligns with your career path, and avoiding genetic templates.";
  }
  if (text.includes("canada") || text.includes("express entry")) {
    return "Canada Express Entry is a points-based system (CRS) managed across three programs: FSWP, FSTP, and CEC. Highly-demanded fields include Software Engineering, nursing, and clean energy. A provincial nominee program (PNP) can add a massive 600 points boost to your profile!";
  }
  if (text.includes("h1b") || text.includes("sponsorship")) {
    return "United States H-1B visas are standard specialty occupation permits. They require employer sponsorship and are subject to an annual computer-run lottery (normally in March). Alternatively, non-profit institutions/universities are cap-exempt!";
  }

  return `Hello! I am Hubbie AI, your mobility advisor. I can help you understand the German Chancenkarte points system, Canada express entry paths, US H-1B, and document preparation. 

To help me tailor advice, please outline your target country or list your acadamics! Ask me anything about international mobility!`;
}
