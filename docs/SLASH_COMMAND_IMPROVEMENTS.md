# Code Quality Audit Slash Command - Improvements

## Summary

Updated `.claude/commands/code-quality-audit.md` to be tailored for this personal blog instead of the generic "Kelp" content platform template.

## Key Changes Made

### 1. **Context Section** - Updated Project Description

**Before:**
```markdown
The codebase you are about to review is **Kelp** - a content aggregation
platform for knowledge workers (similar to Feedly or Pocket with AI-powered
personalization). It aggregates news articles, blog posts, and research papers...
```

**After:**
```markdown
The codebase you are about to review is **Brennan Moore's Personal Homepage/Blog**
- a statically-generated personal website built with Next.js and Notion as a
headless CMS. The site showcases writing, photography, and professional work history.
```

**Impact:** Claude now understands it's auditing a static blog, not a multi-user platform, so it won't flag missing features like user authentication or rate limiting.

---

### 2. **Tech Stack** - Accurate Technology List

**Before:**
```markdown
- Next.js 15.5.4 with App Router + Turbopack
- PostgreSQL + Drizzle ORM
- Supabase Auth (Google OAuth)
- Vercel AI Gateway (Gemini 2.5 Flash)
- Inngest (background jobs)
- Deployed on Vercel
```

**After:**
```markdown
- Next.js 15.5.4 with App Router (Static Site Generation)
- TypeScript with strict mode
- Notion API v5.1.0 (headless CMS)
- Vitest for testing (71 tests)
- Deployed on Vercel
- Node.js 22.x
```

**Impact:** Claude knows what technologies are actually used and won't look for PostgreSQL, Supabase, or Drizzle ORM patterns.

---

### 3. **Before Starting** - Correct File Paths

**Before:**
```markdown
1. Read `memory-bank/ACTIVE_CONTEXT.md` and `memory-bank/PROGRESS.md`
2. Run `npm run test:coverage`
3. Check `next.config.ts` for security headers
4. Look for `src/lib/rate-limit.ts` for rate limiting
```

**After:**
```markdown
1. Read `CLAUDE.md` for project context and recent changes
2. Read `memory-bank/activeContext.md` and `memory-bank/progress.md`
3. Run `npm run test:coverage`
4. Check `next.config.ts` for security headers
5. Run `npm run typecheck`
6. Check `package.json` for dependency versions
7. Verify actual implementation before flagging as missing
```

**Impact:** Claude looks in the right places (correct case for memory-bank files) and runs appropriate checks.

---

### 4. **Test Coverage Criteria** - Static Blog Focus

**Before:**
```markdown
- Good patterns: jest-axe, semantic queries (getByRole), MSW v2, behavioral assertions
- Review test organization: component, API route, integration, service layer coverage
```

**After:**
```markdown
- Good patterns: Type-safe mocking with Vitest, semantic queries (getByRole),
  behavioral assertions, proper `act()` usage
- Review test organization: component, page, utility function, API route coverage
- **Static site context**: Focus on build-time functionality and component
  rendering over runtime API testing
```

**Impact:** Claude looks for Vitest patterns (not Jest) and focuses on static generation testing.

---

### 5. **Simplicity Criteria** - Appropriate Expectations

**Before:**
```markdown
- Assess separation of concerns: Database schema → Services → API routes → Components
- Context matters: Content aggregation has inherent complexity (crawling, AI, personalization)
```

**After:**
```markdown
- Assess separation of concerns: Notion API → Cache utilities → Page components → UI components
- Count total lines of code (should be relatively small for a personal blog)
- **Context matters**: Static blogs should be simple - complexity should be minimal
  and well-justified
```

**Impact:** Claude expects simplicity, not complex service architectures.

---

### 6. **Code Consistency** - Relevant Patterns

**Before:**
```markdown
- API route patterns: Check for consistent use of `requireAuth()`, `verifyOrigin()`,
  `validateRequestBody()`
- Database patterns: Drizzle schema with `pgTable`, `relations()`, `$inferSelect`
```

**After:**
```markdown
- Cache access patterns: Consistent use of file system reads for `posts-cache.json`
  and `photos-cache.json`
- Notion API patterns: Consistent property access and type checking
- Naming conventions: camelCase functions, PascalCase components, kebab-case files
```

**Impact:** Claude checks patterns actually used in this codebase.

---

### 7. **Security Best Practices** - Static Blog Security

**Before:**
```markdown
4. Security Best Practices for Content Platforms:
   - Authentication: Supabase Auth implementation, session management, OAuth flows
   - Authorization: Row Level Security (RLS) policies
   - CSRF Protection: Origin/Referer verification
   - Rate Limiting: Check limiters.auth, limiters.api, limiters.public usage
```

**After:**
```markdown
4. Security Best Practices for Static Blogs:
   - Security Headers: Verify CSP configuration, X-Frame-Options, Referrer-Policy
   - Dependency Security: Check for vulnerable dependencies with `npm audit`
   - Environment Variables: Verify Notion API token is in `.env` files
   - **Not Applicable** (static blog): User authentication, authorization, rate
     limiting, CSRF protection, database injection
```

**Impact:** Claude focuses on relevant security concerns (headers, dependencies) and doesn't flag missing auth/database security.

---

### 8. **Industry Standards** - Blog-Specific Standards

**Before:**
```markdown
- Content Platform Standards: RSS/Atom parsing, JSON Feed, OPML export
- Web Standards: Schema.org markup (SEO), OAuth 2.0, ISO 8601 dates
- API Standards: OpenAPI/Swagger (if API is public)
```

**After:**
```markdown
- Blog Standards: RSS 2.0 feed generation
- Web Standards: Schema.org JSON-LD for BlogPosting, OpenGraph metadata, Twitter Cards
- SEO Standards: Sitemap generation, canonical URLs, proper meta tags
- Accessibility: Semantic HTML, alt text on images, ARIA when needed
- **Consider Adding**: JSON Feed, OPML export
```

**Impact:** Claude looks for blog-specific standards (RSS, Schema.org, sitemap) instead of API documentation.

---

### 9. **Assessment Checklist** - Relevant Security Items

**Before:**
```markdown
- ✅/❌ Authentication & Session Management
- ✅/❌ Row Level Security (RLS) policies
- ✅/❌ CSRF Protection
- ✅/❌ Rate Limiting (check src/lib/rate-limit.ts)
```

**After:**
```markdown
- ✅/❌ Security Headers (CSP, HTTPS redirect, XSS protection in next.config.ts)
- ✅/❌ Environment Variable Security (API tokens in .env, not committed)
- ✅/❌ Dependency Vulnerabilities (npm audit results)
- ℹ️ N/A: Authentication, authorization, rate limiting, CSRF, database injection
```

**Impact:** Claude checks what actually matters for a static blog and clearly marks N/A items.

---

### 10. **Important Reminders** - Clear Context

**Added at the end:**
```markdown
- This is a STATIC BLOG with no user accounts, database, or state-changing operations
- Focus on build-time functionality, static generation, and component testing
- Don't expect/require: user auth, RLS policies, rate limiting, CSRF protection
- DO expect: Security headers, RSS feeds, Schema.org markup, type safety, test quality
```

**Impact:** Clear reminder to Claude about what type of project this is and what to focus on.

---

## Benefits

1. **More Accurate Audits** - Claude won't waste time looking for PostgreSQL schemas or Supabase auth
2. **Relevant Recommendations** - Suggestions will be appropriate for a static blog
3. **Faster Execution** - No time spent checking for files/patterns that don't exist
4. **Better Context** - Claude understands this is Brennan's personal blog, not a generic platform
5. **Correct Expectations** - Static blog security model (headers, dependencies) vs. app security (auth, RLS, rate limiting)

## Next Steps

The slash command is now ready for future audits. To run it:

```bash
/code-quality-audit
```

This will generate a report in `docs/CODE_QUALITY_AUDIT_YYYY-MM-DD.md` with appropriate context and expectations for this static blog project.
