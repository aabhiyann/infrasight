import React, { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  presets?: {
    label: string;
    range: DateRange;
  }[];
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  presets = [],
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange>(
    value || {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date(),
    }
  );

  // Default presets
  const defaultPresets = [
    {
      label: "Last 7 days",
      range: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    },
    {
      label: "Last 30 days",
      range: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    },
    {
      label: "Last 90 days",
      range: {
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    },
    {
      label: "This month",
      range: {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(),
      },
    },
    {
      label: "Last month",
      range: {
        start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      },
    },
  ];

  const allPresets = [...presets, ...defaultPresets];

  useEffect(() => {
    if (value) {
      setTempRange(value);
    }
  }, [value]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePresetClick = (preset: (typeof allPresets)[0]) => {
    setTempRange(preset.range);
    onChange(preset.range);
    setIsOpen(false);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    setTempRange((prev) => ({ ...prev, start: newStart }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    setTempRange((prev) => ({ ...prev, end: newEnd }));
  };

  const handleApply = () => {
    onChange(tempRange);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange(
      value || {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      }
    );
    setIsOpen(false);
  };

  const getDisplayText = (): string => {
    if (!value) return "Select date range";
    return `${formatDate(value.start)} - ${formatDate(value.end)}`;
  };

  return (
    <div className={`date-range-picker ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline d-flex items-center gap-sm"
        aria-label="Select date range"
      >
        <Calendar size={16} />
        <span>{getDisplayText()}</span>
        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {isOpen && (
        <div className="date-range-picker-dropdown">
          <div className="date-range-picker-header">
            <h4>Select Date Range</h4>
          </div>

          <div className="date-range-picker-presets">
            <h5>Quick Select</h5>
            <div className="preset-buttons">
              {allPresets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="date-range-picker-custom">
            <h5>Custom Range</h5>
            <div className="custom-date-inputs">
              <div className="date-input-group">
                <label htmlFor="start-date">Start Date</label>
                <input
                  id="start-date"
                  type="date"
                  value={tempRange.start.toISOString().split("T")[0]}
                  onChange={handleStartDateChange}
                  className="form-control"
                  max={tempRange.end.toISOString().split("T")[0]}
                />
              </div>
              <div className="date-input-group">
                <label htmlFor="end-date">End Date</label>
                <input
                  id="end-date"
                  type="date"
                  value={tempRange.end.toISOString().split("T")[0]}
                  onChange={handleEndDateChange}
                  className="form-control"
                  min={tempRange.start.toISOString().split("T")[0]}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          <div className="date-range-picker-actions">
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
