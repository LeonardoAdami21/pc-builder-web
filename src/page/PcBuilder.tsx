import { PcBuilder } from "../components/pc-builder/PcBuilder";

export function PcBuilderPage() {
  return (
    <main className="max-w-360 mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="mb-8">
        <h1 className="text-display font-bold text-3xl text-text-primary">
          🖥️ Monte seu PC
        </h1>
        <p className="text-text-muted mt-2">
          Selecione os componentes e verifique a compatibilidade automaticamente
        </p>
      </div>
      <PcBuilder />
    </main>
  );
}
