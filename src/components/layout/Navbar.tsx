import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  RiSearchLine,
  RiShoppingCartLine,
  RiHeartLine,
  RiUserLine,
  RiMenuLine,
  RiCloseLine,
  RiShieldLine,
  RiFlashlightLine,
} from "react-icons/ri";
import { searchService, type Product } from "../../service/types";
import { useCartStore } from "../../store/cart.store";
import { useAuthStore } from "../../store/auth.store";
import { cn, debounce, formatPrice } from "../../utils/utils";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { totalItems, toggleCart } = useCartStore();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fechar mobile ao navegar
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const fetchSuggestions = debounce(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const { data } = await searchService.autocomplete(q);
      setSuggestions(data || []);
    } catch {}
  }, 300);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setShowSuggestions(false);
    }
  };

  const navLinks = [
    { label: "Hardware", href: "/products?categoryId=hardware" },
    { label: "PCs Gamer", href: "/pc-builder" },
    { label: "Periféricos", href: "/products?categoryId=perifericos" },
    { label: "Monitores", href: "/products?categoryId=monitores" },
    {
      label: "Ofertas",
      href: "/offers",
      icon: (
        <RiFlashlightLine size={14} className="text-[var(--color-accent)]" />
      ),
    },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--color-bg-primary)]/95 backdrop-blur-md border-b border-[var(--color-border)]"
          : "bg-transparent",
      )}
    >
      {/* Top bar */}
      <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] py-1.5 px-4 hidden md:flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <span>Frete grátis para Sul e Sudeste acima de R$299</span>
        <div className="flex items-center gap-4">
          <span>PIX com 15% de desconto</span>
          <span className="text-[var(--color-accent)]">
            Parcele em até 12x sem juros
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg-primary)] font-bold text-sm group-hover:scale-110 transition-transform">
            G
          </div>
          <span className="text-display font-bold text-lg text-[var(--color-text-primary)] hidden sm:block">
            GAMER<span className="text-[var(--color-accent)]">STORE</span>
          </span>
        </Link>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-xl relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <RiSearchLine
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                  fetchSuggestions(e.target.value);
                }}
                onFocus={() => search && setShowSuggestions(true)}
                placeholder="Buscar produtos, marcas..."
                className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-all"
              />
            </div>
          </form>

          {/* Autocomplete */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-2xl z-50">
              {suggestions.map((product: Product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    navigate(`/products/${product.slug}`);
                    setSearch("");
                    setShowSuggestions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-bg-hover)] transition-colors text-left"
                >
                  {product.images[0] && (
                    <img
                      src={product.images.map(imgUrl => imgUrl)[0]}
                      alt={product.name}
                      className="w-8 h-8 object-contain rounded shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--color-text-primary)] truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-[var(--color-accent)]">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSearch}
                className="w-full px-4 py-2.5 text-sm text-[var(--color-accent)] hover:bg-[var(--color-bg-hover)] transition-colors flex items-center gap-2 border-t border-[var(--color-border)]"
              >
                <RiSearchLine size={14} />
                Ver todos os resultados para "{search}"
              </button>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center gap-1 shrink-0">
          <Link to="/wishlist">
            <button className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors hidden md:flex">
              <RiHeartLine size={20} />
            </button>
          </Link>

          {isAuthenticated ? (
            <Link to={user?.role !== "USER" ? "/admin" : "/account"}>
              <button className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5 hidden md:flex">
                {user?.role !== "USER" ? (
                  <RiShieldLine
                    size={20}
                    className="text-[var(--color-accent)]"
                  />
                ) : (
                  <RiUserLine size={20} />
                )}
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors hidden md:flex">
                <RiUserLine size={20} />
              </button>
            </Link>
          )}

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-lg hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
          >
            <RiShoppingCartLine size={22} />
            {totalItems() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[var(--color-accent)] text-[var(--color-bg-primary)] text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {totalItems()}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] transition-colors md:hidden"
          >
            {mobileOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
          </button>
        </div>
      </div>

      {/* Nav links */}
      <div className="border-t border-[var(--color-border)] hidden md:block">
        <div className="max-w-[1440px] mx-auto px-6 h-10 flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors py-2"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[var(--color-border)] flex gap-2">
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="flex-1 py-2 text-center text-sm text-[var(--color-accent)]"
                >
                  Minha Conta
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex-1 py-2 text-center text-sm text-[var(--color-text-secondary)]"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 py-2 text-center text-sm text-[var(--color-accent)] font-medium"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
