// src/components/VirtualizedTable.tsx
import React, { FC, useRef, useMemo, memo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { InventoryRow } from "../types";
import { generateVehicleUrl } from "../utils/vehicleUrl";
import { isInTransit, formatAgeShort, sortByAgeDescending } from "../utils/inventoryUtils";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ExternalLink } from "lucide-react";

type Props = { rows: InventoryRow[]; onRowClick: (row: InventoryRow) => void; };
type GroupedRows = { year: number; model: string; modelNumber: string; displayName: string; rows: InventoryRow[]; };
type FlattenedRow = { type: "header"; group: GroupedRows; id: string } | { type: "row"; row: InventoryRow; id: string };

const shouldSubgroup = (model: string): boolean => model === "SILVERADO 1500" || model === "SILVERADO 2500HD" || model === "SIERRA 1500";
const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 52;

export const VirtualizedTable: FC<Props> = memo(({ rows, onRowClick }) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const flattenedRows = useMemo<FlattenedRow[]>(() => {
          if (!rows.length) return [];
          const groupMap: Record<string, InventoryRow[]> = {};
          rows.forEach((row) => {
                  const key = shouldSubgroup(row.Model) && row["Model Number"] ? `${row.Year}|${row.Model}|${row["Model Number"]}` : `${row.Year}|${row.Model}|`;
                  if (!groupMap[key]) groupMap[key] = [];
                  groupMap[key]?.push(row);
          });
          const groups: GroupedRows[] = Object.entries(groupMap).map(([key, groupRows]) => {
                  const [year, model, modelNumber] = key.split("|");
                  return { year: parseInt(year || "0"), model: model || "", modelNumber: modelNumber || "", displayName: shouldSubgroup(model || "") && modelNumber ? `${model} ${modelNumber}` : model || "", rows: sortByAgeDescending(groupRows) };
          });
          groups.sort((a, b) => b.year !== a.year ? b.year - a.year : a.model.localeCompare(b.model));
          const flattened: FlattenedRow[] = [];
          groups.forEach((group) => {
                  flattened.push({ type: "header", group, id: `h-${group.year}-${group.model}` });
                  group.rows.forEach((row) => flattened.push({ type: "row", row, id: `r-${row["Stock Number"]}` }));
          });
          return flattened;
    }, [rows]);

                                                  const getItemSize = useCallback((i: number) => flattenedRows[i]?.type === "header" ? HEADER_HEIGHT : ROW_HEIGHT, [flattenedRows]);
    const virtualizer = useVirtualizer({ count: flattenedRows.length, getScrollElement: () => parentRef.current, estimateSize: getItemSize, overscan: 10 });
    const handleStockClick = useCallback((e: React.MouseEvent, row: InventoryRow) => { e.stopPropagation(); const url = generateVehicleUrl(row); if (url) window.open(url, "_blank"); }, []);

                                                  if (!rows.length) return null;
    return (
          <Card>
                <CardContent className="p-0">
                        <div className="sticky top-0 z-10 bg-muted border-b">
                                  <table className="w-full"><thead><tr>
                                              <th className="text-left p-3 text-xs uppercase text-muted-foreground" style={{ width: "12%" }}>Stock #</th>th>
                                              <th className="text-left p-3 text-xs uppercase text-muted-foreground" style={{ width: "8%" }}>Year</th>th>
                                              <th className="text-left p-3 text-xs uppercase text-muted-foreground" style={{ width: "20%" }}>Model</th>th>
                                              <th className="text-left p-3 text-xs uppercase text-muted-foreground" style={{ width: "15%" }}>Exterior</th>th>
                                              <th className="text-left p-3 text-xs uppercase text-muted-foreground" style={{ width: "15%" }}>Trim</th>th>
                                              <th className="text-left p-3 text-xs uppercase text-muted-foreground" style={{ width: "10%" }}>Age</th>th>
                                              <th className="text-left p-3 text-xs uppercase text-muted-foreground" style={{ width: "10%" }}>MSRP</th>th>
                                  </tr>tr></thead>thead></table>table>
                        </div>div>
                        <div ref={parentRef} className="overflow-auto" style={{ height: "600px" }}>
                                  <div style={{ height: `${virtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}>
                                    {virtualizer.getVirtualItems().map((vr) => {
                          const item = flattenedRows[vr.index];
                          if (!item) return null;
                          if (item.type === "header") return (
                                            <div key={item.id} className="absolute w-full" style={{ height: vr.size, transform: `translateY(${vr.start}px)` }}>
                                                              <div className="flex items-center justify-between p-3 bg-primary/10 border-t-2 border-primary/30">
                                                                                  <span className="font-bold text-sm">{item.group.year} {item.group.displayName}</span>span>
                                                                                  <Badge variant="secondary">{item.group.rows.length}</Badge>Badge>
                                                              </div>div>
                                            </div>div>
                                          );
                          const r = item.row;
                          return (
                                            <div key={item.id} className="absolute w-full border-b hover:bg-accent/30 cursor-pointer" style={{ height: vr.size, transform: `translateY(${vr.start}px)` }} onClick={() => onRowClick(r)}>
                                                              <div className="flex items-center h-full">
                                                                                  <span className="p-3 text-sm text-primary" style={{ width: "12%" }} onClick={(e) => handleStockClick(e, r)}>{r["Stock Number"]}</span>span>
                                                                                  <span className="p-3 text-sm" style={{ width: "8%" }}>{r.Year}</span>span>
                                                                                  <span className="p-3 text-sm" style={{ width: "20%" }}>{r.Model}</span>span>
                                                                                  <span className="p-3 text-sm" style={{ width: "15%" }}>{r["Exterior Color"]}</span>span>
                                                                                  <span className="p-3 text-sm" style={{ width: "15%" }}>{r.Trim}</span>span>
                                                                                  <span className="p-3 text-sm" style={{ width: "10%" }}><span className={isInTransit(r) ? "text-amber-500" : ""}>{formatAgeShort(r)}</span>span></span>span>
                                                                                  <span className="p-3 text-sm font-medium" style={{ width: "10%" }}>${Number(r.MSRP).toLocaleString()}</span>span>
                                                              </div>div>
                                            </div>div>
                                          );
          })}
                                  </div>div>
                        </div>div>
                        <div className="p-3 text-right text-xs text-muted-foreground border-t">Showing {rows.length} vehicles</div>div>
                </CardContent>CardContent>
          </Card>Card>
        );
});
VirtualizedTable.displayName = "VirtualizedTable";
export default VirtualizedTable;</Card>
