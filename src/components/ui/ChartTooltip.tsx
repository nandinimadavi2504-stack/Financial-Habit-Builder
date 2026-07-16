import { useTheme } from '../../context/ThemeContext';

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
}

export default function ChartTooltip({ active, payload, label, formatter }: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  formatter?: (value: number) => string;
}) {
  const { theme } = useTheme();
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className={`px-3 py-2 rounded-lg shadow-lg border text-xs ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-700'}`}>
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
          <span className="font-semibold">{formatter && typeof entry.value === 'number' ? formatter(entry.value) : entry.value}</span>
        </div>
      ))}
    </div>
  );
}
