"use client";

import React, { Suspense } from "react";
import type { ApexOptions } from "apexcharts";

// @ts-ignore
const Chart = React.lazy(() => import("react-apexcharts"));

interface DonutChartProps {
  data: number[];
  labels: string[];
  title?: string;
  height?: number;
  colors?: string[];
  formatAsCurrency?: boolean;
}

export function DonutChart({
  data,
  labels,
  title,
  height = 350,
  colors = ["#F43F5E", "#FB923C", "#FBBF24", "#10B981", "#FB7185"],
  formatAsCurrency = false,
}: DonutChartProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    colors,
    labels,
    ...(title && {
      title: {
        text: title,
        align: "left",
        offsetY: 0,
        style: {
          fontSize: "16px",
          fontWeight: "600",
        },
      },
    }),
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return `${val.toFixed(1)}%`;
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "hsl(var(--muted-foreground))",
      },
    },
    stroke: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value: number) => {
          if (formatAsCurrency) {
            return new Intl.NumberFormat("en-KE", {
              style: "currency",
              currency: "KES",
            }).format(value);
          }
          return value.toLocaleString();
        },
      },
    },
  };

  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="h-87.5 w-full animate-pulse bg-muted rounded-md" />
        }
      >
        {isClient && (
          <Chart options={options} series={data} type="donut" height={height} />
        )}
      </Suspense>
    </div>
  );
}
