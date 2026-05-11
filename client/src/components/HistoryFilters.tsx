import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";

interface HistoryFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  searchQuery: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

export function HistoryFilters({ onSearch, onFilterChange }: HistoryFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, searchQuery: value };
    setFilters(newFilters);
    onSearch(value);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters: FilterState = {
      searchQuery: "",
      status: "all",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
    onSearch("");
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.status !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Pesquisar por edital, órgão ou palavra-chave..."
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10 border border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-accent"
        />
        {filters.searchQuery && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Filter className="w-4 h-4" />
        Filtros Avançados
        {hasActiveFilters && (
          <span className="ml-2 px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full font-medium">
            {[
              filters.status !== "all" ? 1 : 0,
              filters.dateFrom ? 1 : 0,
              filters.dateTo ? 1 : 0,
            ].reduce((a, b) => a + b, 0)}
          </span>
        )}
      </Button>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-4 border border-border rounded-lg bg-accent/5 space-y-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Status
            </label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="border border-border bg-background text-foreground">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="submitted">Enviado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Data De
              </label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="border border-border bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Data Até
              </label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="border border-border bg-background text-foreground"
              />
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
