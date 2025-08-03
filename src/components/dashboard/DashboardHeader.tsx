import { Clock, Activity, Database, CheckCircle, FileText } from "lucide-react";
import { ECGAnimation } from "./ECGAnimation";

interface DashboardHeaderProps {
  lastUpdated: Date;
  recordCount?: number;
  dataSource?: 'google_sheets' | 'mock_data';
  onRefresh?: () => void;
  onFilterClick?: () => void;
  loading?: boolean;
  businessHealth?: number;
}

export function DashboardHeader({ 
  lastUpdated, 
  recordCount, 
  dataSource, 
  onRefresh, 
  onFilterClick,
  loading = false,
  businessHealth = 58
}: DashboardHeaderProps) {
  return (
    <div className="glass rounded-xl p-2 border border-glass-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">
              BookGX Plus
            </h1>
            <div className="flex items-center gap-2">
              <ECGAnimation 
                size={64} 
                isHealthy={businessHealth >= 80}
              />
              <span className={`text-lg font-bold ${businessHealth >= 80 ? 'text-green-500' : 'text-red-500'}`}>
                {businessHealth}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-4 lg:space-y-0">
          {/* Data Source and Record Count */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                {dataSource === 'google_sheets' ? 'Google Sheets' : 'Demo Data'}
              </span>
              {dataSource === 'google_sheets' && (
                <CheckCircle className="w-4 h-4 text-accent" />
              )}
            </div>
            
            {recordCount !== undefined && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-sm font-medium text-primary">
                  {recordCount.toLocaleString()} records
                </span>
              </div>
            )}
          </div>

          {/* Last Updated and Live Status */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                dataSource === 'google_sheets' ? 'bg-accent' : 'bg-warning'
              }`} />
              <span className={`text-sm font-medium ${
                dataSource === 'google_sheets' ? 'text-accent' : 'text-warning'
              }`}>
                {dataSource === 'google_sheets' ? 'Live Data' : 'Demo Mode'}
              </span>
              <Activity className={`w-4 h-4 ${
                dataSource === 'google_sheets' ? 'text-accent' : 'text-warning'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}