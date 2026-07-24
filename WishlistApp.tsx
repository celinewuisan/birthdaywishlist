"use client";

import clsx from "clsx";

export type Filters = {
  search: string;
  category: string;
  happiness: string;
  onlyAvailable: boolean;
};

export default function FilterBar({
  filters,
  categories,
  onChange,
}: {
  filters: Filters;
  categories: string[];
  onChange: (f: Filters) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
      <input
        type="text"
        placeholder="search gifts..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="input sm:max-w-xs"
      />

      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="input sm:max-w-[10rem]"
      >
        <option value="">all categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={filters.happiness}
        onChange={(e) => onChange({ ...filters, happiness: e.target.value })}
        className="input sm:max-w-[12rem]"
      >
        <option value="">any happiness level</option>
        <option value="HAPPY">Happy!</option>
        <option value="OMG_EXCITED">OMG SO EXCITED</option>
        <option value="CHANGED_MY_LIFE">You Changed My Life</option>
      </select>

      <button
        onClick={() => onChange({ ...filters, onlyAvailable: !filters.onlyAvailable })}
        className={clsx("btn whitespace-nowrap", filters.onlyAvailable ? "btn-primary" : "btn-secondary")}
      >
        only show available
      </button>
    </div>
  );
}
