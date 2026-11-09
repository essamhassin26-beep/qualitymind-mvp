import React, { useState, useEffect } from "react";
import {
  QrCode, Camera, AlertTriangle, CheckCircle2, XCircle,
  Factory, Gauge, Wrench, ClipboardList, ArrowLeft, Circle,
  Lightbulb, ShieldAlert, ChevronLeft, ChevronRight as ChevronR,
  PackageCheck, ScanLine, TrendingUp, TrendingDown, Users, Sparkles, Construction, Pencil, History
} from "lucide-react";

const C = {
  bg: "#101317", panel: "#1A1F26", panelAlt: "#212832", bezel: "#2A323D",
  line: "#2C3540", cyan: "#4CC9E8", cyanDim: "#1E3A42", gold: "#C9A24B",
  text: "#EDF0F3", textDim: "#8B95A3", textFaint: "#5A6473",
  ok: "#34C77B", okDim: "#12291C", warn: "#E8A23B", warnDim: "#2E2311",
  crit: "#E5484D", critDim: "#2E1517",
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

function Panel({ children, className = "", style = {}, glow }: any) {
  return (
    <div className={`rounded-xl relative ${className}`} style={{
        background: `linear-gradient(180deg, ${C.panelAlt}, ${C.panel})`,
        border: `1px solid ${C.bezel}`,
        boxShadow: glow ? `0 0 0 1px ${C.line} inset, 0 8px 24px -8px rgba(0,0,0,0.6), 0 0 20px -4px ${glow}55` : `0 0 0 1px ${C.line} inset, 0 8px 24px -8px rgba(0,0,0,0.6)`,
        ...style,
      }}>
      {children}
    </div>
  );
}

function TrackedLabel({ children, color = C.textFaint }: any) {
  return <span className="qm-mono qm-tracked uppercase" style={{ color, fontSize: 10.5 }}>{children}</span>;
}

function Gauge_({ value, max, label, unit, tone = "cyan", size = 122 }: any) {
  const pct = Math.min(1, value / max);
  const r = 46;
  const cKm = 2 * Math.PI * r;
  const offset = cKm * (1 - pct);
  const toneColor = { cyan: C.cyan, ok: C.ok, warn: C.warn, crit: C.crit }[tone as keyof typeof C] || C.cyan;
  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke={C.line} strokeWidth="7" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={toneColor} strokeWidth="7" strokeDasharray={cKm} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s", filter: `drop-shadow(0 0 4px ${toneColor}88)` }} />
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

function Badge({ children, tone = "default" }: any) {
  const map = { default: { bg: C.panelAlt, color: C.textDim, border: C.line }, cyan: { bg: C.cyanDim, color: C.cyan, border: C.cyan }, crit: { bg: C.critDim, color: C.crit, border: C.crit }, warn: { bg: C.warnDim, color: C.warn, border: C.warn }, ok: { bg: C.okDim, color: C.ok, border: C.ok } };
  const t = map[tone as keyof typeof map];
  return <span className="qm-mono px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1" style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}55` }}>{children}</span>;
}

function SeverityDot({ level }: any) {
  const c = level === "V1" ? C.crit : level === "V2" ? C.warn : C.textFaint;
  return <span className="inline-block w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: c, boxShadow: `0 0 5px ${c}99` }} />;
}

function RiskBar({ name, risk, ppm }: any) {
  const tone = risk > 70 ? C.crit : risk > 40 ? C.warn : C.ok;
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: `1px solid ${C.line}` }}>
      <span className="qm-sans w-24 shrink-0 truncate" style={{ color: C.text, fontSize: 13 }}>{name}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: C.line }}>
        <div className="h-full rounded-full" style={{ width: `${risk}%`, background: tone }} />
      </div>
      <span className="qm-mono w-10 text-right" style={{ color: tone, fontSize: 12 }}>{risk}%</span>
    </div>
  );
}

const SUPPLIERS = [ { name: "Auto Cool", risk: 82, ppm: 340 }, { name: "GTI", risk: 61, ppm: 190 }, { name: "Idaco", risk: 34, ppm: 90 } ];
const PARTS_LIST = [
  { id: 1, name: "CARPET ASSY-FLOOR", pn: "749023AS1A", supplier: "GTI", code: "1344", model: "N17", important: "B", real: true },
  { id: 2, name: "BLOWER ASSY-AIR COND,FR", pn: "272105WV1A", supplier: "AUTO COOL", code: "280", model: "N17", important: "B", real: true },
];
const SHEET_POINTS: any = {
  1: [ { item: "فحص وش السجادة", key: "التأكد من عدم وجود كرمشة أو انثناء", severity: "V2" }, { item: "فحص وش السجادة", key: "التأكد من عدم وجود قطع", severity: "V2" } ],
  2: [ { item: "فحص البوابات", key: "التأكد من غلق وفتح البوابات", severity: "V1" }, { item: "فحص البوابات", key: "التأكد من عدم وجود انثناء", severity: "V1" } ],
};
const DEFAULT_POINTS = [ { item: "فحص عام", key: "فحص مطابقة العينة", severity: "V3" } ];

function InspectionSheetBrowser({ typeFilter, isMobile, partsList = PARTS_LIST }: any) {
  const sourceList = partsList && partsList.length > 0 ? partsList : PARTS_LIST;
  const [query, setQuery] = useState("");
  const scoped = typeFilter ? sourceList.filter((p: any) => (typeFilter === "CKD" ? p.supplier.includes("CKD") : !p.supplier.includes("CKD"))) : sourceList;
  const [selectedId, setSelectedId] = useState(scoped[0]?.id || 3);
  const [disp, setDisp] = useState({});

  const filtered = scoped.filter((p: any) => p.name.includes(query) || p.pn.includes(query));
  const selected = scoped.find((p: any) => p.id === selectedId) || scoped[0];
  const points = selected.checkPoints && selected.checkPoints.length > 0 ? selected.checkPoints : (SHEET_POINTS[selected.id] || DEFAULT_POINTS);
  const counts = points.reduce((acc: any, _: any, i: number) => { const v = disp[i]; if (v) acc[v] = (acc[v] || 0) + 1; return acc; }, {});

  const PartsListPanel = () => (
    <div style={!isMobile ? { borderLeft: `1px solid ${C.line}`, background: C.panelAlt, maxHeight: 640 } : { background: C.panelAlt }} className="flex flex-col">
      <div className="p-3" style={{ borderBottom: `1px solid ${C.line}` }}>
        <TrackedLabel color={C.text}>قائمة الأجزاء ({filtered.length})</TrackedLabel>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث..." className="qm-sans w-full mt-2 px-3 py-2 rounded-lg text-xs outline-none" style={{ background: C.bg, color: C.text, border: `1px solid ${C.line}` }} />
      </div>
      <div className="overflow-y-auto flex-1">
        {filtered.map((p: any) => (
          <button key={p.id} onClick={() => setSelectedId(p.id)} className="w-full text-right px-3.5 py-3 transition-colors" style={{ background: selectedId === p.id ? C.cyanDim : "transparent", borderBottom: `1px solid ${C.line}`, borderRight: selectedId === p.id ? `3px solid ${C.cyan}` : "3px solid transparent" }}>
            <div className="qm-sans font-medium" style={{ color: selectedId === p.id ? C.cyan : C.text, fontSize: 12.5 }}>{p.name}</div>
            <div className="qm-mono" style={{ color: C.textFaint, fontSize: 10 }}>{p.pn}</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Panel className="overflow-hidden">
      <div className="grid" style={{ gridTemplateColumns: isMobile ? "1fr" : "260px 1fr" }}>
        <PartsListPanel />
        {selected && (
          <div className="p-6 qm-fade">
            <div className="mb-4">
              <Badge tone={selected.important === "A" ? "crit" : "default"}>IMPORTANT PART · {selected.important}</Badge>
              <h2 className="qm-sans font-bold mt-2" style={{ color: C.text, fontSize: 18 }}>{selected.name}</h2>
              <div className="qm-mono" style={{ color: C.cyan, fontSize: 12.5 }}>{selected.pn}</div>
            </div>
            <div className="space-y-2.5">
              {points.map((pt: any, i: number) => (
                <Panel key={i} className="p-3.5" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
                  <div className="flex items-start gap-2 mb-3">
                    <SeverityDot level={pt.severity} />
                    <span className="qm-sans flex-1" style={{ color: C.text, fontSize: 13.5 }}>{pt.item}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["OK", "REJECT", "CONCESSION"].map(v => (
                      <button key={v} onClick={() => setDisp({...disp, [i]: v})} className="py-2 rounded-lg qm-sans text-xs" style={disp[i] === v ? { background: C.cyanDim, color: C.cyan, border: `1px solid ${C.cyan}` } : { background: C.panelAlt, color: C.textFaint, border: `1px solid ${C.line}` }}>{v}</button>
                    ))}
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

export default function QualityMindMockup() {
  const [section, setSection] = useState("local");
  const isMobile = useIsMobile();
  const [liveParts, setLiveParts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginRes = await fetch('https://qualitymind-mvp.onrender.com/api/auth/login', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email: 'admin@nissan.com.eg', password: 'Admin@123'})
        });
        const loginData = await loginRes.json();
        const partsRes = await fetch('https://qualitymind-mvp.onrender.com/api/parts', {
          headers: { 'Authorization': 'Bearer ' + loginData.access_token }
        });
        const partsData = await partsRes.json();
        if (Array.isArray(partsData) && partsData.length > 0) {
          setLiveParts(partsData.map((p: any) => ({
            id: p.id, name: p.partName, pn: p.partNumber,
            supplier: p.supplier?.name || 'Real Supplier', code: 'API', model: 'N17', important: p.importantPartClass || 'B', real: true
          })));
        }
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

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

    const renderContent = () => {
    switch (section) {
      case "local": return <InspectionSheetBrowser typeFilter="Local" isMobile={isMobile} partsList={liveParts} />;
      case "ckd": return <InspectionSheetBrowser typeFilter="CKD" isMobile={isMobile} partsList={liveParts} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center qm-fade" dir="rtl">
          <Construction size={48} color={C.gold} className="mb-4" />
          <h2 className="qm-sans font-bold text-2xl mb-2" style={{ color: C.text }}>قيد التطوير</h2>
          <p className="qm-sans text-sm" style={{ color: C.textDim }}>هذا القسم سيتم ربطه بالبيانات الحقيقية في التحديث القادم.</p>
        </div>
      );
    }
  };

  return (
    <div dir="rtl" className="min-h-screen w-full flex" style={{ background: "#05070A" }}>
      <FontImport />
      <div className="shrink-0 flex flex-col py-6 px-3" style={{ width: 232, background: C.panel, borderLeft: `1px solid ${C.line}` }}>
        <div className="px-2 mb-7"><Logo /></div>
        <div className="flex flex-col gap-1">
          {SECTIONS.map((s) => {
            const active = section === s.id;
            return (
              <button key={s.id} onClick={() => setSection(s.id)} className="qm-sans w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-right" style={active ? { background: C.cyanDim, color: C.cyan, border: `1px solid ${C.cyan}55` } : { color: C.textDim }}>
                <span className="qm-mono text-xs opacity-70">{s.n}</span>
                <s.icon size={15} />
                <span className="flex-1 text-xs">{s.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-auto px-2 pt-4 border-t border-slate-700">
           <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <TrackedLabel color={C.gold}>SYSTEM ARCHITECT</TrackedLabel>
            <span className="qm-sans font-semibold text-cyan-400 text-xs">م. عصام أبو زيد</span>
          </div>
        </div>
      </div>
      <div className="flex-1 p-7 overflow-y-auto">
        <div className="max-w-6xl mx-auto qm-fade">{renderContent()}</div>
      </div>
    </div>
  );
}
