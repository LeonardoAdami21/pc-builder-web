import { useState } from "react";
import { Link } from "react-router-dom";
import {
  RiShoppingCartLine,
  RiHeartLine,
  RiHeartFill,
  RiScalesLine,
  RiEyeLine,
} from "react-icons/ri";
import toast from "react-hot-toast";
import { userService, type Product } from "../../service/types";
import { useCartStore } from "../../store/cart.store";
import { useCompareStore } from "../../store/compare.store";
import { useAuthStore } from "../../store/auth.store";
import { cn, discountPercent, formatPrice } from "../../utils/utils";
import { Badge, StarRating } from "../ui";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { add: addCompare, remove: removeCompare, has } = useCompareStore();
  const { isAuthenticated } = useAuthStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [addingCart, setAddingCart] = useState(false);

  const primaryImage =
    product.images?.find((i: any) => i?.isPrimary) || product.image;
  const discount = product.comparePrice
    ? discountPercent(Number(product.comparePrice), Number(product.price))
    : 0;
  const inStock = product.stock > 0;
  const inCompare = has(product.id);

  const handleAddCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    setAddingCart(true);
    addItem(product);
    toast.success("Adicionado ao carrinho!", { duration: 2000 });
    setTimeout(() => setAddingCart(false), 600);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Faça login para salvar");
      return;
    }
    try {
      await userService.toggleWishlist(product.id);
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? "Removido da wishlist" : "Salvo na wishlist!");
    } catch {
      toast.error("Erro ao atualizar wishlist");
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    inCompare ? removeCompare(product.id) : addCompare(product);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className={cn(
        "card-base card-hover group relative flex flex-col overflow-hidden",
        !inStock && "opacity-70",
        className,
      )}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {discount >= 5 && (
          <Badge variant="danger" size="sm">
            -{discount}%
          </Badge>
        )}
        {product.isFeatured && (
          <Badge variant="accent" size="sm">
            Destaque
          </Badge>
        )}
        {!inStock && (
          <Badge variant="muted" size="sm">
            Esgotado
          </Badge>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <Badge variant="warning" size="sm">
            Últimas {product.stock}un
          </Badge>
        )}
      </div>

      {/* Ações rápidas */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
        <button
          onClick={handleWishlist}
          className="w-8 h-8 rounded-lg bg-(--color-bg-primary)/80 backdrop-blur flex items-center justify-center hover:bg-(--color-bg-hover) transition-colors"
          title="Adicionar à wishlist"
        >
          {wishlisted ? (
            <RiHeartFill size={15} className="text-(--color-danger)" />
          ) : (
            <RiHeartLine
              size={15}
              className="text-(--color-text-secondary)"
            />
          )}
        </button>
        <button
          onClick={handleCompare}
          className={cn(
            "w-8 h-8 rounded-lg backdrop-blur flex items-center justify-center transition-colors",
            inCompare
              ? "bg-(--color-accent)/20 text-(--color-accent)"
              : "bg-(--color-bg-primary)/80 text-(--color-text-secondary) hover:bg-(--color-bg-hover)",
          )}
          title="Comparar produto"
        >
          <RiScalesLine size={15} />
        </button>
        <Link
          to={`/products/${product.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 rounded-lg bg-(--color-bg-primary)/80 backdrop-blur flex items-center justify-center hover:bg-(--color-bg-hover) transition-colors"
          title="Ver produto"
        >
          <RiEyeLine size={15} className="text-(--color-text-secondary)" />
        </Link>
      </div>

      {/* Imagem */}
      <div className="relative aspect-square bg-(--color-bg-hover) overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <RiShoppingCartLine
              size={40}
              className="text-(--color-text-muted)"
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {product.brand && (
          <span className="text-[10px] font-medium text-(--color-text-muted) uppercase tracking-wider">
            {product.brand}
          </span>
        )}

        <h3 className="text-sm text-(--color-text-primary) line-clamp-2 leading-snug flex-1 group-hover:text-(--color-accent) transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product?.avgRating && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.avgRating} size={12} />
            <span className="text-[11px] text-(--color-text-muted)">
              ({product?.reviews ?? 0})
            </span>
          </div>
        )}

        {/* Preço + CTA */}
        <div className="flex items-end justify-between gap-2 mt-auto pt-1">
          <div>
            {product.comparePrice &&
              Number(product.comparePrice) > Number(product.price) && (
                <p className="text-[11px] text-(--color-text-muted) line-through">
                  {formatPrice(product.comparePrice)}
                </p>
              )}
            <p className="text-base font-bold text-(--color-price) text-display">
              {formatPrice(product.price)}
            </p>
            <p className="text-[10px] text-(--color-text-muted)">
              12x {formatPrice(Number(product.price) / 12)} s/juros
            </p>
          </div>

          <button
            onClick={handleAddCart}
            disabled={!inStock || addingCart}
            className={cn(
              "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
              inStock
                ? "bg-(--color-accent) text-(--color-bg-primary) hover:brightness-110 active:scale-90 shadow-[0_0_12px_var(--color-accent-glow)]"
                : "bg-(--color-bg-hover) text-(--color-text-muted) cursor-not-allowed",
            )}
          >
            <RiShoppingCartLine size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
