import Link from "next/link";
import { BarChart3, TrendingUp, DollarSign, Target, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">SellerHub</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Accurate Profit Analytics for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {" "}Amazon Sellers
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Track your sales and profits on Amazon FBA in real-time. View sales, orders, refunds,
              advertising costs, estimated payout, and net profit at a glance.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Everything You Need to Track Your Amazon Business
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<BarChart3 className="w-8 h-8" />}
                title="Tiles View"
                description="Compare performance across multiple time periods side-by-side. See today, yesterday, MTD, and more at a glance."
              />
              <FeatureCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Chart View"
                description="Visualize trends over time. Spot seasonality, growth patterns, and correlations between metrics."
              />
              <FeatureCard
                icon={<DollarSign className="w-8 h-8" />}
                title="P&L Breakdown"
                description="Detailed profit & loss table showing every expense category. Drill down into Amazon fees, COGS, and more."
              />
              <FeatureCard
                icon={<Target className="w-8 h-8" />}
                title="Product Trends"
                description="Track individual product performance over time. Identify winners, losers, and emerging opportunities."
              />
            </div>
          </div>
        </section>

        {/* Metrics Preview */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Track Every Metric That Matters
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <MetricCard label="Sales" value="$52,380" change="+12.5%" positive />
              <MetricCard label="Orders" value="402" change="+8.2%" positive />
              <MetricCard label="Net Profit" value="$8,950" change="+15.3%" positive />
              <MetricCard label="Margin" value="17.1%" change="-2.1%" positive={false} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>
            SellerHub - A demo dashboard inspired by sellerboard. Built with Next.js and Tailwind CSS.
          </p>
          <p className="mt-2">
            <Link href="https://github.com/azimmomin123/SellerHub" className="hover:text-white">
              View Source Code
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      <p className={`text-sm mt-2 ${positive ? "text-green-600" : "text-red-600"}`}>
        {change} vs last month
      </p>
    </div>
  );
}
