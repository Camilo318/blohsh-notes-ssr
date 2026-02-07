import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config = {
  darkMode: ["selector"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        blohsh: {
          DEFAULT: "hsl(var(--blohsh))",
          secondary: "hsl(var(--blohsh-secondary))",
          foreground: "hsl(var(--blohsh-foreground))",
          border: "hsl(var(--blohsh-border))",
          hover: "hsl(var(--blohsh-hover))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        note: {
          rose: "hsl(var(--note-rose))",
          "rose-text": "hsl(var(--note-rose-text))",
          mint: "hsl(var(--note-mint))",
          "mint-text": "hsl(var(--note-mint-text))",
          cream: "hsl(var(--note-cream))",
          "cream-text": "hsl(var(--note-cream-text))",
          sky: "hsl(var(--note-sky))",
          "sky-text": "hsl(var(--note-sky-text))",
          lavender: "hsl(var(--note-lavender))",
          "lavender-text": "hsl(var(--note-lavender-text))",
          "content-bg": "hsl(var(--note-content-bg))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        "3xl":
          "0 1px 2px 0 rgba(60, 64, 67, 0.302), 0 2px 6px 2px rgba(60, 64, 67, 0.149)",
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            // Map Tailwind Typography variables to shadcn/ui theme tokens (CSS variables)
            "--tw-prose-body": "hsl(var(--foreground))",
            "--tw-prose-headings": "hsl(var(--foreground))",
            "--tw-prose-lead": "hsl(var(--muted-foreground))",
            "--tw-prose-links": "hsl(var(--primary))",
            "--tw-prose-bold": "hsl(var(--foreground))",
            "--tw-prose-counters": "hsl(var(--muted-foreground))",
            "--tw-prose-bullets": "hsl(var(--muted-foreground))",
            "--tw-prose-hr": "hsl(var(--border))",
            "--tw-prose-quotes": "hsl(var(--foreground))",
            // Slightly stronger quote borders for dark mode readability
            "--tw-prose-quote-borders": "hsl(var(--foreground) / 0.15)",
            "--tw-prose-captions": "hsl(var(--muted-foreground))",
            "--tw-prose-code": "hsl(var(--foreground))",
            "--tw-prose-pre-code": "hsl(var(--foreground))",
            // Use a subtle "lift" background that works in both themes
            "--tw-prose-pre-bg": "hsl(var(--foreground) / 0.06)",
            "--tw-prose-th-borders": "hsl(var(--foreground) / 0.12)",
            "--tw-prose-td-borders": "hsl(var(--foreground) / 0.12)",

            // Optional fine-tuning for better contrast + shadcn feel
            a: {
              fontWeight: theme("fontWeight.medium"),
              textDecoration: "none",
            },
            "a:hover": {
              textDecoration: "underline",
            },
            code: {
              fontWeight: theme("fontWeight.medium"),
            },
            ":not(pre) > code": {
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--foreground) / 0.08)",
              border: "1px solid hsl(var(--foreground) / 0.12)",
              borderRadius: theme("borderRadius.md"),
              paddingLeft: theme("spacing.1"),
              paddingRight: theme("spacing.1"),
              paddingTop: theme("spacing.0.5"),
              paddingBottom: theme("spacing.0.5"),
            },
            ":not(pre) > code::before": { content: '""' },
            ":not(pre) > code::after": { content: '""' },
            pre: {
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--foreground) / 0.06)",
              border: "1px solid hsl(var(--foreground) / 0.12)",
              borderRadius: theme("borderRadius.lg"),
            },
            blockquote: {
              fontStyle: "normal",
              borderLeftColor: "hsl(var(--foreground) / 0.15)",
              color: "hsl(var(--foreground))",
            },
            "blockquote p:first-of-type::before": { content: '""' },
            "blockquote p:last-of-type::after": { content: '""' },
          },
        },
      }),
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;

export default withUt(config);
