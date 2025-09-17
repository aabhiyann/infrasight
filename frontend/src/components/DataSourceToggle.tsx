import React from "react";
import { Database } from "lucide-react";

const DataSourceToggle: React.FC = () => {
  return (
    <div className="header-user">
      <div className="header-user-trigger d-flex items-center gap-sm">
        <Database size={16} />
        <span className="text-small">Mock Data Only</span>
      </div>
    </div>
  );
};

export default DataSourceToggle;
