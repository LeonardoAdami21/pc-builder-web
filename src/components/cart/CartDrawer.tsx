import { useNavigate } from "react-router-dom";
import {
  RiCloseLine,
  RiDeleteBinLine,
  RiAddLine,
  RiSubtractLine,
  RiShoppingCartLine,
} from "react-icons/ri";
import { useCartStore } from "../../store/cart.store";
import { Button } from "../ui/Button";
import { formatPrice } from "../../utils/utils";

export function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    toggleCart,
    removeItem,
    updateQty,
    formattedTotal,
    totalItems,
  } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-bg-secondary border-l border-border z-50 flex flex-col"
        style={{ animation: "slideInRight 0.3s var(--ease-out-expo)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <RiShoppingCartLine
              size={20}
              className="text-accent"
            />
            <h2 className="text-display font-semibold text-text-primary">
              Carrinho
              {totalItems() > 0 && (
                <span className="ml-2 text-sm font-normal text-text-muted">
                  ({totalItems()} {totalItems() === 1 ? "item" : "itens"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={toggleCart}
            className="p-1.5 rounded-lg hover:bg-(--color-bg-hover) text-(--color-text-muted) transition-colors"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-(--color-bg-card) flex items-center justify-center">
                <RiShoppingCartLine
                  size={32}
                  className="text-(--color-text-muted)"
                />
              </div>
              <div>
                <p className="text-(--color-text-secondary) font-medium">
                  Seu carrinho está vazio
                </p>
                <p className="text-sm text-(--color-text-muted) mt-1">
                  Adicione produtos para continuar
                </p>
              </div>
              <Button variant="outline" onClick={toggleCart}>
                Explorar produtos
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 rounded-xl bg-(--color-bg-card) border border-(--color-border)"
              >
                {/* Imagem */}
                <div className="w-16 h-16 rounded-lg bg-(--color-bg-hover) flex items-center justify-center shrink-0 overflow-hidden">
                  {item.product.images[0] ? (
                    <img
                      src={item.product.url}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <RiShoppingCartLine
                      size={24}
                      className="text-text-muted"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-(--color-text-primary) line-clamp-2 leading-tight">
                    {item.product.name}
                  </p>
                  <p className="text-(--color-accent) font-semibold text-sm mt-1">
                    {formatPrice(item.product.price)}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQty(item.product.id, item.quantity - 1)
                      }
                      className="w-7 h-7 rounded-lg bg-(--color-bg-hover) flex items-center justify-center text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-border) transition-colors"
                    >
                      <RiSubtractLine size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-(--color-text-primary)">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQty(item.product.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.product.stock}
                      className="w-7 h-7 rounded-lg bg-(--color-bg-hover) flex items-center justify-center text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-border) transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <RiAddLine size={14} />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto p-1.5 rounded-lg hover:bg-red-950/30 text-(--color-text-muted) hover:text-(--color-danger) transition-colors"
                    >
                      <RiDeleteBinLine size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-(--color-border) space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-(--color-text-secondary)">
                Subtotal
              </span>
              <span className="text-display font-bold text-xl text-(--color-text-primary)">
                {formattedTotal()}
              </span>
            </div>
            <p className="text-xs text-(--color-text-muted)">
              Frete e descontos calculados no checkout
            </p>
            <Button
              fullWidth
              size="lg"
              onClick={() => {
                navigate("/checkout");
                toggleCart();
              }}
            >
              Finalizar Compra
            </Button>
            <Button fullWidth variant="ghost" onClick={toggleCart}>
              Continuar Comprando
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
