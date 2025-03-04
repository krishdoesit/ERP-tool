"use client";

import { Widget, dummyData } from "@/lib/data";
import { get } from "lodash";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WidgetRendererProps {
  widget: Widget;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const formatValue = (value: any) => {
    if (typeof value === "number") {
      if (
        widget.title.toLowerCase().includes("revenue") ||
        widget.title.toLowerCase().includes("expense") ||
        widget.title.toLowerCase().includes("sales")
      ) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(value);
      }
      
      if (
        widget.title.toLowerCase().includes("rate") ||
        widget.title.toLowerCase().includes("percentage")
      ) {
        return `${value.toFixed(1)}%`;
      }
      
      return value.toLocaleString();
    }
    
    return value;
  };

  const renderStatCard = () => {
    const fieldPath = widget.fields[0];
    const value = get(dummyData, fieldPath);
    
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-3xl font-bold">{formatValue(value)}</div>
        <div className="text-sm text-muted-foreground mt-1">{fieldPath.split(".").pop()}</div>
      </div>
    );
  };

  const renderBarChart = () => {
    const fieldPath = widget.fields[0];
    const data = get(dummyData, fieldPath);
    
    if (!data || typeof data !== "object") return null;
    
    const chartData = Object.entries(data).map(([name, value]) => ({
      name,
      value,
    }));
    
    return (
      <ResponsiveContainer width="100%" height={widget.height > 1 ? 300 : 150}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* Fix Recharts defaultProps warnings by providing explicit props */}
          <XAxis dataKey="name" scale="auto" allowDataOverflow={false} />
          <YAxis scale="auto" allowDataOverflow={false} />
          <Tooltip formatter={(value) => formatValue(value)} />
          <Bar dataKey="value" fill="hsl(var(--chart-1))" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    const fieldPath = widget.fields[0];
    const data = get(dummyData, fieldPath);
    
    if (!data || typeof data !== "object") return null;
    
    const chartData = Object.entries(data).map(([name, value]) => ({
      name,
      value,
    }));
    
    return (
      <ResponsiveContainer width="100%" height={widget.height > 1 ? 300 : 150}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatValue(value)} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderLineChart = () => {
    const fieldPath = widget.fields[0];
    const data = get(dummyData, fieldPath);
    
    if (!data || typeof data !== "object") return null;
    
    const chartData = Object.entries(data).map(([name, value]) => ({
      name,
      value,
    }));
    
    return (
      <ResponsiveContainer width="100%" height={widget.height > 1 ? 300 : 150}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* Fix Recharts defaultProps warnings by providing explicit props */}
          <XAxis dataKey="name" scale="auto" allowDataOverflow={false} />
          <YAxis scale="auto" allowDataOverflow={false} />
          <Tooltip formatter={(value) => formatValue(value)} />
          <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderAreaChart = () => {
    const fieldPath = widget.fields[0];
    const data = get(dummyData, fieldPath);
    
    if (!data || typeof data !== "object") return null;
    
    const chartData = Object.entries(data).map(([name, value]) => ({
      name,
      value,
    }));
    
    return (
      <ResponsiveContainer width="100%" height={widget.height > 1 ? 300 : 150}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* Fix Recharts defaultProps warnings by providing explicit props */}
          <XAxis dataKey="name" scale="auto" allowDataOverflow={false} />
          <YAxis scale="auto" allowDataOverflow={false} />
          <Tooltip formatter={(value) => formatValue(value)} />
          <Area type="monotone" dataKey="value" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderTable = () => {
    const fieldPath = widget.fields[0];
    const data = get(dummyData, fieldPath);
    
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    
    const columns = Object.keys(data[0]);
    
    return (
      <div className="max-h-[300px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {typeof row[column] === "number"
                      ? formatValue(row[column])
                      : row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderKpiCard = () => {
    const fieldPath = widget.fields[0];
    const value = get(dummyData, fieldPath);
    const targetPath = widget.fields[1];
    const targetValue = targetPath ? get(dummyData, targetPath) : null;
    
    const percentage = targetValue ? (value / targetValue) * 100 : null;
    
    return (
      <div className="flex flex-col h-full justify-center">
        <div className="text-3xl font-bold">{formatValue(value)}</div>
        <div className="text-sm text-muted-foreground mt-1">{fieldPath.split(".").pop()}</div>
        {targetValue && (
          <div className="mt-2">
            <div className="text-xs text-muted-foreground">Target: {formatValue(targetValue)}</div>
            <div className="h-2 bg-secondary mt-1 rounded-full">
              <div
                className="h-2 bg-primary rounded-full"
                style={{ width: `${Math.min(percentage!, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  switch (widget.type) {
    case "bar-chart":
      return renderBarChart();
    case "pie-chart":
      return renderPieChart();
    case "line-chart":
      return renderLineChart();
    case "area-chart":
      return renderAreaChart();
    case "stat-card":
      return renderStatCard();
    case "table":
      return renderTable();
    case "kpi-card":
      return renderKpiCard();
    default:
      return <div>Unsupported widget type</div>;
  }
}