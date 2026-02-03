// src/components/ChartsSection.tsx
import React, { FC, memo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AgingBuckets, ModelPieDatum } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

interface Props {
    modelPieData: ModelPieDatum[];
    agingBuckets: AgingBuckets;
    agingHandlers: {
      on0_30: () => void;
      on31_60: () => void;
      on61_90: () => void;
      on90_plus: () => void;
    };
    onModelClick?: (model: string) => void;
}

const MODEL_COLORS = [
    "#0066B1",
    "#16a34a",
    "#f97316",
    "#eab308",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#64748b",
  ];

interface AgingBucketProps {
    label: string;
    value: number;
    variant: "fresh" | "normal" | "watch" | "risk";
    badgeText: string;
    onClick: () => void;
}

const AgingBucket: FC<AgingBucketProps> = ({ label, value, variant, badgeText, onClick }) => {
    const variantStyles = {
          fresh: "hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
          normal: "hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/30",
          watch: "hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30",
          risk: "hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/30",
    };

    return (
          <button
                  type="button"
                  onClick={onClick}
                  className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-lg border bg-card transition-all cursor-pointer",
                            "focus:outline-none focus:ring-2 focus:ring-primary",
                            variantStyles[variant]
                          )}
                >
                <span className="text-xs font-medium text-muted-foreground">{label}</span>span>
                <span className="text-3xl font-bold tabular-nums">{value}</span>span>
                <Badge variant={variant}>{badgeText}</Badge>Badge>
          </button>button>
        );
};

export const ChartsSection: FC<Props> = memo(({
    modelPieData,
    agingBuckets,
    agingHandlers,
    onModelClick,
}) => {
    const handlePieClick = (data: ModelPieDatum) => {
          if (onModelClick && data?.name) {
                  onModelClick(data.name);
          }
    };
  
    return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                        <CardHeader className="pb-2">
                                  <CardTitle className="text-center text-base font-semibold">
                                              Inventory Mix - Top Models
                                  </CardTitle>CardTitle>
                        </CardHeader>CardHeader>
                        <CardContent>
                                  <ResponsiveContainer width="100%" height={250}>
                                              <PieChart>
                                                            <Pie
                                                                              data={modelPieData}
                                                                              cx="50%"
                                                                              cy="50%"
                                                                              innerRadius={60}
                                                                              outerRadius={100}
                                                                              paddingAngle={2}
                                                                              dataKey="value"
                                                                              nameKey="name"
                                                                              onClick={handlePieClick}
                                                                              style={{ cursor: "pointer" }}
                                                                            >
                                                              {modelPieData.map((entry, index) => (
                                                                                                <Cell
                                                                                                                      key={`cell-${index}`}
                                                                                                                      fill={MODEL_COLORS[index % MODEL_COLORS.length]}
                                                                                                                      style={{ cursor: "pointer" }}
                                                                                                                    />
                                                                                              ))}
                                                            </Pie>Pie>
                                                            <Tooltip
                                                                              formatter={(value: number, name: string) => [value, name]}
                                                                              contentStyle={{
                                                                                                  background: "hsl(var(--card))",
                                                                                                  border: "1px solid hsl(var(--border))",
                                                                                                  borderRadius: "var(--radius)",
                                                                                                  color: "hsl(var(--card-foreground))",
                                                                                                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                                                              }}
                                                                            />
                                              </PieChart>PieChart>
                                  </ResponsiveContainer>ResponsiveContainer>
                                  <div className="flex flex-wrap gap-2 justify-center mt-3">
                                    {modelPieData.slice(0, 6).map((item, index) => (
                          <button
                                            key={item.name}
                                            onClick={() => onModelClick?.(item.name)}
                                            className="flex items-center gap-1.5 text-xs hover:bg-accent px-2 py-1 rounded transition-colors cursor-pointer"
                                          >
                                          <span
                                                              className="w-2.5 h-2.5 rounded-sm"
                                                              style={{ background: MODEL_COLORS[index % MODEL_COLORS.length] }}
                                                            />
                                          <span className="text-muted-foreground hover:text-foreground">{item.name}</span>span>
                          </button>button>
                        ))}
                                  </div>div>
                                  <p className="text-xs text-center text-muted-foreground mt-3">
                                              Click on a segment or legend to filter by model
                                  </p>p>
                        </CardContent>CardContent>
                </Card>Card>
          
                <Card>
                        <CardHeader className="pb-2">
                                  <CardTitle className="text-center text-base font-semibold">
                                              Aging Overview - Days in Stock
                                  </CardTitle>CardTitle>
                        </CardHeader>CardHeader>
                        <CardContent>
                                  <div className="grid grid-cols-2 gap-3">
                                              <AgingBucket
                                                              label="0-30 Days"
                                                              value={agingBuckets.bucket0_30}
                                                              variant="fresh"
                                                              badgeText="Fresh"
                                                              onClick={agingHandlers.on0_30}
                                                            />
                                              <AgingBucket
                                                              label="31-60 Days"
                                                              value={agingBuckets.bucket31_60}
                                                              variant="normal"
                                                              badgeText="Normal"
                                                              onClick={agingHandlers.on31_60}
                                                            />
                                              <AgingBucket
                                                              label="61-90 Days"
                                                              value={agingBuckets.bucket61_90}
                                                              variant="watch"
                                                              badgeText="Watch"
                                                              onClick={agingHandlers.on61_90}
                                                            />
                                              <AgingBucket
                                                              label="90+ Days"
                                                              value={agingBuckets.bucket90_plus}
                                                              variant="risk"
                                                              badgeText="At Risk"
                                                              onClick={agingHandlers.on90_plus}
                                                            />
                                  </div>div>
                        </CardContent>CardContent>
                </Card>Card>
          </div>div>
        );
});

ChartsSection.displayName = "ChartsSection";</button>
