import { Clock, Activity, Database, CheckCircle, FileText } from "lucide-react";
// @ts-expect-error: ECGAnimation module is missing or not yet implemented
import { ECGAnimation } from "./ECGAnimation";

interface ConnectionStatusProps {
  lastUpdated: Date;
  recordCount?: number;
  dataSource?: 'google_sheets' | 'mock_data';
  onRefresh?: () => void;
  onFilterClick?: () => void;
  loading?: boolean;
  businessHealth?: number;
}

export function ConnectionStatus({ 
  lastUpdated, 
  recordCount, 
  dataSource, 
  onRefresh, 
  onFilterClick,
  loading = false,
  businessHealth = 58
}: ConnectionStatusProps) {
  return (
    <div className="glass rounded-xl p-2 border border-glass-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ECGAnimation 
                size={40} 
                isHealthy={businessHealth >= 80}
              />
              <span className={`text-sm font-bold ${businessHealth >= 80 ? 'text-green-500' : 'text-red-500'}`}>
                {businessHealth}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-2 lg:space-y-0">
          {/* Data Source and Record Count */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs">
              <Database className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">
                {dataSource === 'google_sheets' ? 'Google Sheets' : 'Demo Data'}
              </span>
              {dataSource === 'google_sheets' && (
                <CheckCircle className="w-3 h-3 text-accent" />
              )}
            </div>
            
            {recordCount !== undefined && (
              <div className="flex items-center space-x-2 px-2 py-0.5 bg-primary/10 rounded-full">
                <span className="text-xs font-medium text-primary">
                  {recordCount.toLocaleString()} records
                </span>
              </div>
            )}
          </div>

          {/* Last Updated and Live Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                dataSource === 'google_sheets' ? 'bg-accent' : 'bg-warning'
              }`} />
              <span className={`text-xs font-medium ${
                dataSource === 'google_sheets' ? 'text-accent' : 'text-warning'
              }`}>
                {dataSource === 'google_sheets' ? 'Live Data' : 'Demo Mode'}
              </span>
              <Activity className={`w-3 h-3 ${
                dataSource === 'google_sheets' ? 'text-accent' : 'text-warning'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}