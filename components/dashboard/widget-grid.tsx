"use client";

import { Widget } from "@/lib/data";
import { SortableWidget } from "./sortable-widget";
import { Card } from "@/components/ui/card";

interface WidgetGridProps {
  widgets: Widget[];
  onRemoveWidget: (id: string) => void;
  onUpdateWidget: (widget: Widget) => void;
}

export function WidgetGrid({ widgets, onRemoveWidget, onUpdateWidget }: WidgetGridProps) {
  if (widgets.length === 0) {
    return (
      <Card className="flex h-[400px] items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">No widgets added yet</h3>
          <p className="text-muted-foreground mt-2">
            Add widgets from the "Add Widgets" tab to start building your dashboard.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {widgets.map((widget) => (
        <SortableWidget
          key={widget.id}
          widget={widget}
          onRemove={onRemoveWidget}
          onUpdate={onUpdateWidget}
        />
      ))}
    </div>
  );
}