# Project Guidelines

## 🛠️ Development Environment

- **Language**: TypeScript (`^5.9.0`)
- **Framework**: Next.js (App Router)
- **Styling**: CSS + tailwind (`^4`)
- **Component Library**: `radix-ui`
- **Testing**: vitest + React Testing Library
- **Linting**: ESLint with `@typescript-eslint`
- **Formatting**: Prettier
- **Package Manager**: `npm` (preferred)

## 📂 Recommended Project Structure

```warp-runnable-command
.
├── app/ # App Router structure
│ ├── layout.tsx
│ ├── page.tsx
│ └── api/
├── components/ # UI components (radix-ui or custom)
│ ├── footer.tsx
│ ├── theme-provider.tsx
│ └── ui/
│   └── badge.tsx
├── hooks/ # Custom React hooks
├── lib/ # Client helpers, API wrappers, etc.
├── styles/ # Tailwind customizations
├── tests/ # Unit and integration tests
├── public/ # images, fonts, etc.
├── .eslintrc.json
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── next.config.js
├── package.json
└── README.md
```

## 📦 Installation Notes

- `npm install`

## ⚙️ Dev Commands

- **Dev server**: `npm run dev`
- **Build**: `npm build`
- **Start**: `npm start`
- **Lint**: `npm lint`
- **Format**: `npm format`
- **Test**: `npm test`

## 🧪 Testing Practices

- **Testing Library**: `@testing-library/react`
- **Mocking**: `vi.mock()`
- **Test command**: `npm test`
- Organize tests in `/tests` or co-located with components

## 🧱 Component Guidelines

- Use `radix-/ui` components by default for form elements, cards, dialogs, etc.
- Style components with Tailwind utility classes
- Co-locate CSS modules or component-specific styling in the same directory
- Use environment variables for configuration
- Use server components by default
- Implement client components only when necessary

## 📝 Code Style Standards

- Prefer arrow functions
- Annotate return types
- Always destructure props
- Avoid `any` type, use `unknown` or strict generics
- Use TypeScript for type safety
- Implement proper metadata for SEO
- Utilize Next.js Image component for optimized images
- Use CSS Modules or Tailwind CSS for styling
- Implement proper error boundaries
- Follow Next.js naming conventions for special files

## 🔍 Documentation & Onboarding

- Each component and hook should include a short comment on usage
- Document top-level files (like `app/layout.tsx`) and configs
- Keep `README.md` up to date with getting started, design tokens, and component usage notes

## 🔐 Security

- Validate all server-side inputs (API routes)
- Use HTTPS-only cookies and CSRF tokens when applicable
- Protect sensitive routes with middleware or session logic
