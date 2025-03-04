"use client";

import { useState } from "react";
import { availableFields, FieldDefinition } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, Filter, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function DataFilterPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Group fields by their top-level category
  const fieldsByCategory = availableFields.reduce((acc, field) => {
    const category = field.path.split(".")[0];
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(field);
    return acc;
  }, {} as Record<string, FieldDefinition[]>);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSelectAllInCategory = (category: string, isSelected: boolean) => {
    const categoryFields = fieldsByCategory[category].map((field) => field.id);
    
    if (isSelected) {
      setSelectedFields((prev) => [
        ...prev,
        ...categoryFields.filter((id) => !prev.includes(id)),
      ]);
    } else {
      setSelectedFields((prev) =>
        prev.filter((id) => !categoryFields.includes(id))
      );
    }
  };

  const filteredCategories = Object.keys(fieldsByCategory).filter((category) =>
    fieldsByCategory[category].some((field) =>
      field.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSaveFilters = () => {
    // In a real application, this would save the filter configuration
    console.log("Selected fields:", selectedFields);
    // Show a toast notification
    alert("Filter configuration saved!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Data Field Selection
          </CardTitle>
          <CardDescription>
            Select which data fields you want to include in your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fields..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {selectedFields.length} fields selected
              </div>
              <Button variant="outline" size="sm" onClick={handleSaveFilters}>
                <Save className="mr-2 h-4 w-4" />
                Save Filters
              </Button>
            </div>
            
            <Separator />
            
            <ScrollArea className="h-[400px] pr-4">
              <Accordion type="multiple" value={expandedCategories} onValueChange={setExpandedCategories}>
                {filteredCategories.map((category) => {
                  const categoryFields = fieldsByCategory[category].filter((field) =>
                    field.label.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  
                  const allSelected = categoryFields.every((field) =>
                    selectedFields.includes(field.id)
                  );
                  
                  const someSelected = !allSelected && categoryFields.some((field) =>
                    selectedFields.includes(field.id)
                  );
                  
                  return (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center space-x-2">
                          {/* Fix the indeterminate attribute warning by using proper DOM attributes */}
                          <div className="flex items-center justify-center">
                            <Checkbox
                              id={`category-${category}`}
                              checked={allSelected}
                              // Only pass indeterminate when it's true
                              {...(someSelected ? { indeterminate: true } : {})}
                              onCheckedChange={(checked) =>
                                handleSelectAllInCategory(category, !!checked)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <Label
                            htmlFor={`category-${category}`}
                            className="text-base font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </Label>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-6 space-y-2">
                          {categoryFields.map((field) => (
                            <div key={field.id} className="flex items-center space-x-2">
                              {/* Fix the nested button issue by wrapping in a div */}
                              <div className="flex items-center justify-center">
                                <Checkbox
                                  id={field.id}
                                  checked={selectedFields.includes(field.id)}
                                  onCheckedChange={() => handleFieldToggle(field.id)}
                                />
                              </div>
                              <Label
                                htmlFor={field.id}
                                className="text-sm cursor-pointer flex-1"
                              >
                                {field.label.split(" > ").slice(1).join(" > ")}
                                {field.format && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({field.format})
                                  </span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}