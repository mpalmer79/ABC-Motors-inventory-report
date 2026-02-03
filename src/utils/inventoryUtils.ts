// src/utils/inventoryUtils.ts
import { InventoryRow } from "../types";

export function isInTransit(row: InventoryRow): boolean {
    return (row.Status || "").toUpperCase().includes("TRANSIT");
}

export function formatAge(row: InventoryRow): string {
    if (isInTransit(row)) return "IN TRANSIT";
    return `${row.Age} day${row.Age === 1 ? "" : "s"}`;
}

export function formatAgeShort(row: InventoryRow): string {
    if (isInTransit(row)) return "IN TRANSIT";
    return String(row.Age);
}

export function sortByAgeDescending(rows: InventoryRow[]): InventoryRow[] {
    return [...rows].sort((a, b) => {
          const aInTransit = isInTransit(a);
          const bInTransit = isInTransit(b);
          if (aInTransit && !bInTransit) return 1;
          if (!aInTransit && bInTransit) return -1;
          return b.Age - a.Age;
    });
}

export function sortByModelThenAge(rows: InventoryRow[]): InventoryRow[] {
    return [...rows].sort((a, b) => {
          if (a.Model !== b.Model) return a.Model.localeCompare(b.Model);
          const aInTransit = isInTransit(a);
          const bInTransit = isInTransit(b);
          if (aInTransit && !bInTransit) return 1;
          if (!aInTransit && bInTransit) return -1;
          return b.Age - a.Age;
    });
}
