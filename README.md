# PDFTalk

AI-powered PDF document analysis. Upload contracts, quotes, and business documents to get instant summaries, risk analysis, questions to ask, and simplified versions.

## Features

- **Executive Summaries**: Get 5-10 key bullet points covering the most important information
- **Risk Analysis**: Identify potential risks, unusual clauses, and points requiring attention
- **Questions to Ask**: Suggested questions to clarify with the other party
- **Easy Reading Mode**: Complex legal language transformed into plain English
- **Document History**: Track all your uploaded documents
- **Usage Tracking**: Monitor your monthly page quota

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: OpenAI GPT-4 Turbo
- **Payments**: Stripe
- **File Storage**: Supabase Storage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account

### 1. Clone and Install

```bash
cd PDFTalk
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Go to Settings > API to get your keys

### 3. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create three products with monthly prices:
   - Basic: €3.99/month
   - Growth: €12.99/month
   - Pro: €20.99/month
3. Get your API keys and price IDs

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_BASIC_PRICE_ID=price_xxx
STRIPE_GROWTH_PRICE_ID=price_xxx
STRIPE_PRO_PRICE_ID=price_xxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Set Up Stripe Webhook (for production)

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # App-specific components
├── lib/                   # Utility functions
│   ├── openai.ts         # OpenAI integration
│   ├── stripe.ts         # Stripe configuration
│   ├── pdf.ts            # PDF extraction
│   └── supabase/         # Supabase clients
└── types/                 # TypeScript types
```

## Pricing Plans

| Feature | Basic (€3.99) | Growth (€12.99) | Pro (€20.99) |
|---------|---------------|-----------------|--------------|
| Pages/month | 150 | 600 | 1,500 |
| Max pages/doc | 20 | 60 | 100 |
| Document history | 30 | 200 | Unlimited |
| Document comparison | - | 2 PDFs | 3 PDFs |
| Team seats | - | - | 5 |
| API access | - | - | Yes |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Push to GitHub
2. Import to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add environment variables
6. Deploy

## License

MIT
