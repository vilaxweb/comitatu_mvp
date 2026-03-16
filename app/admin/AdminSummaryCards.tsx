"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type SummaryCardProps = {
  title: string;
  description: string;
  total: number;
};

function buildFlatSeries(total: number) {
  const base = Array.from({ length: 7 }, () => total);
  return base.map((value, index) => ({
    label: `D-${base.length - 1 - index}`,
    value,
  }));
}

function SummaryCard({ title, description, total }: SummaryCardProps) {
  const data = buildFlatSeries(total);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="flex-1 truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center text-muted-foreground/70 hover:text-muted-foreground"
                aria-label={description}
              >
                <Info className="size-3" aria-hidden />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>{description}</TooltipContent>
          </Tooltip>
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <p className="text-3xl font-semibold text-foreground">{total}</p>
          <div className="h-10 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
              >
                <XAxis dataKey="label" hide />
                <YAxis hide domain={[0, "dataMax + 1"]} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f97316"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function AdminSummaryCards({
  totalActiveUsers,
  totalAvailableProviders,
  totalActiveCustomers,
  totalActiveAdmins,
}: {
  totalActiveUsers: number;
  totalAvailableProviders: number;
  totalActiveCustomers: number;
  totalActiveAdmins: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Usuarios activos"
        description="Total de cuentas con estado activo."
        total={totalActiveUsers}
      />
      <SummaryCard
        title="Proveedores disponibles"
        description="Proveedores con cuenta activa en la plataforma."
        total={totalAvailableProviders}
      />
      <SummaryCard
        title="Clientes activos"
        description="Clientes con cuenta activa listos para contratar servicios."
        total={totalActiveCustomers}
      />
      <SummaryCard
        title="Administradores activos"
        description="Cuentas de administrador con acceso al panel."
        total={totalActiveAdmins}
      />
    </div>
  );
}

