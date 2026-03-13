import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PageHeaderProps {
  title: string;
  totalLabel: string;
  totalCount: number;
  searchPlaceholder?: string;
  search: string;
  onSearchChange: (v: string) => void;
  selectedClass: string;
  onClassChange: (v: string) => void;
  classes: string[];
  onAdd?: () => void;
  addLabel?: string;
}

const PageHeader = ({
  title,
  totalLabel,
  totalCount,
  searchPlaceholder = "Search...",
  search,
  onSearchChange,
  selectedClass,
  onClassChange,
  classes,
  onAdd,
  addLabel,
}: PageHeaderProps) => {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-1 font-display text-2xl font-bold text-primary sm:text-3xl"
      >
        {title}
      </motion.h1>
      <p className="mb-6 text-xs text-muted-foreground">{title} /</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 flex flex-wrap items-center gap-3"
      >
        <span className="font-display text-sm font-semibold text-foreground">
          {totalLabel} : {totalCount}
        </span>

        <select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>

        {onAdd && (
          <Button
            onClick={onAdd}
            className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-1 h-4 w-4" />
            {addLabel || "Add New"}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default PageHeader;
