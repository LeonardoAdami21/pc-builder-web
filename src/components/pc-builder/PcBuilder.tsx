import { useState } from "react";
import {
  RiCpuLine,
  RiHardDriveLine,
  RiAddLine,
  RiCheckLine,
  RiAlertLine,
  RiCloseLine,
} from "react-icons/ri";
import toast from "react-hot-toast";
import { pcBuilderService, type Product } from "../../service/types";
import { cn, formatPrice } from "../../utils/utils";
import { Button } from "../ui/Button";
import { Badge, Spinner } from "../ui";

type ComponentType =
  | "CPU"
  | "MOTHERBOARD"
  | "RAM"
  | "GPU"
  | "STORAGE"
  | "PSU"
  | "CASE"
  | "COOLER"
  | "FAN";

type CompatibilityResult = {
  compatible: boolean;
  issues: {
    type: ComponentType;
    message: string;
  }[];
  warnings: {
    type: ComponentType;
    message: string;
  }[];
  message: string;
};
const COMPONENT_SLOTS: {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
  required: boolean;
}[] = [
  {
    type: "CPU",
    label: "Processador",
    icon: <RiCpuLine size={18} />,
    required: true,
  },
  {
    type: "MOTHERBOARD",
    label: "Placa-mãe",
    icon: <RiHardDriveLine size={18} />,
    required: true,
  },
  {
    type: "RAM",
    label: "Memória RAM",
    icon: <RiCpuLine size={18} />,
    required: true,
  },
  {
    type: "GPU",
    label: "Placa de Vídeo",
    icon: <RiCpuLine size={18} />,
    required: false,
  },
  {
    type: "STORAGE",
    label: "Armazenamento",
    icon: <RiHardDriveLine size={18} />,
    required: true,
  },
  {
    type: "PSU",
    label: "Fonte",
    icon: <RiCpuLine size={18} />,
    required: true,
  },
  {
    type: "CASE",
    label: "Gabinete",
    icon: <RiCpuLine size={18} />,
    required: false,
  },
  {
    type: "COOLER",
    label: "Cooler",
    icon: <RiCpuLine size={18} />,
    required: false,
  },
];

export function PcBuilder() {
  const [slots, setSlots] = useState<Record<ComponentType, Product | null>>({
    CPU: null,
    MOTHERBOARD: null,
    RAM: null,
    GPU: null,
    STORAGE: null,
    PSU: null,
    CASE: null,
    COOLER: null,
    FAN: null,
  });
  const [activeSlot, setActiveSlot] = useState<ComponentType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [compatibility, setCompatibility] =
    useState<CompatibilityResult | null>(null);
  const [checkingCompat, setCheckingCompat] = useState(false);

  const totalPrice = Object.values(slots).reduce(
    (sum, p) => sum + (p ? Number(p.price) : 0),
    0,
  );

  const selectedIds = Object.values(slots)
    .filter(Boolean)
    .map((p) => p!.id);

  const openSlot = async (type: ComponentType) => {
    setActiveSlot(type);
    setSearchQ("");
    setLoading(true);
    try {
      const { data } = await pcBuilderService.components(type);
      setProducts(data || []);
    } catch {
      toast.error("Erro ao carregar componentes");
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = (type: ComponentType, product: Product) => {
    setSlots((prev) => ({ ...prev, [type]: product }));
    setActiveSlot(null);
    setCompatibility(null);
  };

  const removeSlot = (type: ComponentType) => {
    setSlots((prev) => ({ ...prev, [type]: null }));
    setCompatibility(null);
  };

  const checkCompatibility = async () => {
    if (selectedIds.length < 2) {
      toast.error("Adicione ao menos 2 componentes");
      return;
    }
    setCheckingCompat(true);
    try {
      const { data } = await pcBuilderService.checkCompat(selectedIds);
      setCompatibility(data);
      if (data.compatible) toast.success("Configuração compatível!");
      else toast.error(`${data.issues.length} problema(s) de compatibilidade`);
    } catch {
      toast.error("Erro ao verificar");
    } finally {
      setCheckingCompat(false);
    }
  };

  const filteredProducts = products.filter(
    (p) => !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase()),
  );

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6">
      {/* Slots */}
      <div className="space-y-2">
        {COMPONENT_SLOTS.map(({ type, label, icon, required }) => {
          const selected = slots[type];
          return (
            <div
              key={type}
              className={cn(
                "card-base p-3 flex items-center gap-3 transition-all",
                activeSlot === type && "border-(--color-accent)",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-(--color-text-muted)",
                  selected
                    ? "bg-(--color-accent-subtle) text-(--color-accent)"
                    : "bg-(--color-bg-hover)",
                )}
              >
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-(--color-text-muted) uppercase tracking-wide">
                    {label}
                  </span>
                  {required && (
                    <span className="text-[10px] text-(--color-danger)">
                      *
                    </span>
                  )}
                </div>
                {selected ? (
                  <p className="text-sm font-medium text-(--color-text-primary) truncate mt-0.5">
                    {selected.name}
                  </p>
                ) : (
                  <p className="text-sm text-(--color-text-muted) mt-0.5">
                    Nenhum selecionado
                  </p>
                )}
              </div>

              {selected ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-(--color-price)">
                    {formatPrice(selected.price)}
                  </span>
                  <button
                    onClick={() => removeSlot(type)}
                    className="p-1 rounded hover:bg-red-950/30 text-(--color-text-muted) hover:text-(--color-danger) transition-colors"
                  >
                    <RiCloseLine size={16} />
                  </button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openSlot(type)}
                >
                  <RiAddLine size={14} />
                  Escolher
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Painel direito */}
      <div className="space-y-4">
        {/* Resumo */}
        <div className="card-base p-4 space-y-3">
          <h3 className="text-display font-semibold text-(--color-text-primary)">
            Resumo da build
          </h3>

          {selectedIds.length === 0 ? (
            <p className="text-sm text-(--color-text-muted)">
              Selecione os componentes
            </p>
          ) : (
            <div className="space-y-1.5">
              {COMPONENT_SLOTS.filter(({ type }) => slots[type]).map(
                ({ type, label }) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="text-(--color-text-muted) truncate pr-2">
                      {label}
                    </span>
                    <span className="text-(--color-text-primary) shrink-0">
                      {formatPrice(slots[type]!.price)}
                    </span>
                  </div>
                ),
              )}
              <div className="border-t border-(--color-border) pt-2 flex justify-between">
                <span className="font-semibold text-(--color-text-primary)">
                  Total
                </span>
                <span className="text-display font-bold text-(--color-price)">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          )}

          <Button
            fullWidth
            variant="secondary"
            onClick={checkCompatibility}
            loading={checkingCompat}
            disabled={selectedIds.length < 2}
          >
            Verificar compatibilidade
          </Button>
        </div>

        {/* Resultado de compatibilidade */}
        {compatibility && (
          <div
            className={cn(
              "card-base p-4 space-y-2",
              compatibility.compatible
                ? "border-(--color-success)/40"
                : "border-(--color-danger)/40",
            )}
          >
            <div className="flex items-center gap-2">
              {compatibility.compatible ? (
                <RiCheckLine
                  size={18}
                  className="text-(--color-success)"
                />
              ) : (
                <RiAlertLine size={18} className="text-(--color-danger)" />
              )}
              <span
                className={cn(
                  "font-semibold text-sm",
                  compatibility.compatible
                    ? "text-(--color-success)"
                    : "text-(--color-danger)",
                )}
              >
                {compatibility.compatible
                  ? "Configuração compatível!"
                  : "Problemas encontrados"}
              </span>
            </div>

            {compatibility.issues.map((issue, i) => (
              <p key={i} className="text-xs text-(--color-danger) pl-6">
                {issue.message}
              </p>
            ))}
            {compatibility.warnings.map((w, i) => (
              <p key={i} className="text-xs text-(--color-warning) pl-6">
                {w.message}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Modal de seleção de produto */}
      {activeSlot && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setActiveSlot(null)}
          />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-150 md:max-h-[80vh] bg-(--color-bg-secondary) border border-(--color-border)ded-2xl z-50 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-(--color-border)">
              <h3 className="text-display font-semibold">
                Escolher{" "}
                {COMPONENT_SLOTS.find((s) => s.type === activeSlot)?.label}
              </h3>
              <button onClick={() => setActiveSlot(null)}>
                <RiCloseLine
                  size={20}
                  className="text-(--color-text-muted)"
                />
              </button>
            </div>

            <div className="p-4 border-b border-(--color-border)">
              <input
                placeholder="Buscar..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="w-full bg-(--color-bg-card) border border-(--color-border) rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-(--color-accent)"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="text-center text-(--color-text-muted) py-8">
                  Nenhum produto encontrado
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => selectProduct(activeSlot, product)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-(--color-bg-card) border border-(--color-border) hover:border-(--color-accent) transition-colors text-left"
                  >
                    {product.images[0] && (
                      <img
                        src={product.url}
                        alt={product.name}
                        className="w-12 h-12 object-contain shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-(--color-text-primary) truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-(--color-text-muted)">
                        {product.brand} · Estoque: {product.stock}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-(--color-price)">
                        {formatPrice(product.price)}
                      </p>
                      {product.stock <= 5 && product.stock > 0 && (
                        <Badge variant="warning" size="sm">
                          Últimas un.
                        </Badge>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
