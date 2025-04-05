"use client"

import { useRef, useEffect } from "react"
import { Chart, type ChartConfiguration } from "chart.js/auto"

export default function HealthMetrics() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    updateHealthChart()

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  const updateHealthChart = () => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")

      if (ctx) {
        // Sample health data (in a real app, this would come from a health API or device)
        const healthData = {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          steps: [6500, 8200, 7800, 9100, 8400, 10200, 8432],
          sleep: [6.8, 7.2, 6.5, 7.8, 7.0, 8.5, 7.2],
        }

        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        // Create new chart
        const config: ChartConfiguration = {
          type: "line",
          data: {
            labels: healthData.labels,
            datasets: [
              {
                label: "Steps",
                data: healthData.steps,
                borderColor: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                tension: 0.4,
                fill: true,
                yAxisID: "y",
              },
              {
                label: "Sleep (hours)",
                data: healthData.sleep,
                borderColor: "#8b5cf6",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                tension: 0.4,
                fill: true,
                yAxisID: "y1",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              y: {
                type: "linear",
                display: true,
                position: "left",
                beginAtZero: true,
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              },
              y1: {
                type: "linear",
                display: true,
                position: "right",
                beginAtZero: true,
                max: 10,
                grid: {
                  drawOnChartArea: false,
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              },
              x: {
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              },
            },
          },
        }

        chartInstance.current = new Chart(ctx, config)
      }
    }
  }

  return (
    <div className="mirror-card rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4">Health Metrics</h3>
      <div className="chart-container mb-4">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center">
          <div className="text-xs text-gray-400">Steps</div>
          <div className="text-2xl font-bold">8,432</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Sleep</div>
          <div className="text-2xl font-bold">7.2h</div>
        </div>
      </div>
    </div>
  )
}

