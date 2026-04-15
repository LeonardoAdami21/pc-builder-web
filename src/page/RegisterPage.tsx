import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Input } from "../components/ui";
import { RiLockLine, RiMailLine, RiUserLine } from "react-icons/ri";
import { Button } from "../components/ui/Button";
import { z } from "zod";

// ─── Register ──────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Use maiúscula, minúscula e número",
    ),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);
      toast.success("Conta criada! Bem-vindo!");
      navigate("/");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Erro ao criar conta");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-display font-bold text-3xl text-text-primary">
            Criar conta
          </h1>
          <p className="text-text-muted mt-2">
            Comece a comprar agora
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card-base p-6 space-y-4"
        >
          <Input
            label="Nome completo"
            placeholder="João Silva"
            leftIcon={<RiUserLine size={16} />}
            error={errors.name?.message as string}
            {...register("name")}
          />
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
            placeholder="Mín. 8 caracteres"
            leftIcon={<RiLockLine size={16} />}
            error={errors.password?.message as string}
            {...register("password")}
          />
          <Button type="submit" fullWidth size="lg" loading={isLoading}>
            Criar conta
          </Button>
          <p className="text-center text-sm text-text-muted">
            Já tem conta?{" "}
            <Link
              to="/login"
              className="text-accent hover:underline"
            >
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};
export default RegisterPage;
