import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  RiHeartLine,
  RiScalesLine,
  RiShieldCheckLine,
  RiShoppingCartLine,
  RiTruckLine,
} from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PriceHistoryChart } from "../components/product/PriceHistory";
import { ProductCard } from "../components/product/ProducCart";
import { Button } from "../components/ui/Button";
import { productService, priceHistoryService } from "../service/types";
import { useCartStore } from "../store/cart.store";
import { useCompareStore } from "../store/compare.store";
import { discountPercent, cn, formatPrice } from "../utils/utils";
import { Badge, Skeleton, StarRating } from "../components/ui";

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCartStore();
  const { add: addCompare, has } = useCompareStore();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">(
    "desc",
  );
  const [activeImg, setActiveImg] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.bySlug(slug!).then((r) => r.data),
    enabled: !!slug,
  });

  const { data: priceHistory } = useQuery({
    queryKey: ["price-history", product?.id],
    queryFn: () =>
      priceHistoryService.byProduct(product!.id).then((r) => r.data),
    enabled: !!product?.id,
  });

  const { data: related } = useQuery({
    queryKey: ["related", product?.id],
    queryFn: () => productService.related(product!.id).then((r) => r.data),
    enabled: !!product?.id,
  });

  if (isLoading) {
    return (
      <main className="max-w-360 mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!product)
    return (
      <div className="pt-40 text-center text-text-muted">
        Produto não encontrado
      </div>
    );

  const primaryImg =
    product.images?.find((i: any) => i.isPrimary) ?? product.images?.[0];
  const discount = product.comparePrice
    ? discountPercent(Number(product.comparePrice), Number(product.price))
    : 0;
  const inCompare = has(product.id);

  const groupedAttrs = product.attributes?.reduce(
    (acc: any, attr: any) => {
      const g = attr.group || "Especificações";
      if (!acc[g]) acc[g] = [];
      acc[g].push(attr);
      return acc;
    },
    {} as Record<string, typeof product.attributes>,
  );

  return (
    <main className="max-w-360 mx-auto px-4 md:px-6 pt-32 pb-20 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-(--color-text-muted)">
        <Link to="/" className="hover:text-(--color-text-primary)">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-(--color-text-primary)">
          Produtos
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              to={`/products?categoryId=${product.categoryId}`}
              className="hover:text-(--color-text-primary)"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-(--color-text-primary) truncate max-w-50">
          {product.name}
        </span>
      </nav>

      {/* Produto principal */}
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Galeria */}
        <div className="space-y-3">
          <div className="aspect-square bg-(--color-bg-card) border border-(--color-border) rounded-2xl overflow-hidden flex items-center justify-center p-8">
            <img
              src={product.images?.[activeImg]?.url ?? primaryImg?.url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img: any, i: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "shrink-0 w-16 h-16 rounded-lg border overflow-hidden transition-all",
                    activeImg === i
                      ? "border-(--color-accent)"
                      : "border-(--color-border)",
                  )}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="space-y-5">
          <div>
            {product.brand && (
              <p className="text-xs font-semibold text-(--color-accent) uppercase tracking-widest mb-2">
                {product.brand}
              </p>
            )}
            <h1 className="text-xl md:text-2xl font-semibold text-(--color-text-primary) leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-(--color-text-muted) mt-1">
              SKU: {product.sku}
            </p>
          </div>

          {/* Rating */}
          {product.avgRating && (
            <div className="flex items-center gap-2">
              <StarRating rating={product.avgRating} size={16} />
              <span className="text-sm text-(--color-text-muted)">
                {product.avgRating.toFixed(1)} ({product._count?.reviews}{" "}
                avaliações)
              </span>
            </div>
          )}

          {/* Preço */}
          <div className="p-4 rounded-xl bg-(--color-bg-card) border border-(--color-border) space-y-1">
            {product.comparePrice &&
              Number(product.comparePrice) > Number(product.price) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-(--color-text-muted) line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <Badge variant="danger">-{discount}%</Badge>
                </div>
              )}
            <p className="text-3xl font-bold text-display text-(--color-price)">
              {formatPrice(product.price)}
            </p>
            <p className="text-sm text-(--color-text-muted)">
              ou 12x de{" "}
              <strong className="text-(--color-text-secondary)">
                {formatPrice(Number(product.price) / 12)}
              </strong>{" "}
              sem juros
            </p>
            <p className="text-sm text-(--color-success)">
              🔥 {formatPrice(Number(product.price) * 0.85)} no PIX (15% off)
            </p>
          </div>

          {/* Estoque */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-(--color-success)" />
                <span className="text-sm text-(--color-success)">
                  {product.stock <= 5
                    ? `Apenas ${product.stock} em estoque!`
                    : "Em estoque"}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-(--color-danger)" />
                <span className="text-sm text-(--color-danger)">
                  Sem estoque
                </span>
              </>
            )}
            {product.warranty && (
              <span className="ml-auto text-xs text-(--color-text-muted) flex items-center gap-1">
                <RiShieldCheckLine size={13} />
                {product.warranty} meses de garantia
              </span>
            )}
          </div>

          {/* Quantidade + CTA */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-(--color-border) rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-(--color-text-muted) hover:bg-(--color-bg-hover) transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-10 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={qty >= product.stock}
                  className="px-3 py-2 text-(--color-text-muted) hover:bg-(--color-bg-hover) transition-colors disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <Button
                size="lg"
                fullWidth
                disabled={product.stock === 0}
                onClick={() => {
                  addItem(product, qty);
                  toast.success("Adicionado ao carrinho!");
                }}
              >
                <RiShoppingCartLine size={18} />
                {product.stock === 0 ? "Esgotado" : "Adicionar ao carrinho"}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  addCompare(product);
                }}
              >
                <RiScalesLine size={15} />
                {inCompare ? "Na comparação" : "Comparar"}
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                <RiHeartLine size={15} />
                Wishlist
              </Button>
            </div>
          </div>

          {/* Benefícios */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {[
              {
                icon: <RiTruckLine size={14} />,
                text: "Frete grátis Sul/Sudeste acima de R$299",
              },
              {
                icon: <RiShieldCheckLine size={14} />,
                text: "Produto original com nota fiscal",
              },
            ].map((b) => (
              <div
                key={b.text}
                className="flex items-start gap-2 text-xs text-(--color-text-muted)"
              >
                <span className="text-(--color-accent) mt-0.5 shrink-0">
                  {b.icon}
                </span>
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Histórico de preços */}
      {priceHistory && <PriceHistoryChart data={priceHistory as any} />}

      {/* Tabs: Descrição, Specs, Reviews */}
      <div>
        <div className="flex border-b border-(--color-border) mb-6 gap-1">
          {(["desc", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-colors -mb-px border-b-2",
                activeTab === tab
                  ? "border-(--color-accent) text-(--color-accent)"
                  : "border-transparent text-(--color-text-muted) hover:text-(--color-text-primary)",
              )}
            >
              {tab === "desc"
                ? "Descrição"
                : tab === "specs"
                  ? "Especificações"
                  : "Avaliações"}
            </button>
          ))}
        </div>

        {activeTab === "desc" && (
          <div className="prose prose-invert max-w-none text-(--color-text-secondary) text-sm leading-relaxed">
            {product.description ||
              product.shortDesc ||
              "Sem descrição disponível."}
          </div>
        )}

        {activeTab === "specs" && groupedAttrs && (
          <div className="space-y-6">
            {Object.entries(groupedAttrs).map(([group, attrs]: any) => (
              <div key={group}>
                <h3 className="text-sm font-semibold text-(--color-text-muted) uppercase tracking-wider mb-3">
                  {group}
                </h3>
                <div className="card-base overflow-hidden divide-y divide-(--color-border)">
                  {attrs?.map((attr: any) => (
                    <div key={attr.id} className="flex px-4 py-2.5 text-sm">
                      <span className="w-40 shrink-0 text-(--color-text-muted)">
                        {attr.key}
                      </span>
                      <span className="text-(--color-text-primary)">
                        {attr.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {product.reviews?.length === 0 ? (
              <p className="text-(--color-text-muted) text-center py-8">
                Sem avaliações ainda
              </p>
            ) : (
              product.reviews?.map((review: any) => (
                <div key={review.id} className="card-base p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-(--color-bg-hover) flex items-center justify-center text-xs font-bold text-(--color-text-secondary)">
                      {review.user?.name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-(--color-text-primary)">
                        {review.user?.name}
                      </p>
                      <StarRating rating={review.rating} size={12} />
                    </div>
                    {review.isVerified && (
                      <Badge variant="success" size="sm" className="ml-auto">
                        Compra verificada
                      </Badge>
                    )}
                  </div>
                  {review.title && (
                    <p className="text-sm font-medium text-(--color-text-primary)">
                      {review.title}
                    </p>
                  )}
                  <p className="text-sm text-(--color-text-secondary)">
                    {review.body}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Relacionados */}
      {related && (related as any[]).length > 0 && (
        <div>
          <h2 className="text-display font-bold text-xl text-(--color-text-primary) mb-6">
            Produtos relacionados
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(related as any[]).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
