import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RiLockLine, RiMailLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Input } from "../components/ui";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/auth.store";

// ─── Login ─────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await login(data);
      toast.success("Bem-vindo!");
      navigate("/");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Credenciais inválidas");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-display font-bold text-3xl text-text-primary">
            Entrar
          </h1>
          <p className="text-text-muted mt-2">
            Acesse sua conta GamerStore
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card-base p-6 space-y-4"
        >
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            leftIcon={<RiMailLine size={16} />}
            error={errors.email?.message as string}
            {...register("email")}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            leftIcon={<RiLockLine size={16} />}
            error={errors.password?.message as string}
            {...register("password")}
          />
          <Button type="submit" fullWidth size="lg" loading={isLoading}>
            Entrar
          </Button>
          <p className="text-center text-sm text-text-muted">
            Não tem conta?{" "}
            <Link
              to="/register"
              className="text-accent hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
