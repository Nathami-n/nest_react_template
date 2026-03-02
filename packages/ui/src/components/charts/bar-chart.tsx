"use client";

import React, { Suspense } from "react";
import type { ApexOptions } from "apexcharts";

// @ts-ignore
const Chart = React.lazy(() => import("react-apexcharts"));

interface BarChartProps {
  data: { name: string; data: number[] }[];
  categories: string[];
  title?: string;
  height?: number;
  horizontal?: boolean;
  colors?: string[];
}

export function BarChart({
  data,
  categories,
  title,
  height = 350,
  horizontal = false,
  colors = ["#F43F5E", "#FB923C", "#FBBF24", "#10B981", "#FB7185"],
}: BarChartProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      toolbar: { show: false }
    },
    colors,
    plotOptions: {
      bar: {
        horizontal,
        borderRadius: 4,
        columnWidth: '50%',
        distributed: colors.length > 1,
      },
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    grid: {
      borderColor: "hsl(var(--border))",
      strokeDashArray: 4,
      show: true,
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "hsl(var(--muted-foreground))" },
        formatter: horizontal ? (value: number) => {
          return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 0,
            notation: "compact",
          }).format(value);
        } : undefined
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "hsl(var(--muted-foreground))" },
        formatter: horizontal ? undefined : (value: number) => value.toFixed(0)
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
          <Chart options={options} series={data} type="bar" height={height} width="100%" />
        )}
      </Suspense>
    </div>
  );
}
