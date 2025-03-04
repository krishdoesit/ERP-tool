export type BusinessData = {
  id: string;
  name: string;
  revenue: {
    total: number;
    byQuarter: {
      Q1: number;
      Q2: number;
      Q3: number;
      Q4: number;
    };
    byProduct: Record<string, number>;
  };
  expenses: {
    total: number;
    byCategory: Record<string, number>;
    byQuarter: {
      Q1: number;
      Q2: number;
      Q3: number;
      Q4: number;
    };
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    demographics: {
      age: Record<string, number>;
      location: Record<string, number>;
      gender: Record<string, number>;
    };
  };
  products: {
    total: number;
    topSelling: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }>;
    categories: Record<string, number>;
  };
  performance: {
    kpis: {
      salesGrowth: number;
      customerRetention: number;
      averageOrderValue: number;
      conversionRate: number;
    };
    targets: {
      sales: number;
      customers: number;
      revenue: number;
    };
  };
};

export const generateDummyData = (): BusinessData => {
  return {
    id: "business-1",
    name: "Acme Corporation",
    revenue: {
      total: 1250000,
      byQuarter: {
        Q1: 280000,
        Q2: 310000,
        Q3: 350000,
        Q4: 310000,
      },
      byProduct: {
        "Product A": 450000,
        "Product B": 320000,
        "Product C": 280000,
        "Product D": 200000,
      },
    },
    expenses: {
      total: 780000,
      byCategory: {
        "Research & Development": 250000,
        Marketing: 180000,
        Operations: 220000,
        Administration: 130000,
      },
      byQuarter: {
        Q1: 180000,
        Q2: 195000,
        Q3: 210000,
        Q4: 195000,
      },
    },
    customers: {
      total: 5800,
      new: 1200,
      returning: 4600,
      demographics: {
        age: {
          "18-24": 870,
          "25-34": 1740,
          "35-44": 1450,
          "45-54": 1160,
          "55+": 580,
        },
        location: {
          "North America": 2900,
          Europe: 1450,
          Asia: 870,
          "Other Regions": 580,
        },
        gender: {
          Male: 3132,
          Female: 2668,
        },
      },
    },
    products: {
      total: 24,
      topSelling: [
        {
          id: "prod-1",
          name: "Premium Widget",
          sales: 1200,
          revenue: 240000,
        },
        {
          id: "prod-2",
          name: "Standard Widget",
          sales: 1800,
          revenue: 180000,
        },
        {
          id: "prod-3",
          name: "Basic Widget",
          sales: 2400,
          revenue: 120000,
        },
        {
          id: "prod-4",
          name: "Widget Accessory",
          sales: 3600,
          revenue: 90000,
        },
      ],
      categories: {
        Premium: 4,
        Standard: 8,
        Basic: 12,
      },
    },
    performance: {
      kpis: {
        salesGrowth: 12.5,
        customerRetention: 78.4,
        averageOrderValue: 215.5,
        conversionRate: 3.2,
      },
      targets: {
        sales: 12000,
        customers: 6500,
        revenue: 1500000,
      },
    },
  };
};

export const dummyData = generateDummyData();

export type FieldDefinition = {
  id: string;
  label: string;
  path: string;
  type: "number" | "string" | "object" | "array";
  format?: "currency" | "percentage" | "decimal" | "integer";
};

export const extractFields = (
  data: any,
  path: string = "",
  label: string = ""
): FieldDefinition[] => {
  if (!data) return [];

  if (typeof data !== "object" || data === null) {
    return [
      {
        id: path,
        label: label || path,
        path,
        type: typeof data as any,
      },
    ];
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return [];
    
    // For arrays, we'll just use the first item as a sample
    if (typeof data[0] !== "object") {
      return [
        {
          id: path,
          label: label || path,
          path,
          type: "array",
        },
      ];
    }
    
    // For arrays of objects, extract fields from the first item
    return extractFields(data[0], path, label);
  }

  // For objects, recursively extract fields
  return Object.entries(data).flatMap(([key, value]) => {
    const newPath = path ? `${path}.${key}` : key;
    const newLabel = label ? `${label} > ${key}` : key;

    if (typeof value === "object" && value !== null) {
      // Special case for byQuarter, byCategory, etc. which are common patterns
      if (
        key === "byQuarter" ||
        key === "byCategory" ||
        key === "byProduct" ||
        key === "demographics" ||
        key === "categories" ||
        key === "kpis" ||
        key === "targets"
      ) {
        return [
          {
            id: newPath,
            label: newLabel,
            path: newPath,
            type: "object",
          },
        ];
      }
      
      return extractFields(value, newPath, newLabel);
    }

    // Determine format based on key name and value type
    let format: FieldDefinition["format"] | undefined;
    if (typeof value === "number") {
      if (
        key.toLowerCase().includes("price") ||
        key.toLowerCase().includes("revenue") ||
        key.toLowerCase().includes("sales") ||
        key.toLowerCase().includes("cost") ||
        key.toLowerCase().includes("expense")
      ) {
        format = "currency";
      } else if (
        key.toLowerCase().includes("rate") ||
        key.toLowerCase().includes("percentage") ||
        key.toLowerCase().includes("growth") ||
        key.toLowerCase().includes("retention")
      ) {
        format = "percentage";
      } else if (Number.isInteger(value)) {
        format = "integer";
      } else {
        format = "decimal";
      }
    }

    return [
      {
        id: newPath,
        label: newLabel,
        path: newPath,
        type: typeof value as any,
        format,
      },
    ];
  });
};

export const availableFields = extractFields(dummyData);

export type WidgetType = 
  | "bar-chart" 
  | "line-chart" 
  | "pie-chart" 
  | "area-chart" 
  | "stat-card" 
  | "table" 
  | "kpi-card";

export type Widget = {
  id: string;
  type: WidgetType;
  title: string;
  fields: string[];
  width: 1 | 2 | 3 | 4;
  height: 1 | 2 | 3;
  config?: Record<string, any>;
};

export const defaultWidgets: Widget[] = [
  {
    id: "revenue-overview",
    type: "bar-chart",
    title: "Revenue by Quarter",
    fields: ["revenue.byQuarter"],
    width: 2,
    height: 2,
  },
  {
    id: "expenses-overview",
    type: "pie-chart",
    title: "Expenses by Category",
    fields: ["expenses.byCategory"],
    width: 2,
    height: 2,
  },
  {
    id: "total-revenue",
    type: "stat-card",
    title: "Total Revenue",
    fields: ["revenue.total"],
    width: 1,
    height: 1,
  },
  {
    id: "total-customers",
    type: "stat-card",
    title: "Total Customers",
    fields: ["customers.total"],
    width: 1,
    height: 1,
  },
  {
    id: "customer-demographics",
    type: "pie-chart",
    title: "Customer Demographics",
    fields: ["customers.demographics.age"],
    width: 2,
    height: 2,
  },
  {
    id: "top-products",
    type: "table",
    title: "Top Selling Products",
    fields: ["products.topSelling"],
    width: 2,
    height: 2,
  },
];