"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Widget } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetRenderer } from "./widget-renderer";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, X } from "lucide-react";
import { useState } from "react";
import { WidgetEditor } from "./widget-editor";

interface SortableWidgetProps {
  widget: Widget;
  onRemove: (id: string) => void;
  onUpdate: (widget: Widget) => void;
}

export function SortableWidget({ widget, onRemove, onUpdate }: SortableWidgetProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${widget.width}`,
    gridRow: `span ${widget.height}`,
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedWidget: Widget) => {
    onUpdate(updatedWidget);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style}>
        <WidgetEditor 
          widget={widget} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab rounded p-1 hover:bg-secondary"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">{widget.title}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onRemove(widget.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <WidgetRenderer widget={widget} />
        </CardContent>
      </Card>
    </div>
  );
}