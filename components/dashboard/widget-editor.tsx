"use client";

import { useState } from "react";
import { Widget, WidgetType, availableFields } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  PieChart,
  LineChart,
  AreaChart,
  Table2,
  BarChart4,
  Activity,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface WidgetEditorProps {
  widget: Widget;
  onSave: (widget: Widget) => void;
  onCancel: () => void;
}

export function WidgetEditor({ widget, onSave, onCancel }: WidgetEditorProps) {
  const [title, setTitle] = useState(widget.title);
  const [type, setType] = useState<WidgetType>(widget.type);
  const [selectedFields, setSelectedFields] = useState<string[]>(widget.fields);
  const [width, setWidth] = useState<Widget["width"]>(widget.width);
  const [height, setHeight] = useState<Widget["height"]>(widget.height);

  const handleSave = () => {
    onSave({
      ...widget,
      title,
      type,
      fields: selectedFields,
      width,
      height,
    });
  };

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const widgetTypeOptions: { value: WidgetType; label: string; icon: React.ReactNode }[] = [
    { value: "bar-chart", label: "Bar Chart", icon: <BarChart className="h-4 w-4" /> },
    { value: "line-chart", label: "Line Chart", icon: <LineChart className="h-4 w-4" /> },
    { value: "pie-chart", label: "Pie Chart", icon: <PieChart className="h-4 w-4" /> },
    { value: "area-chart", label: "Area Chart", icon: <AreaChart className="h-4 w-4" /> },
    { value: "stat-card", label: "Stat Card", icon: <Activity className="h-4 w-4" /> },
    { value: "table", label: "Table", icon: <Table2 className="h-4 w-4" /> },
    { value: "kpi-card", label: "KPI Card", icon: <BarChart4 className="h-4 w-4" /> },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Widget</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Widget Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Widget Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as WidgetType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select widget type" />
            </SelectTrigger>
            <SelectContent>
              {widgetTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Widget Size</Label>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Select
                value={width.toString()}
                onValueChange={(value) => setWidth(parseInt(value) as Widget["width"])}
              >
                <SelectTrigger id="width">
                  <SelectValue placeholder="Width" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Select
                value={height.toString()}
                onValueChange={(value) => setHeight(parseInt(value) as Widget["height"])}
              >
                <SelectTrigger id="height">
                  <SelectValue placeholder="Height" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Row</SelectItem>
                  <SelectItem value="2">2 Rows</SelectItem>
                  <SelectItem value="3">3 Rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Data Fields</Label>
          <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
            {availableFields
              .filter((field) => {
                // Filter fields based on widget type
                if (type === "stat-card" || type === "kpi-card") {
                  return field.type === "number";
                }
                if (type === "table") {
                  return field.type === "array";
                }
                if (
                  type === "bar-chart" ||
                  type === "line-chart" ||
                  type === "pie-chart" ||
                  type === "area-chart"
                ) {
                  return field.type === "object";
                }
                return true;
              })
              .map((field) => (
                <div key={field.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => handleFieldToggle(field.id)}
                  />
                  <Label
                    htmlFor={field.id}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {field.label}
                  </Label>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}