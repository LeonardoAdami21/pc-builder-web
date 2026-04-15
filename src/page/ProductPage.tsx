import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService, searchService, type Product, type ProductQuery } from "../service/types";
import { ProductFilters, type FilterValues } from "../components/product/ProductFilter";
import { Button } from "../components/ui/Button";
import { SkeletonCard } from "../components/ui";
import { ProductCard } from "../components/product/ProducCart";


export function ProductsPage() {
  const [params] = useSearchParams();
  const [filters, setFilters] = useState<ProductQuery>({
    page: 1,
    limit: 20,
    isFeatured: true,
    search: params.get("search") || undefined,
    categoryId: params.get("categoryId") || undefined,
  });

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      search: params.get("search") || undefined,
      categoryId: params.get("categoryId") || undefined,
      page: 1,
    }));
  }, [params.toString()]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.list(filters).then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const { data: facets } = useQuery({
    queryKey: ["facets", filters.categoryId],
    queryFn: () => searchService.facets(filters.categoryId).then((r) => r.data),
  });

  const products: Product[] = (data as any)?.items ?? [];
  const meta = (data as any)?.meta;

  const handleFilter = (values: FilterValues) => {
    setFilters((f) => ({ ...f, ...values, page: 1 }));
  };

  const handleReset = () => {
    setFilters({ page: 1, limit: 20, isFeatured: true });
  };

  return (
    <main className="max-w-360 mx-auto px-4 md:px-6 pt-32 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-display font-bold text-2xl text-(--color-text-primary)">
          {filters.search ? `Resultados para "${filters.search}"` : "Catálogo"}
        </h1>
        {meta && (
          <p className="text-sm text-(--color-text-muted) mt-1">
            {meta.total} produto{meta.total !== 1 ? "s" : ""} encontrado
            {meta.total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="flex gap-6">
        <ProductFilters
          brands={facets?.brands}
          priceRange={facets?.priceRange}
          onFilter={handleFilter}
          onReset={handleReset}
        />

        <div className="flex-1 min-w-0">
          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-(--color-text-muted) text-lg">
                Nenhum produto encontrado
              </p>
              <Button variant="ghost" className="mt-4" onClick={handleReset}>
                Limpar filtros
              </Button>
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity ${isFetching ? "opacity-60" : ""}`}
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Paginação */}
              {meta && meta.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!meta.hasPrev}
                    onClick={() =>
                      setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))
                    }
                  >
                    Anterior
                  </Button>
                  <span className="px-4 py-2 text-sm text-(--color-text-muted)">
                    {meta.page} / {meta.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!meta.hasNext}
                    onClick={() =>
                      setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))
                    }
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
