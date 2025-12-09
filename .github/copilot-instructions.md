# Copilot Instructions for vite-tennis

## Project Overview
A tennis club booking and ladder system built with React 19, TypeScript, and Firebase. The project is in early development - currently only boilerplate exists with no implemented features yet.

**Language**: This webapp is in Swedish. All user-facing text, labels, messages, and content must be in Swedish.

**Critical**: Always check `feature-backlog.md` for the 30+ planned features and their exact specifications before implementing anything. Update the backlog as features are completed. Ask questions if any feature details are unclear.

## Tech Stack
- **Framework**: React 19 with TypeScript (strict mode enabled)
- **Build Tool**: Rolldown-Vite 7.2.5 (Vite alternative using npm override in package.json)
- **Backend**: Firebase (Auth, Firestore, Storage) - configured via `.vscode/mcp.json`
- **Styling**: Tailwind CSS v4 with CSS Variables (uses oklch color space)
- **UI Components**: shadcn/ui (New York style) with class-variance-authority
- **Icons**: Lucide React
- **Dev Server**: Runs on `0.0.0.0:4490` (see vite.config.ts)
- **MCP Servers**: shadcn, firebase, and github available (see `.vscode/mcp.json`)
- **GitHub CLI**: Installed and available for repository management

## Architecture & File Organization

### Current State
- **No features implemented yet** - only React boilerplate in `src/App.tsx`
- `src/components/` directory doesn't exist yet - create when adding first shadcn component
- `src/features/` doesn't exist - will hold feature modules as they're built
- Only existing custom code: `src/lib/utils.ts` with `cn()` helper for class merging

### Planned Structure (create as features are implemented)
```
src/
├── components/ui/          # shadcn components (Button, Card, Drawer, etc.)
├── features/
│   ├── auth/
│   │   ├── components/     # LoginDrawer, SignUpForm (reusable presentational)
│   │   ├── services/       # authService.ts (Firebase Auth calls)
│   │   └── hooks/          # useAuth.ts (business logic)
│   ├── booking/
│   │   ├── components/     # BookingForm, BookingCard (reusable)
│   │   ├── containers/     # BookingWidget, BookingDrawer (smart components)
│   │   ├── services/       # bookingService.ts (Firestore operations)
│   │   └── hooks/          # useBooking.ts
│   └── ladder/             # Tennis ladder feature
├── services/               # Shared Firebase config and utilities
├── hooks/                  # Global hooks (useFirestore, useAuth, etc.)
└── lib/                    # utils.ts and other helpers
```

### Component Design Philosophy
- **Separation**: Business logic (hooks) → data ops (services) → presentation (components)
- **Reusability**: Build components that work in multiple contexts (page, modal, drawer)
- **Example**: `BookingForm` component should work in both homepage widget and edit drawer
- **Container/Presenter**: Containers handle data/state, presenters only render props

### TypeScript
- Use TypeScript for all new files
- Prefer type inference where possible
- Use interfaces for object shapes
- Use types for unions and intersections
- Enable strict mode (already configured)

### React
- Use functional components with hooks
- Prefer named exports for components
- Use proper TypeScript types for props (avoid `any`)
- Follow React 19 best practices
- Keep components small and focused

### File Structure
- Components go in `src/components/` for shared/common components
- Feature-specific code goes in `src/features/<feature-name>/`
- Use PascalCase for component files (e.g., `Button.tsx`)
- Group related components in subdirectories
- Keep utilities in `src/lib/`
- Services (Firebase, API calls) in `src/services/` or `src/features/<feature-name>/services/`
- Custom hooks in `src/hooks/` or `src/features/<feature-name>/hooks/`

### Styling
- **Mobile-first approach**: Always design for mobile screens first, then enhance for tablet and desktop
- **Colors**: Use shadcn/ui color system via CSS variables (e.g., `bg-primary`, `text-foreground`, `border-muted`) - avoid Tailwind's default color palette
- **Layout & Spacing**: Use Tailwind CSS utility classes for layout, spacing, sizing, and responsive design (`flex`, `grid`, `p-4`, `gap-2`, `sm:`, `md:`, `lg:`, `xl:`)
- Leverage the `cn()` utility from `src/lib/utils.ts` for conditional classes
- Use shadcn/ui components when possible (MCP server available for adding components)
- Use CSS variables for theming (defined in `src/index.css`)
- Test on mobile viewport before expanding to larger screens

### shadcn/ui Guidelines
- **Adding components**: Use the MCP server to search and add shadcn components (e.g., `@shadcn/button`, `@shadcn/card`)
- **Component customization**: Modify shadcn components directly in `src/components/ui/` - they're yours to customize
- **Variants**: Use `class-variance-authority` (cva) for creating component variants instead of prop drilling
- **Composition**: Leverage shadcn's compound component patterns (e.g., `Card`, `CardHeader`, `CardContent`)
- **Forms**: Use shadcn's form components with React Hook Form for type-safe form handling
- **Theming**: Modify CSS variables in `src/index.css` to customize the entire design system
- **Accessibility**: shadcn components include ARIA attributes by default - maintain them when customizing
- **Icons**: Use Lucide React icons (already included with shadcn) for consistency
- **Don't reinvent**: Check if shadcn has a component before building custom UI elements

### Component Architecture & Modularity
- **Build reusable, context-agnostic components**: Design components to work in multiple contexts (e.g., homepage, modals, drawers)
- **Separate business logic from presentation**: Extract business logic into custom hooks or services
- **Use composition over configuration**: Break features into small, composable units
- **Container/Presenter pattern**: 
  - Create "smart" containers that handle data fetching and state management
  - Create "dumb" presentational components that only receive props and render UI
- **Example structure for a booking feature**:
  ```
  src/features/booking/
    ├── hooks/
    │   └── useBooking.ts          # Business logic
    ├── services/
    │   └── bookingService.ts      # Firebase operations
    ├── components/
    │   ├── BookingForm.tsx        # Reusable form component
    │   ├── BookingCard.tsx        # Reusable display component
    │   └── BookingList.tsx        # Reusable list component
    └── containers/
        ├── BookingWidget.tsx      # For homepage
        └── BookingDrawer.tsx      # For editing in drawer
  ```
- **Key principles**:
  - Components should accept all necessary data via props
  - Avoid hardcoding layout constraints in feature components
  - Use render props or children props for flexible composition
  - Extract shared state management to context or custom hooks

### Component Patterns
- **shadcn components**: Place in `src/components/ui/` and customize as needed
- **Custom components**: Build on top of shadcn primitives when possible
- **Prop interfaces**: Extend shadcn component props when creating wrappers
- **Variants**: Use `cva` from `class-variance-authority` for multiple component states
- **Example variant pattern**:
  ```tsx
  import { cva, type VariantProps } from "class-variance-authority"
  
  const buttonVariants = cva("base-classes", {
    variants: {
      variant: { default: "...", destructive: "..." },
      size: { default: "...", sm: "...", lg: "..." }
    },
    defaultVariants: { variant: "default", size: "default" }
  })
  ```
- **Export pattern**: Export both component and type for props
  ```tsx
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
  export { Button, buttonVariants }
  ```

### Import Order
1. React imports
2. Third-party libraries
3. Local components
4. Utils and helpers
5. Types
6. Styles

### Best Practices
- Write descriptive component and function names
- Add JSDoc comments for complex logic
- Handle loading and error states
- Implement proper accessibility (ARIA labels, semantic HTML)
- Optimize for performance (memoization where needed)
- Use proper form validation
- Follow ESLint rules

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Notes
- This project uses Rolldown (Vite alternative) for faster builds
- Tailwind CSS v4 uses CSS variables instead of JIT
- React 19 features are available (use actions, optimistic updates, etc.)
