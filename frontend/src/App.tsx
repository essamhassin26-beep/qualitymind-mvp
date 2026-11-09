import React, { useState, useEffect } from "react";
import { api } from "./lib/api";
import {
  QrCode, Camera, AlertTriangle, CheckCircle2, XCircle,
  Factory, Gauge, Wrench, ClipboardList, ArrowLeft, Circle,
  Lightbulb, ShieldAlert, ChevronLeft, ChevronRight as ChevronR,
  PackageCheck, ScanLine, TrendingUp, TrendingDown, Users, Sparkles, Construction, Pencil, History
} from "lucide-react";

// ============================================================
// DESIGN TOKENS — "Precision Instrument Panel" direction
// Grounded in: factory-floor gauges, torque wrenches, blueprint drafting,
// calibration certificates. Enterprise tenant-branded (Nissan Motor Egypt).
// Type: IBM Plex Mono (data/codes) + IBM Plex Sans Arabic (UI labels)
// Signature: radial gauge dials + bezel-edged panels + tracked micro-labels
// ============================================================

const C = {
  bg: "#101317",
  panel: "#1A1F26",
  panelAlt: "#212832",
  bezel: "#2A323D",
  line: "#2C3540",
  cyan: "#4CC9E8",
  cyanDim: "#1E3A42",
  gold: "#C9A24B",
  text: "#EDF0F3",
  textDim: "#8B95A3",
  textFaint: "#5A6473",
  ok: "#34C77B",
  okDim: "#12291C",
  warn: "#E8A23B",
  warnDim: "#2E2311",
  crit: "#E5484D",
  critDim: "#2E1517",
};

function FontImport() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
      .qm-mono { font-family: 'IBM Plex Mono', monospace; }
      .qm-sans { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      .qm-tracked { letter-spacing: 0.12em; }
      @keyframes qmFadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      .qm-fade { animation: qmFadeUp .35s ease both; }
    `}</style>
  );
}

// ---------- Responsive helper ----------
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 820);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ---------- Bezel Panel (signature container) ----------
function Panel({ children, className = "", style = {}, glow }) {
  return (
    <div
      className={`rounded-xl relative ${className}`}
      style={{
        background: `linear-gradient(180deg, ${C.panelAlt}, ${C.panel})`,
        border: `1px solid ${C.bezel}`,
        boxShadow: glow
          ? `0 0 0 1px ${C.line} inset, 0 8px 24px -8px rgba(0,0,0,0.6), 0 0 20px -4px ${glow}55`
          : `0 0 0 1px ${C.line} inset, 0 8px 24px -8px rgba(0,0,0,0.6)`,
        ...style,
      }}
    >
      {children}
    </div>
    
  );
}

function TrackedLabel({ children, color = C.textFaint }) {
  return <span className="qm-mono qm-tracked uppercase" style={{ color, fontSize: 10.5 }}>{children}</span>;
}

// ---------- Radial Gauge ----------
function Gauge_({ value, max, label, unit, tone = "cyan", size = 122 }) {
  const pct = Math.min(1, value / max);
  const r = 46;
  const cKm = 2 * Math.PI * r;
  const offset = cKm * (1 - pct);
  const toneColor = { cyan: C.cyan, ok: C.ok, warn: C.warn, crit: C.crit }[tone];
  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke={C.line} strokeWidth="7" />
          <circle
            cx="60" cy="60" r={r} fill="none" stroke={toneColor} strokeWidth="7"
            strokeDasharray={cKm} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 4px ${toneColor}88)` }}
          />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * 2 * Math.PI;
            const major = i % 2 === 0;
            const x1 = 60 + Math.cos(a) * (major ? 53 : 55), y1 = 60 + Math.sin(a) * (major ? 53 : 55);
            const x2 = 60 + Math.cos(a) * 58, y2 = 60 + Math.sin(a) * 58;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.line} strokeWidth={major ? 1.5 : 0.75} />;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="qm-mono font-semibold" style={{ color: C.text, fontSize: size * 0.2 }}>{value}</span>
          <TrackedLabel>{unit}</TrackedLabel>
        </div>
      </div>
      <span className="qm-sans text-center mt-2.5" style={{ color: C.textDim, fontSize: 12, maxWidth: size + 24, lineHeight: 1.4 }}>{label}</span>
    </div>
    
  );
}

function Badge({ children, tone = "default" }) {
  const map = {
    default: { bg: C.panelAlt, color: C.textDim, border: C.line },
    cyan: { bg: C.cyanDim, color: C.cyan, border: C.cyan },
    crit: { bg: C.critDim, color: C.crit, border: C.crit },
    warn: { bg: C.warnDim, color: C.warn, border: C.warn },
    ok: { bg: C.okDim, color: C.ok, border: C.ok },
  };
  const t = map[tone];
  return (
    <span className="qm-mono px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1"
      style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}55` }}>
      {children}
    </span>
  );
}

// ---------- App Masthead (tenant-branded chrome) ----------
function Masthead() {
  return (
    <div className="flex items-center justify-between w-full max-w-6xl px-1 mb-7">
      <div className="flex items-center gap-3">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="13" stroke={C.cyan} strokeWidth="1.4" />
          <circle cx="15" cy="15" r="4.5" fill={C.cyan} />
          <line x1="15" y1="1" x2="15" y2="6" stroke={C.gold} strokeWidth="1.4" />
          <line x1="15" y1="24" x2="15" y2="29" stroke={C.line} strokeWidth="1.4" />
          <line x1="1" y1="15" x2="6" y2="15" stroke={C.line} strokeWidth="1.4" />
          <line x1="24" y1="15" x2="29" y2="15" stroke={C.line} strokeWidth="1.4" />
        </svg>
        <div>
          <div className="qm-sans font-bold" style={{ color: C.text, fontSize: 16 }}>QualityMind <span style={{ color: C.cyan }}>AI</span></div>
          <TrackedLabel color={C.gold}>NISSAN MOTOR EGYPT · SUPPLIER QUALITY</TrackedLabel>
        </div>
      </div>
      <button onClick={async () => {
  try {
    const res = await fetch('https://qualitymind-mvp.onrender.com/api/auth/login', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: 'admin@nissan.com.eg', password: 'Admin@123'})
    });
    if(res.ok) alert('✅ متصل بالسيرفر الحقيقي بنجاح! الدنيا شغالة!');
    else alert('❌ فشل الاتصال: ' + res.status);
  } catch(e) { alert('❌ السيرفر صاحي؟ (قد يستغرق 50 ثانية للاستيقاظ)'); }
}} className="qm-mono px-3 py-1.5 rounded text-xs font-medium inline-flex items-center gap-1" style={{ background: C.okDim, color: C.ok, border: `1px solid ${C.ok}55` }}>
  <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: C.ok }} /> اختبار الاتصال
</button>
    </div>
    
  );
}

// ============================================================
// MOBILE — Incoming Inspection
// ============================================================
const CHECKPOINTS = [
  { id: 1, item: "فحص وش السجادة", key: "التأكد من عدم وجود كرمشة أو انثناء", severity: "V2" },
  { id: 2, item: "لون الجزء", key: "مطابقة عينة اللون المرجعية", severity: "V3" },
  { id: 3, item: "إحكام التثبيت", key: "عدم وجود اهتزاز عند الضغط اليدوي", severity: "V1" },
  { id: 4, item: "خشونة السطح", key: "خالي من الخدوش الظاهرة بمسافة 30 سم", severity: "V2" },
  { id: 5, item: "أبعاد التركيب", key: "مطابقة القالب المرجعي ±0.3مم", severity: "V1" },
];

function SeverityDot({ level }) {
  const c = level === "V1" ? C.crit : level === "V2" ? C.warn : C.textFaint;
  return <span className="inline-block w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: c, boxShadow: `0 0 5px ${c}99` }} />;
}

function MobileScreen() {
  const [scanned, setScanned] = useState(true);
  const [results, setResults] = useState({});
  const [remarksOpen, setRemarksOpen] = useState(null);

  const setResult = (id, val) => setResults((r) => ({ ...r, [id]: { ...r[id], result: val } }));
  const setRemark = (id, text) => setResults((r) => ({ ...r, [id]: { ...r[id], remark: text } }));

  const done = Object.keys(results).filter((k) => results[k]?.result).length;
  const ngCount = Object.values(results).filter((r) => r?.result === "NG").length;
  const allDone = done === CHECKPOINTS.length;

  return (
    <div className="mx-auto overflow-hidden" style={{ width: 380, height: 780, borderRadius: 38, background: "#000", border: "7px solid #05070A", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px #000" }}>
      <div className="h-full flex flex-col" style={{ background: C.bg }}>
        <div className="qm-mono flex justify-between items-center px-5 pt-3 pb-1 text-xs" style={{ color: C.textFaint }}>
          <span>09:41</span>
          <TrackedLabel color={C.gold}>NMEG · QM</TrackedLabel>
        </div>

        {!scanned ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
            <div className="w-56 h-56 rounded-2xl flex items-center justify-center relative" style={{ border: `1.5px dashed ${C.cyan}55`, background: C.panel }}>
              <ScanLine size={64} color={C.cyan} strokeWidth={1.1} />
              <div className="absolute inset-3 rounded-xl" style={{ border: `1px solid ${C.cyan}22` }} />
            </div>
            <p className="qm-sans text-center" style={{ color: C.textDim, fontSize: 13.5, lineHeight: 1.6 }}>
              وجّه الكاميرا نحو QR الجزء<br />لسحب معيار الفحص (Control Plan) تلقائياً
            </p>
            <button onClick={() => setScanned(true)}
              className="qm-sans w-full py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
              style={{ background: C.cyan, color: "#06181D" }}>
              محاكاة المسح (Demo)
            </button>
          </div>
        ) : (
          <>
            <div className="px-4 pt-2 pb-3" style={{ borderBottom: `1px solid ${C.line}` }}>
              <div className="flex items-center justify-between mb-2.5">
                <button onClick={() => { setScanned(false); setResults({}); }} className="p-1 -mr-1"><ArrowLeft size={18} color={C.textDim} /></button>
                <Badge tone="cyan">IMPORTANT PART · A</Badge>
              </div>
              <h1 className="qm-sans font-semibold" style={{ color: C.text, fontSize: 17.5 }}>فرش الشنطة الخلفية</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="qm-mono" style={{ color: C.cyan, fontSize: 12.5 }}>PN·555013AS0AE</span>
                <span className="qm-sans" style={{ color: C.textFaint, fontSize: 12 }}>مورّد Aliaa</span>
              </div>
            </div>

            <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: C.panelAlt }}>
              <TrackedLabel>فحص 100% إجباري — عينة 3/12</TrackedLabel>
              <span className="qm-mono font-medium" style={{ color: C.text, fontSize: 12 }}>{done}/{CHECKPOINTS.length}</span>
            </div>
            <div style={{ height: 3, background: C.line }}>
              <div className="h-full" style={{ width: `${(done / CHECKPOINTS.length) * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.gold})`, transition: "width .4s" }} />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
              {CHECKPOINTS.map((cp) => {
                const r = results[cp.id];
                return (
                  <Panel key={cp.id} className="p-3.5">
                    <div className="flex items-start gap-2">
                      <SeverityDot level={cp.severity} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="qm-sans font-medium" style={{ color: C.text, fontSize: 13.5 }}>{cp.item}</span>
                          <TrackedLabel color={cp.severity === "V1" ? C.crit : cp.severity === "V2" ? C.warn : C.textFaint}>{cp.severity}</TrackedLabel>
                        </div>
                        <p className="qm-sans mt-0.5" style={{ color: C.textDim, fontSize: 11.5, lineHeight: 1.55 }}>{cp.key}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => setResult(cp.id, "OK")}
                        className="flex-1 py-2 rounded-lg qm-sans text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        style={r?.result === "OK" ? { background: C.okDim, color: C.ok, border: `1px solid ${C.ok}` } : { background: C.panelAlt, color: C.textFaint, border: `1px solid ${C.line}` }}>
                        <CheckCircle2 size={14} /> OK
                      </button>
                      <button onClick={() => setResult(cp.id, "NG")}
                        className="flex-1 py-2 rounded-lg qm-sans text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        style={r?.result === "NG" ? { background: C.critDim, color: C.crit, border: `1px solid ${C.crit}` } : { background: C.panelAlt, color: C.textFaint, border: `1px solid ${C.line}` }}>
                        <XCircle size={14} /> NG
                      </button>
                      <button onClick={() => setRemarksOpen(remarksOpen === cp.id ? null : cp.id)} className="p-2.5 rounded-lg" style={{ background: C.panelAlt, border: `1px solid ${C.line}` }}>
                        <Camera size={14} color={C.textDim} />
                      </button>
                    </div>
                    {remarksOpen === cp.id && (
                      <input autoFocus placeholder="ملاحظة (اختياري)... مثال: تغليف تالف لكن الجزء سليم" onChange={(e) => setRemark(cp.id, e.target.value)}
                        className="qm-sans w-full mt-2.5 px-3 py-2.5 rounded-lg text-xs outline-none qm-fade"
                        style={{ background: C.bg, color: C.text, border: `1px solid ${C.cyan}55` }} />
                    )}
                  </Panel>
                );
              })}
            </div>

            <div className="px-4 py-3.5" style={{ borderTop: `1px solid ${C.line}`, background: C.panelAlt }}>
              {ngCount > 0 && (
                <div className="flex items-center gap-1.5 mb-2.5 qm-sans qm-fade" style={{ color: C.warn, fontSize: 11.5 }}>
                  <AlertTriangle size={13} /> {ngCount} نقطة NG — سيُنشأ PIR تلقائياً عند الرفض
                </div>
              )}
              <div className="flex gap-2">
                <button disabled={!allDone} className="flex-1 py-3.5 rounded-xl qm-sans font-semibold text-sm transition-opacity"
                  style={{ background: allDone ? C.ok : C.line, color: allDone ? "#06181D" : C.textFaint, opacity: allDone ? 1 : 0.55 }}>
                  قبول الكمية
                </button>
                <button disabled={!allDone} className="flex-1 py-3.5 rounded-xl qm-sans font-semibold text-sm transition-opacity"
                  style={{ background: allDone ? C.crit : C.line, color: allDone ? "#2E0A0C" : C.textFaint, opacity: allDone ? 1 : 0.55 }}>
                  رفض ← بدء الاحتواء
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    
  );
}

// ============================================================
// WEB — Plant Dashboard
// ============================================================
const SUPPLIERS = [
  { name: "Auto Cool", risk: 82, ppm: 340 },
  { name: "GTI", risk: 61, ppm: 190 },
  { name: "Idaco", risk: 34, ppm: 90 },
  { name: "Mobica", risk: 18, ppm: 45 },
  { name: "EA", risk: 9, ppm: 20 },
];

function RiskBar({ name, risk, ppm }) {
  const tone = risk > 70 ? C.crit : risk > 40 ? C.warn : C.ok;
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: `1px solid ${C.line}` }}>
      <span className="qm-sans w-24 shrink-0 truncate" style={{ color: C.text, fontSize: 13 }}>{name}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: C.line }}>
        <div className="h-full rounded-full" style={{ width: `${risk}%`, background: tone, boxShadow: `0 0 6px ${tone}88` }} />
      </div>
      <span className="qm-mono w-10 text-right" style={{ color: tone, fontSize: 12 }}>{risk}%</span>
      <span className="qm-mono w-16 text-right" style={{ color: C.textFaint, fontSize: 11 }}>{ppm} PPM</span>
    </div>
    
  );
}

function WebDashboard() {
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.line}`, background: C.panelAlt }}>
        <div className="flex items-center gap-2.5">
          <Factory size={19} color={C.cyan} />
          <span className="qm-sans font-semibold" style={{ color: C.text, fontSize: 15.5 }}>لوحة القيادة — مصنع N17</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: C.ok, boxShadow: `0 0 8px ${C.ok}` }} />
          <TrackedLabel color={C.ok}>PLANT STATUS · SAFE</TrackedLabel>
        </div>
      </div>

      <div className="p-6 grid grid-cols-12 gap-5">
        <Panel className="col-span-12 p-5 flex items-center justify-around flex-wrap gap-4" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
          <Gauge_ value={112} max={200} label="PPM (الهدف: 150)" unit="PPM" tone="ok" />
          <Gauge_ value={34} max={100} label="DPHU (V1+V2+V3)" unit="/100" tone="warn" />
          <Gauge_ value={82} max={100} label="Production Risk Index" unit="%" tone="crit" />
          <Gauge_ value={91} max={100} label="Containment Efficiency" unit="%" tone="cyan" />
          <Gauge_ value={7} max={20} label="Open PIRs" unit="PIR" tone="warn" />
        </Panel>

        <Panel className="col-span-7 p-5" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={15} color={C.textDim} />
            <TrackedLabel color={C.text}>مورّدون حسب المخاطرة اليوم</TrackedLabel>
          </div>
          {SUPPLIERS.map((s) => <RiskBar key={s.name} {...s} />)}
        </Panel>

        <div className="col-span-5 flex flex-col gap-5">
          <Panel className="p-5" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList size={15} color={C.textDim} />
              <TrackedLabel color={C.text}>أولويات فريق الجودة</TrackedLabel>
            </div>
            <div className="space-y-2.5">
              {[
                { t: "PIR-2026-0892 — إجراء دائم متأخر يومين", tone: C.crit },
                { t: "Auto Cool — يوصى بـ Supplier Audit (BR-012)", tone: C.warn },
                { t: "3 عينات فحص جديدة بانتظار مراجعة", tone: C.textFaint },
              ].map((x, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Circle size={7} fill={x.tone} color="transparent" />
                  <span className="qm-sans" style={{ color: C.text, fontSize: 12.5 }}>{x.t}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel glow={C.gold} className="p-5" style={{ background: `linear-gradient(135deg, ${C.panel}, ${C.cyanDim}33)` }}>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={15} color={C.gold} />
              <TrackedLabel color={C.gold}>أفضل فرصة Kaizen هذا الأسبوع</TrackedLabel>
            </div>
            <p className="qm-sans" style={{ color: C.textDim, fontSize: 12.5, lineHeight: 1.65 }}>
              تقليل Secondary Scratch عبر تعديل نقطة تحميل بالخط — توفير مقدَّر 4.2 دقيقة/عملية،
              درجة SQCE: <span className="qm-mono font-semibold" style={{ color: C.cyan }}>88%</span>
            </p>
          </Panel>
        </div>
      </div>
    </Panel>
  );
}

// ============================================================
// WEB — Containment Screen (BR-003: four-zone sweep)
// ============================================================
const ZONES = [
  { id: "line", label: "خط الإنتاج" },
  { id: "visual", label: "منطقة Visual" },
  { id: "warehouse", label: "المخزن" },
  { id: "receiving", label: "الاستلام" },
];

function ContainmentScreen() {
  const [active, setActive] = useState(0);
  const [zoneData, setZoneData] = useState({});
  const [tagged, setTagged] = useState(false);

  const setField = (zoneId, field, val) =>
    setZoneData((d) => ({ ...d, [zoneId]: { ...d[zoneId], [field]: val } }));

  const totals = ZONES.reduce(
    (acc, z) => {
      const zd = zoneData[z.id] || {};
      acc.checked += Number(zd.checked || 0);
      acc.accepted += Number(zd.accepted || 0);
      acc.rejected += Number(zd.rejected || 0);
      return acc;
    },
    { checked: 0, accepted: 0, rejected: 0 }
  );

  const zonesDone = ZONES.filter((z) => zoneData[z.id]?.checked).length;
  const allZonesDone = zonesDone === ZONES.length;
  const zone = ZONES[active];

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.line}`, background: C.panelAlt }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge tone="crit">PIR-2026-0892</Badge>
            <Badge tone="default">فرش الشنطة الخلفية · PN 555013AS0AE</Badge>
          </div>
          <TrackedLabel color={C.text}>شيت الاحتواء — Containment Sheet</TrackedLabel>
        </div>
        <div className="text-left">
          <div className="qm-mono font-semibold" style={{ color: C.text, fontSize: 14 }}>Aliaa</div>
          <TrackedLabel>المورّد</TrackedLabel>
        </div>
      </div>

      <div className="p-6">
        {/* Zone stepper */}
        <div className="flex items-center mb-6">
          {ZONES.map((z, i) => {
            const zd = zoneData[z.id];
            const state = zd?.checked ? "done" : i === active ? "active" : "pending";
            return (
              <React.Fragment key={z.id}>
                <button onClick={() => setActive(i)} className="flex flex-col items-center gap-2 group">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center qm-mono font-semibold text-sm transition-all"
                    style={
                      state === "done" ? { background: C.okDim, border: `1.5px solid ${C.ok}`, color: C.ok }
                        : state === "active" ? { background: C.cyanDim, border: `1.5px solid ${C.cyan}`, color: C.cyan, boxShadow: `0 0 12px ${C.cyan}55` }
                        : { background: C.panelAlt, border: `1.5px solid ${C.line}`, color: C.textFaint }
                    }
                  >
                    {state === "done" ? <CheckCircle2 size={17} /> : i + 1}
                  </div>
                  <span className="qm-sans" style={{ color: state === "pending" ? C.textFaint : C.text, fontSize: 11.5 }}>{z.label}</span>
                </button>
                {i < ZONES.length - 1 && <div className="flex-1 mx-2 mb-6" style={{ height: 1.5, background: zd?.checked ? C.ok : C.line }} />}
              </React.Fragment>
            );
          })}
        </div>

        {!tagged ? (
          <div className="grid grid-cols-12 gap-5 qm-fade" key={zone.id}>
            <Panel className="col-span-8 p-5" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
              <TrackedLabel color={C.cyan}>فرز منطقة: {zone.label}</TrackedLabel>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { key: "checked", label: "الكمية المفحوصة" },
                  { key: "accepted", label: "المقبولة" },
                  { key: "rejected", label: "المرفوضة" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="qm-sans block mb-1.5" style={{ color: C.textDim, fontSize: 11.5 }}>{f.label}</label>
                    <input
                      type="number"
                      value={zoneData[zone.id]?.[f.key] || ""}
                      onChange={(e) => setField(zone.id, f.key, e.target.value)}
                      className="qm-mono w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: C.panelAlt, color: C.text, border: `1px solid ${C.line}` }}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg qm-sans text-xs" style={{ background: C.panelAlt, border: `1px solid ${C.line}`, color: C.textDim }}>
                  <Camera size={14} /> إرفاق صورة العيب
                </button>
                <span className="qm-sans" style={{ color: C.textFaint, fontSize: 11 }}>الوردية: أولى · المفتش: محمد سامي</span>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setActive((a) => Math.max(0, a - 1))} disabled={active === 0}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg qm-sans text-sm" style={{ color: active === 0 ? C.textFaint : C.textDim, opacity: active === 0 ? 0.4 : 1 }}>
                  <ChevronLeft size={15} /> السابق
                </button>
                {active < ZONES.length - 1 ? (
                  <button onClick={() => { setField(zone.id, "checked", zoneData[zone.id]?.checked || 1); setActive((a) => a + 1); }}
                    className="flex items-center gap-1 px-5 py-2.5 rounded-lg qm-sans text-sm font-semibold" style={{ background: C.cyan, color: "#06181D" }}>
                    المنطقة التالية <ChevronR size={15} />
                  </button>
                ) : (
                  <button onClick={() => { setField(zone.id, "checked", zoneData[zone.id]?.checked || 1); setTagged(true); }}
                    disabled={!allZonesDone && !zoneData[zone.id]?.checked}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg qm-sans text-sm font-semibold" style={{ background: C.ok, color: "#06181D" }}>
                    <PackageCheck size={16} /> إنهاء الاحتواء
                  </button>
                )}
              </div>
            </Panel>

            <Panel className="col-span-4 p-5" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
              <TrackedLabel>الإجمالي التراكمي</TrackedLabel>
              <div className="mt-4 space-y-3">
                {[
                  { label: "مفحوصة", val: totals.checked, tone: C.text },
                  { label: "مقبولة", val: totals.accepted, tone: C.ok },
                  { label: "مرفوضة", val: totals.rejected, tone: C.crit },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="qm-sans" style={{ color: C.textDim, fontSize: 12.5 }}>{r.label}</span>
                    <span className="qm-mono font-semibold" style={{ color: r.tone, fontSize: 16 }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 qm-fade">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5" style={{ background: C.okDim, border: `2px solid ${C.ok}`, boxShadow: `0 0 24px ${C.ok}55` }}>
              <CheckCircle2 size={44} color={C.ok} />
            </div>
            <h3 className="qm-sans font-bold mb-1" style={{ color: C.text, fontSize: 18 }}>تم إغلاق الاحتواء</h3>
            <TrackedLabel color={C.ok}>QUALITY CLEARANCE TAG ISSUED</TrackedLabel>
            <Panel className="mt-6 px-6 py-4 flex items-center gap-5" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
              <div className="w-16 h-16 rounded-md flex items-center justify-center" style={{ background: "#fff" }}>
                <QrCode size={44} color="#000" />
              </div>
              <div className="text-right">
                <div className="qm-mono" style={{ color: C.text, fontSize: 12 }}>CNT-2026-0341</div>
                <div className="qm-sans" style={{ color: C.textDim, fontSize: 11.5 }}>محمد سامي · 2026-07-18 14:32</div>
                <div className="qm-mono mt-1" style={{ color: C.ok, fontSize: 11 }}>OK — {totals.accepted}/{totals.checked} مقبول</div>
              </div>
            </Panel>
          </div>
        )}
      </div>
    </Panel>
  );
}

// ============================================================
// WEB/TABLET — Inspection Sheet Browser (part list + full sheet)
// ============================================================
// Sourced verbatim (Item Check / Key Point) from real "MULTIPLE PARTS RECEIVING
// INSPECTION REPORT" sheets: GTI, Auto Cool, EA, Idaco, Mobica. CKD entries below
// come from real PIR/Process Audit documents but do not yet have a matching
// Item Check/Key Point sheet on file — flagged honestly in the UI.
const PARTS_LIST = [
  { id: 1, name: "CARPET ASSY-FLOOR (سجادة الأرضية)", pn: "749023AS1A", supplier: "GTI", code: "1344", model: "N17", important: "B", real: true },
  { id: 2, name: "BLOWER ASSY-AIR COND,FR", pn: "272105WV1A", supplier: "AUTO COOL", code: "280", model: "N17", important: "B", real: true },
  { id: 3, name: "MBR COMPL-FR SUSP", pn: "544003AS0A", supplier: "EA", code: "334", model: "N17", important: "A", real: true },
  { id: 4, name: "HARN-ENG ROOM (ضفيرة حجرة المحرك)", pn: "240125WV0B", supplier: "IDACO", code: "L128", model: "N17", important: "A", real: true },
  { id: 5, name: "FIN ASSY-RR DOOR,RH (Beige)", pn: "829005WV2B", supplier: "MOBICA", code: "65", model: "N17", important: "B", real: true },
  { id: 6, name: "اسبويلر الشنطة الخلفية", pn: "—", supplier: "CKD Supplier", code: "—", model: "N17", important: "B", real: false },
  { id: 7, name: "الفانوس الأمامى", pn: "—", supplier: "CKD Supplier", code: "—", model: "N17", important: "A", real: false },
];

const SHEET_POINTS = {
  1: [ // GTI — CARPET ASSY-FLOOR (حرفياً من النموذج الحقيقي)
    { item: "فحص وش السجادة", key: "التأكد من عدم وجود كرمشة أو انثناء", severity: "V2" },
    { item: "فحص وش السجادة", key: "التأكد من عدم وجود قطع", severity: "V2" },
    { item: "فحص وش السجادة", key: "التأكد من عدم وجود إتساخ", severity: "V3" },
    { item: "فحص وش السجادة", key: "التأكد من وجود فتحات لتثبيت السجادة: 4 يمين، 4 شمال، 2 خلف", severity: "V1" },
    { item: "فحص وش السجادة", key: "التأكد من وجود فتحات تثبيت الكرسي", severity: "V1" },
    { item: "فحص وش السجادة", key: "التأكد من عدم وجود قطع بنهاية الفتحات أو الأحرف", severity: "V2" },
    { item: "فحص السجادة من الخلف", key: "التأكد من وجود 4 لباد من الخلف ولصق اللباد جيداً", severity: "V2" },
    { item: "فحص السجادة من الخلف", key: "التأكد من عدم ترحيل اللباد", severity: "V2" },
    { item: "فحص السجادة من الخلف", key: "التأكد من سمك اللباد ومطابقته بالعينة", severity: "V3" },
  ],
  2: [ // Auto Cool — BLOWER ASSY-AIR COND,FR
    { item: "فحص البوابات", key: "التأكد من غلق وفتح البوابات حتى نهاية المشوار (ووجود شحم لسهولة الحركة)", severity: "V1" },
    { item: "فحص البوابات", key: "التأكد من عدم وجود انثناء بالواير والتأكد من تثبيت الوايرات", severity: "V1" },
    { item: "فحص البوابات", key: "التأكد من وجود فوم البوابات وعدم وجود قطع به وملصق جيداً", severity: "V2" },
    { item: "فحص البوابات", key: "التأكد من وضع علامة فحص الفوم ووجود استيكر فحص الجودة", severity: "V3" },
    { item: "فحص البوابات", key: "التأكد من عدم وجود كسر بالبوابات والتأكد من وجود طبة بلاستيك على فتحة البارد", severity: "V1" },
    { item: "فحص لوحة المفاتيح والمروحة", key: "التأكد من عدم وجود خدوش", severity: "V3" },
    { item: "فحص لوحة المفاتيح والمروحة", key: "التأكد من عدم وجود كسر بلوحة المفاتيح", severity: "V1" },
    { item: "فحص لوحة المفاتيح والمروحة", key: "التأكد من حركة المفاتيح باليد كل مشوار في مكانه", severity: "V2" },
    { item: "فحص فيشة الحساس", key: "التأكد من عدم وجود كسر بالفيشة أو انثناء بالبينات + سلامة السلك", severity: "V1" },
    { item: "فحص حوامل التثبيت", key: "التأكد من وجود حوامل التثبيت وعدم كسر أماكن التثبيت وبنوز دليل التجميع", severity: "V1" },
  ],
  3: [ // EA — MBR COMPL-FR SUSP
    { item: "عمود علبة الدركسيون", key: "التأكد من أن بيض العمود خالي من القطع", severity: "V1" },
    { item: "عمود علبة الدركسيون", key: "التأكد من أن فركسبل العمود خالي من القطع ومثبت بعدد 2 كلبس", severity: "V1" },
    { item: "عمود علبة الدركسيون", key: "التأكد من عزم عدد 4 مسمار لتثبيت عمود الدركسيون بوجود علامات المركر عليها", severity: "V1" },
    { item: "عمود علبة الدركسيون", key: "التأكد من أن كاوتشة عمود الدركسيون العلوية خالية من القطع", severity: "V2" },
    { item: "فحص الاستبليزر (ميزان علبة الدركسيون)", key: "التأكد من عزم عدد 4 مسمار لتثبيت الميزان بجسم العلبة بوجود علامات المركر", severity: "V1" },
    { item: "فحص الاستبليزر (ميزان علبة الدركسيون)", key: "التأكد من أن عدد 2 كاوتشة البيضة خالية من القطع", severity: "V2" },
    { item: "فحص الاستبليزر (ميزان علبة الدركسيون)", key: "التأكد من وجود عدد 2 جلبة لعدم تحريك الاستبليزر يمين شمال", severity: "V1" },
    { item: "فحص جسم القنطرة", key: "التأكد من وجود عدد 2 بيضة يمين وشمال خالية من القطع", severity: "V1" },
    { item: "فحص جسم القنطرة", key: "التأكد من عدم وجود كدمات أو عيوب بالدهان", severity: "V3" },
    { item: "فحص جسم القنطرة", key: "التأكد من وجود رقم اللوط", severity: "V3" },
  ],
  4: [ // Idaco — HARN-ENG ROOM
    { item: "فحص جسم الضفيرة", key: "التأكد من طول الضفيرة ومطابقتها بالعينة", severity: "V1" },
    { item: "فحص جسم الضفيرة", key: "التأكد من عدم وجود قطع في الجروميت أو الأسلاك", severity: "V1" },
    { item: "فحص جسم الضفيرة", key: "التأكد من اتجاه الجروميت ووجود مخرج الأرضي", severity: "V1" },
    { item: "فحص جسم الضفيرة", key: "التأكد من وجود عوازل الضفيرة بأنواعها في أماكنها المناسبة مطابقة للعينة", severity: "V2" },
    { item: "فحص جسم الضفيرة", key: "التأكد من وجود استيكر اختبار الضفيرة", severity: "V3" },
    { item: "فحص السوكيتات", key: "التأكد من عدم وجود كسر في السوكيت", severity: "V1" },
    { item: "فحص السوكيتات", key: "التأكد من عدم انثناء البينات الموجودة بداخل السوكيت", severity: "V1" },
    { item: "فحص السوكيتات", key: "التأكد من وجود السوكيتات بأنواعها وألوانها المختلفة مطابقة للعينة", severity: "V2" },
    { item: "فحص الكلبسات", key: "التأكد من تثبيت الكلبسات في أماكنها المضبوطة مطابقة للعينة", severity: "V2" },
  ],
  5: [ // Mobica — FIN ASSY-RR DOOR,RH
    { item: "فحص الفرش الأمامي (وش وظهر)", key: "التأكد من عدم وجود قطع", severity: "V2" },
    { item: "فحص الفرش الأمامي (وش وظهر)", key: "التأكد من عدم وجود اتساخ (بقع - أتربة)", severity: "V3" },
    { item: "فحص الفرش الأمامي (وش وظهر)", key: "التأكد من عدم وجود كسر وخدوش", severity: "V2" },
    { item: "فحص الفرش الخلفي (وش وظهر)", key: "التأكد من تثبيت الجريدة (عدد 9 كلبس تثبيت، 7 كلبس للفرش الأمامي)", severity: "V1" },
    { item: "فحص الفرش الخلفي (وش وظهر)", key: "التأكد من وجود عدد 3 لباد مانع صوت تحت الجريدة (2 للفرش الخلفي)", severity: "V3" },
    { item: "فحص الفرش الخلفي (وش وظهر)", key: "التأكد من عدم كسر دليل التثبيت", severity: "V1" },
    { item: "فحص الجزء الأوسط من الخلف", key: "التأكد من تثبيت الجزء الشبكي بعدد 8 مسمار", severity: "V1" },
    { item: "فحص الجزء الأوسط من الخلف", key: "التأكد من وجود عازل الصوت ببنز الجزء الأوسط", severity: "V3" },
  ],
};
const DEFAULT_POINTS = [
  { item: "⚠️ لا يوجد شيت فحص حقيقي لهذا الجزء بعد", key: "هذه نقاط عامة مؤقتة — ابعتلي شيت الفحص الأصلي (Item Check / Key Point) وهستبدلها ببنوده الحقيقية", severity: "V3" },
];



// ---------- Editable value with mandatory reason (BR-002 pattern) ----------
function EditableStat({ label, value, unit, onSave, tone = C.cyan }) {
  const [editing, setEditing] = useState(false);
  const [newVal, setNewVal] = useState(value);
  const [reason, setReason] = useState("");
  const [log, setLog] = useState([]);

  const save = () => {
    if (!reason.trim()) return;
    const entry = { from: value, to: newVal, reason, by: "م. أحمد رمضان", date: new Date().toLocaleDateString("en-GB") };
    setLog((l) => [entry, ...l]);
    onSave(newVal);
    setEditing(false);
    setReason("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <TrackedLabel>{label}</TrackedLabel>
        <div className="flex items-center gap-1.5">
          {log.length > 0 && <History size={11} color={C.textFaint} />}
          <button onClick={() => { setNewVal(value); setEditing(!editing); }} className="p-1 rounded" style={{ background: C.panelAlt }}>
            <Pencil size={11} color={C.textDim} />
          </button>
        </div>
      </div>
      {!editing ? (
        <div className="qm-mono font-semibold" style={{ color: tone, fontSize: 18 }}>{value} <span style={{ fontSize: 11, color: C.textFaint }}>{unit}</span></div>
      ) : (
        <div className="qm-fade space-y-2 p-2.5 rounded-lg" style={{ background: C.bg, border: `1px solid ${C.cyan}55` }}>
          <input type="number" value={newVal} onChange={(e) => setNewVal(e.target.value)}
            className="qm-mono w-full px-2 py-1.5 rounded text-sm outline-none" style={{ background: C.panelAlt, color: C.text, border: `1px solid ${C.line}` }} />
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="سبب التعديل (إجباري — BR-002)"
            className="qm-sans w-full px-2 py-1.5 rounded text-xs outline-none" style={{ background: C.panelAlt, color: C.text, border: `1px solid ${C.line}` }} />
          <div className="flex gap-2">
            <button onClick={save} disabled={!reason.trim()} className="flex-1 py-1.5 rounded qm-sans text-xs font-semibold"
              style={{ background: reason.trim() ? C.ok : C.line, color: reason.trim() ? "#06181D" : C.textFaint }}>حفظ</button>
            <button onClick={() => setEditing(false)} className="flex-1 py-1.5 rounded qm-sans text-xs" style={{ background: C.panelAlt, color: C.textDim, border: `1px solid ${C.line}` }}>إلغاء</button>
          </div>
        </div>
      )}
      {log.length > 0 && !editing && (
        <div className="mt-1.5 space-y-1">
          {log.map((e, i) => (
            <div key={i} className="qm-sans" style={{ fontSize: 10, color: C.textFaint }}>
              {e.from}→{e.to} · {e.reason} · {e.by} · {e.date}
            </div>
          ))}
        </div>
      )}
    </div>
    
  );
}

function RefImage({ label, tone, Icon }) {
  return (
    <div className="flex-1 rounded-lg flex flex-col items-center justify-center py-5 gap-1.5"
      style={{ background: C.bg, border: `1px dashed ${tone}55` }}>
      <Icon size={26} color={tone} strokeWidth={1.4} />
      <TrackedLabel color={tone}>{label}</TrackedLabel>
    </div>
    
  );
}

function DispositionRow({ point, value, onChange }) {
  const options = [
    { key: "OK", label: "OK", tone: C.ok, toneDim: C.okDim, Icon: CheckCircle2 },
    { key: "REJECT", label: "مرفوض", tone: C.crit, toneDim: C.critDim, Icon: XCircle },
    { key: "CONCESSION", label: "مقبول بتجاوز", tone: C.gold, toneDim: "#332A14", Icon: ShieldAlert },
  ];
  return (
    <Panel className="p-3.5" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
      <div className="flex items-start gap-2 mb-3">
        <SeverityDot level={point.severity} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="qm-sans font-medium" style={{ color: C.text, fontSize: 13.5 }}>{point.item}</span>
            <TrackedLabel color={point.severity === "V1" ? C.crit : point.severity === "V2" ? C.warn : C.textFaint}>{point.severity}</TrackedLabel>
          </div>
          <p className="qm-sans mt-0.5" style={{ color: C.textDim, fontSize: 11.5, lineHeight: 1.55 }}>{point.key}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((o) => (
          <button key={o.key} onClick={() => onChange(o.key)}
            className="py-2 rounded-lg qm-sans text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            style={value === o.key ? { background: o.toneDim, color: o.tone, border: `1px solid ${o.tone}` } : { background: C.panelAlt, color: C.textFaint, border: `1px solid ${C.line}` }}>
            <o.Icon size={13} /> {o.label}
          </button>
        ))}
      </div>
    </Panel>
  );
}

function InspectionSheetBrowser({ typeFilter, isMobile, partsList }) {
  const [query, setQuery] = useState("");
  const safeParts = partsList && partsList.length > 0 ? partsList : PARTS_LIST;
  const scoped = typeFilter ? safeParts.filter((p) => (typeFilter === "CKD" ? p.supplier.includes("CKD") : !p.supplier.includes("CKD"))) : safeParts;
  const [selectedId, setSelectedId] = useState(scoped[0]?.id || 3);
  const [disp, setDisp] = useState({});

  const filtered = scoped.filter((p) => p.name.includes(query) || p.pn.includes(query) || p.supplier.includes(query));
  const selected = scoped.find((p) => p.id === selectedId) || scoped[0];
  const points = SHEET_POINTS[selected.id] || DEFAULT_POINTS;

  const setPointDisp = (idx, val) => setDisp((d) => ({ ...d, [idx]: val }));
  const counts = points.reduce((acc, _, i) => { const v = disp[i]; if (v) acc[v] = (acc[v] || 0) + 1; return acc; }, {});

  const selectPart = (id) => { setSelectedId(id); setDisp({}); };

  const PartsListPanel = () => (
    <div style={!isMobile ? { borderLeft: `1px solid ${C.line}`, background: C.panelAlt, maxHeight: 640 } : { background: C.panelAlt }} className="flex flex-col">
      <div className="p-3" style={{ borderBottom: `1px solid ${C.line}` }}>
        <TrackedLabel color={C.text}>قائمة الأجزاء ({filtered.length})</TrackedLabel>
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث بالاسم / الرقم / المورّد..."
          className="qm-sans w-full mt-2 px-3 py-2 rounded-lg text-xs outline-none"
          style={{ background: C.bg, color: C.text, border: `1px solid ${C.line}` }}
        />
      </div>
      {isMobile ? (
        <div className="flex gap-2 p-2.5 overflow-x-auto">
          {filtered.map((p) => (
            <button key={p.id} onClick={() => selectPart(p.id)}
              className="qm-sans shrink-0 px-3 py-2 rounded-lg whitespace-nowrap text-right relative"
              style={selectedId === p.id ? { background: C.cyanDim, color: C.cyan, border: `1px solid ${C.cyan}66` } : { background: C.bg, color: C.textDim, border: `1px solid ${C.line}` }}>
              {p.real && <Circle size={5} fill={C.ok} color="transparent" className="absolute top-1.5 left-1.5" />}
              <div style={{ fontSize: 11.5 }}>{p.name}</div>
              <div className="qm-mono" style={{ fontSize: 9.5, opacity: 0.7 }}>{p.pn}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          {filtered.map((p) => (
            <button key={p.id} onClick={() => selectPart(p.id)}
              className="w-full text-right px-3.5 py-3 transition-colors relative"
              style={{
                background: selectedId === p.id ? C.cyanDim : "transparent",
                borderBottom: `1px solid ${C.line}`,
                borderRight: selectedId === p.id ? `3px solid ${C.cyan}` : "3px solid transparent",
              }}>
              {p.real && <Circle size={5} fill={C.ok} color="transparent" className="absolute top-3 left-3" />}
              <div className="qm-sans font-medium" style={{ color: selectedId === p.id ? C.cyan : C.text, fontSize: 12.5 }}>{p.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="qm-mono" style={{ color: C.textFaint, fontSize: 10 }}>{p.pn}</span>
                <span className="qm-sans" style={{ color: C.textFaint, fontSize: 10.5 }}>· {p.supplier}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Panel className="overflow-hidden">
      {isMobile ? (
        <div className="flex flex-col">
          <PartsListPanel />
          <div style={{ borderTop: `1px solid ${C.line}` }} />
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "260px 1fr" }}>
          <PartsListPanel />
          <div className="p-6 qm-fade" key={selectedId}>
            <SheetBody selected={selected} counts={counts} points={points} disp={disp} setPointDisp={setPointDisp} />
          </div>
        </div>
      )}
      {isMobile && (
        <div className="p-4 qm-fade" key={selectedId}>
          <SheetBody selected={selected} counts={counts} points={points} disp={disp} setPointDisp={setPointDisp} mobile />
        </div>
      )}
    </Panel>
  );
}

function SheetBody({ selected, counts, points, disp, setPointDisp, mobile }) {
  const defaultRate = selected.important === "A" ? 100 : 20;
  const [samplingRate, setSamplingRate] = useState(defaultRate);

  return (
    <>
      <div className={mobile ? "mb-4" : "flex items-center justify-between mb-4"}>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge tone={selected.important === "A" ? "crit" : "default"}>IMPORTANT PART · {selected.important}</Badge>
            <Badge tone="default">{selected.model}</Badge>
          </div>
          <h2 className="qm-sans font-bold" style={{ color: C.text, fontSize: mobile ? 16 : 18 }}>{selected.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="qm-mono" style={{ color: C.cyan, fontSize: 12.5 }}>{selected.pn}</span>
            <span className="qm-sans" style={{ color: C.textFaint, fontSize: 12 }}>مورّد: {selected.supplier}</span>
          </div>
        </div>
        <div className={mobile ? "flex items-center gap-2 mt-3" : "flex items-center gap-2"}>
          <Badge tone="ok">{counts.OK || 0} OK</Badge>
          <Badge tone="warn">{counts.CONCESSION || 0} بتجاوز</Badge>
          <Badge tone="crit">{counts.REJECT || 0} مرفوض</Badge>
        </div>
      </div>

      <Panel className="p-3.5 mb-5" style={{ background: C.bg, border: `1px solid ${C.line}`, maxWidth: mobile ? "100%" : 260 }}>
        <EditableStat label="نسبة الفحص (BR-002)" value={samplingRate} unit="%" onSave={setSamplingRate} tone={samplingRate === 100 ? C.crit : C.cyan} />
      </Panel>

      <div className="flex gap-3 mb-5">
        <RefImage label="نموذج OK مرجعي" tone={C.ok} Icon={CheckCircle2} />
        <RefImage label="نموذج NG مرجعي" tone={C.crit} Icon={XCircle} />
      </div>

      <div className="space-y-2.5" style={!mobile ? { maxHeight: 280, overflowY: "auto" } : {}}>
        {points.map((pt, i) => (
          <DispositionRow key={i} point={pt} value={disp[i]} onChange={(v) => setPointDisp(i, v)} />
        ))}
      </div>
  );
}


// ============================================================
// SECTION 5 — DPHU (VES-based, split by V1/V2/V3)
// ============================================================
const DPHU_ROWS = [
  { chassis: "N17-0091823", v1: 0, v2: 1, v3: 2 },
  { chassis: "N17-0091824", v1: 1, v2: 0, v3: 1 },
  { chassis: "N17-0091825", v1: 0, v2: 2, v3: 3 },
  { chassis: "N17-0091826", v1: 0, v2: 0, v3: 1 },
  { chassis: "N17-0091827", v1: 1, v2: 1, v3: 0 },
];
const DPHU_CAUSES = [
  { cat: "TOOL", pct: 34 }, { cat: "EQUIPMENTS", pct: 26 }, { cat: "PARTS", pct: 21 },
  { cat: "JOB ALLOCATION", pct: 12 }, { cat: "FACILITY", pct: 7 },
];

function DPHUScreen() {
  const totalV1 = DPHU_ROWS.reduce((s, r) => s + r.v1, 0);
  const totalV2 = DPHU_ROWS.reduce((s, r) => s + r.v2, 0);
  const totalV3 = DPHU_ROWS.reduce((s, r) => s + r.v3, 0);
  const [target, setTarget] = useState(15);
  return (
    <Panel className="p-6">
      <div className="flex items-start justify-between mb-1">
        <TrackedLabel color={C.text}>DPHU — من VES (Vehicle Evaluation Sheet)</TrackedLabel>
        <Panel className="p-2.5" style={{ background: C.bg, border: `1px solid ${C.line}`, width: 150 }}>
          <EditableStat label="الهدف الشهري" value={target} unit="عيب/100" onSave={setTarget} tone={C.gold} />
        </Panel>
      </div>
      <div className="grid grid-cols-3 gap-4 my-5">
        <Gauge_ value={totalV1} max={20} label="إجمالي V1" unit="عيب" tone="crit" size={104} />
        <Gauge_ value={totalV2} max={20} label="إجمالي V2" unit="عيب" tone="warn" size={104} />
        <Gauge_ value={totalV3} max={20} label="إجمالي V3" unit="عيب" tone="cyan" size={104} />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <Panel className="col-span-7 p-4" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
          <TrackedLabel>سجل السيارات (Chassis No.)</TrackedLabel>
          <div className="mt-3">
            <div className="grid grid-cols-4 gap-2 pb-2" style={{ borderBottom: `1px solid ${C.line}` }}>
              {["Chassis", "V1", "V2", "V3"].map((h) => <TrackedLabel key={h}>{h}</TrackedLabel>)}
            </div>
            {DPHU_ROWS.map((r) => (
              <div key={r.chassis} className="grid grid-cols-4 gap-2 py-2 qm-mono" style={{ fontSize: 12, borderBottom: `1px solid ${C.line}` }}>
                <span style={{ color: C.text }}>{r.chassis}</span>
                <span style={{ color: r.v1 ? C.crit : C.textFaint }}>{r.v1}</span>
                <span style={{ color: r.v2 ? C.warn : C.textFaint }}>{r.v2}</span>
                <span style={{ color: r.v3 ? C.cyan : C.textFaint }}>{r.v3}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="col-span-5 p-4" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
          <TrackedLabel>توزيع السبب الجذري (5 فئات)</TrackedLabel>
          <div className="mt-3 space-y-2.5">
            {DPHU_CAUSES.map((c) => (
              <div key={c.cat} className="flex items-center gap-2">
                <span className="qm-sans w-28 shrink-0" style={{ color: C.text, fontSize: 11.5 }}>{c.cat}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: C.line }}>
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: C.cyan }} />
                </div>
                <span className="qm-mono w-9 text-right" style={{ color: C.textDim, fontSize: 11 }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Panel>
  );
}

// ============================================================
// SECTION 6 — PPM
// ============================================================
function PPMScreen() {
  const [target, setTarget] = useState(150);
  return (
    <Panel className="p-6">
      <TrackedLabel color={C.text}>PPM — (كمية NG ÷ إجمالي الكمية المورَّدة شهرياً) × 1,000,000</TrackedLabel>
      <div className="flex items-center justify-around my-5 flex-wrap gap-5">
        <Gauge_ value={112} max={300} label="PPM الإجمالي هذا الشهر" unit="PPM" tone="ok" />
        <Panel className="p-3" style={{ background: C.bg, border: `1px solid ${C.line}`, width: 150 }}>
          <EditableStat label="الهدف الشهري" value={target} unit="PPM" onSave={setTarget} tone={C.gold} />
        </Panel>
      </div>
      <Panel className="p-4" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
        <TrackedLabel>PPM لكل مورّد</TrackedLabel>
        <div className="mt-2">
          {SUPPLIERS.map((s) => <RiskBar key={s.name} name={s.name} risk={Math.round((s.ppm / 400) * 100)} ppm={s.ppm} />)}
        </div>
      </Panel>
    </Panel>
  );
}

// ============================================================
// SECTION 7 — أعطال الإنتاج (MCDR Cost Tracking)
// ============================================================
const MCDR_ROWS = [
  { part: "فرش الشنطة الخلفية", price: 145, w1: 2, w2: 1, w3: 3, w4: 0 },
  { part: "ماسورة الفرامل", price: 60, w1: 5, w2: 4, w3: 2, w4: 3 },
  { part: "BLOWER ASSY-AC", price: 210, w1: 1, w2: 0, w3: 1, w4: 1 },
];
function FaultsScreen() {
  const rows = MCDR_ROWS.map((r) => ({ ...r, cost: r.price * (r.w1 + r.w2 + r.w3 + r.w4) }));
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const target = 12000, commitment = 15000;
  return (
    <Panel className="p-6">
      <TrackedLabel color={C.text}>أعطال الإنتاج — تكلفة MCDR الأسبوعية (COPQ)</TrackedLabel>
      <div className="flex items-center justify-around my-5 flex-wrap gap-4">
        <Gauge_ value={totalCost} max={commitment} label="التكلفة الفعلية هذا الشهر" unit="EGP" tone={totalCost > target ? "warn" : "ok"} />
        <Gauge_ value={target} max={commitment} label="Target" unit="EGP" tone="cyan" />
        <Gauge_ value={commitment} max={commitment} label="Commitment" unit="EGP" tone="crit" />
      </div>
      <Panel className="p-4" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
        <div className="grid grid-cols-7 gap-2 pb-2" style={{ borderBottom: `1px solid ${C.line}` }}>
          {["الجزء", "السعر", "W1", "W2", "W3", "W4", "التكلفة"].map((h) => <TrackedLabel key={h}>{h}</TrackedLabel>)}
        </div>
        {rows.map((r) => (
          <div key={r.part} className="grid grid-cols-7 gap-2 py-2.5 items-center" style={{ borderBottom: `1px solid ${C.line}` }}>
            <span className="qm-sans" style={{ color: C.text, fontSize: 12 }}>{r.part}</span>
            <span className="qm-mono" style={{ color: C.textDim, fontSize: 11.5 }}>{r.price}</span>
            <span className="qm-mono" style={{ color: C.textDim, fontSize: 11.5 }}>{r.w1}</span>
            <span className="qm-mono" style={{ color: C.textDim, fontSize: 11.5 }}>{r.w2}</span>
            <span className="qm-mono" style={{ color: C.textDim, fontSize: 11.5 }}>{r.w3}</span>
            <span className="qm-mono" style={{ color: C.textDim, fontSize: 11.5 }}>{r.w4}</span>
            <span className="qm-mono font-semibold" style={{ color: C.gold, fontSize: 12 }}>{r.cost} EGP</span>
          </div>
        ))}
      </Panel>
    </Panel>
  );
}

// ============================================================
// SECTION 8 — أودت سبلاير (Supplier Audit Report — real format)
// ============================================================
const AUDIT_FINDINGS = [
  { n: 1, summary: "لا يوجد سجل معايرة محدَّث لأدوات القياس بالمحطة 3", action: "تحديث سجل المعايرة + خطة دورية", due: "2026-08-01" },
  { n: 2, summary: "غياب لوحة Poka-yoke عند نقطة التجميع النهائي", action: "تركيب نظام كشف تلقائي", due: "2026-08-15" },
  { n: 3, summary: "عدم وجود دليل PSW موثّق لآخر تغيير هندسي", action: "استكمال مستندات PSW خلال أسبوعين", due: "2026-07-30" },
];
// ============================================================
// SECTION 4 — فحص الموردين (Supplier Audit Visit Protocol — BR-019, real)
// ============================================================
const VISIT_STEPS = [
  { n: 1, title: "إخطار مسبق", detail: "يُرسل قبل الزيارة بأسبوع على الأقل — يحدد تاريخ التفتيش ونطاق نقاط التفتيش المستهدفة." },
  { n: 2, title: "الدخول والاستقبال", detail: "لقاء مدير الجودة عند المورد أو أي مسؤول جودة مكلَّف." },
  { n: 3, title: "تغطية الزيارة", detail: "5S · مراقبة الإنتاج والفنيين على الخط · مطابقة تطبيق الـ Standard فعلياً · تحقق ميداني من تنفيذ حل أي PIR سابق على أرض الواقع." },
  { n: 4, title: "التوثيق الفوري", detail: "كل ملاحظة تُسجَّل في شيت أثناء الزيارة نفسها، مع مراجعة تقارير الفحص والعيوب المرتبطة." },
  { n: 5, title: "الاجتماع الختامي", detail: "عرض المخالفات والملاحظات على المورد قبل مغادرة الموقع." },
  { n: 6, title: "Re-audit", detail: "موعد متابعة يُحدَّد في محضر الاجتماع للتأكد من إصلاح المشاكل." },
  { n: 7, title: "التقرير النهائي", detail: "يُعرض على المدير المباشر بنتيجة الزيارة والبنود المطلوب تحسينها." },
];

function SourceInspectionScreen() {
  const [active, setActive] = useState(0);
  const [notes, setNotes] = useState({});
  const setNote = (i, v) => setNotes((n) => ({ ...n, [i]: v }));

  return (
    <Panel className="p-6">
      <div className="flex items-center justify-between mb-1">
        <TrackedLabel color={C.text}>بروتوكول زيارة تدقيق المورد (BR-019)</TrackedLabel>
        <Badge tone="ok">✅ مؤكَّد من الممارسة الفعلية</Badge>
      </div>
      <p className="qm-sans mt-1 mb-5" style={{ color: C.textDim, fontSize: 12 }}>المورّد: Auto Cool · تاريخ الإخطار: 2026-07-11 · تاريخ الزيارة: 2026-07-18</p>

      <div className="space-y-2.5">
        {VISIT_STEPS.map((s, i) => {
          const isActive = active === i;
          const done = notes[i] !== undefined && notes[i] !== "";
          return (
            <Panel key={s.n} className="p-4" style={{ background: C.bg, border: `1px solid ${isActive ? C.cyan + "66" : C.line}` }}>
              <button onClick={() => setActive(isActive ? -1 : i)} className="w-full flex items-start gap-3 text-right">
                <div className="w-7 h-7 rounded-full flex items-center justify-center qm-mono text-xs shrink-0"
                  style={done ? { background: C.okDim, color: C.ok, border: `1px solid ${C.ok}` } : { background: C.panelAlt, color: C.textDim, border: `1px solid ${C.line}` }}>
                  {done ? <CheckCircle2 size={14} /> : s.n}
                </div>
                <div className="flex-1">
                  <span className="qm-sans font-medium" style={{ color: C.text, fontSize: 13.5 }}>{s.title}</span>
                  <p className="qm-sans mt-0.5" style={{ color: C.textDim, fontSize: 11.5, lineHeight: 1.6 }}>{s.detail}</p>
                </div>
              </button>
              {isActive && (
                <textarea
                  value={notes[i] || ""} onChange={(e) => setNote(i, e.target.value)}
                  placeholder="ملاحظات الزيارة لهذه الخطوة..."
                  className="qm-sans w-full mt-3 px-3 py-2.5 rounded-lg text-xs outline-none qm-fade"
                  rows={3}
                  style={{ background: C.panelAlt, color: C.text, border: `1px solid ${C.cyan}55` }}
                />
              )}
            </Panel>
          );
        })}
      </div>
    </Panel>
  );
}

function AuditScreen() {
  return (
    <Panel className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <TrackedLabel color={C.text}>SUPPLIER AUDIT REPORT — تقرير مراجعة الموردين</TrackedLabel>
          <p className="qm-sans mt-1" style={{ color: C.textDim, fontSize: 12 }}>المورّد: Auto Cool · السبب: تكرار عيوب (BR-012) · المراجع: م. أحمد رمضان</p>
        </div>
        <Badge tone="warn">توصية Audit نشطة</Badge>
      </div>
      <Panel className="p-4" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
        <div className="grid grid-cols-12 gap-2 pb-2" style={{ borderBottom: `1px solid ${C.line}` }}>
          <TrackedLabel>#</TrackedLabel>
          <span className="col-span-6"><TrackedLabel>ملخص المراجعة</TrackedLabel></span>
          <span className="col-span-4"><TrackedLabel>الإجراءات المطلوبة</TrackedLabel></span>
          <TrackedLabel>الموعد</TrackedLabel>
        </div>
        {AUDIT_FINDINGS.map((f) => (
          <div key={f.n} className="grid grid-cols-12 gap-2 py-3 items-start" style={{ borderBottom: `1px solid ${C.line}` }}>
            <span className="qm-mono" style={{ color: C.textFaint, fontSize: 12 }}>{f.n}</span>
            <span className="col-span-6 qm-sans" style={{ color: C.text, fontSize: 12 }}>{f.summary}</span>
            <span className="col-span-4 qm-sans" style={{ color: C.textDim, fontSize: 12 }}>{f.action}</span>
            <span className="qm-mono" style={{ color: C.warn, fontSize: 11 }}>{f.due}</span>
          </div>
        ))}
      </Panel>
    </Panel>
  );
}

// ============================================================
// SECTION 9 — الكايزن و5S
// ============================================================
const KAIZEN_ITEMS = [
  { title: "تقليل Secondary Scratch عند نقطة التحميل", s: 8, q: 9, c: 7, e: 6 },
  { title: "تعديل ارتفاع طاولة الفحص لتقليل إجهاد المفتش", s: 9, q: 5, c: 4, e: 10 },
];
const FIVE_S_STATIONS = [
  { station: "TOP COAT", planned: 90, actual: 84 },
  { station: "TOUCH UP", planned: 90, actual: 91 },
  { station: "SEALER", planned: 85, actual: 78 },
];
function KaizenScreen() {
  return (
    <div className="grid grid-cols-12 gap-5">
      <Panel className="col-span-7 p-5">
        <TrackedLabel color={C.text}>الكايزن — تقييم SQCE</TrackedLabel>
        <div className="mt-3 space-y-3">
          {KAIZEN_ITEMS.map((k, i) => {
            const overall = Math.round(((k.s + k.q + k.c + k.e) / 40) * 100);
            return (
              <Panel key={i} className="p-4" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="qm-sans font-medium" style={{ color: C.text, fontSize: 13 }}>{k.title}</span>
                  <Badge tone={overall > 75 ? "ok" : "warn"}>{overall}%</Badge>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[["Safety", k.s], ["Quality", k.q], ["Cost", k.c], ["Ergonomics", k.e]].map(([l, v]) => (
                    <div key={l} className="text-center">
                      <div className="qm-mono font-semibold" style={{ color: C.cyan, fontSize: 14 }}>{v}/10</div>
                      <TrackedLabel>{l}</TrackedLabel>
                    </div>
                  ))}
                </div>
              </Panel>
            );
          })}
        </div>
      </Panel>
      <Panel className="col-span-5 p-5">
        <TrackedLabel color={C.text}>متابعة 5S بالمحطات</TrackedLabel>
        <div className="mt-3 space-y-3">
          {FIVE_S_STATIONS.map((s) => (
            <div key={s.station}>
              <div className="flex justify-between mb-1">
                <span className="qm-sans" style={{ color: C.text, fontSize: 12 }}>{s.station}</span>
                <span className="qm-mono" style={{ color: s.actual >= s.planned ? C.ok : C.warn, fontSize: 11 }}>{s.actual}/{s.planned}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: C.line }}>
                <div className="h-full rounded-full" style={{ width: `${s.actual}%`, background: s.actual >= s.planned ? C.ok : C.warn }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
    
  );
}

// ============================================================
// Placeholder (genuinely not built yet — honest state)
// ============================================================
function ComingSoon({ label, note }) {
  return (
    <Panel className="p-16 flex flex-col items-center justify-center text-center">
      <Construction size={34} color={C.textFaint} className="mb-3" />
      <span className="qm-sans font-medium" style={{ color: C.text, fontSize: 15 }}>{label}</span>
      <p className="qm-sans mt-2 max-w-md" style={{ color: C.textFaint, fontSize: 12.5, lineHeight: 1.6 }}>{note}</p>
    </Panel>
  );
}

export default function QualityMindMockup() {
  const [liveParts, setLiveParts] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginRes = await api.post('/auth/login', { email: 'admin@nissan.com.eg', password: 'Admin@123' });
        const token = loginRes.data.access_token;
        const partsRes = await api.get('/parts', { headers: { Authorization: `Bearer ${token}` } });
        if (partsRes.data && partsRes.data.length > 0) {
          const mapped = partsRes.data.map(p => ({
            id: p.id,
            name: p.partName,
            pn: p.partNumber,
            supplier: p.supplier?.name || 'Real Supplier',
            code: 'API',
            model: 'N17',
            important: p.importantPartClass || 'A',
            real: true
          }));
          setLiveParts(mapped);
        }
      } catch (e) { console.error("Error fetching live data", e); }
    };
    fetchData();
  }, []);

  const [realParts, setRealParts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginRes = await fetch('https://qualitymind-mvp.onrender.com/api/auth/login', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email: 'admin@nissan.com.eg', password: 'Admin@123'})
        });
        const loginData = await loginRes.json();
        const token = loginData.access_token;

        const partsRes = await fetch('https://qualitymind-mvp.onrender.com/api/parts', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const partsData = await partsRes.json();
        alert('رد السيرفر: ' + JSON.stringify(partsData));
        if (Array.isArray(partsData) && partsData.length > 0) {
          const mapped = partsData.map((p) => ({
            id: p.id,
            name: p.partName,
            pn: p.partNumber,
            supplier: p.supplier?.name || 'Real Supplier',
            code: 'API',
            model: 'N17',
            important: p.importantPartClass || 'B',
            real: true
          }));
          setRealParts(mapped);
        }
      } catch (e) {
        console.error("API Error", e);
      }
    };
    fetchData();
  }, []);

  
  

  const [section, setSection] = useState("local");
  const isMobile = useIsMobile();

  const SECTIONS = [
    { id: "local", n: 1, label: "فحص أجزاء اللوكال", icon: ClipboardList },
    { id: "ckd", n: 2, label: "فحص أجزاء CKD", icon: PackageCheck },
    { id: "line", n: 3, label: "مشاكل خط الإنتاج", icon: AlertTriangle },
    { id: "supplier-insp", n: 4, label: "فحص الموردين", icon: Factory },
    { id: "dphu", n: 5, label: "DPHU", icon: Gauge },
    { id: "ppm", n: 6, label: "PPM", icon: TrendingDown },
    { id: "faults", n: 7, label: "أعطال الإنتاج", icon: Wrench },
    { id: "audit", n: 8, label: "أودت سبلاير", icon: ShieldAlert },
    { id: "kaizen5s", n: 9, label: "الكايزن و5S", icon: Sparkles },
  ];

  const READY = new Set(["local", "ckd", "line", "supplier-insp", "dphu", "ppm", "faults", "audit", "kaizen5s"]);

  const renderContent = () => {
    switch (section) {
      case "local": return <InspectionSheetBrowser typeFilter="Local" isMobile={isMobile} partsList={liveParts} />;
      case "ckd": return <InspectionSheetBrowser typeFilter="CKD" isMobile={isMobile} partsList={liveParts} />;
      case "line": return <ContainmentScreen />;
      case "supplier-insp": return <SourceInspectionScreen />;
      case "dphu": return <DPHUScreen />;
      case "ppm": return <PPMScreen />;
      case "faults": return <FaultsScreen />;
      case "audit": return <AuditScreen />;
      case "kaizen5s": return <KaizenScreen />;
      default: return null;
    }
  };

  const Logo = () => (
    <div className="flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 30 30" fill="none" className="shrink-0">
        <circle cx="15" cy="15" r="13" stroke={C.cyan} strokeWidth="1.4" />
        <circle cx="15" cy="15" r="4.5" fill={C.cyan} />
        <line x1="15" y1="1" x2="15" y2="6" stroke={C.gold} strokeWidth="1.4" />
      </svg>
      <div>
        <div className="qm-sans font-bold" style={{ color: C.text, fontSize: 14 }}>QualityMind AI</div>
        <TrackedLabel color={C.gold}>NISSAN MOTOR EGYPT</TrackedLabel>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div dir="rtl" className="min-h-screen w-full flex flex-col" style={{ background: "#05070A" }}>
        <FontImport />
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ background: C.panel, borderBottom: `1px solid ${C.line}` }}>
          <Logo />
          <div className="flex flex-col items-end">
            <span className="w-1.5 h-1.5 rounded-full mb-1" style={{ background: C.ok, boxShadow: `0 0 6px ${C.ok}` }} />
            <span className="qm-sans" style={{ color: C.cyan, fontSize: 10 }}>م. عصام أبو زيد</span>
          </div>
        </div>
        {/* Horizontal scroll strip of sections */}
        <div className="flex gap-2 px-3 py-2.5 overflow-x-auto shrink-0" style={{ background: C.panel, borderBottom: `1px solid ${C.line}` }}>
          {SECTIONS.map((s) => {
            const active = section === s.id;
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                className="qm-sans shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap"
                style={active ? { background: C.cyanDim, color: C.cyan, border: `1px solid ${C.cyan}66` } : { background: C.panelAlt, color: C.textDim, border: `1px solid ${C.line}` }}>
                <span className="qm-mono" style={{ fontSize: 10, opacity: 0.7 }}>{s.n}</span>
                <s.icon size={13} />
                <span style={{ fontSize: 12 }}>{s.label}</span>
              </button>
            );
          })}
        </div>
        {/* Content */}
        <div className="flex-1 p-3 overflow-y-auto qm-fade" key={section}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen w-full flex" style={{ background: "#05070A" }}>
      <FontImport />
      {/* Vertical sidebar — desktop */}
      <div className="shrink-0 flex flex-col py-6 px-3" style={{ width: 232, background: C.panel, borderLeft: `1px solid ${C.line}` }}>
        <div className="px-2 mb-7"><Logo /></div>
        <div className="flex flex-col gap-1">
          {SECTIONS.map((s) => {
            const active = section === s.id;
            const ready = READY.has(s.id);
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                className="qm-sans w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-right transition-colors relative"
                style={active ? { background: C.cyanDim, color: C.cyan, border: `1px solid ${C.cyan}55` } : { color: ready ? C.textDim : C.textFaint, border: `1px solid transparent` }}>
                <span className="qm-mono shrink-0" style={{ fontSize: 10.5, opacity: 0.7 }}>{s.n}</span>
                <s.icon size={15} />
                <span className="flex-1" style={{ fontSize: 12.5 }}>{s.label}</span>
                {!ready && <Circle size={5} fill={C.textFaint} color="transparent" />}
              </button>
            );
          })}
        </div>
        <div className="mt-auto px-2 pt-4 space-y-3" style={{ borderTop: `1px solid ${C.line}` }}>
          <div className="flex flex-col gap-1 p-2.5 rounded-lg" style={{ background: C.panelAlt, border: `1px solid ${C.line}` }}>
            <TrackedLabel color={C.gold}>SYSTEM ARCHITECT</TrackedLabel>
            <span className="qm-sans font-semibold" style={{ color: C.cyan, fontSize: 12 }}>م. عصام أبو زيد</span>
          </div>
          <div className="flex items-center gap-2 px-1">
            <button onClick={async () => {
  try {
    const res = await fetch('https://qualitymind-mvp.onrender.com/api/auth/login', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: 'admin@nissan.com.eg', password: 'Admin@123'})
    });
    if(res.ok) alert('✅ متصل بالسيرفر الحقيقي بنجاح!');
    else alert('❌ فشل الاتصال: ' + res.status);
  } catch(e) { alert('❌ السيرفر صاحي؟'); }
}} className="qm-sans text-xs px-2 py-1 rounded" style={{ background: C.okDim, color: C.ok, border: `1px solid ${C.ok}55` }}>
  اختبار الاتصال
</button>
            <span className="qm-sans" style={{ color: C.ok, fontSize: 11 }}>النظام متصل</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-7 overflow-y-auto">
        <div className="max-w-6xl mx-auto qm-fade" key={section}>
          {renderContent()}
        </div>
      </div>
    </div>
    
  );
}

