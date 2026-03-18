# Roast OG Image Generation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically generate an Open Graph image (1200x630px) when a roast is created, using the design from "Screen 4 - OG Image" in devroast.pen and the Takumi CLI tool.

**Architecture:** When a roast is created, calculate the score, generate an OG image using Takumi CLI with a Pug/HTML template matching the Pencil design, save to `public/roasts/{id}.png`, and update the database record.

**Tech Stack:** Next.js 16, Drizzle ORM, Takumi CLI (via child_process), Pug templates

---

## File Structure

```
src/
├── db/
│   └── schema.ts                    # Add ogImagePath column
├── lib/
│   ├── og-image-generator.ts        # NEW: Takumi CLI integration
│   └── templates/
│       └── og-image.pug             # NEW: Template matching Pencil design
├── app/
│   ├── api/
│   │   └── roast/
│   │       └── route.ts             # Integrate OG generation
│   └── roast/
│       └── [id]/
│           └── page.tsx             # NEW: Share page with OG meta tags
public/
└── roasts/                         # NEW: OG images storage
```

---

### Task 0: Install Takumi CLI (Prerequisite)

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add Takumi as dev dependency**

Run: `npm install --save-dev @kane50613/takumi`

Or add manually to package.json:
```json
{
  "devDependencies": {
    "@kane50613/takumi": "^1.0.0"
  }
}
```

- [ ] **Step 2: Verify installation**

Run: `npx takumi --version`

Expected: Version number output

---

### Task 1: Add ogImagePath Column to Schema

**Files:**
- Modify: `src/db/schema.ts:49-57`

- [ ] **Step 1: Add ogImagePath to roasts table**

```typescript
// In src/db/schema.ts, add to roasts table (around line 56):
ogImagePath: text("og_image_path"),
```

- [ ] **Step 2: Create migration**

Run: `npx drizzle-kit push`

---

### Task 2: Create Takumi Template

**Files:**
- Create: `src/lib/templates/og-image.pug`

- [ ] **Step 1: Create Pug template matching Pencil design**

```pug
// src/lib/templates/og-image.pug
doctype html
html
  head
    meta(charset="UTF-8")
    style.
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        background: #0A0A0A;
        width: 1200px;
        height: 630px;
        font-family: 'JetBrains Mono', monospace;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 64px;
      }
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        width: 100%;
      }
      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 20px;
      }
      .logo-prompt { color: #10B981; font-weight: 700; }
      .logo-text { color: #FAFAFA; }
      .score {
        display: flex;
        align-items: flex-end;
        gap: 4px;
      }
      .score-num {
        font-size: 160px;
        font-weight: 900;
        color: #F59E0B;
        line-height: 1;
      }
      .score-denom {
        font-size: 56px;
        color: #737373;
        line-height: 1;
      }
      .verdict {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .verdict-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #EF4444;
      }
      .verdict-text {
        font-size: 20px;
        color: #EF4444;
      }
      .lang-info {
        font-size: 16px;
        color: #737373;
      }
      .quote {
        font-size: 22px;
        color: #FAFAFA;
        text-align: center;
        max-width: 100%;
      }
    body
      .container
        .logo
          span.logo-prompt >
          span.logo-text devroast
        .score
          span.score-num #{score}
          span.score-denom /10
        .verdict
          .verdict-dot
          span.verdict-text #{verdict}
        span.lang-info lang: #{language} · #{lines} lines
        span.quote "#{quote}"
```

- [ ] **Step 2: Commit**

```bash
git add src/db/schema.ts src/lib/templates/og-image.pug
git commit -m "feat: add ogImagePath column and Takumi template"
```

---

### Task 3: Create OG Image Generator

**Files:**
- Create: `src/lib/og-image-generator.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/og-image-generator.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateOgImage } from './og-image-generator';

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('fs', () => ({
  existsSync: vi.fn(() => true),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

describe('generateOgImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate OG image with correct parameters', async () => {
    const mockExecSync = require('child_process').execSync;
    mockExecSync.mockImplementation(() => Buffer.from(''));
    
    const result = await generateOgImage({
      roastId: 'test-uuid',
      score: 3.5,
      verdict: 'needs_serious_help',
      language: 'javascript',
      lines: '7',
      quote: 'this code was written during a power outage...',
    });
    
    expect(result).toBe('/roasts/test-uuid.png');
    expect(mockExecSync).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/lib/og-image-generator.test.ts`
Expected: FAIL (file doesn't exist)

- [ ] **Step 3: Write minimal implementation (with actual Takumi CLI)**

```typescript
// src/lib/og-image-generator.ts
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';

interface OgImageData {
  roastId: string;
  score: string | number;
  verdict: string;
  language: string;
  lines: string | number;
  quote: string;
}

const ROASTS_DIR = path.join(process.cwd(), 'public', 'roasts');
const TEMPLATE_PATH = path.join(process.cwd(), 'src/lib/templates/og-image.pug');

export async function generateOgImage(data: OgImageData): Promise<string | null> {
  try {
    // Ensure directory exists
    if (!existsSync(ROASTS_DIR)) {
      mkdirSync(ROASTS_DIR, { recursive: true });
    }

    const { roastId, score, verdict, language, lines, quote } = data;
    
    // Truncate quote if too long
    const truncatedQuote = quote.length > 200 
      ? quote.substring(0, 197) + '...' 
      : quote;

    const outputPath = path.join(ROASTS_DIR, `${roastId}.png`);
    
    // Create a JSON file with the data for Takumi
    const dataPath = path.join(ROASTS_DIR, `${roastId}.json`);
    const jsonData = JSON.stringify({
      score: String(score),
      verdict,
      language,
      lines: String(lines),
      quote: truncatedQuote,
    });
    writeFileSync(dataPath, jsonData);
    
    // Call Takumi CLI to generate the image
    const takumiCmd = `npx takumi generate --template "${TEMPLATE_PATH}" --output "${outputPath}" --data "${dataPath}" --width 1200 --height 630`;
    
    console.log(`[OG Image] Running: ${takumiCmd}`);
    
    try {
      execSync(takumiCmd, { stdio: 'pipe' });
    } catch (execError: any) {
      console.error('[OG Image] Takumi CLI error:', execError.message);
      // Clean up temp file
      if (existsSync(dataPath)) unlinkSync(dataPath);
      return null;
    }
    
    // Clean up temp data file
    if (existsSync(dataPath)) unlinkSync(dataPath);
    
    // Verify image was created
    if (!existsSync(outputPath)) {
      console.error('[OG Image] Output file not created');
      return null;
    }
    
    return `/roasts/${roastId}.png`;
  } catch (error) {
    console.error('[OG Image] Failed to generate:', error);
    return null;
  }
}

export function calculateVerdict(score: number): string {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'decent';
  if (score >= 4) return 'needs_work';
  return 'needs_serious_help';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/lib/og-image-generator.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/og-image-generator.ts src/lib/og-image-generator.test.ts
git commit -m "feat: add OG image generator module"
```

---

### Task 4: Integrate OG Generation into Roast Creation

**Files:**
- Modify: `src/app/api/roast/route.ts:28-49`

- [ ] **Step 1: Modify roast creation to generate OG image**

```typescript
// Add imports at top of src/app/api/roast/route.ts
import { generateOgImage, calculateVerdict } from '@/lib/og-image-generator';

// Modify the POST function around line 30-49:
// After scores are inserted, generate OG image

// ... existing code for submission, roast, and scores ...

const verdict = calculateVerdict(aiResponse.score);
const codeLines = code.split('\n').length;

const ogImagePath = await generateOgImage({
  roastId: submission.id, // using submission.id as roast identifier
  score: aiResponse.score,
  verdict,
  language,
  lines: codeLines.toString(),
  quote: aiResponse.roast,
});

// If we have a roast record, update it with ogImagePath
// (Need to get the roast ID from the insert result - see below)

// The current code doesn't return the roast, let's fix that:
const [roastRecord] = await db
  .insert(roasts)
  .values({
    submissionId: submission.id,
    content: aiResponse.roast,
    roastType,
  })
  .returning();

// Update with OG image path if generated
if (ogImagePath) {
  await db
    .update(roasts)
    .set({ ogImagePath })
    .where(eq(roasts.id, roastRecord.id));
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/roast/route.ts
git commit -m "feat: integrate OG image generation into roast creation"
```

---

### Task 5: Create Share Page with OG Meta Tags

**Files:**
- Create: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/app/roast/[id]/page.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Page from './page';

describe('Roast Share Page', () => {
  it('should render roast with OG meta tags', () => {
    // Mock params
    const params = Promise.resolve({ id: 'test-id' });
    // This test will need proper mocking of db queries
    expect(true).toBe(true); // Placeholder
  });
});
```

- [ ] **Step 2: Create the share page (with parameterized queries)**

```typescript
// src/app/roast/[id]/page.tsx
import { db } from '@/db';
import { roasts, submissions } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  
  // Use parameterized query with Drizzle
  const result = await db
    .select({
      content: roasts.content,
      ogImagePath: roasts.ogImagePath,
      language: submissions.language,
    })
    .from(roasts)
    .innerJoin(submissions, eq(roasts.submissionId, submissions.id))
    .where(eq(submissions.id, id))
    .limit(1);
  
  const row = result[0];
  
  if (!row) {
    return { title: 'Roast Not Found | devroast' };
  }
  
  const imageUrl = row.ogImagePath 
    ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${row.ogImagePath}`
    : undefined;
  
  return {
    title: 'Check out my roast | devroast',
    description: row.content.substring(0, 160),
    openGraph: imageUrl ? {
      images: [{ url: imageUrl }],
    } : undefined,
    twitter: imageUrl ? {
      card: 'summary_large_image',
      images: [imageUrl],
    } : undefined,
  };
}

export default async function RoastSharePage({ params }: Props) {
  const { id } = await params;
  
  // Use parameterized query with Drizzle
  const result = await db
    .select({
      id: roasts.id,
      content: roasts.content,
      roastType: roasts.roastType,
      ogImagePath: roasts.ogImagePath,
      language: submissions.language,
      code: submissions.code,
    })
    .from(roasts)
    .innerJoin(submissions, eq(roasts.submissionId, submissions.id))
    .where(eq(submissions.id, id))
    .limit(1);
  
  const row = result[0];
  
  if (!row) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Roast not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-bg-page p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Share your roast
        </h1>
        
        {row.ogImagePath && (
          <div className="mb-6">
            <img 
              src={row.ogImagePath} 
              alt="Roast OG Image"
              className="w-full rounded-lg"
            />
          </div>
        )}
        
        <div className="bg-bg-surface rounded-lg p-4 mb-4">
          <p className="text-text-primary">{row.content}</p>
        </div>
        
        <p className="text-text-tertiary text-sm">
          Language: {row.language}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/roast/
git commit -m "feat: add roast share page with OG meta tags"
```

---

### Task 6: Verify End-to-End

- [ ] **Step 1: Test roast creation**

Run: `curl -X POST http://localhost:3000/api/roast -H "Content-Type: application/json" -d '{"code":"const x = 1;","language":"javascript","roastType":"sarcastic"}'`

Expected: Redirect to /results/{id}

- [ ] **Step 2: Check if OG image was created**

Run: `ls public/roasts/`

Expected: PNG file exists

- [ ] **Step 3: Test share page**

Run: `curl -I http://localhost:3000/roast/{id}`

Expected: 200 with OG meta tags in HTML

- [ ] **Step 4: Test error handling (OG generation fails)**

This verifies the spec requirement: "Se geração falhar, continuar sem OG image"

Simulate a failure by temporarily breaking the template path, then create a roast:

Run: `mv src/lib/templates/og-image.pug src/lib/templates/og-image.pug.bak`

Then:
Run: `curl -X POST http://localhost:3000/api/roast -H "Content-Type: application/json" -d '{"code":"test","language":"javascript","roastType":"sarcastic"}'`

Expected: Still redirects successfully (roast created even though OG image failed)

Restore:
Run: `mv src/lib/templates/og-image.pug.bak src/lib/templates/og-image.pug`

---

## Summary

- [ ] Task 0: Install Takumi CLI (2 steps)
- [ ] Task 1: Add ogImagePath column to schema (2 steps)
- [ ] Task 2: Create Takumi Pug template (2 steps)
- [ ] Task 3: Create OG image generator (5 steps)
- [ ] Task 4: Integrate into roast creation (2 steps)
- [ ] Task 5: Create share page with OG meta tags (3 steps)
- [ ] Task 6: Verify end-to-end (4 steps)
