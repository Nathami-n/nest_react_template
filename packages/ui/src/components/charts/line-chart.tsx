"use client";

import React, { Suspense } from "react";
import type { ApexOptions } from "apexcharts";

// @ts-ignore
const Chart = React.lazy(() => import("react-apexcharts"));

interface LineChartProps {
  data: { name: string; data: number[] }[];
  categories: string[];
  title?: string;
  height?: number;
  colors?: string[];
}

export function LineChart({
  data,
  categories,
  title,
  height = 350,
  colors = ["#F43F5E", "#FB923C", "#FBBF24", "#10B981", "#FB7185"],
}: LineChartProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      fontFamily: "inherit",
    },
    colors,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    title: title
      ? {
        text: title,
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: 600,
        }
      }
      : undefined,
    grid: {
      borderColor: "hsl(var(--border))",
      strokeDashArray: 4,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "hsl(var(--muted-foreground))",
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "hsl(var(--muted-foreground))",
        },
        formatter: (value: number) => {
          return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 0,
            notation: "compact"
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
          }).format(value);
        },
      },
    },
  };

  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="h-[350px] w-full animate-pulse bg-muted rounded-md" />
        }
      >
        {isClient && (
          <Chart options={options} series={data} type="line" height={height} />
        )}
      </Suspense>
    </div>
  );
}
