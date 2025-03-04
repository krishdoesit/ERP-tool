"use client";

import { useState } from "react";
import { Widget, WidgetType } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WidgetEditor } from "./widget-editor";
import { BarChart, PieChart, LineChart, AreaChart, Table2, Activity, BarChart4 } from "lucide-react";

interface WidgetPaletteProps {
  onAddWidget: (widget: Widget) => void;
}

export function WidgetPalette({ onAddWidget }: WidgetPaletteProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Widget | null>(null);

  const widgetTemplates: { type: WidgetType; title: string; icon: React.ReactNode; description: string }[] = [
    {
      type: "bar-chart",
      title: "Bar Chart",
      icon: <BarChart className="h-6 w-6" />,
      description: "Compare values across categories",
    },
    {
      type: "line-chart",
      title: "Line Chart",
      icon: <LineChart className="h-6 w-6" />,
      description: "Show trends over time",
    },
    {
      type: "pie-chart",
      title: "Pie Chart",
      icon: <PieChart className="h-6 w-6" />,
      description: "Display proportion of categories",
    },
    {
      type: "area-chart",
      title: "Area Chart",
      icon: <AreaChart className="h-6 w-6" />,
      description: "Visualize volume over time",
    },
    {
      type: "stat-card",
      title: "Stat Card",
      icon: <Activity className="h-6 w-6" />,
      description: "Display a single important metric",
    },
    {
      type: "table",
      title: "Table",
      icon: <Table2 className="h-6 w-6" />,
      description: "Show detailed data in rows and columns",
    },
    {
      type: "kpi-card",
      title: "KPI Card",
      icon: <BarChart4 className="h-6 w-6" />,
      description: "Track performance against targets",
    },
  ];

  const handleSelectTemplate = (template: { type: WidgetType; title: string }) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: template.type,
      title: template.title,
      fields: [],
      width: 2,
      height: 2,
    };
    
    setSelectedTemplate(newWidget);
  };

  const handleSaveWidget = (widget: Widget) => {
    onAddWidget(widget);
    setSelectedTemplate(null);
  };

  const handleCancelWidget = () => {
    setSelectedTemplate(null);
  };

  if (selectedTemplate) {
    return (
      <div className="max-w-2xl mx-auto">
        <WidgetEditor
          widget={selectedTemplate}
          onSave={handleSaveWidget}
          onCancel={handleCancelWidget}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgetTemplates.map((template) => (
        <Card key={template.type} className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{template.title}</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                {template.icon}
              </div>
            </div>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleSelectTemplate(template)}
            >
              Add to Dashboard
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}