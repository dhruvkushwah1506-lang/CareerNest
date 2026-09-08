import { generateText } from '../utils/gemini.js';

// Recruiter: turn a few rough inputs into a polished job description + requirements.
export const generateJobDescription = async (req, res) => {
    try {
        const { title, jobType, experienceYear, location, notes } = req.body;

        if (!title) {
            return res.status(400).json({ msg: 'Job title is required to generate a description', success: false });
        }

        const systemPrompt = `You are an expert technical recruiter and copywriter. You write concise, compelling, and specific job descriptions for a job board. Always respond ONLY with valid JSON in this exact shape, no markdown fences, no extra commentary:
{"description": "string, 3-5 sentences", "requirements": "comma-separated list of 5-8 skills/requirements"}`;

        const userPrompt = `Write a job description for this role:
Title: ${title}
Job Type: ${jobType || 'Not specified'}
Experience Required: ${experienceYear ? experienceYear + ' years' : 'Not specified'}
Location: ${location || 'Not specified'}
Extra notes from recruiter: ${notes || 'None'}`;

        const raw = await generateText(systemPrompt, userPrompt, { maxTokens: 500, temperature: 0.7 });

        let parsed;
        try {
            const cleaned = raw.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
            parsed = JSON.parse(cleaned);
        } catch (parseErr) {
            // Fall back to sending the raw text as description if the model didn't return valid JSON
            parsed = { description: raw, requirements: '' };
        }

        return res.status(200).json({
            success: true,
            description: parsed.description || '',
            requirements: parsed.requirements || ''
        });

    } catch (err) {
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ msg: err.message, success: false });
    }
};

// Student: turn skills + a short blurb into a polished professional bio.
export const generateBio = async (req, res) => {
    try {
        const { skills, currentBio, fullname } = req.body;

        if (!skills && !currentBio) {
            return res.status(400).json({ msg: 'Add a few skills or notes first so the AI has something to work with', success: false });
        }

        const systemPrompt = `You are a professional resume writer. You write short, confident, first-person professional bios (2-3 sentences, under 45 words) for a job-seeker's public profile. Respond with plain text only, no quotes, no markdown.`;

        const userPrompt = `Write a short professional bio for ${fullname || 'a candidate'}.
Skills: ${skills || 'Not specified'}
Existing notes/bio to build on: ${currentBio || 'None'}`;

        const bio = await generateText(systemPrompt, userPrompt, { maxTokens: 150, temperature: 0.7 });

        return res.status(200).json({ success: true, bio: bio.replace(/^["']|["']$/g, '') });

    } catch (err) {
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ msg: err.message, success: false });
    }
};
