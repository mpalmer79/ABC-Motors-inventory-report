import React, { FC, useCallback, useMemo } from "react";
import "./index.css";
import "./styles/theme.css";
import { useInventoryStore } from "./store/inventoryStore";
import { useInventoryLoader } from "./hooks/useInventoryLoader";
import { isInTransit, sortByAgeDescending } from "./utils/inventoryUtils";
import { AgingBuckets, InventoryRow } from "./types";
import { ErrorBoundary, SectionErrorBoundary } from "./components/ErrorBoundary";
import { HeaderBar } from "./components/HeaderBar";
import { FiltersBar } from "./components/FiltersBar";
import { KpiBar } from "./components/KpiBar";
import { ChartsSection } from "./components/ChartsSection";
import { NewArrivalsPanel } from "./components/NewArrivalsPanel";
import { OldestUnitsPanel } from "./components/OldestUnitsPanel";
import { InventoryTable } from "./components/InventoryTable";
import { DrilldownTable } from "./components/DrilldownTable";
import { VehicleDetailDrawer } from "./components/VehicleDetailDrawer";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { StaleIndicator } from "./components/StaleIndicator";

const STOP_WORDS = new Set([
    "i", "im", "i'm", "looking", "for", "to", "the", "a", "an", "with", "show", "me", "find", "need", "want", "please",
  ]);

// Models that should be split by Model Number
const SPLIT_BY_MODEL_NUMBER = ["SILVERADO 1500", "SILVERADO 2500HD", "SIERRA 1500", "SIERRA 2500HD", "SIERRA 3500HD"];

const App: FC = () => {
    const { refetch } = useInventoryLoader();
    const rows = useInventoryStore((s) => s.rows);
    const error = useInventoryStore((s) => s.error);
    const isLoading = useInventoryStore((s) => s.isLoading);
    const isStale = useInventoryStore((s) => s.isStale);
    const lastUpdated = useInventoryStore((s) => s.lastUpdated);
    const isRefreshing = useInventoryStore((s) => s.isRefreshing);
    const filters = useInventoryStore((s) => s.filters);
    const searchTerm = useInventoryStore((s) => s.searchTerm);
    const drillType = useInventoryStore((s) => s.drillType);
    const selectedVehicle = useInventoryStore((s) => s.selectedVehicle);
    const selectedMake = useInventoryStore((s) => s.selectedMake);
    const setFilters = useInventoryStore((s) => s.setFilters);
    const setSearchTerm = useInventoryStore((s) => s.setSearchTerm);
    const setDrillType = useInventoryStore((s) => s.setDrillType);
    const setSelectedVehicle = useInventoryStore((s) => s.setSelectedVehicle);
    const setSelectedMake = useInventoryStore((s) => s.setSelectedMake);
    const resetAll = useInventoryStore((s) => s.resetAll);
    const setRefreshing = useInventoryStore((s) => s.setRefreshing);

    // Filter out invalid rows first
    const validRows = useMemo(() => {
          return rows.filter((r) => r["Stock Number"] && r.Model && r.Year > 0);
    }, [rows]);

    const modelsList = useMemo(() => {
          const modelsSet = new Set<string>();
          validRows.forEach((r) => {
                  if (SPLIT_BY_MODEL_NUMBER.includes(r.Model) && r["Model Number"]) {
                            modelsSet.add(`${r.Model} ${r["Model Number"]}`);
                  } else {
                            modelsSet.add(r.Model);
                  }
          });
          return Array.from(modelsSet).sort();
    }, [validRows]);

    const agingBuckets = useMemo<AgingBuckets>(() => {
          const b = { bucket0_30: 0, bucket31_60: 0, bucket61_90: 0, bucket90_plus: 0 };
          validRows.forEach((r) => {
                  if (isInTransit(r)) return;
                  if (r.Age <= 30) b.bucket0_30++;
                  else if (r.Age <= 60) b.bucket31_60++;
                  else if (r.Age <= 90) b.bucket61_90++;
                  else b.bucket90_plus++;
          });
          return b;
    }, [validRows]);

    // Calculate average age for KPI
    const avgAge = useMemo(() => {
          const onLotRows = validRows.filter((r) => !isInTransit(r) && r.Age > 0);
          if (onLotRows.length === 0) return 0;
          const totalAge = onLotRows.reduce((sum, r) => sum + r.Age, 0);
          return Math.round(totalAge / onLotRows.length);
    }, [validRows]);

    // Memoized data (abbreviated for demo)
    const sortedRows = useMemo(() => {
          return [...validRows].sort((a, b) => {
                  if (a.Model !== b.Model) return a.Model.localeCompare(b.Model);
                  return b.Age - a.Age;
          });
    }, [validRows]);

    const filteredRows = useMemo(() => {
          return sortedRows.filter((row) => {
                  if (filters.make && row.Make !== filters.make) return false;
                  if (filters.year !== "ALL" && String(row.Year) !== filters.year) return false;
                  if (filters.stockNumber) {
                            const stockNum = filters.stockNumber.toLowerCase().trim();
                            const rowStockNum = row["Stock Number"].toLowerCase().trim();
                            if (!rowStockNum.includes(stockNum)) return false;
                  }
                  return true;
          });
    }, [sortedRows, filters]);

    const filteredNewArrivals = useMemo(() => {
          return filteredRows.filter((r) => r.Age > 0 && r.Age <= 7 && !isInTransit(r));
    }, [filteredRows]);

    const filteredInTransit = useMemo(() => {
          return filteredRows.filter((r) => isInTransit(r));
    }, [filteredRows]);

    const handleSmartSearch = useCallback((text: string) => {
          setSearchTerm(text);
    }, [setSearchTerm]);

    const handleRefresh = useCallback(async () => {
          setRefreshing(true);
          await refetch();
    }, [refetch, setRefreshing]);

    if (isLoading && validRows.length === 0) {
          return (
                  <div className="app-root">
                          <HeaderBar searchTerm="" onSearchChange={() => {}} />
                          <main className="container">
                                    <p>Loading inventory...</p>p>
                          </main>main>
                  </div>div>
                );
    }
  
    return (
          <ErrorBoundary>
                <div className="app-root">
                        <HeaderBar searchTerm={searchTerm} onSearchChange={handleSmartSearch} />
                        <main className="container">
                          {error && <section className="panel"><p>{error}</p>p></section>section>}
                          {validRows.length > 0 && (
                        <>
                                      <FiltersBar models={[]} filters={filters} onChange={setFilters} />
                                      <InventoryTable rows={filteredRows} onRowClick={setSelectedVehicle} />
                                      <VehicleDetailDrawer vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
                        </>>
                      )}
                        </main>main>
                </div>div>
          </ErrorBoundary>ErrorBoundary>
        );
};

export default App;</></div>
