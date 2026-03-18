# Roast Creation Feature Design

## Overview
This document describes the implementation of the roast creation feature, allowing users to submit code snippets and receive AI-generated roast analysis.

## Goals
1. Allow users to submit code snippets via the homepage
2. Generate AI-powered roast analysis using OpenAI API
3. Save submission and analysis to database
4. Redirect user to results page showing the roast
5. Respect user's roast mode preference (sarcastic vs constructive)

## Architecture

### Components
1. **Homepage Form** (`src/app/page.tsx`) - Enhanced form for code submission
2. **API Route** (`src/app/api/roast/route.ts`) - New endpoint for processing submissions
3. **AI Service** (`src/lib/ai-service.ts`) - Wrapper for OpenAI API calls
4. **Database Updates** - Utilize existing schema (submissions, roasts, scores tables)
5. **Results Page** (`src/app/results/[id]/page.tsx`) - Display roast analysis

### Data Flow
1. User submits code via homepage form
2. Form data sent to `/api/roast` API route
3. API route:
   - Saves code submission to `submissions` table
   - Calls AI service to generate roast analysis
   - Saves roast content to `roasts` table
   - Saves scoring metrics to `scores` table
   - Redirects to `/results/[id]` with submission ID
4. Results page fetches and displays the analysis

## Implementation Details

### API Route (`src/app/api/roast/route.ts`)
```typescript
export async function POST(request: Request) {
  const { code, language, roastType } = await request.json();
  
  // Save submission
  const submission = await db.insert(submissions).values({
    code,
    language
  }).returning();
  
  // Generate AI roast
  const aiResponse = await aiService.generateRoast(code, language, roastType);
  
  // Save roast and scores
  await db.insert(roasts).values({
    submissionId: submission[0].id,
    content: aiResponse.roast,
    roastType
  });
  
  await db.insert(scores).values({
    submissionId: submission[0].id,
    totalScore: aiResponse.score,
    codeQuality: aiResponse.codeQuality,
    readability: aiResponse.readability,
    bestPractices: aiResponse.bestPractices
  });
  
  // Redirect to results
  return Response.redirect(`/results/${submission[0].id}`, 302);
}
```

### AI Service (`src/lib/ai-service.ts`)
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
  async generateRoast(code: string, language: string, roastType: 'sarcastic' | 'constructive' | 'brutal') {
    const prompt = this.buildPrompt(code, language, roastType);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    
    return this.parseResponse(completion.choices[0].message.content);
  }
  
  // Helper methods for prompt building and response parsing...
};
```

### Homepage Updates (`src/app/page.tsx`)
- Import and use the roast mode toggle state
- Update form submission handler to call `/api/roast` endpoint
- Handle loading states and errors appropriately

### Environment Variables
- Requires `OPENAI_API_KEY` in `.env` file

## Error Handling
- Validation errors (empty code, invalid language) return 400
- AI service errors return 500 with fallback messages
- Database errors return 500
- Client-side handles network errors gracefully

## Success Criteria
1. User can submit code from homepage
2. Submission is saved to database
3. AI generates appropriate roast based on roast mode
4. Results are saved and accessible via `/results/[id]`
5. User is redirected to results page after submission
6. Feature works with both sarcastic and constructive roast modes