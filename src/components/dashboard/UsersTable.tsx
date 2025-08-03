import React, { useState, useEffect } from 'react';
import { Users, Search, Download, LogOut, Eye, EyeOff } from 'lucide-react';
import { fetchUsersData, User } from '@/utils/usersData';

interface UsersTableProps {
  onLogout: () => void;
}

export function UsersTable({ onLogout }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsersData();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['Name', 'Role', 'Password', 'Cards'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.Name,
        user.Role,
        user.Password,
        user.Cards || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCardBadges = (cards: string) => {
    if (!cards) return [];
    return cards.split(',').map(card => card.trim());
  };

  if (loading) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
            <p className="text-muted-foreground">Manage user access and permissions</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users by name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  <div className="flex items-center space-x-2">
                    <span>Password</span>
                    <button
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Access Cards</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">{user.Name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.Role.toLowerCase() === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : user.Role.toLowerCase() === 'branch manager'
                        ? 'bg-blue-100 text-blue-800'
                        : user.Role.toLowerCase() === 'sales officer'
                        ? 'bg-green-100 text-green-800'
                        : user.Role.toLowerCase() === 'artist'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.Role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {showPasswords ? user.Password : '••••••••'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {getCardBadges(user.Cards || '').map((card, cardIndex) => (
                        <span
                          key={cardIndex}
                          className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                        >
                          {card}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="glass rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">{users.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {users.filter(u => u.Role.toLowerCase() === 'admin').length}
            </div>
            <div className="text-sm text-muted-foreground">Admins</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {users.filter(u => u.Role.toLowerCase() !== 'admin').length}
            </div>
            <div className="text-sm text-muted-foreground">Regular Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {users.filter(u => u.Cards?.includes('PerformanceIndicators')).length}
            </div>
            <div className="text-sm text-muted-foreground">Full Access</div>
          </div>
        </div>
      </div>
    </div>
  );
} 