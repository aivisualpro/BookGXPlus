import { useEffect, useState } from "react";
import { StatsOverview } from "./StatsOverview";
import { RevenueChart } from "./RevenueChart";
import { PerformanceIndicators } from "./PerformanceIndicators";
import { ParticleBackground } from "./ParticleBackground";

import { DateRangeFilter } from "./DateRangeFilter";
import { createDashboardAPI, transformToDashboardData } from "@/utils/googleSheets";
import { User } from "@/utils/usersData";

interface DashboardData {
  revenue: { month: string; value: number; growth: number }[];
  users: { date: string; active: number; new: number; retention: number }[];
  conversion: { stage: string; users: number; rate: number }[];
  performance: {
    serverUptime: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  stats: {
    totalRevenue: number;
    totalUsers: number;
    conversionRate: number;
    avgOrderValue: number;
    totalReviews: number;
    reviewsByStatus: { [status: string]: number };
    revenueByStatus: { [status: string]: number };
    acquisitionChannels: { [channel: string]: string };
    natureBooking: { [nature: string]: string };
    locationData: { name: string; value: number; percentage: number; color: string }[];
    acquisitionPieData: { name: string; value: number; percentage: number; color: string }[];
    naturePieData: { name: string; value: number; percentage: number; color: string }[];
  };
  recordCount: number;
  dataSource: 'google_sheets' | 'mock_data';
}

interface DashboardLayoutProps {
  user?: User;
  onNavigateHome?: () => void;
  onNavigateUsers?: () => void;
  onLogout?: () => void;
  onDataUpdate?: (data: { dataSource: 'google_sheets' | 'mock_data'; recordCount?: number; lastUpdated: Date; businessHealth?: number }) => void;
}

export function DashboardLayout({ user, onNavigateHome, onNavigateUsers, onLogout, onDataUpdate }: DashboardLayoutProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<string>('default');

  // Get user's allowed cards
  const getUserCards = () => {
    if (!user?.Cards) {
      console.log('No cards found for user:', user);
      return ['ConnectionStatus', 'StatsOverview'];
    }
    
    const cards = user.Cards.split(',').map(card => card.trim());
    console.log('User cards:', user.Name, 'Cards:', user.Cards, 'Parsed:', cards);
    
    // Special debugging for newrec user
    if (user.Name.toLowerCase().includes('newrec')) {
      console.log('🔍 NEWREC USER DEBUG:');
      console.log('🔍 Original Cards string:', user.Cards);
      console.log('🔍 Parsed cards array:', cards);
      console.log('🔍 ConnectionStatus check:', cards.includes('ConnectionStatus'));
      console.log('🔍 StatsOverview check:', cards.includes('StatsOverview'));
    }
    
    return cards;
  };

  const allowedCards = getUserCards();
  console.log('Allowed cards for', user?.Name, ':', allowedCards);

  // Function to fetch data from Google Sheets
  const fetchData = async (startDate?: string, endDate?: string): Promise<DashboardData> => {
    try {
      // Try to fetch real data from Google Sheets
      const sheetsAPI = createDashboardAPI();
      const rawData = await sheetsAPI.fetchParsedData();
      return transformToDashboardData(rawData, startDate, endDate);
    } catch (error) {
      console.warn('Failed to fetch from Google Sheets, using mock data:', error);
      
      // Fallback to mock data if Google Sheets fails
      return {
        revenue: [
          { month: "Jan", value: 45000, growth: 12 },
          { month: "Feb", value: 52000, growth: 15 },
          { month: "Mar", value: 48000, growth: -8 },
          { month: "Apr", value: 61000, growth: 27 },
          { month: "May", value: 69000, growth: 13 },
          { month: "Jun", value: 75000, growth: 9 },
          { month: "Jul", value: 82000, growth: 9 },
          { month: "Aug", value: 79000, growth: -4 },
          { month: "Sep", value: 87000, growth: 10 },
          { month: "Oct", value: 94000, growth: 8 },
          { month: "Nov", value: 101000, growth: 7 },
          { month: "Dec", value: 108000, growth: 7 }
        ],
        users: [
          { date: "Location A", active: 15420, new: 12, retention: 87 },
          { date: "Location B", active: 16100, new: 18, retention: 89 },
          { date: "Location C", active: 15800, new: 15, retention: 85 },
          { date: "Location D", active: 17200, new: 22, retention: 91 },
          { date: "Location E", active: 18500, new: 16, retention: 88 },
          { date: "Location F", active: 17900, new: 19, retention: 86 },
          { date: "Location G", active: 19300, new: 25, retention: 92 }
        ],
        conversion: [
          { stage: "Inquiries", users: 1000, rate: 100 },
          { stage: "Confirmed", users: 850, rate: 85 },
          { stage: "Completed", users: 765, rate: 90 },
          { stage: "Paid", users: 720, rate: 94 },
          { stage: "Rated", users: 580, rate: 80 }
        ],
        performance: {
          serverUptime: 94.2, // Payment completion rate
          responseTime: 275, // Average order value
          errorRate: 8.5, // Cancellation rate
          throughput: 23.4 // Up-selling rate
        },
          stats: {
            totalRevenue: 847000,
            totalUsers: 1250, // Unique clients
            conversionRate: 76.5, // Booking completion rate
            avgOrderValue: 275.50,
            totalReviews: 580,
            reviewsByStatus: { 'Completed': 450, 'Confirmed': 100, 'Canceled': 30 },
            revenueByStatus: { 'Completed': 720000, 'Confirmed': 80000, 'Canceled': 47000 },
            acquisitionChannels: { 'Direct': '45%', 'Social Media': '30%', 'Referral': '15%', 'Other': '10%' },
            natureBooking: { 'Online': '60%', 'Phone': '25%', 'Walk-in': '15%' },
            locationData: [
              { name: 'Location A', value: 250000, percentage: 29.5, color: '#8884d8' },
              { name: 'Location B', value: 220000, percentage: 26.0, color: '#82ca9d' },
              { name: 'Location C', value: 180000, percentage: 21.3, color: '#ffc658' },
              { name: 'Location D', value: 150000, percentage: 17.7, color: '#ff7300' },
              { name: 'Location E', value: 47000, percentage: 5.5, color: '#ff0000' }
            ],
            acquisitionPieData: [
              { name: 'Direct', value: 45, percentage: 45, color: '#8884d8' },
              { name: 'Social Media', value: 30, percentage: 30, color: '#82ca9d' },
              { name: 'Referral', value: 15, percentage: 15, color: '#ffc658' },
              { name: 'Other', value: 10, percentage: 10, color: '#ff7300' }
            ],
            naturePieData: [
              { name: 'Online', value: 60, percentage: 60, color: '#8884d8' },
              { name: 'Phone', value: 25, percentage: 25, color: '#82ca9d' },
              { name: 'Walk-in', value: 15, percentage: 15, color: '#ffc658' }
            ]
          },
        recordCount: 1250,
        dataSource: 'mock_data'
      };
    }
  };

  const loadData = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      const dashboardData = await fetchData(startDate, endDate);
      setData(dashboardData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData(dateRange.start, dateRange.end);
  };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
  };

  const handleTimePeriodChange = (period: string) => {
    setCurrentPeriod(period);
    const endDate = new Date();
    let startDate = new Date();

    switch (period) {
      case 'today':
        startDate = new Date();
        break;
      case 'this-month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case 'last-month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate.setDate(0); // Last day of previous month
        break;
      case 'this-year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      case 'all':
        loadData('', '');
        return;
      default:
        // Default to last 90 days
        startDate.setDate(startDate.getDate() - 90);
    }

    loadData(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    loadData(startDate, endDate);
  };

  useEffect(() => {
    // Load all data by default (no date filtering)
    setCurrentPeriod('all');
    loadData('', ''); // Empty strings mean no date filtering - load all data
  }, []);

  // Notify parent component when data changes
  useEffect(() => {
    if (data && onDataUpdate) {
      const businessHealth = Math.round(
        (data.performance.serverUptime + 
         (data.performance.responseTime / 500 * 100) + 
         (100 - data.performance.errorRate * 2) + 
         (data.performance.throughput * 2)) / 4
      );
      
      onDataUpdate({
        dataSource: data.dataSource,
        recordCount: data.recordCount,
        lastUpdated: lastUpdated,
        businessHealth: businessHealth
      });
    }
  }, [data, lastUpdated, onDataUpdate]);

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 p-6 space-y-6">
        {showFilters && (
          <div className="flex justify-start">
            <DateRangeFilter onDateRangeChange={handleDateRangeChange} loading={loading} />
          </div>
        )}

        {loading && !data ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass h-48 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-6 animate-fade-in">

            
            {/* StatsOverview - Show if user has permission */}
            {(() => {
              const hasPermission = allowedCards.includes('StatsOverview');
              console.log('StatsOverview permission check:', hasPermission, 'for user:', user?.Name);
              return hasPermission ? (
                <StatsOverview stats={data.stats} dateRange={dateRange} onTimePeriodChange={handleTimePeriodChange} currentPeriod={currentPeriod} />
              ) : null;
            })()}
            
            <div className="space-y-6">
              {/* RevenueChart - Show if user has permission */}
              {(() => {
                const hasPermission = allowedCards.includes('RevenueChart');
                console.log('RevenueChart permission check:', hasPermission, 'for user:', user?.Name);
                return hasPermission ? (
                  <RevenueChart data={data.revenue} />
                ) : null;
              })()}
              
              {/* PerformanceIndicators - Show if user has permission */}
              {(() => {
                const hasPermission = allowedCards.includes('PerformanceIndicators');
                console.log('PerformanceIndicators permission check:', hasPermission, 'for user:', user?.Name);
                return hasPermission ? (
                  <PerformanceIndicators performance={data.performance} />
                ) : null;
              })()}
            </div>
          </div>
        ) : (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-muted-foreground">Failed to load dashboard data</p>
          </div>
        )}
      </div>
    </div>
  );
}