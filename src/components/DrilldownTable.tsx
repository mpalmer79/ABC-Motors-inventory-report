// src/components/DrilldownTable.tsx
import React, { FC } from "react";
import { InventoryRow } from "../types";
import { generateVehicleUrl } from "../utils/vehicleUrl";
import { isInTransit, formatAgeShort, sortByAgeDescending } from "../utils/inventoryUtils";
import { useIsMobile } from "../hooks/useMediaQuery";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

type Props = {
    groups: Record<string, InventoryRow[]>;
    onBack: () => void;
    onRowClick: (row: InventoryRow) => void;
    title?: string;
};

function formatBodyDescription(body: string | undefined): string {
    if (!body) return "";
    let cleaned = body.replace(/\s*w\/\d+SB\s*/gi, "").replace(/\s*,\s*\d+"\s*CA\s*/gi, "").trim();
    const match = cleaned.match(/^(4WD|2WD|AWD)?\s*(Crew Cab|Double Cab|Reg Cab|Regular Cab)?\s*(\d+)?[""']?/i);
    if (match) {
          const driveType = match[1] || "";
          let cabStyle = match[2] || "";
          const wheelbase = match[3] || "";
          if (cabStyle.toLowerCase() === "regular cab") cabStyle = "REG CAB";
          const parts: string[] = [];
          if (driveType) parts.push(driveType.toUpperCase());
          if (cabStyle) parts.push(cabStyle.toUpperCase());
          if (wheelbase) parts.push(`${wheelbase}" WB`);
          return parts.join(" ");
    }
    return cleaned.toUpperCase();
}

export const DrilldownTable: FC<Props> = ({ groups, onBack, onRowClick, title }) => {
    const isMobile = useIsMobile();
    const groupKeys = Object.keys(groups);
    const totalCount = groupKeys.reduce((sum, key) => sum + (groups[key]?.length || 0), 0);

    const handleStockClick = (e: React.MouseEvent, row: InventoryRow) => {
          e.stopPropagation();
          const url = generateVehicleUrl(row);
          if (url) window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
          <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 mb-6">
                        <Button variant="outline" size="lg" onClick={onBack} className="gap-2 px-8">
                                  <ArrowLeft className="h-5 w-5" />
                                  Back to Dashboard
                        </Button>Button>
                  {title && (
                      <div className="text-center">
                                  <h2 className="text-xl font-bold">{title}</h2>h2>
                                  <p className="text-sm text-muted-foreground mt-1">{totalCount} vehicles</p>p>
                      </div>div>
                        )}
                </div>div>
                <Card>
                        <CardContent className="p-0">
                          {groupKeys.map((key, groupIndex) => {
                        const parts = key.split("|");
                        const model = parts[1] ?? "";
                        const modelNumber = parts[2] ?? null;
                        const groupRows = groups[key];
                        if (!groupRows) return null;
                        const rowsForGroup = sortByAgeDescending(groupRows);
                        const firstRow = rowsForGroup[0];
                        const bodyDescription = firstRow?.Body ? formatBodyDescription(firstRow.Body) : "";
                        let groupTitle = model;
                        if (modelNumber) {
                                        groupTitle += ` ${modelNumber}`;
                                        if (bodyDescription) groupTitle += ` ${bodyDescription}`;
                        }
                        return (
                                        <div key={key} className={groupIndex > 0 ? "border-t" : ""}>
                                          {isMobile ? (
                                                            <>
                                                                                <div className="p-4 bg-primary/10">
                                                                                                      <span className="font-bold text-sm">{groupTitle} - {rowsForGroup.length}</span>span>
                                                                                  </div>div>
                                                                                <div className="p-4 space-y-2">
                                                                                  {rowsForGroup.map((r) => (
                                                                                      <div key={r["Stock Number"]} className="p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors cursor-pointer" onClick={() => onRowClick(r)}>
                                                                                                                <div className="flex items-center justify-between mb-2">
                                                                                                                                            <span className="text-sm font-semibold text-primary flex items-center gap-1" onClick={(e) => handleStockClick(e, r)}>
                                                                                                                                                                          #{r["Stock Number"]}
                                                                                                                                                                          <ExternalLink className="h-3 w-3" />
                                                                                                                                              </span>span>
                                                                                                                                            <span className="text-sm font-medium">{r.Year} {r.Model}</span>span>
                                                                                                                  </div>div>
                                                                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                                                                                            <div className="flex justify-between"><span className="text-muted-foreground">Trim</span>span><span>{r.Trim}</span>span></div>div>
                                                                                                                                            <div className="flex justify-between"><span className="text-muted-foreground">Age</span>span><span className={isInTransit(r) ? "text-amber-500 font-semibold" : ""}>{formatAgeShort(r)}</span>span></div>div>
                                                                                                                                            <div className="flex justify-between col-span-2"><span className="text-muted-foreground">MSRP</span>span><span className="font-semibold">${Number(r.MSRP).toLocaleString()}</span>span></div>div>
                                                                                                                  </div>div>
                                                                                        </div>div>
                                                                                    ))}
                                                                                  </div>div>
                                                            </>>
                                                          ) : (
                                                            <div className="overflow-x-auto">
                                                                                <table className="w-full">
                                                                                                      <tbody>
                                                                                                                              <tr className="bg-primary/10">
                                                                                                                                                        <td colSpan={3} className="p-3 font-bold text-sm">{groupTitle} - {rowsForGroup.length}</td>td>
                                                                                                                                                        <td className="p-3 text-xs font-semibold uppercase text-muted-foreground">Exterior Color</td>td>
                                                                                                                                                        <td className="p-3 text-xs font-semibold uppercase text-muted-foreground">Trim</td>td>
                                                                                                                                                        <td className="p-3 text-xs font-semibold uppercase text-muted-foreground">Model #</td>td>
                                                                                                                                                        <td className="p-3 text-xs font-semibold uppercase text-muted-foreground">Age</td>td>
                                                                                                                                                        <td className="p-3 text-xs font-semibold uppercase text-muted-foreground">MSRP</td>td>
                                                                                                                                </tr>tr>
                                                                                                        {rowsForGroup.map((r) => (
                                                                                        <tr key={r["Stock Number"]} className="border-b hover:bg-accent/30 cursor-pointer" onClick={() => onRowClick(r)}>
                                                                                                                    <td className="p-3"><span className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1" onClick={(e) => handleStockClick(e, r)}>{r["Stock Number"]}<ExternalLink className="h-3 w-3" /></span>span></td>td>
                                                                                                                    <td className="p-3 text-sm">{r.Year}</td>td>
                                                                                                                    <td className="p-3 text-sm">{r.Model}</td>td>
                                                                                                                    <td className="p-3 text-sm">{r["Exterior Color"]}</td>td>
                                                                                                                    <td className="p-3 text-sm">{r.Trim}</td>td>
                                                                                                                    <td className="p-3 text-sm">{r["Model Number"]}</td>td>
                                                                                                                    <td className="p-3 text-sm"><span className={isInTransit(r) ? "text-amber-500 font-semibold" : ""}>{formatAgeShort(r)}</span>span></td>td>
                                                                                                                    <td className="p-3 text-sm font-medium">${Number(r.MSRP).toLocaleString()}</td>td>
                                                                                          </tr>tr>
                                                                                      ))}
                                                                                                        </tbody>tbody>
                                                                                  </table>table>
                                                            </div>div>
                                                        )}
                                        </div>div>
                                      );
          })}
                        </CardContent>CardContent>
                </Card>Card>
          </div>div>
        );
};</></div>
