// Thin wrapper around Google's Gemini API (generateContent).
// Uses global fetch (Node 18+, matches this project's "engines" requirement).
// Gemini has a genuinely free tier for this kind of usage - get a key at
// https://aistudio.google.com/apikey

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Calls Gemini generateContent and returns the plain text reply.
 * @param {string} systemPrompt - instructions describing the assistant's role
 * @param {string} userPrompt - the actual request content
 * @param {object} opts - { maxTokens, temperature }
 */
export const generateText = async (systemPrompt, userPrompt, opts = {}) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        const err = new Error('AI feature is not configured. Missing GEMINI_API_KEY on the server.');
        err.statusCode = 503;
        throw err;
    }

    const { maxTokens = 500, temperature = 0.7 } = opts;
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

    const response = await fetch(`${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: [
                { role: 'user', parts: [{ text: userPrompt }] }
            ],
            generationConfig: {
                temperature,
                maxOutputTokens: maxTokens
            }
        })
    });

    if (!response.ok) {
        const errBody = await response.text().catch(() => '');
        const err = new Error(`Gemini request failed (${response.status}): ${errBody}`);
        err.statusCode = 502;
        throw err;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
        const err = new Error('AI returned an empty response. Please try again.');
        err.statusCode = 502;
        throw err;
    }
    return text;
};
