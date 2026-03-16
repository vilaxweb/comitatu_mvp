 "use client";
 
 import * as React from "react";
 import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

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
  const gradientId = React.useId().replace(/:/g, "");

  const chartConfig: ChartConfig = {
    value: {
      label: title,
      color: "#f97316",
    },
  };

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
          <ChartContainer config={chartConfig} className="h-10 w-20">
            <AreaChart
              data={data}
              margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" hide />
              <YAxis hide domain={[0, "dataMax + 1"]} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    indicator="line"
                    labelKey="label"
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                fill={`url(#${gradientId})`}
                strokeWidth={1.5}
                fillOpacity={0.2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
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

