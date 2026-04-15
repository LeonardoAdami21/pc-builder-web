import { useQuery } from "@tanstack/react-query";
import { RiArrowRightLine, RiCpuLine, RiFlashlightLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/product/ProducCart";
import { SkeletonCard } from "../components/ui";
import {
  categoryService,
  priceHistoryService,
  productService,
  type Category,
  type Product,
} from "../service/types";
import { formatPrice } from "../utils/utils";
export function HomePage() {
  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () =>
      productService.list({ isFeatured: true, limit: 8 }).then((r) => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories", "tree"],
    queryFn: () => categoryService.tree().then((r) => r.data),
  });

  const { data: drops } = useQuery({
    queryKey: ["price-history", "drops"],
    queryFn: () => priceHistoryService.biggestDrops(6).then((r) => r.data),
  });

  const heroFeatures = [
    "Histórico de preços em tempo real",
    "PC Builder com verificação de compatibilidade",
    "Comparador lado a lado",
    "Parcele em 12x sem juros",
  ];

  return (
    <main className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-bg-primary" />

        {/* Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-150 h-75 bg-accent opacity-[0.06] blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-360 mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-subtle border border-accent/20 text-accent text-sm mb-6">
            <RiFlashlightLine size={14} />O e-commerce gamer mais completo do
            Brasil
          </div>

          <h1 className="text-display font-bold text-5xl md:text-7xl text-text-primary leading-none mb-6">
            MONTE O PC
            <br />
            <span className="gradient-text">DOS SEUS SONHOS</span>
          </h1>

          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
            Hardware, periféricos e PCs gamer com os melhores preços, histórico
            de preços e PC Builder inteligente.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <Link to="/pc-builder">
              <button className="px-6 py-3 bg-accent text-bg-primary font-semibold rounded-xl hover:brightness-110 transition-all shadow-[0_0_30px_var(--color-accent-glow)] flex items-center gap-2">
                <RiCpuLine size={18} />
                Monte seu PC
              </button>
            </Link>
            <Link to="/products">
              <button className="px-6 py-3 border border-border text-text-primary rounded-xl hover:border-border-light transition-all flex items-center gap-2">
                Ver catálogo
                <RiArrowRightLine size={18} />
              </button>
            </Link>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-3 justify-center">
            {heroFeatures.map((f) => (
              <span
                key={f}
                className="flex items-center gap-1.5 text-sm text-text-muted"
              >
                <span className="w-1 h-1 rounded-full bg-accent" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categorias ──────────────────────────────────────── */}
      {categories && categories.length > 0 && (
        <section className="max-w-360 mx-auto px-4 md:px-6 mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {(categories as Category[]).slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="card-base card-hover p-4 flex flex-col items-center gap-2 text-center group"
              >
                <span className="text-2xl">{cat.icon || "📦"}</span>
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                  {cat.name}
                </span>
                {cat._count && (
                  <span className="text-[11px] text-text-muted">
                    {cat._count.products} produtos
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Maiores quedas de preço ──────────────────────────── */}
      {drops && (drops as any[]).length > 0 && (
        <section className="max-w-360 mx-auto px-4 md:px-6 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-display font-bold text-2xl text-text-primary">
                📉 Maiores quedas de preço
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Últimos 30 dias
              </p>
            </div>
            <Link
              to="/offers"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              Ver todas <RiArrowRightLine size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(drops as any[])
              .slice(0, 6)
              .map(({ product, dropPercent, maxPrice, currentPrice }: any) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="card-base card-hover flex items-center gap-4 p-4"
                >
                  {product.images?.[0] && (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-14 h-14 object-contain shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary line-clamp-2 leading-tight">
                      {product.name}
                    </p>
                    <p className="text-xs text-text-muted line-through mt-0.5">
                      {formatPrice(maxPrice)}
                    </p>
                    <p className="text-base font-bold text-price">
                      {formatPrice(currentPrice)}
                    </p>
                  </div>
                  <div className="shrink-0 px-2 py-1 rounded-lg bg-emerald-950/40 text-success text-xs font-bold">
                    -{dropPercent.toFixed(0)}%
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* ── Produtos em destaque ─────────────────────────────── */}
      <section className="max-w-360 mx-auto px-4 md:px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-display font-bold text-2xl text-text-primary">
            ⚡ Destaques
          </h2>
          <Link
            to="/products"
            className="text-sm text-accent hover:underline flex items-center gap-1"
          >
            Ver todos <RiArrowRightLine size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
          {loadingFeatured
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : (featured as any)?.items?.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
        </div>
      </section>
    </main>
  );
}
