// ─── ComparePage ──────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { RiScalesLine, RiCloseLine } from "react-icons/ri";
import { compareService } from "../service/types";
import { useCompareStore } from "../store/compare.store";
import { Button } from "../components/ui/Button";
import { formatPrice } from "../utils/utils";
import { StarRating } from "../components/ui";

export function ComparePage() {
  const { ids, remove, clear } = useCompareStore();

  const { data, isLoading } = useQuery({
    queryKey: ["compare", ids],
    queryFn: () => compareService.compare(ids).then((r) => r.data),
    enabled: ids.length >= 2,
  });

  if (ids.length < 2) {
    return (
      <main className="max-w-360 mx-auto px-4 md:px-6 pt-40 pb-20 text-center">
        <RiScalesLine
          size={48}
          className="text-text-muted mx-auto mb-4"
        />
        <h1 className="text-display font-bold text-2xl text-text-primary mb-2">
          Comparador de Produtos
        </h1>
        <p className="text-text-muted">
          Adicione ao menos 2 produtos para comparar
        </p>
      </main>
    );
  }

  const comparison = data as any;

  return (
    <main className="max-w-360 mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-display font-bold text-2xl text-text-primary">
          ⚖️ Comparar Produtos
        </h1>
        <Button variant="ghost" size="sm" onClick={clear}>
          Limpar tudo
        </Button>
      </div>

      {isLoading ? (
        <p className="text-text-muted">
          Carregando comparação...
        </p>
      ) : comparison ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-150">
            <thead>
              <tr>
                <th className="text-left p-3 w-44 text-text-muted text-sm font-medium">
                  Produto
                </th>
                {comparison.products.map((p: any) => (
                  <th key={p.id} className="p-3 text-center min-w-45">
                    <div className="relative">
                      <button
                        onClick={() => remove(p.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-bg-hover flex items-center justify-center hover:bg-danger/20"
                      >
                        <RiCloseLine
                          size={11}
                          className="text-text-muted"
                        />
                      </button>
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-20 h-20 object-contain mx-auto mb-2"
                        />
                      )}
                      <p className="text-sm font-medium text-text-primary line-clamp-2">
                        {p.name}
                      </p>
                      <p className="text-lg font-bold text-price mt-1">
                        {formatPrice(p.price)}
                      </p>
                      {p.avgRating && (
                        <StarRating rating={p.avgRating} size={12} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(comparison.comparisonTable ?? {}).map(
                ([group, rows]) => (
                  <>
                    <tr key={`group-${group}`}>
                      <td
                        colSpan={comparison.products.length + 1}
                        className="px-3 py-2 text-xs font-semibold text-accent uppercase tracking-wider bg-bg-secondary"
                      >
                        {group}
                      </td>
                    </tr>
                    {(rows as any[]).map((row: any) => (
                      <tr
                        key={row.key}
                        className={
                          row.highlight ? "bg-accent-subtle" : ""
                        }
                      >
                        <td className="p-3 text-sm text-text-muted">
                          {row.key}
                        </td>
                        {row.values.map((val: string, i: number) => (
                          <td
                            key={i}
                            className="p-3 text-sm text-center text-text-primary"
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ),
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </main>
  );
}
