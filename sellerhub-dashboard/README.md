# SellerHub - Amazon FBA Profit Analytics Dashboard

![SellerHub](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-3-3ecf8e?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A modern, comprehensive Amazon FBA profit analytics dashboard inspired by sellerboard. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase authentication.

![SellerHub Dashboard](https://via.placeholder.com/1200x600/1e40af/ffffff?text=SellerHub+Dashboard)

## Features

### 🔐 **Authentication**
- Secure user authentication with Supabase
- Email/password sign up and sign in
- Protected dashboard routes
- User session management
- Email confirmation flow

### 📊 **Five Dashboard Views**

#### 1. **Tiles View**
- Side-by-side KPI comparison across multiple time periods
- Quick snapshot of Sales, Orders, Units Sold, Refunds, Ad Cost, and Net Profit
- Expandable tiles for detailed metrics breakdown
- Color-coded margins and profit indicators

#### 2. **Chart View**
- Interactive line, bar, and area charts using Recharts
- Visualize trends over time (daily, weekly, monthly)
- Toggle multiple metrics on/off
- Identify correlations between metrics

#### 3. **P&L View**
- Detailed Profit & Loss table with expandable categories
- Drill-down into Amazon Fees breakdown
- Margin and ROI calculations

#### 4. **Map View**
- Geographic sales and stock distribution visualization
- Interactive regional map
- Country-by-country metrics table

#### 5. **Trends View**
- Product-by-product performance tracking
- Sparkline mini-charts for trend visualization
- Top performers vs. declining products

### 🎨 **Modern UI/UX**
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Intuitive sidebar navigation
- User profile menu with sign out

### 📈 **Key Metrics Tracked**
- Revenue, Orders, Units Sold, Refunds
- Advertising Cost, Amazon Fees, COGS
- Gross Profit, Net Profit, Margin, ROI

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Project Settings** > **API**
4. Copy your project URL and anon key

### 2. Clone and Install

```bash
git clone https://github.com/azimmomin123/SellerHub.git
cd SellerHub/sellerhub-dashboard
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Configure Supabase Email Templates (Optional)

In Supabase Dashboard:
1. Go to **Authentication** > **Email Templates**
2. Customize the confirmation email template if desired
3. Ensure "Enable email confirmations" is on

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
sellerhub-dashboard/
├── app/
│   ├── auth/
│   │   └── callback/      # Auth callback route
│   ├── dashboard/
│   │   ├── tiles/         # Tiles View page
│   │   ├── charts/        # Chart View page
│   │   ├── pl/            # P&L View page
│   │   ├── map/           # Map View page
│   │   └── trends/        # Trends View page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Landing page
├── components/
│   ├── auth-provider.tsx  # Auth context provider
│   └── dashboard-layout.tsx  # Dashboard shell with sidebar
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Browser Supabase client
│   │   ├── server.ts      # Server Supabase client
│   │   └── middleware.ts  # Auth middleware utilities
│   ├── types.ts           # TypeScript type definitions
│   ├── utils.ts           # Utility functions
│   └── mock-data.ts       # Demo data
├── middleware.ts          # Next.js middleware for route protection
└── package.json
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first CSS |
| **Supabase** | Authentication & database |
| **Recharts** | Chart library |
| **Lucide React** | Icon library |

## Authentication Flow

```
┌─────────┐     ┌──────────┐     ┌─────────────┐
│ Landing │ ──> │ Signup/  │ ──> │ Email       │
│ Page    │     │ Login    │     │ Confirm     │
└─────────┘     └──────────┘     └─────────────┘
                                          │
                                          ▼
                                    ┌──────────┐
                                    │ Dashboard│
                                    │ (Protected)│
                                    └──────────┘
```

### Protected Routes

All routes under `/dashboard/*` are protected. Unauthenticated users are redirected to `/login`.

## Dashboard Views Explained

### Tiles View
Side-by-side KPI comparison across time periods (Today, Yesterday, MTD, etc.)

### Chart View
Interactive charts to visualize trends and correlations over time

### P&L View
Detailed profit & loss table with expandable expense categories

### Map View
Geographic visualization of sales and stock distribution

### Trends View
Product-by-product performance tracking with sparkline charts

## Roadmap

- [x] Supabase authentication
- [ ] Amazon SP-API integration
- [ ] Dark mode
- [ ] Multi-account support
- [ ] Email alerts
- [ ] PPC optimization suggestions
- [ ] Inventory forecasting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Inspiration

This dashboard was inspired by [sellerboard](https://sellerboard.com), an excellent profit analytics tool for Amazon FBA sellers.

## Sources

- [sellerboard Official Website](https://sellerboard.com/)
- [Mastering sellerboard's Profitability Dashboard](https://blog.sellerboard.com/2025/06/28/mastering-sellerboards-profitability-dashboard-tiles-charts-pl-map-and-trends/)

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Built with ❤️ by [Azim Momin](https://github.com/azimmomin123)

---

**Note**: This is a demonstration dashboard. The data shown is mock data for illustration purposes. To use with real Amazon data, you would need to integrate with Amazon's Selling Partner API.
