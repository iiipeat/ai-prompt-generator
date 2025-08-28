# AI Prompt Generator

A professional AI prompt generator website that creates optimized prompts for various AI platforms using the Claude API. Built for deployment on Vercel.

## Features

- **Multi-Platform Support**: Generate prompts for ChatGPT, Midjourney, Claude, and prompt optimization
- **Professional Interface**: Clean, modern UI inspired by popular prompt generator sites
- **Secure API Integration**: Server-side Claude API integration with environment variable security
- **Real-time Generation**: Fast prompt generation with loading states and error handling
- **Quick Suggestions**: Pre-built prompt templates for common use cases
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Live Demo

🌐 **[View Live Site](your-vercel-url-here.vercel.app)**

## Local Development

### Prerequisites
- Node.js 18+ 
- A Claude API key from [Anthropic Console](https://console.anthropic.com/)

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Claude API key:
   ```
   CLAUDE_API_KEY=your_actual_api_key_here
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Vercel Deployment

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fai-prompt-generator&env=CLAUDE_API_KEY&envDescription=Claude%20API%20key%20from%20Anthropic%20Console)

### Manual Deployment

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Add environment variables in Vercel dashboard:**
   - Go to your project settings in Vercel
   - Add `CLAUDE_API_KEY` with your actual API key
   - Redeploy if necessary

## Project Structure

```
/
├── index.html          # Main page structure
├── styles.css          # Styling and responsive design  
├── script.js           # Frontend logic and API calls
├── api/
│   └── generate.js     # Vercel serverless function
├── package.json        # Dependencies and scripts
├── vercel.json         # Vercel configuration
├── .env.example        # Environment variables template
└── README.md           # This file
```

## API Usage

The `/api/generate` endpoint accepts POST requests with:

```javascript
{
  "userInput": "Description of desired prompt",
  "promptType": "standard|creative|technical|business|educational", 
  "targetPlatform": "chatgpt|midjourney|claude|optimizer"
}
```

Returns:
```javascript
{
  "generatedPrompt": "The optimized prompt text",
  "metadata": {
    "promptType": "standard",
    "targetPlatform": "chatgpt", 
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Customization

### Adding New Prompt Types
Edit the `getSystemPrompt()` function in `api/generate.js` to add new prompt types or modify existing ones.

### Styling Changes
Modify `styles.css` to customize the appearance. The design uses CSS Grid and Flexbox for responsive layouts.

### Adding New Platforms
1. Add new tab in `index.html`
2. Update `updateSuggestions()` in `script.js`  
3. Add platform-specific prompting in `api/generate.js`

## Security

- API keys are stored securely in environment variables
- No sensitive data exposed to client-side code
- CORS headers configured for security
- Rate limiting can be added if needed

## Technologies Used

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Node.js serverless functions
- **API**: Anthropic Claude API
- **Deployment**: Vercel
- **Security**: Environment variables, server-side API calls

## License

MIT License - feel free to use this project for your own purposes.

## Support

If you encounter any issues:
1. Check that your Claude API key is valid and has sufficient credits
2. Ensure environment variables are properly set in Vercel
3. Check the browser console for any JavaScript errors
4. Verify the API endpoint is working: `https://your-site.vercel.app/api/generate`

---

Built with ❤️ for the AI community