import { useQuery } from "@tanstack/react-query";
import { orderService, userService } from "../service/types";
import { useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { RiHeartLine, RiMapPinLine, RiShoppingBagLine } from "react-icons/ri";
import { Button } from "../components/ui/Button";
import { formatPrice, relativeDate } from "../utils/utils";
import { Badge } from "../components/ui";
import { ProductCard } from "../components/product/ProducCart";

export function AccountPage() {
  const { user, logout } = useAuthStore();
  const [tab, setTab] = useState<"orders" | "wishlist" | "addresses">("orders");

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.list().then((r) => r.data),
  });
  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => userService.wishlist().then((r) => r.data),
  });

  const statusMap: Record<string, { label: string; variant: any }> = {
    PENDING: { label: "Pendente", variant: "warning" },
    PAYMENT_CONFIRMED: { label: "Pago", variant: "success" },
    PROCESSING: { label: "Preparando", variant: "accent" },
    SHIPPED: { label: "Enviado", variant: "accent" },
    DELIVERED: { label: "Entregue", variant: "success" },
    CANCELLED: { label: "Cancelado", variant: "danger" },
  };

  return (
    <main className="max-w-360 mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-3">
          <div className="card-base p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-accent">
              {user?.name?.[0]}
            </div>
            <p className="font-semibold text-text-primary">{user?.name}</p>
            <p className="text-xs text-text-muted">{user?.email}</p>
          </div>

          {[
            {
              key: "orders",
              label: "Meus Pedidos",
              icon: <RiShoppingBagLine size={16} />,
            },
            {
              key: "wishlist",
              label: "Lista de Desejos",
              icon: <RiHeartLine size={16} />,
            },
            {
              key: "addresses",
              label: "Endereços",
              icon: <RiMapPinLine size={16} />,
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as any)}
              className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors ${tab === item.key ? "bg-accent-subtle text-accent" : "text-text-secondary hover:bg-bg-hover"}`}
            >
              {item.icon} {item.label}
            </button>
          ))}

          <Button variant="ghost" size="sm" fullWidth onClick={logout}>
            Sair da conta
          </Button>
        </aside>

        {/* Conteúdo */}
        <div>
          {tab === "orders" && (
            <div className="space-y-4">
              <h2 className="text-display font-bold text-xl text-text-primary">
                Meus Pedidos
              </h2>
              {!(orders as any)?.items?.length ? (
                <p className="text-text-muted">Nenhum pedido ainda</p>
              ) : (
                (orders as any).items.map((order: any) => (
                  <div key={order.id} className="card-base p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-text-muted">
                          {relativeDate(order.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant={statusMap[order.status]?.variant ?? "muted"}
                      >
                        {statusMap[order.status]?.label ?? order.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">
                        {order.items?.length} item(s)
                      </span>
                      <span className="font-bold text-price">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              <h2 className="text-display font-bold text-xl text-text-primary mb-6">
                Lista de Desejos
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(wishlist as any[])?.map(({ product }: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {tab === "addresses" && (
            <div>
              <h2 className="text-display font-bold text-xl text-text-primary mb-6">
                Endereços
              </h2>
              <p className="text-text-muted">
                Gerencie seus endereços de entrega
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
