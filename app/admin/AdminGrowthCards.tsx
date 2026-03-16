 "use client";

 import * as React from "react";
 import { Area, AreaChart, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
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

type GrowthSeriesProps = {
  title: string;
  description: string;
  total: number;
  data: number[];
};

function buildChartData(series: number[], total: number) {
  const baseSeries =
    series && series.length
      ? series
      : // si no hay serie, generamos 7 puntos constantes
        Array.from({ length: 7 }, () => total);

  return baseSeries.map((value, index) => ({
    label: `D-${baseSeries.length - 1 - index}`,
    value,
  }));
}

function GrowthCard({ title, description, total, data }: GrowthSeriesProps) {
  const chartData = buildChartData(data, total);
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
          <p className="text-2xl font-semibold text-foreground">{total}</p>
          <ChartContainer config={chartConfig} className="h-14 w-24">
            <AreaChart
              data={chartData}
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

export function AdminGrowthCards({
  newUsersLast7Days,
  newProvidersLast7Days,
  newServicesLast7Days,
  newUsersSeriesLast7Days,
  newProvidersSeriesLast7Days,
  newServicesSeriesLast7Days,
}: {
  newUsersLast7Days: number;
  newProvidersLast7Days: number;
  newServicesLast7Days: number;
  newUsersSeriesLast7Days: number[];
  newProvidersSeriesLast7Days: number[];
  newServicesSeriesLast7Days: number[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Growth</h3>
      <p className="text-xs text-muted-foreground">
        Evolución de altas en los últimos 7 días.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <GrowthCard
          title="Nuevos usuarios"
          description="Cuentas creadas en los últimos 7 días."
          total={newUsersLast7Days}
          data={newUsersSeriesLast7Days}
        />
        <GrowthCard
          title="Nuevos proveedores"
          description="Proveedores que se han dado de alta en los últimos 7 días."
          total={newProvidersLast7Days}
          data={newProvidersSeriesLast7Days}
        />
        <GrowthCard
          title="Nuevos servicios"
          description="Servicios creados en la plataforma en los últimos 7 días."
          total={newServicesLast7Days}
          data={newServicesSeriesLast7Days}
        />
      </div>
    </div>
  );
}

