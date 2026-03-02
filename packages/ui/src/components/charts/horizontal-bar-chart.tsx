"use client";

import React, { Suspense } from "react";
import type { ApexOptions } from "apexcharts";

// @ts-ignore
const Chart = React.lazy(() => import("react-apexcharts"));

interface HorizontalBarChartProps {
  data: { name: string; data: number[] }[];
  categories: string[];
  title?: string;
  height?: number;
  colors?: string[];
}

export function HorizontalBarChart({
  data,
  categories,
  title,
  height = 350,
  colors = ["#F43F5E", "#FB923C", "#FBBF24", "#10B981", "#FB7185"],
}: HorizontalBarChartProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      toolbar: { show: false },
    },
    colors,
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "70%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (value: number) => {
        return new Intl.NumberFormat("en-KE", {
          style: "currency",
          currency: "KES",
          minimumFractionDigits: 0,
          notation: "compact",
        }).format(value);
      },
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "hsl(var(--border))",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "hsl(var(--muted-foreground))" },
        formatter: (value: string) => {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) return value;
          return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 0,
            notation: "compact",
          }).format(numValue);
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "hsl(var(--muted-foreground))" },
        maxWidth: 150,
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value: number) => {
          return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
          }).format(value);
        },
      },
    },
  };

  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="h-87.5 w-full bg-gray-100 animate-pulse rounded-md" />
        }
      >
        {isClient && (
          <Chart
            options={options}
            series={data}
            type="bar"
            height={height}
            width="100%"
          />
        )}
      </Suspense>
    </div>
  );
}
