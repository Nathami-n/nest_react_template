"use client";

import React, { Suspense } from "react";
import type { ApexOptions } from "apexcharts";

// @ts-ignore
const Chart = React.lazy(() => import("react-apexcharts"));

interface AreaChartProps {
  data: { name: string; data: number[] }[];
  categories: string[];
  title?: string;
  height?: number;
  colors?: string[];
}

export function AreaChart({
  data,
  categories,
  title,
  height = 350,
  colors = ["#F43F5E", "#FB923C", "#FBBF24", "#10B981", "#FB7185"],
}: AreaChartProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "inherit",
      toolbar: { show: false }
    },
    colors,
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    grid: {
      borderColor: "hsl(var(--border))",
      strokeDashArray: 4,
      show: true,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "hsl(var(--muted-foreground))" }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "hsl(var(--muted-foreground))" },
        formatter: (value: number) => {
          return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 0,
            notation: "compact",
          }).format(value);
        },
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value: number) => {
          return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 0,
          }).format(value);
        }
      }
    }
  };

  return (
    <div className="w-full text-black">
      <Suspense fallback={<div className="h-[350px] w-full bg-gray-100 animate-pulse" />}>
        {isClient && (
          <Chart options={options} series={data} type="area" height={height} width="100%" />
        )}
      </Suspense>
    </div>
  );
}
