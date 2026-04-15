import { useQuery } from "@tanstack/react-query";

import {
  RiShoppingBagLine,
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiAlertLine,
  RiArrowUpLine,
} from "react-icons/ri";
import { adminService } from "../service/types";
import { Badge, Spinner } from "../components/ui";
import { formatPrice, relativeDate } from "../utils/utils";

type DashboardData = {
  revenue: {
    total: number;
    today: number;
    thisMonth: number;
  };
  recentOrders: {
    id: string;
    total: number;
    createdAt: string;
    orderNumber: number;
    status: string;
  }[];
  topProducts: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  overview: {
    ordersToday: number;
    ordersThisMonth: number;
    users: number;
    products: number;
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    revenue: {
      total: number;
      thisMonth: number;
    };
    newUsersToday: number;
    newUsersThisMonth: number;
    newProductsToday: number;
    newProductsThisMonth: number;
    pendingOrders: number;
    lowStockProducts: number;
  };
};

export function AdminPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.dashboard().then((r) => r.data),
    refetchInterval: 30000,
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={32} />
      </div>
    );

  const d = data!;

  const metricCards = [
    {
      label: "Receita hoje",
      value: formatPrice(d.revenue.today),
      icon: <RiMoneyDollarCircleLine size={20} />,
      color: "text-[var(--color-price)]",
    },
    {
      label: "Receita do mês",
      value: formatPrice(d.revenue.thisMonth),
      icon: <RiArrowUpLine size={20} />,
      color: "text-[var(--color-success)]",
    },
    {
      label: "Pedidos hoje",
      value: d.overview.ordersToday,
      icon: <RiShoppingBagLine size={20} />,
      color: "text-[var(--color-accent)]",
    },
    {
      label: "Novos usuários",
      value: d.overview.newUsersToday,
      icon: <RiUserLine size={20} />,
      color: "text-[var(--color-accent)]",
    },
    {
      label: "Pedidos pendentes",
      value: d.overview.pendingOrders,
      icon: <RiAlertLine size={20} />,
      color: "text-[var(--color-warning)]",
    },
    {
      label: "Estoque baixo",
      value: d.overview.lowStockProducts,
      icon: <RiAlertLine size={20} />,
      color: "text-[var(--color-danger)]",
    },
  ];

  const statusMap: Record<string, any> = {
    PENDING: "warning",
    PAYMENT_CONFIRMED: "success",
    PROCESSING: "accent",
    SHIPPED: "accent",
    DELIVERED: "success",
    CANCELLED: "danger",
  };

  return (
    <main className="max-w-360 mx-auto px-4 md:px-6 pt-32 pb-20 space-y-8">
      <div>
        <h1 className="text-display font-bold text-3xl text-text-primary">
          🛡️ Painel Admin
        </h1>
        <p className="text-text-muted mt-1">
          Visão geral em tempo real
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((m) => (
          <div key={m.label} className="card-base p-4 space-y-2">
            <div className={`${m.color}`}>{m.icon}</div>
            <p className="text-xl font-bold text-display text-text-primary">
              {m.value}
            </p>
            <p className="text-xs text-text-muted">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pedidos recentes */}
        <div className="card-base p-5">
          <h2 className="text-display font-semibold text-text-primary mb-4">
            Pedidos Recentes
          </h2>
          <div className="space-y-2">
            {d.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-text-muted">
                    {relativeDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusMap[order.status] ?? "muted"} size="sm">
                    {order.status}
                  </Badge>
                  <span className="text-sm font-bold text-price">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top produtos */}
        <div className="card-base p-5">
          <h2 className="text-display font-semibold text-text-primary mb-4">
            Mais Vendidos
          </h2>
          <div className="space-y-3">
            {d.topProducts.map((p: any, i: number) => (
              <div key={p.productId} className="flex items-center gap-3">
                <span className="w-6 text-center text-sm font-bold text-text-muted">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">
                    {p.productName}
                  </p>
                  <p className="text-xs text-text-muted">
                    {p._sum.quantity} vendas
                  </p>
                </div>
                <span className="text-sm font-bold text-price shrink-0">
                  {formatPrice(p._sum.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumo geral */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total de usuários", value: d.overview.totalUsers },
          { label: "Total de produtos", value: d.overview.totalProducts },
          { label: "Total de pedidos", value: d.overview.totalOrders },
          { label: "Receita total", value: formatPrice(d.revenue.total) },
        ].map((s) => (
          <div key={s.label} className="card-base p-4 text-center">
            <p className="text-2xl font-bold text-display text-text-primary">
              {s.value}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
