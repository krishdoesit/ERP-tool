"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Widget, defaultWidgets } from "@/lib/data";
import { WidgetGrid } from "./widget-grid";
import { WidgetPalette } from "./widget-palette";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataFilterPanel } from "./data-filter-panel";

export function DashboardBuilder() {
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddWidget = (widget: Widget) => {
    setWidgets((prev) => [...prev, widget]);
    setActiveTab("dashboard");
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== widgetId));
  };

  const handleUpdateWidget = (updatedWidget: Widget) => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === updatedWidget.id ? updatedWidget : widget
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Builder</h2>
        <Button onClick={() => setActiveTab("add")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="add">Add Widgets</TabsTrigger>
          <TabsTrigger value="filter">Filter Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          {/* Use suppressHydrationWarning to fix the DND-Kit hydration warning */}
          <div suppressHydrationWarning>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={widgets.map(widget => widget.id)}>
                <WidgetGrid 
                  widgets={widgets} 
                  onRemoveWidget={handleRemoveWidget}
                  onUpdateWidget={handleUpdateWidget}
                />
              </SortableContext>
            </DndContext>
          </div>
        </TabsContent>
        
        <TabsContent value="add" className="mt-6">
          <WidgetPalette onAddWidget={handleAddWidget} />
        </TabsContent>
        
        <TabsContent value="filter" className="mt-6">
          <DataFilterPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}