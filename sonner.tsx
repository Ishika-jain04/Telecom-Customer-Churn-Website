import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { PieChart, Pie, Cell } from "recharts";
import {
  TrendingDown, Users, AlertTriangle, Shield, Zap, ChevronRight,
  ArrowUpRight, ArrowDownRight, Bell, Settings, Search, Activity,
  BarChart2, Target, Phone, Wifi, CreditCard, Star, X, ChevronLeft,
  MessageSquare, Clock, CheckCircle2, Package, Send, Filter, Sliders
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const churnTrendData = [
  { month: "Jan", churn: 4.2 }, { month: "Feb", churn: 3.9 },
  { month: "Mar", churn: 4.8 }, { month: "Apr", churn: 5.2 },
  { month: "May", churn: 4.6 }, { month: "Jun", churn: 3.7 },
  { month: "Jul", churn: 3.4 }, { month: "Aug", churn: 4.1 },
  { month: "Sep", churn: 4.9 }, { month: "Oct", churn: 5.6 },
  { month: "Nov", churn: 4.3 }, { month: "Dec", churn: 3.8 },
];

const riskSegments = [
  { name: "Critical Risk", value: 8240, color: "#EF4444", pct: 12 },
  { name: "High Risk", value: 14380, color: "#F59E0B", pct: 21 },
  { name: "Medium Risk", value: 22150, color: "#6366F1", pct: 32 },
  { name: "Low Risk", value: 23830, color: "#10B981", pct: 35 },
];

const retentionActions = [
  { action: "Loyalty Discount Offer", success: 78, customers: 3420, revenue: "$142K" },
  { action: "Plan Upgrade Incentive", success: 64, customers: 2180, revenue: "$98K" },
  { action: "Service Quality Call", success: 55, customers: 1890, revenue: "$71K" },
  { action: "Bundled Package Deal", success: 82, customers: 4100, revenue: "$187K" },
  { action: "Free Premium Month", success: 71, customers: 2760, revenue: "$124K" },
];

const churnReasons = [
  { reason: "Price too high", pct: 34 },
  { reason: "Poor network coverage", pct: 27 },
  { reason: "Better competitor offer", pct: 22 },
  { reason: "Customer service issues", pct: 11 },
  { reason: "Relocation", pct: 6 },
];

const revenueAtRisk = [
  { segment: "Mobile", at_risk: 4.2, protected: 31.8 },
  { segment: "Broadband", at_risk: 2.8, protected: 18.2 },
  { segment: "Business", at_risk: 6.1, protected: 42.9 },
  { segment: "IoT", at_risk: 0.9, protected: 7.1 },
];

type Subscriber = {
  name: string; id: string; plan: string; score: number; risk: string;
  tenure: string; mrr: string; segment: string; phone: string; email: string;
  dataUsage: string; complaints: number; lastContact: string;
  usageHistory: number[]; paymentStatus: string; contract: string;
};

const allSubscribers: Subscriber[] = [
  { name: "Marcus Chen", id: "TC-00291", plan: "Enterprise 5G", score: 94, risk: "Critical", tenure: "2y 3m", mrr: "$489", segment: "Business", phone: "+1 (415) 882-3310", email: "m.chen@acmecorp.com", dataUsage: "847 GB", complaints: 4, lastContact: "Dec 18, 2024", usageHistory: [820, 790, 830, 860, 847], paymentStatus: "Overdue 12d", contract: "Month-to-Month" },
  { name: "Aisha Okonkwo", id: "TC-04712", plan: "Premium Fiber", score: 87, risk: "Critical", tenure: "1y 1m", mrr: "$219", segment: "Broadband", phone: "+1 (312) 554-7821", email: "aisha.ok@gmail.com", dataUsage: "1.2 TB", complaints: 3, lastContact: "Dec 22, 2024", usageHistory: [950, 1100, 1050, 1200, 1180], paymentStatus: "Current", contract: "Month-to-Month" },
  { name: "Dmitri Volkov", id: "TC-01983", plan: "Business Plus", score: 81, risk: "High", tenure: "3y 8m", mrr: "$634", segment: "Business", phone: "+1 (646) 229-4401", email: "d.volkov@volkov-llc.com", dataUsage: "2.1 TB", complaints: 2, lastContact: "Dec 10, 2024", usageHistory: [2200, 2100, 2050, 2150, 2100], paymentStatus: "Current", contract: "Annual" },
  { name: "Priya Sharma", id: "TC-07654", plan: "Mobile Unlimited", score: 76, risk: "High", tenure: "8m", mrr: "$87", segment: "Mobile", phone: "+1 (408) 771-9920", email: "priya.s92@icloud.com", dataUsage: "42 GB", complaints: 2, lastContact: "Dec 19, 2024", usageHistory: [55, 48, 60, 38, 42], paymentStatus: "Current", contract: "Month-to-Month" },
  { name: "James Okafor", id: "TC-03291", plan: "Home Broadband", score: 69, risk: "High", tenure: "2y 0m", mrr: "$129", segment: "Broadband", phone: "+1 (713) 340-8812", email: "jokafor@yahoo.com", dataUsage: "680 GB", complaints: 1, lastContact: "Nov 30, 2024", usageHistory: [700, 720, 690, 660, 680], paymentStatus: "Current", contract: "Annual" },
  { name: "Lena Müller", id: "TC-08812", plan: "Family Bundle", score: 62, risk: "Medium", tenure: "4y 2m", mrr: "$312", segment: "Mobile", phone: "+1 (503) 448-2291", email: "lena.muller@web.de", dataUsage: "178 GB", complaints: 1, lastContact: "Dec 5, 2024", usageHistory: [190, 185, 170, 180, 178], paymentStatus: "Current", contract: "Annual" },
];

// Cohort data: rows = acquisition month, cols = months since acquisition
const cohortData = [
  { cohort: "Jan '24", total: 12400, rates: [100, 92, 87, 83, 79, 75, 72, 70, 68, 65, 63, 61] },
  { cohort: "Feb '24", total: 13100, rates: [100, 91, 86, 81, 78, 74, 71, 68, 66, 64, 62] },
  { cohort: "Mar '24", total: 11800, rates: [100, 90, 84, 80, 76, 72, 69, 66, 64, 62] },
  { cohort: "Apr '24", total: 10900, rates: [100, 89, 83, 78, 74, 70, 67, 64, 62] },
  { cohort: "May '24", total: 12700, rates: [100, 91, 85, 81, 77, 73, 70, 67] },
  { cohort: "Jun '24", total: 14200, rates: [100, 93, 88, 84, 80, 76, 73] },
  { cohort: "Jul '24", total: 15100, rates: [100, 94, 89, 85, 81, 78] },
  { cohort: "Aug '24", total: 13400, rates: [100, 92, 87, 83, 79] },
  { cohort: "Sep '24", total: 11600, rates: [100, 90, 84, 80] },
  { cohort: "Oct '24", total: 10200, rates: [100, 88, 82] },
  { cohort: "Nov '24", total: 12900, rates: [100, 91] },
  { cohort: "Dec '24", total: 14600, rates: [100] },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function useCounter(target: number, duration = 1800, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(parseFloat(start.toFixed(decimals)));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, decimals]);
  return value;
}

function RiskBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Critical: "bg-red-500/15 text-red-400 border-red-500/30",
    High: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Medium: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    Low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono border ${styles[level]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? "#EF4444" : score >= 70 ? "#F59E0B" : "#6366F1";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="font-mono text-xs w-6 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

function KPICard({ label, value, sub, delta, deltaUp, icon: Icon, accent }: {
  label: string; value: string; sub?: string; delta?: string; deltaUp?: boolean; icon: any; accent: string;
}) {
  return (
    <div className="relative bg-card border border-border rounded-2xl p-6 group overflow-hidden transition-all duration-300 hover:border-indigo-500/30 hover:-translate-y-0.5">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(600px circle at 50% 0%, ${accent}08 0%, transparent 70%)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}18`, color: accent }}>
          <Icon size={18} />
        </div>
        {delta && (
          <span className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full border ${deltaUp ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"}`}>
            {deltaUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{delta}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1 font-mono">{label}</p>
      {sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Customer Detail Panel ─────────────────────────────────────────────────────

function CustomerPanel({ sub, onClose }: { sub: Subscriber; onClose: () => void }) {
  const [action, setAction] = useState("");
  const maxUsage = Math.max(...sub.usageHistory);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-xl bg-card border-l border-border flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm" style={{ fontFamily: "Epilogue" }}>
              {sub.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <p className="font-bold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>{sub.name}</p>
              <p className="text-xs font-mono text-muted-foreground">{sub.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* Risk score */}
          <div className="bg-background rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted-foreground">CHURN RISK SCORE</span>
              <RiskBadge level={sub.risk} />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black" style={{ fontFamily: "Epilogue, sans-serif", color: sub.score >= 85 ? "#EF4444" : sub.score >= 70 ? "#F59E0B" : "#6366F1" }}>{sub.score}</span>
              <span className="text-muted-foreground text-sm mb-2">/100</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-3">
              <div className="h-full rounded-full" style={{ width: `${sub.score}%`, background: sub.score >= 85 ? "linear-gradient(90deg,#EF4444,#F87171)" : sub.score >= 70 ? "linear-gradient(90deg,#F59E0B,#FCD34D)" : "linear-gradient(90deg,#6366F1,#818CF8)" }} />
            </div>
          </div>

          {/* Profile grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Plan", value: sub.plan },
              { label: "Segment", value: sub.segment },
              { label: "MRR", value: sub.mrr },
              { label: "Tenure", value: sub.tenure },
              { label: "Contract", value: sub.contract },
              { label: "Payment", value: sub.paymentStatus, alert: sub.paymentStatus.includes("Overdue") },
              { label: "Data Usage", value: sub.dataUsage },
              { label: "Complaints", value: `${sub.complaints} open`, alert: sub.complaints >= 3 },
            ].map(({ label, value, alert }) => (
              <div key={label} className="bg-background rounded-lg p-3 border border-border">
                <p className="text-xs font-mono text-muted-foreground mb-1">{label}</p>
                <p className={`text-sm font-semibold ${alert ? "text-red-400" : "text-foreground"}`} style={{ fontFamily: "Figtree, sans-serif" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Usage sparkline */}
          <div className="bg-background rounded-xl p-4 border border-border">
            <p className="text-xs font-mono text-muted-foreground mb-3">DATA USAGE · LAST 5 MONTHS</p>
            <div className="flex items-end gap-2 h-16">
              {sub.usageHistory.map((v, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${(v / maxUsage) * 100}%`, background: i === sub.usageHistory.length - 1 ? "#6366F1" : "rgba(99,102,241,0.3)" }} />
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-background rounded-xl p-4 border border-border space-y-2">
            <p className="text-xs font-mono text-muted-foreground mb-3">CONTACT</p>
            <p className="text-sm text-foreground font-mono">{sub.phone}</p>
            <p className="text-sm text-foreground font-mono">{sub.email}</p>
            <p className="text-xs text-muted-foreground">Last contact: {sub.lastContact}</p>
          </div>

          {/* Retention action */}
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
            <p className="text-xs font-mono text-indigo-400 mb-3">RECOMMENDED ACTION</p>
            <div className="space-y-2 mb-4">
              {["Loyalty discount — 20% off for 3 months", "Free plan upgrade for 60 days", "Priority service callback within 2h", "Personalised retention call"].map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`size-4 rounded-full border flex items-center justify-center transition-colors ${action === opt ? "border-indigo-400 bg-indigo-500/20" : "border-border"}`}>
                    {action === opt && <span className="size-2 rounded-full bg-indigo-400" />}
                  </div>
                  <input type="radio" className="sr-only" value={opt} checked={action === opt} onChange={() => setAction(opt)} />
                  <span className="text-sm text-foreground group-hover:text-indigo-300 transition-colors" style={{ fontFamily: "Figtree, sans-serif" }}>{opt}</span>
                </label>
              ))}
            </div>
            <button
              disabled={!action}
              onClick={() => { toast.success(`Action queued for ${sub.name}`, { description: action }); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)", color: "white", fontFamily: "Figtree, sans-serif" }}>
              <Send size={13} /> Apply Retention Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav({ active, setActive }: { active: string; setActive: (v: string) => void }) {
  const tabs = ["Overview", "Risk Analysis", "Retention", "Predictions", "Reports"];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Activity size={15} className="text-indigo-400" />
            </div>
            <span className="font-bold text-foreground tracking-tight" style={{ fontFamily: "Epilogue, sans-serif" }}>ChurnIQ</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 ml-1">Telecom</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((t) => (
              <button key={t} onClick={() => setActive(t)}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${active === t ? "text-indigo-400 bg-indigo-500/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
                style={{ fontFamily: "Figtree, sans-serif" }}>{t}</button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => toast("Search coming soon")} className="size-9 rounded-lg bg-white/5 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"><Search size={15} /></button>
            <button onClick={() => toast("3 new alerts", { description: "2 critical subscribers crossed threshold." })} className="relative size-9 rounded-lg bg-white/5 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
            </button>
            <div className="size-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold" style={{ fontFamily: "Epilogue" }}>AK</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  const churnRate = useCounter(4.3, 1600, 1);
  const customers = useCounter(68600, 1800, 0);
  const revenue = useCounter(97.4, 1700, 1);
  const retained = useCounter(96.2, 1600, 1);

  return (
    <section className="relative pt-12 pb-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-violet-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>
      <div className="relative">
        <div className="flex items-start justify-between mb-10 flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE · Refreshed 2m ago
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-2" style={{ fontFamily: "Epilogue, sans-serif" }}>
              Customer Churn
              <span className="bg-clip-text text-transparent ml-3" style={{ backgroundImage: "linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)" }}>Intelligence</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-xl" style={{ fontFamily: "Figtree, sans-serif" }}>
              Predictive analytics for Q4 2024 — monitoring 68,600 active subscribers across mobile, broadband, and business segments.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => toast("Settings panel coming soon", { description: "Configure model thresholds and alert rules." })}
              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all" style={{ fontFamily: "Figtree, sans-serif" }}>
              <Settings size={14} />Configure
            </button>
            <button
              onClick={() => toast.loading("Running prediction model…", { id: "predict", duration: 2200, finally() { toast.success("Prediction complete", { id: "predict", description: "68,600 subscribers scored. 22,620 flagged." }); } })}
              className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", fontFamily: "Figtree, sans-serif" }}>
              <Zap size={14} />Run Prediction
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="MONTHLY CHURN RATE" value={`${churnRate}%`} sub="vs. industry avg 5.8%" delta="−0.8pp MoM" deltaUp icon={TrendingDown} accent="#6366F1" />
          <KPICard label="ACTIVE SUBSCRIBERS" value={customers.toLocaleString()} sub="across all segments" delta="+2.4% MoM" deltaUp icon={Users} accent="#22D3EE" />
          <KPICard label="REVENUE AT RISK" value={`$${revenue}M`} sub="annualized churn exposure" delta="+$3.1M YoY" icon={AlertTriangle} accent="#F59E0B" />
          <KPICard label="RETENTION RATE" value={`${retained}%`} sub="rolling 90-day cohort" delta="+1.1pp QoQ" deltaUp icon={Shield} accent="#10B981" />
        </div>
      </div>
    </section>
  );
}

// ── Churn Trend ───────────────────────────────────────────────────────────────

function ChurnTrend() {
  const [hovered, setHovered] = useState<number | null>(null);
  const W = 560, H = 200, padL = 36, padR = 12, padT = 8, padB = 28;
  const vals = churnTrendData.map((d) => d.churn);
  const min = 3.2, max = 6.0;
  const xStep = (W - padL - padR) / (vals.length - 1);
  const toX = (i: number) => padL + i * xStep;
  const toY = (v: number) => padT + ((max - v) / (max - min)) * (H - padT - padB);
  const pts = vals.map((v, i) => [toX(i), toY(v)] as [number, number]);
  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1][0]},${H - padB} L${pts[0][0]},${H - padB} Z`;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Churn Rate Trend</h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">Jan – Dec 2024 · Monthly</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono"><span className="size-2 rounded-full bg-indigo-400" />Churn %</span>
      </div>
      <div className="w-full overflow-hidden" style={{ height: H }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} onMouseLeave={() => setHovered(null)}>
          {[3.5, 4.0, 4.5, 5.0, 5.5].map((g) => (
            <g key={g}>
              <line x1={padL} x2={W - padR} y1={toY(g)} y2={toY(g)} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <text x={padL - 4} y={toY(g) + 4} textAnchor="end" fontSize={10} fill="#6B7A99" fontFamily="DM Mono">{g}</text>
            </g>
          ))}
          {churnTrendData.map((d, i) => (
            <text key={d.month} x={toX(i)} y={H - 6} textAnchor="middle" fontSize={10} fill="#6B7A99" fontFamily="DM Mono">{d.month}</text>
          ))}
          <path d={areaPath} fill="#6366F1" fillOpacity={0.12} />
          <path d={linePath} fill="none" stroke="#6366F1" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {pts.map(([x, y], i) => (
            <rect key={i} x={x - xStep / 2} y={padT} width={xStep} height={H - padT - padB} fill="transparent" onMouseEnter={() => setHovered(i)} />
          ))}
          {hovered !== null && (
            <g>
              <line x1={pts[hovered][0]} x2={pts[hovered][0]} y1={padT} y2={H - padB} stroke="rgba(99,102,241,0.3)" strokeWidth={1} />
              <circle cx={pts[hovered][0]} cy={pts[hovered][1]} r={4} fill="#6366F1" />
              <rect x={pts[hovered][0] - 28} y={pts[hovered][1] - 26} width={56} height={20} rx={4} fill="#0D1220" stroke="rgba(99,102,241,0.3)" strokeWidth={1} />
              <text x={pts[hovered][0]} y={pts[hovered][1] - 12} textAnchor="middle" fontSize={11} fill="#E4E8FF" fontFamily="DM Mono">{vals[hovered]}%</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

// ── Risk Distribution ─────────────────────────────────────────────────────────

function RiskDistribution() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Risk Distribution</h2>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">68,600 total subscribers</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <PieChart width={160} height={160}>
            <Pie data={riskSegments} cx={75} cy={75} innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {riskSegments.map((s, i) => <Cell key={i} fill={s.color} opacity={0.9} />)}
            </Pie>
          </PieChart>
        </div>
        <div className="flex-1 space-y-3">
          {riskSegments.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="size-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground font-medium truncate">{s.name}</span>
                  <span className="text-muted-foreground font-mono ml-2">{s.value.toLocaleString()}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color, opacity: 0.8 }} />
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground w-7 text-right">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Churn Reasons ─────────────────────────────────────────────────────────────

function ChurnReasons() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Churn Drivers</h2>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">Exit survey analysis · N=4,812</p>
      </div>
      <div className="space-y-4">
        {churnReasons.map((r) => (
          <div key={r.reason}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-foreground" style={{ fontFamily: "Figtree, sans-serif" }}>{r.reason}</span>
              <span className="text-xs font-mono text-muted-foreground">{r.pct}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.pct}%`, background: r.pct > 30 ? "linear-gradient(90deg,#EF4444,#F59E0B)" : r.pct > 20 ? "linear-gradient(90deg,#F59E0B,#FBBF24)" : "linear-gradient(90deg,#6366F1,#818CF8)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Revenue at Risk ───────────────────────────────────────────────────────────

function RevenueAtRisk() {
  const [hovered, setHovered] = useState<string | null>(null);
  const maxVal = 50;
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Revenue at Risk by Segment</h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">ARR in $M · Q4 2024</p>
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-red-400" />At Risk</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-indigo-400" />Protected</span>
        </div>
      </div>
      <div className="space-y-5">
        {revenueAtRisk.map((row) => {
          const total = row.at_risk + row.protected;
          const isHov = hovered === row.segment;
          return (
            <div key={row.segment} className="cursor-default" onMouseEnter={() => setHovered(row.segment)} onMouseLeave={() => setHovered(null)}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-muted-foreground">{row.segment}</span>
                {isHov
                  ? <span className="text-xs font-mono"><span className="text-red-400">${row.at_risk}M</span><span className="text-muted-foreground mx-1">/</span><span className="text-indigo-400">${row.protected}M</span></span>
                  : <span className="text-xs font-mono text-muted-foreground">${total}M total</span>}
              </div>
              <div className="h-6 flex rounded-lg overflow-hidden gap-0.5">
                <div className="flex items-center justify-center text-xs font-mono text-white/70 transition-all duration-300 rounded-l-lg" style={{ width: `${(row.at_risk / maxVal) * 100}%`, background: "#EF4444", opacity: isHov ? 1 : 0.7 }}>
                  {row.at_risk > 2 && `$${row.at_risk}M`}
                </div>
                <div className="flex items-center justify-center text-xs font-mono text-white/70 transition-all duration-300 rounded-r-lg flex-1" style={{ background: "#6366F1", opacity: isHov ? 0.8 : 0.5 }}>
                  ${row.protected}M
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Retention Actions ─────────────────────────────────────────────────────────

function RetentionActions() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Retention Campaign Performance</h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">Active campaigns · Last 90 days</p>
        </div>
        <button onClick={() => toast("Showing all 12 campaigns", { description: "Full campaign history loaded." })}
          className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-mono">
          View All <ChevronRight size={12} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["CAMPAIGN", "SUCCESS RATE", "CUSTOMERS SAVED", "REVENUE PROTECTED"].map(h => (
                <th key={h} className="text-left text-xs font-mono text-muted-foreground pb-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {retentionActions.map((r, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 pr-4"><span className="text-foreground font-medium" style={{ fontFamily: "Figtree, sans-serif" }}>{r.action}</span></td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${r.success}%`, background: r.success > 75 ? "#10B981" : r.success > 60 ? "#6366F1" : "#F59E0B" }} />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{r.success}%</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 font-mono text-sm text-foreground">{r.customers.toLocaleString()}</td>
                <td className="py-3.5 font-mono text-sm text-emerald-400">{r.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Watch List ────────────────────────────────────────────────────────────────

function WatchList({ onSelect, filters }: { onSelect: (s: Subscriber) => void; filters: { segment: string; risk: string } }) {
  const filtered = allSubscribers.filter(s =>
    (filters.segment === "All" || s.segment === filters.segment) &&
    (filters.risk === "All" || s.risk === filters.risk)
  );
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>High-Risk Subscriber Watch List</h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">ML churn score &gt;60 · Click a row to open profile</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            {filtered.length} shown
          </span>
          <button onClick={() => toast.success("CSV exported", { description: "watch-list-2024-q4.csv downloaded." })}
            className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all font-mono">
            Export CSV
          </button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground text-sm">No subscribers match the current filters.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["CUSTOMER", "SUBSCRIBER ID", "PLAN", "CHURN SCORE", "RISK LEVEL", "TENURE", "MRR"].map(h => (
                  <th key={h} className="text-left text-xs font-mono text-muted-foreground pb-3 pr-6 last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={i} onClick={() => onSelect(s)}
                  className="border-b border-border/50 hover:bg-indigo-500/5 transition-colors cursor-pointer group">
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400" style={{ fontFamily: "Epilogue" }}>
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium text-foreground group-hover:text-indigo-300 transition-colors" style={{ fontFamily: "Figtree, sans-serif" }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-6 font-mono text-xs text-muted-foreground">{s.id}</td>
                  <td className="py-4 pr-6 text-sm text-foreground" style={{ fontFamily: "Figtree, sans-serif" }}>{s.plan}</td>
                  <td className="py-4 pr-6 w-40"><ScoreBar score={s.score} /></td>
                  <td className="py-4 pr-6"><RiskBadge level={s.risk} /></td>
                  <td className="py-4 pr-6 font-mono text-xs text-muted-foreground">{s.tenure}</td>
                  <td className="py-4 font-mono text-sm text-emerald-400">{s.mrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Filter Bar ────────────────────────────────────────────────────────────────

function FilterBar({ filters, setFilters }: {
  filters: { segment: string; risk: string };
  setFilters: (f: { segment: string; risk: string }) => void;
}) {
  const segments = ["All", "Mobile", "Broadband", "Business", "IoT"];
  const risks = ["All", "Critical", "High", "Medium", "Low"];
  return (
    <div className="flex items-center gap-3 flex-wrap mb-5 p-4 bg-card border border-border rounded-xl">
      <span className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><Filter size={12} />Filters:</span>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-mono">Segment:</span>
        {segments.map(s => (
          <button key={s} onClick={() => setFilters({ ...filters, segment: s })}
            className={`px-3 py-1 text-xs rounded-full font-mono border transition-all ${filters.segment === s ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "border-border text-muted-foreground hover:border-white/20 hover:text-foreground"}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-mono">Risk:</span>
        {risks.map(r => (
          <button key={r} onClick={() => setFilters({ ...filters, risk: r })}
            className={`px-3 py-1 text-xs rounded-full font-mono border transition-all ${filters.risk === r ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "border-border text-muted-foreground hover:border-white/20 hover:text-foreground"}`}>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Alert Banner ──────────────────────────────────────────────────────────────

function AlertBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="flex items-center gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-5 py-3.5 mb-6 flex-wrap">
      <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
      <p className="text-sm text-amber-200/80 flex-1 min-w-0" style={{ fontFamily: "Figtree, sans-serif" }}>
        <strong className="text-amber-400">Action required:</strong> 8,240 subscribers in critical churn risk zone — intervention window closes in <strong className="text-amber-300 font-mono">3 days</strong>.
      </p>
      <button onClick={() => setDismissed(true)} className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors flex-shrink-0">Dismiss</button>
      <button onClick={() => { setDismissed(true); toast.success("Campaign launched", { description: "Loyalty offer sent to 8,240 critical-risk subscribers." }); }}
        className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-300 transition-colors flex-shrink-0" style={{ fontFamily: "Figtree, sans-serif" }}>
        Launch Campaign <ChevronRight size={12} />
      </button>
    </div>
  );
}

// ── Stats Strip ───────────────────────────────────────────────────────────────

function StatsStrip() {
  const stats = [
    { icon: Phone, label: "Mobile subscribers", value: "31,200", color: "#6366F1" },
    { icon: Wifi, label: "Broadband accounts", value: "21,000", color: "#22D3EE" },
    { icon: CreditCard, label: "Avg. revenue/user", value: "$62.40", color: "#10B981" },
    { icon: Star, label: "NPS score", value: "47", color: "#F59E0B" },
    { icon: Target, label: "Predictions run", value: "1.2M", color: "#A78BFA" },
    { icon: BarChart2, label: "Model accuracy", value: "91.3%", color: "#34D399" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3 hover:border-white/10 transition-colors">
          <s.icon size={14} style={{ color: s.color }} />
          <div>
            <p className="text-sm font-bold text-foreground font-mono">{s.value}</p>
            <p className="text-xs text-muted-foreground leading-tight" style={{ fontFamily: "Figtree, sans-serif" }}>{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Cohort Heatmap ────────────────────────────────────────────────────────────

function CohortHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const maxCols = 12;

  function cellColor(rate: number) {
    if (rate === 100) return "rgba(99,102,241,0.15)";
    if (rate >= 90) return "rgba(16,185,129,0.5)";
    if (rate >= 80) return "rgba(16,185,129,0.3)";
    if (rate >= 70) return "rgba(245,158,11,0.35)";
    if (rate >= 60) return "rgba(245,158,11,0.55)";
    return "rgba(239,68,68,0.5)";
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Cohort Retention Heatmap</h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">Monthly cohorts · % of original cohort retained</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: "rgba(16,185,129,0.5)" }} />90%+</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: "rgba(245,158,11,0.5)" }} />70–90%</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: "rgba(239,68,68,0.5)" }} />&lt;70%</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left font-mono text-muted-foreground pb-2 pr-3 w-20">Cohort</th>
              <th className="text-left font-mono text-muted-foreground pb-2 pr-3 w-16">Size</th>
              {Array.from({ length: maxCols }, (_, i) => (
                <th key={i} className="font-mono text-muted-foreground pb-2 px-1 text-center w-12">M{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohortData.map((row, ri) => (
              <tr key={row.cohort}>
                <td className="font-mono text-muted-foreground py-1 pr-3">{row.cohort}</td>
                <td className="font-mono text-muted-foreground py-1 pr-3">{(row.total / 1000).toFixed(1)}K</td>
                {Array.from({ length: maxCols }, (_, ci) => {
                  const rate = row.rates[ci];
                  const isHov = hoveredCell?.row === ri && hoveredCell?.col === ci;
                  return (
                    <td key={ci} className="py-1 px-1">
                      {rate !== undefined ? (
                        <div
                          className="relative h-8 w-10 rounded flex items-center justify-center cursor-default transition-all duration-150"
                          style={{ background: isHov ? "rgba(99,102,241,0.4)" : cellColor(rate), border: isHov ? "1px solid rgba(99,102,241,0.6)" : "1px solid transparent" }}
                          onMouseEnter={() => setHoveredCell({ row: ri, col: ci })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <span className="font-mono text-xs font-semibold" style={{ color: isHov ? "#E4E8FF" : rate >= 80 ? "#E4E8FF" : "#E4E8FF", opacity: isHov ? 1 : 0.9 }}>{rate}%</span>
                        </div>
                      ) : (
                        <div className="h-8 w-10" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hoveredCell && cohortData[hoveredCell.row]?.rates[hoveredCell.col] !== undefined && (
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-6 text-xs font-mono text-muted-foreground">
          <span>Cohort: <strong className="text-foreground">{cohortData[hoveredCell.row].cohort}</strong></span>
          <span>Month: <strong className="text-foreground">M{hoveredCell.col}</strong></span>
          <span>Retained: <strong className="text-indigo-400">{cohortData[hoveredCell.row].rates[hoveredCell.col]}%</strong></span>
          <span>Customers: <strong className="text-foreground">{Math.round(cohortData[hoveredCell.row].total * cohortData[hoveredCell.row].rates[hoveredCell.col] / 100).toLocaleString()}</strong></span>
        </div>
      )}
    </div>
  );
}

// ── Churn Simulator ───────────────────────────────────────────────────────────

function ChurnSimulator() {
  const [form, setForm] = useState({ tenure: 12, plan: "Mobile Unlimited", complaints: 0, dataUsage: 50, paymentDelay: 0, segment: "Mobile" });
  const [result, setResult] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  function calcScore() {
    let s = 20;
    if (form.tenure < 6) s += 25;
    else if (form.tenure < 18) s += 12;
    else if (form.tenure > 36) s -= 10;
    s += form.complaints * 14;
    if (form.paymentDelay > 30) s += 20;
    else if (form.paymentDelay > 0) s += 8;
    if (form.dataUsage < 30) s += 10;
    if (form.plan === "Month-to-Month") s += 15;
    if (form.segment === "Business") s -= 5;
    return Math.min(99, Math.max(5, Math.round(s)));
  }

  function run() {
    setRunning(true);
    setResult(null);
    setTimeout(() => { setResult(calcScore()); setRunning(false); }, 1200);
  }

  const riskLevel = result !== null ? (result >= 75 ? "Critical" : result >= 55 ? "High" : result >= 35 ? "Medium" : "Low") : null;
  const factors = [
    { label: "Contract tenure", impact: form.tenure < 6 ? "high" : form.tenure > 36 ? "low-positive" : "med", note: form.tenure < 6 ? "New customer — high churn risk" : form.tenure > 36 ? "Long tenure reduces risk" : "Moderate tenure" },
    { label: "Open complaints", impact: form.complaints >= 3 ? "high" : form.complaints > 0 ? "med" : "low-positive", note: form.complaints === 0 ? "No open complaints" : `${form.complaints} complaint${form.complaints > 1 ? "s" : ""} detected` },
    { label: "Payment delays", impact: form.paymentDelay > 30 ? "high" : form.paymentDelay > 0 ? "med" : "low-positive", note: form.paymentDelay === 0 ? "No payment delays" : `${form.paymentDelay} days overdue` },
    { label: "Data usage", impact: form.dataUsage < 30 ? "med" : "low-positive", note: form.dataUsage < 30 ? "Low usage signals disengagement" : "Healthy usage level" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Form */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Churn Prediction Simulator</h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">Enter subscriber attributes to estimate churn probability</p>
        </div>
        <div className="space-y-5">
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-2">SEGMENT</label>
            <div className="flex gap-2 flex-wrap">
              {["Mobile", "Broadband", "Business", "IoT"].map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, segment: s }))}
                  className={`px-3 py-1.5 text-xs rounded-lg border font-mono transition-all ${form.segment === s ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "border-border text-muted-foreground hover:border-white/20"}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-2">PLAN TYPE</label>
            <div className="flex gap-2 flex-wrap">
              {["Mobile Unlimited", "Premium Fiber", "Business Plus", "Family Bundle", "Month-to-Month"].map(p => (
                <button key={p} onClick={() => setForm(f => ({ ...f, plan: p }))}
                  className={`px-3 py-1.5 text-xs rounded-lg border font-mono transition-all ${form.plan === p ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "border-border text-muted-foreground hover:border-white/20"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-mono text-muted-foreground">TENURE (MONTHS)</label>
              <span className="text-xs font-mono text-indigo-400">{form.tenure}m</span>
            </div>
            <input type="range" min={1} max={72} value={form.tenure} onChange={e => setForm(f => ({ ...f, tenure: +e.target.value }))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#6366F1", background: `linear-gradient(to right, #6366F1 ${(form.tenure / 72) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-mono text-muted-foreground">OPEN COMPLAINTS</label>
              <span className="text-xs font-mono text-amber-400">{form.complaints}</span>
            </div>
            <input type="range" min={0} max={8} value={form.complaints} onChange={e => setForm(f => ({ ...f, complaints: +e.target.value }))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#F59E0B", background: `linear-gradient(to right, #F59E0B ${(form.complaints / 8) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-mono text-muted-foreground">DATA USAGE (%  of plan)</label>
              <span className="text-xs font-mono text-cyan-400">{form.dataUsage}%</span>
            </div>
            <input type="range" min={0} max={100} value={form.dataUsage} onChange={e => setForm(f => ({ ...f, dataUsage: +e.target.value }))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#22D3EE", background: `linear-gradient(to right, #22D3EE ${form.dataUsage}%, rgba(255,255,255,0.1) 0%)` }} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-mono text-muted-foreground">PAYMENT OVERDUE (DAYS)</label>
              <span className={`text-xs font-mono ${form.paymentDelay > 0 ? "text-red-400" : "text-emerald-400"}`}>{form.paymentDelay}d</span>
            </div>
            <input type="range" min={0} max={60} value={form.paymentDelay} onChange={e => setForm(f => ({ ...f, paymentDelay: +e.target.value }))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#EF4444", background: `linear-gradient(to right, #EF4444 ${(form.paymentDelay / 60) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
          </div>
          <button onClick={run} disabled={running}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 hover:opacity-90 hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)", fontFamily: "Figtree, sans-serif" }}>
            {running ? <><span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Calculating…</> : <><Zap size={14} />Calculate Churn Score</>}
          </button>
        </div>
      </div>

      {/* Result */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Prediction Result</h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">Model v3.4.1 · 91.3% accuracy</p>
        </div>
        {result === null && !running && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="size-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Target size={24} className="text-indigo-400" />
            </div>
            <p className="text-muted-foreground text-sm">Configure attributes and run the simulator to see a churn probability score.</p>
          </div>
        )}
        {running && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="size-16 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin mb-4" />
            <p className="text-muted-foreground text-sm font-mono">Scoring subscriber profile…</p>
          </div>
        )}
        {result !== null && !running && (
          <div className="flex-1 flex flex-col gap-5">
            <div className="bg-background rounded-xl p-5 border border-border text-center">
              <p className="text-xs font-mono text-muted-foreground mb-2">CHURN PROBABILITY SCORE</p>
              <p className="text-7xl font-black mb-1" style={{ fontFamily: "Epilogue, sans-serif", color: result >= 75 ? "#EF4444" : result >= 55 ? "#F59E0B" : result >= 35 ? "#6366F1" : "#10B981" }}>{result}</p>
              <p className="text-muted-foreground text-sm">/100</p>
              {riskLevel && <div className="mt-3 flex justify-center"><RiskBadge level={riskLevel} /></div>}
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-4">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${result}%`, background: result >= 75 ? "linear-gradient(90deg,#EF4444,#F87171)" : result >= 55 ? "linear-gradient(90deg,#F59E0B,#FCD34D)" : "linear-gradient(90deg,#6366F1,#818CF8)" }} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono text-muted-foreground mb-3">CONTRIBUTING FACTORS</p>
              {factors.map(f => (
                <div key={f.label} className="flex items-center justify-between bg-background rounded-lg px-4 py-3 border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground" style={{ fontFamily: "Figtree, sans-serif" }}>{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.note}</p>
                  </div>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${f.impact === "high" ? "text-red-400 bg-red-500/10 border-red-500/20" : f.impact === "med" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>
                    {f.impact === "high" ? "↑ High" : f.impact === "med" ? "→ Med" : "↓ Low"}
                  </span>
                </div>
              ))}
            </div>
            {riskLevel && (riskLevel === "Critical" || riskLevel === "High") && (
              <button onClick={() => toast.success("Action queued", { description: `Retention offer scheduled for simulated subscriber.` })}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)", fontFamily: "Figtree, sans-serif" }}>
                <Send size={13} />Queue Retention Action
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Campaign Builder ──────────────────────────────────────────────────────────

function CampaignBuilder() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ segment: "", offer: "", budget: 50000, audience: 0, name: "" });

  const steps = ["Select Audience", "Choose Offer", "Set Budget", "Review & Launch"];
  const offerOptions = [
    { id: "discount", label: "Loyalty Discount", desc: "20% off for 3 months", est: "74% success rate" },
    { id: "upgrade", label: "Free Plan Upgrade", desc: "Move up one tier for 60 days", est: "64% success rate" },
    { id: "bundle", label: "Bundled Services", desc: "Add TV or Cloud for free", est: "82% success rate" },
    { id: "callback", label: "Priority Callback", desc: "Senior agent call within 2h", est: "55% success rate" },
  ];
  const segmentOptions = [
    { id: "Critical", label: "Critical Risk", count: 8240, color: "#EF4444" },
    { id: "High", label: "High Risk", count: 14380, color: "#F59E0B" },
    { id: "Medium", label: "Medium Risk", count: 22150, color: "#6366F1" },
  ];
  const estSaved = form.audience ? Math.round(form.audience * 0.72) : 0;
  const estRevenue = form.audience && form.budget ? `$${((estSaved * 180) / 1000).toFixed(0)}K` : "—";

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Retention Campaign Builder</h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">Build and launch a targeted retention campaign</p>
        </div>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono">
            <ChevronLeft size={12} />Back
          </button>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`size-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-all ${i < step ? "bg-indigo-500 border-indigo-500 text-white" : i === step ? "border-indigo-400 text-indigo-400" : "border-border text-muted-foreground"}`}>
              {i < step ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={`text-xs ml-2 font-mono hidden sm:inline ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px mx-3 ${i < step ? "bg-indigo-500/50" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Audience */}
      {step === 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: "Figtree, sans-serif" }}>Which risk segment should this campaign target?</p>
          {segmentOptions.map(s => (
            <label key={s.id} onClick={() => setForm(f => ({ ...f, segment: s.id, audience: s.count }))}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${form.segment === s.id ? "border-indigo-500/40 bg-indigo-500/8" : "border-border hover:border-white/15"}`}>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full" style={{ background: s.color }} />
                <div>
                  <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "Figtree, sans-serif" }}>{s.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{s.count.toLocaleString()} subscribers</p>
                </div>
              </div>
              <div className={`size-4 rounded-full border ${form.segment === s.id ? "border-indigo-400 bg-indigo-400" : "border-border"}`} />
            </label>
          ))}
          <button disabled={!form.segment} onClick={() => setStep(1)}
            className="mt-4 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)", fontFamily: "Figtree, sans-serif" }}>
            Continue <ChevronRight size={14} className="inline" />
          </button>
        </div>
      )}

      {/* Step 1: Offer */}
      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: "Figtree, sans-serif" }}>What retention offer will you make?</p>
          {offerOptions.map(o => (
            <label key={o.id} onClick={() => setForm(f => ({ ...f, offer: o.id }))}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${form.offer === o.id ? "border-indigo-500/40 bg-indigo-500/8" : "border-border hover:border-white/15"}`}>
              <div className="flex items-center gap-3">
                <Package size={16} className="text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "Figtree, sans-serif" }}>{o.label}</p>
                  <p className="text-xs text-muted-foreground">{o.desc}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400">{o.est}</span>
            </label>
          ))}
          <button disabled={!form.offer} onClick={() => setStep(2)}
            className="mt-4 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)", fontFamily: "Figtree, sans-serif" }}>
            Continue <ChevronRight size={14} className="inline" />
          </button>
        </div>
      )}

      {/* Step 2: Budget */}
      {step === 2 && (
        <div>
          <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: "Figtree, sans-serif" }}>Set your campaign budget.</p>
          <div className="bg-background rounded-xl p-5 border border-border mb-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-1">TOTAL BUDGET</p>
                <p className="text-4xl font-black text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>${(form.budget / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-muted-foreground mb-1">PER SUBSCRIBER</p>
                <p className="text-xl font-bold text-indigo-400" style={{ fontFamily: "Epilogue, sans-serif" }}>
                  ${form.audience ? (form.budget / form.audience).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
            <input type="range" min={10000} max={500000} step={5000} value={form.budget} onChange={e => setForm(f => ({ ...f, budget: +e.target.value }))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#6366F1", background: `linear-gradient(to right, #6366F1 ${((form.budget - 10000) / 490000) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
            <div className="flex justify-between text-xs font-mono text-muted-foreground mt-2">
              <span>$10K</span><span>$500K</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-xs font-mono text-muted-foreground mb-1">EST. CUSTOMERS SAVED</p>
              <p className="text-xl font-bold text-emerald-400 font-mono">{estSaved.toLocaleString()}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-xs font-mono text-muted-foreground mb-1">EST. REVENUE PROTECTED</p>
              <p className="text-xl font-bold text-emerald-400 font-mono">{estRevenue}</p>
            </div>
          </div>
          <button onClick={() => setStep(3)}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)", fontFamily: "Figtree, sans-serif" }}>
            Review Campaign <ChevronRight size={14} className="inline" />
          </button>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div>
          <div className="mb-6">
            <label className="text-xs font-mono text-muted-foreground block mb-2">CAMPAIGN NAME</label>
            <input type="text" placeholder="e.g. Q4 Critical Risk Retention Drive"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo-500/50 focus:outline-none transition-colors"
              style={{ fontFamily: "Figtree, sans-serif" }} />
          </div>
          <div className="bg-background rounded-xl p-5 border border-border space-y-4 mb-6">
            {[
              { label: "Target Segment", value: `${form.segment} Risk — ${form.audience.toLocaleString()} subscribers` },
              { label: "Offer Type", value: offerOptions.find(o => o.id === form.offer)?.label || "" },
              { label: "Budget", value: `$${(form.budget / 1000).toFixed(0)}K total · $${form.audience ? (form.budget / form.audience).toFixed(2) : 0} per subscriber` },
              { label: "Est. Customers Saved", value: `${estSaved.toLocaleString()}` },
              { label: "Est. Revenue Protected", value: estRevenue },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">{label}</span>
                <span className="text-sm text-foreground font-medium" style={{ fontFamily: "Figtree, sans-serif" }}>{value}</span>
              </div>
            ))}
          </div>
          <button
            disabled={!form.name}
            onClick={() => { toast.success("Campaign launched!", { description: `${form.name || "Campaign"} is now live for ${form.audience.toLocaleString()} subscribers.` }); setStep(0); setForm({ segment: "", offer: "", budget: 50000, audience: 0, name: "" }); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 hover:opacity-90 hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg,#10B981,#059669)", fontFamily: "Figtree, sans-serif" }}>
            <Send size={14} />Launch Campaign
          </button>
        </div>
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedSub, setSelectedSub] = useState<Subscriber | null>(null);
  const [filters, setFilters] = useState({ segment: "All", risk: "All" });

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Figtree, sans-serif" }}>
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#0D1220", border: "1px solid rgba(99,102,241,0.2)", color: "#E4E8FF" } }} />
      {selectedSub && <CustomerPanel sub={selectedSub} onClose={() => setSelectedSub(null)} />}

      <Nav active={activeTab} setActive={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Hero />

        {activeTab === "Overview" && (
          <div className="mt-10 space-y-5">
            <AlertBanner />
            <StatsStrip />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2"><ChurnTrend /></div>
              <RiskDistribution />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <RevenueAtRisk />
              <ChurnReasons />
            </div>
            <RetentionActions />
            <FilterBar filters={filters} setFilters={setFilters} />
            <WatchList onSelect={setSelectedSub} filters={filters} />
          </div>
        )}

        {activeTab === "Risk Analysis" && (
          <div className="mt-10 space-y-5">
            <FilterBar filters={filters} setFilters={setFilters} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <RiskDistribution />
              <ChurnReasons />
            </div>
            <CohortHeatmap />
            <WatchList onSelect={setSelectedSub} filters={filters} />
          </div>
        )}

        {activeTab === "Retention" && (
          <div className="mt-10 space-y-5">
            <AlertBanner />
            <RetentionActions />
            <CampaignBuilder />
          </div>
        )}

        {activeTab === "Predictions" && (
          <div className="mt-10 space-y-5">
            <ChurnSimulator />
            <FilterBar filters={filters} setFilters={setFilters} />
            <WatchList onSelect={setSelectedSub} filters={filters} />
          </div>
        )}

        {activeTab === "Reports" && (
          <div className="mt-10 space-y-5">
            <CohortHeatmap />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <RevenueAtRisk />
              <ChurnReasons />
            </div>
            <ChurnTrend />
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-12 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Activity size={11} className="text-indigo-400" />
            </div>
            <span className="text-sm font-bold text-muted-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>ChurnIQ</span>
          </div>
          <p className="text-xs font-mono text-muted-foreground/50">Model v3.4.1 · Data as of 2024-12-31 · © 2025 ChurnIQ Analytics</p>
        </div>
      </footer>
    </div>
  );
}
