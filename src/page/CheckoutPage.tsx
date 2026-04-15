import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cart.store";
import { formatPrice } from "../utils/utils";

export function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading] = useState(false);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (items.length === 0) {
    navigate("/");
    return null;
  }

  return (
    <main className="max-w-360 mx-auto px-4 md:px-6 pt-32 pb-20">
      <h1 className="text-display font-bold text-2xl text-text-primary mb-8">
        Finalizar Compra
      </h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="card-base p-6">
          <h2 className="text-display font-semibold text-text-primary mb-4">
            Resumo do pedido
          </h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between text-sm"
              >
                <span className="text-text-secondary truncate pr-4">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="text-text-primary shrink-0">
                  {formatPrice(Number(item.product.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-price text-xl text-display">
              {formatPrice(totalPrice())}
            </span>
          </div>
        </div>
        <div className="card-base p-6 space-y-4 h-fit">
          <p className="text-sm text-text-muted">
            <span>
              Ao confirmar o pedido, você concorda com nossos termos de uso.
            </span>
          </p>
          <Button fullWidth size="lg" loading={loading}>
            Confirmar Pedido
          </Button>
        </div>
      </div>
    </main>
  );
}
