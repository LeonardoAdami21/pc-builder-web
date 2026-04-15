import { useState } from "react";
import { RiFilterLine, RiCloseLine } from "react-icons/ri";
import { cn } from "../../utils/utils";
import { Button } from "../ui/Button";

interface FiltersProps {
  brands?: { name: string; count: number }[];
  priceRange?: { min: number; max: number };
  onFilter: (filters: FilterValues) => void;
  onReset: () => void;
}

export interface FilterValues {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  orderBy?: string;
}

export function ProductFilters({
  brands = [],
  priceRange,
  onFilter,
  onReset,
}: FiltersProps) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [orderBy, setOrderBy] = useState("newest");
  const [mobileOpen, setMobileOpen] = useState(false);

  const apply = () => {
    onFilter({
      brand: selectedBrand || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock || undefined,
      orderBy,
    });
  };

  const reset = () => {
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    setOrderBy("newest");
    onReset();
  };

  const orderOptions = [
    { value: "newest", label: "Mais recentes" },
    { value: "price_asc", label: "Menor preço" },
    { value: "price_desc", label: "Maior preço" },
    { value: "best_reviewed", label: "Melhor avaliados" },
    { value: "best_selling", label: "Mais vendidos" },
  ];

  const FilterContent = () => (
    <div className="space-y-5">
      {/* Ordenar */}
      <div>
        <h4 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-2">
          Ordenar por
        </h4>
        <div className="space-y-1">
          {orderOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setOrderBy(opt.value)}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
                orderBy === opt.value
                  ? "bg-(--color-accent-subtle) text-(--color-accent)"
                  : "text-(--color-text-secondary) hover:bg-(--color-bg-hover)",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marcas */}
      {brands.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-2">
            Marca
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedBrand("")}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
                !selectedBrand
                  ? "bg-(--color-accent-subtle) text-(--color-accent)"
                  : "text-(--color-text-secondary) hover:bg-(--color-bg-hover)",
              )}
            >
              Todas
            </button>
            {brands.map((b) => (
              <button
                key={b.name}
                onClick={() => setSelectedBrand(b.name ?? "")}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-lg text-sm flex justify-between items-center transition-colors",
                  selectedBrand === b.name
                    ? "bg-(--color-accent-subtle) text-(--color-accent)"
                    : "text-(--color-text-secondary) hover:bg-(--color-bg-hover)",
                )}
              >
                <span>{b.name}</span>
                <span className="text-[11px] text-(--color-text-muted)">
                  ({b.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Faixa de preço */}
      <div>
        <h4 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-2">
          Faixa de preço
        </h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={priceRange ? `R$ ${priceRange.min}` : "Min"}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-(--color-bg-card) border border-(--color-border) rounded-lg px-2 py-1.5 text-xs text-(--color-text-primary) focus:outline-none focus:border-(--color-accent)"
          />
          <input
            type="number"
            placeholder={priceRange ? `R$ ${priceRange.max}` : "Max"}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-(--color-bg-card) border border-(--color-border) rounded-lg px-2 py-1.5 text-xs text-(--color-text-primary) focus:outline-none focus:border-(--color-accent)"
          />
        </div>
      </div>

      {/* Em estoque */}
      <label className="flex items-center gap-2 cursor-pointer">
        <div
          onClick={() => setInStock(!inStock)}
          className={cn(
            "w-9 h-5 rounded-full transition-colors relative",
            inStock ? "bg-(--color-accent)" : "bg-(--color-border)",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
              inStock ? "translate-x-4" : "translate-x-0.5",
            )}
          />
        </div>
        <span className="text-sm text-(--color-text-secondary)">
          Somente em estoque
        </span>
      </label>

      {/* Botões */}
      <div className="flex gap-2 pt-2">
        <Button size="sm" fullWidth onClick={apply}>
          Aplicar
        </Button>
        <Button size="sm" variant="ghost" onClick={reset}>
          Limpar
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-52 shrink-0">
        <div className="sticky top-32 bg-(--color-bg-card) border border-(--color-border) rounded-xl p-4">
          <h3 className="text-display font-semibold text-(--color-text-primary) mb-4">
            Filtros
          </h3>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile trigger */}
      <div className="lg:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setMobileOpen(true)}
        >
          <RiFilterLine size={16} />
          Filtros
        </Button>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed bottom-0 left-0 right-0 bg-(--color-bg-secondary) border-t border-(--color-border) rounded-t-2xl z-50 p-5 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-display font-semibold">Filtros</h3>
                <button onClick={() => setMobileOpen(false)}>
                  <RiCloseLine
                    size={22}
                    className="text-(--color-text-muted)"
                  />
                </button>
              </div>
              <FilterContent />
            </div>
          </>
        )}
      </div>
    </>
  );
}
