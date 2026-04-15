import { useQuery } from "@tanstack/react-query";
import { priceHistoryService } from "../service/types";
import { ProductCard } from "../components/product/ProducCart";

export function OffersPage() {
  const { data: drops, isLoading } = useQuery({
    queryKey: ["drops"],
    queryFn: () => priceHistoryService.biggestDrops(20).then((r) => r.data),
  });

  return (
    <main className="max-w-360 mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="mb-8">
        <h1 className="text-display font-bold text-3xl text-text-primary">
          📉 Maiores Ofertas
        </h1>
        <p className="text-text-muted mt-2">
          Produtos com maior queda de preço nos últimos 30 dias
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton rounded-xl aspect-3/4" />
            ))
          : (drops as any[])?.map(({ product }: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </main>
  );
}
