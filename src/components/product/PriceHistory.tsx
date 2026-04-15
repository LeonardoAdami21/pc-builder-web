import { useEffect, useRef } from "react";
import { RiArrowDownLine } from "react-icons/ri";
import { formatPrice } from "../../utils/utils";
import { Badge } from "../ui";

export type PriceHistoryResponse = {
  history: {
    date: string;
    price: string;
  }[];
  stats: {
    min: string;
    max: string;
    avg: string;
    dropPercent: number;
    dropFromMax: number;
  };
  period: {
    days: number;
  };
};

interface Props {
  data: PriceHistoryResponse;
}

export function PriceHistoryChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { history, stats } = data;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const PAD = { top: 16, right: 16, bottom: 28, left: 60 };
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;

    const prices = history.map((h) => Number(h.price));
    const minP = Math.min(...prices) * 0.97;
    const maxP = Math.max(...prices) * 1.03;

    const xStep = chartW / (history.length - 1);
    const toX = (i: number) => PAD.left + i * xStep;
    const toY = (p: number) =>
      PAD.top + chartH - ((p - minP) / (maxP - minP)) * chartH;

    // Grid lines
    ctx.strokeStyle = "rgba(42,42,58,0.8)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + (i / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(W - PAD.right, y);
      ctx.stroke();
      const price = maxP - ((maxP - minP) * i) / 4;
      ctx.fillStyle = "#55556a";
      ctx.font = "10px DM Sans, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(
        formatPrice(price).replace("R$\u00a0", "R$ "),
        PAD.left - 6,
        y + 4,
      );
    }

    // Area fill
    const gradient = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + chartH);
    gradient.addColorStop(0, "rgba(0,229,255,0.18)");
    gradient.addColorStop(1, "rgba(0,229,255,0)");
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(prices[0]));
    history.forEach((_, i) => {
      if (i > 0) ctx.lineTo(toX(i), toY(prices[i]));
    });
    ctx.lineTo(toX(history.length - 1), PAD.top + chartH);
    ctx.lineTo(toX(0), PAD.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(prices[0]));
    history.forEach((_, i) => {
      if (i > 0) ctx.lineTo(toX(i), toY(prices[i]));
    });
    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.stroke();

    // Dots
    history.forEach((h: any, i: number) => {
      const x = toX(i);
      const y = toY(Number(h.price));
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#00e5ff";
      ctx.fill();
    });

    // Current price dot (last)
    const lastX = toX(history.length - 1);
    const lastY = toY(prices[prices.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#00e5ff";
    ctx.fill();
    ctx.strokeStyle = "rgba(0,229,255,0.3)";
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [history]);

  if (!stats) return null;

  return (
    <div className="bg-(--color-bg-card) border border-(--color-border) rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-display font-semibold text-(--color-text-primary)">
          Histórico de preços
        </h3>
        <Badge variant="muted">últimos {data.period.days} dias</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-(--color-bg-hover) rounded-lg p-3 text-center">
          <p className="text-[10px] text-(--color-text-muted) uppercase tracking-wider">
            Mínimo
          </p>
          <p className="text-sm font-bold text-(--color-success) mt-0.5">
            {formatPrice(stats.min)}
          </p>
        </div>
        <div className="bg-(--color-bg-hover) rounded-lg p-3 text-center">
          <p className="text-[10px] text-(--color-text-muted) uppercase tracking-wider">
            Médio
          </p>
          <p className="text-sm font-bold text-(--color-text-primary) mt-0.5">
            {formatPrice(stats.avg)}
          </p>
        </div>
        <div className="bg-(--color-bg-hover) rounded-lg p-3 text-center">
          <p className="text-[10px] text-(--color-text-muted) uppercase tracking-wider">
            Máximo
          </p>
          <p className="text-sm font-bold text-(--color-danger) mt-0.5">
            {formatPrice(stats.max)}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="relative h-44">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Queda */}
      {stats.dropPercent > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
          <RiArrowDownLine
            size={16}
            className="text-(--color-success) shrink-0"
          />
          <p className="text-sm text-(--color-success)">
            <strong>{stats.dropPercent.toFixed(1)}%</strong> abaixo do preço
            máximo registrado
            <span className="text-(--color-text-muted) ml-1">
              (você economiza {formatPrice(Math.abs(stats.dropFromMax))})
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
