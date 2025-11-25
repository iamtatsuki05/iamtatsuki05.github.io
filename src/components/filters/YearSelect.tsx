import React from 'react';

type Props = {
  years: string[];
  value: string;
  onChange: (year: string) => void;
  label: string;
  allLabel?: string;
  className?: string;
};

export function YearSelect({ years, value, onChange, label, allLabel = 'All', className }: Props) {
  return (
    <div className={className}>
      <label className="text-sm opacity-70 mr-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-sm px-2 py-1 dark:border-gray-700"
      >
        <option value="">{allLabel}</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
