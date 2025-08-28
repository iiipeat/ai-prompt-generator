import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userInput, promptType, targetPlatform } = req.body;

        if (!userInput) {
            return res.status(400).json({ error: 'User input is required' });
        }

        if (!process.env.CLAUDE_API_KEY) {
            return res.status(500).json({ error: 'Claude API key not configured' });
        }

        const systemPrompt = getSystemPrompt(promptType, targetPlatform);
        const userPrompt = `${userInput}

Please create an optimized, professional prompt based on this request. Make it clear, specific, and effective for getting the best results.`;

        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [{
                role: 'user',
                content: userPrompt
            }]
        });

        const generatedPrompt = message.content[0].text;

        res.status(200).json({
            generatedPrompt,
            metadata: {
                promptType,
                targetPlatform,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        
        if (error.status === 401) {
            res.status(401).json({ error: 'Invalid API key' });
        } else if (error.status === 429) {
            res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
        } else if (error.status >= 400 && error.status < 500) {
            res.status(error.status).json({ error: error.message || 'Client error' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

function getSystemPrompt(promptType, targetPlatform) {
    const basePrompt = "You are an expert prompt engineer. Your task is to take user requests and transform them into highly effective, optimized prompts.";
    
    const platformSpecific = {
        chatgpt: "Create prompts optimized for ChatGPT. Focus on clear instructions, context setting, and specific output formats. Use techniques like role-playing, step-by-step instructions, and examples when appropriate.",
        
        midjourney: "Create prompts optimized for Midjourney image generation. Include specific artistic styles, lighting, composition details, camera angles, and technical parameters. Use descriptive language for visual elements, colors, and moods.",
        
        claude: "Create prompts optimized for Claude. Emphasize analytical thinking, step-by-step reasoning, and comprehensive analysis. Structure requests clearly with context, constraints, and desired output format.",
        
        optimizer: "You are optimizing an existing prompt. Focus on making it more specific, adding relevant constraints, improving clarity, and enhancing the likelihood of getting desired results. Identify weaknesses in the original prompt and address them."
    };

    const typeSpecific = {
        standard: "Create a well-structured, general-purpose prompt that is clear and direct.",
        creative: "Emphasize creativity, imagination, and innovative thinking. Encourage unique perspectives and original ideas.",
        technical: "Focus on precision, accuracy, and technical details. Include relevant specifications and requirements.",
        business: "Emphasize professional communication, strategic thinking, and business outcomes. Include relevant context about goals and constraints.",
        educational: "Focus on clear explanation, learning objectives, and pedagogical effectiveness. Structure content for optimal understanding."
    };

    return `${basePrompt}

${platformSpecific[targetPlatform] || platformSpecific.chatgpt}

${typeSpecific[promptType] || typeSpecific.standard}

Guidelines:
1. Make prompts specific and actionable
2. Include relevant context and constraints
3. Specify desired output format when helpful
4. Use clear, professional language
5. Ensure the prompt is complete and self-contained
6. Consider edge cases and potential ambiguities

Respond only with the optimized prompt, without additional commentary or explanation.`;
}