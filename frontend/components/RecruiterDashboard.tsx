import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import HomeScreen from './HomeScreen';
import JobsScreen from './JobsScreen';
import AnalyticsScreen from './AnalyticsScreen';
import SettingsScreen from './SettingsScreen';

// Mock data for development - all stats set to zero
const mockKPIData = {
  timeSaved: {
    value: '0 hrs',
    subtitle: 'vs manual screening',
    trend: 'neutral'
  },
  pendingReviews: {
    value: 0,
    threshold: 20
  },
  avgMatch: {
    value: 0,
    trend: 'neutral'
  },
  overrides: {
    value: 0
  },
  biasAlerts: {
    value: 0
  }
};

const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    location: 'Engineering',
    status: 'open',
    resumeCount: 0,
    aiStatus: 'ready',
    pendingActions: 0,
    biasRisk: 'low',
    confidence: 0
  },
  {
    id: '2',
    title: 'Product Manager',
    location: 'Product',
    status: 'open',
    resumeCount: 0,
    aiStatus: 'ready',
    pendingActions: 0,
    biasRisk: 'low',
    confidence: 0
  },
  {
    id: '3',
    title: 'UX Designer',
    location: 'Design',
    status: 'open',
    resumeCount: 0,
    aiStatus: 'ready',
    pendingActions: 0,
    biasRisk: 'low',
    confidence: 0
  }
];

const mockAlerts = [
  // No active alerts - empty array
];

export default function RecruiterDashboard({ userData, onLogout, onNavigateToTab, activeContent = 'home' }: { 
  userData: any; 
  onLogout: () => void;
  onNavigateToTab?: (tab: 'home' | 'jobs' | 'analytics' | 'settings') => void;
  activeContent?: string;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSort, setSelectedSort] = useState('recent');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(activeContent); // Track active bottom nav tab

  // Update active tab when activeContent changes
  React.useEffect(() => {
    setActiveTab(activeContent);
  }, [activeContent]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return '#10B981';
    if (confidence >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#6B7280';
      case 'screening': return '#F59E0B';
      case 'interview': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getAIStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return '#10B981';
      case 'processing': return '#F59E0B';
      case 'needs_review': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderKPICard = (icon: string, title: string, value: string | number, subtitle?: string, color?: string, trend?: string) => (
    <View style={[styles.kpiCard, { borderLeftColor: color || '#6B7280' }]}>
      <View style={styles.kpiHeader}>
        <Text style={styles.kpiIcon}>{icon}</Text>
        <View style={styles.kpiTitleContainer}>
          <Text style={styles.kpiTitle}>{title}</Text>
          {subtitle && <Text style={styles.kpiSubtitle}>{subtitle}</Text>}
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <Text style={styles.trend}>{trend === 'up' ? '↑' : '↓'}</Text>
          </View>
        )}
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
    </View>
  );

  const renderJobCard = (job: any) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobLocation}>{job.location}</Text>
        </View>
        <View style={styles.jobStatusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
            <Text style={styles.statusText}>{job.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.jobMetrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Resumes</Text>
          <Text style={styles.metricValue}>{job.resumeCount}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>AI Status</Text>
          <View style={[styles.aiStatusBadge, { backgroundColor: getAIStatusColor(job.aiStatus) }]}>
            <Text style={styles.aiStatusText}>{job.aiStatus.replace('_', ' ').toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Confidence</Text>
          <View style={styles.confidenceContainer}>
            <Text style={[styles.confidenceValue, { color: getConfidenceColor(job.confidence) }]}>
              {job.confidence}%
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.jobActions}>
        <Text style={styles.pendingActions}>{job.pendingActions} pending</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>View Candidates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Review Alerts</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.matchBar}>
        <View style={[styles.matchSegment, { flex: job.confidence / 100 }]} />
        <View style={[styles.matchSegment, { flex: (100 - job.confidence) / 100 }]} />
      </View>
    </View>
  );

  const renderAlertRow = (alert: any) => (
    <TouchableOpacity style={styles.alertRow}>
      <View style={[styles.alertIcon, { backgroundColor: alert.type === 'bias' ? '#EF4444' : '#F59E0B' }]}>
        <Text style={styles.alertIconText}>
          {alert.type === 'bias' ? '⚠️' : '⚠️'}
        </Text>
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.alertMessage}>{alert.message}</Text>
        <Text style={styles.alertJob}>{alert.jobId}</Text>
        <Text style={styles.alertTime}>{alert.time}</Text>
      </View>
      <TouchableOpacity style={styles.alertCTA}>
        <Text style={styles.alertCTAText}>Review Now</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>Invenia AI</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>RECRUITER</Text>
          </View>
        </View>
        
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.notificationBell}>
            <Text style={styles.notificationIcon}>🔔</Text>
            {mockAlerts.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{mockAlerts.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileAvatar}
            onPress={() => setShowProfileMenu(true)}
          >
            <Text style={styles.avatarText}>{userData?.user?.name?.charAt(0)?.toUpperCase() || 'R'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Menu Modal */}
      <Modal
        visible={showProfileMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowProfileMenu(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.profileMenu}>
                <View style={styles.profileMenuHeader}>
                  <View style={styles.profileMenuAvatar}>
                    <Text style={styles.profileMenuAvatarText}>
                      {userData?.user?.name?.charAt(0)?.toUpperCase() || 'R'}
                    </Text>
                  </View>
                  <View style={styles.profileMenuInfo}>
                    <Text style={styles.profileMenuName}>{userData?.user?.name || 'Recruiter'}</Text>
                    <Text style={styles.profileMenuEmail}>{userData?.user?.email || 'recruiter@invenia.ai'}</Text>
                  </View>
                </View>
                
                <View style={styles.profileMenuDivider} />
                
                <TouchableOpacity style={styles.profileMenuItem}>
                  <Text style={styles.profileMenuItemText}>⚙️ Settings</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.profileMenuItem}>
                  <Text style={styles.profileMenuItemText}>📊 Analytics</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.profileMenuItem}>
                  <Text style={styles.profileMenuItemText}>💬 Support</Text>
                </TouchableOpacity>
                
                <View style={styles.profileMenuDivider} />
                
                <TouchableOpacity 
                  style={styles.profileMenuItem}
                  onPress={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                >
                  <Text style={[styles.profileMenuItemText, { color: '#EF4444' }]}>🚪 Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Render content based on active tab */}
        {activeContent === 'home' && (
          <HomeScreen userData={userData} />
        )}
        
        {activeContent === 'jobs' && (
          <JobsScreen userData={userData} />
        )}
        
        {activeContent === 'analytics' && (
          <AnalyticsScreen userData={userData} />
        )}
        
        {activeContent === 'settings' && (
          <SettingsScreen userData={userData} onLogout={onLogout} />
        )}
        
        {/* Default dashboard content when no specific tab is active */}
        {activeContent === 'dashboard' && (
          <View>
            {/* ROI KPI Strip */}
            <View style={styles.kpiStrip}>
              <Text style={styles.sectionTitle}>PERFORMANCE OVERVIEW</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiScroll}>
                {renderKPICard('⏱️', 'Time Saved (This Week)', mockKPIData.timeSaved.value, mockKPIData.timeSaved.subtitle, '#10B981', mockKPIData.timeSaved.trend)}
                {renderKPICard('📄', 'Pending Reviews', mockKPIData.pendingReviews.value, undefined, mockKPIData.pendingReviews.value > mockKPIData.pendingReviews.threshold ? '#EF4444' : '#6B7280')}
                {renderKPICard('📊', 'Avg Match %', `${mockKPIData.avgMatch.value}%`, undefined, '#10B981', mockKPIData.avgMatch.trend)}
                {renderKPICard('🔁', 'Overrides', mockKPIData.overrides.value, undefined, '#F59E0B')}
                {mockKPIData.biasAlerts.value > 0 && renderKPICard('⚖️', 'Bias Alerts', mockKPIData.biasAlerts.value, undefined, '#EF4444')}
              </ScrollView>
            </View>

            {/* AI Attention & Alerts Panel */}
            <View style={styles.alertsPanel}>
              <Text style={styles.sectionTitle}>AI ATTENTION REQUIRED</Text>
              {mockAlerts.map((alert) => renderAlertRow(alert))}
            </View>

            {/* My Active Jobs Section */}
            <View style={styles.jobsSection}>
              <View style={styles.jobsHeader}>
                <Text style={styles.sectionTitle}>MY ACTIVE JOBS</Text>
                <View style={styles.sortContainer}>
                  <TouchableOpacity 
                    style={[styles.sortButton, selectedSort === 'recent' && styles.sortButtonActive]}
                    onPress={() => setSelectedSort('recent')}
                  >
                    <Text style={styles.sortButtonText}>Recent</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.sortButton, selectedSort === 'risk' && styles.sortButtonActive]}
                    onPress={() => setSelectedSort('risk')}
                  >
                    <Text style={styles.sortButtonText}>Risk</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.sortButton, selectedSort === 'confidence' && styles.sortButtonActive]}
                    onPress={() => setSelectedSort('confidence')}
                  >
                    <Text style={styles.sortButtonText}>Confidence</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.jobsList}>
                {mockJobs.map((job) => renderJobCard(job))}
              </View>
            </View>

            {/* Quick Action Bar */}
            <View style={styles.quickActionBar}>
              <TouchableOpacity style={styles.quickActionButton}>
                <Text style={styles.quickActionText}>➕ Create Job</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <Text style={styles.quickActionText}>📄 Upload Resumes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <Text style={styles.quickActionText}>📊 View Reports</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Fixed Bottom Navigation Bar - Outside ScrollView */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.bottomNavItem, activeTab === 'home' && styles.bottomNavItemActive]}
          onPress={() => onNavigateToTab ? onNavigateToTab('home') : {}}
        >
          <Text style={[styles.bottomNavIcon, activeTab === 'home' && styles.bottomNavTextActive]}>🏠</Text>
          <Text style={[styles.bottomNavText, activeTab === 'home' && styles.bottomNavTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.bottomNavItem, activeTab === 'jobs' && styles.bottomNavItemActive]}
          onPress={() => onNavigateToTab ? onNavigateToTab('jobs') : {}}
        >
          <Text style={[styles.bottomNavIcon, activeTab === 'jobs' && styles.bottomNavTextActive]}>💼</Text>
          <Text style={[styles.bottomNavText, activeTab === 'jobs' && styles.bottomNavTextActive]}>Jobs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.bottomNavItem, activeTab === 'analytics' && styles.bottomNavItemActive]}
          onPress={() => onNavigateToTab ? onNavigateToTab('analytics') : {}}
        >
          <Text style={[styles.bottomNavIcon, activeTab === 'analytics' && styles.bottomNavTextActive]}>📊</Text>
          <Text style={[styles.bottomNavText, activeTab === 'analytics' && styles.bottomNavTextActive]}>Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.bottomNavItem, activeTab === 'settings' && styles.bottomNavItemActive]}
          onPress={() => onNavigateToTab ? onNavigateToTab('settings') : {}}
        >
          <Text style={[styles.bottomNavIcon, activeTab === 'settings' && styles.bottomNavTextActive]}>⚙️</Text>
          <Text style={[styles.bottomNavText, activeTab === 'settings' && styles.bottomNavTextActive]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // Add padding for status bar
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBell: {
    marginRight: 16,
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: 80, // Add padding for bottom navigation
  },
  kpiStrip: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  kpiScroll: {
    flexDirection: 'row',
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    borderLeftWidth: 4,
    borderLeftColor: '#6B7280',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  kpiIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  kpiTitleContainer: {
    flex: 1,
  },
  kpiTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 18,
  },
  kpiSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  trendContainer: {
    alignItems: 'center',
  },
  trend: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  alertsPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertIconText: {
    fontSize: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  alertJob: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  alertCTA: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  alertCTAText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  jobsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#3B82F6',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  sortButtonActive: {
    color: '#FFFFFF',
  },
  jobsList: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6B7280',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobStatusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  jobMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  aiStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingActions: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  matchBar: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  matchSegment: {
    backgroundColor: '#10B981',
  },
  quickActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  quickActionButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  // Profile Menu Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  profileMenu: {
    backgroundColor: '#FFFFFF',
    width: 280,
    maxHeight: '80%',
    borderRadius: 16,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  profileMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileMenuAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileMenuAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileMenuInfo: {
    flex: 1,
  },
  profileMenuName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  profileMenuEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  profileMenuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  profileMenuItemText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  // Bottom Navigation Styles
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavItemActive: {
    backgroundColor: '#3B82F6',
  },
  bottomNavIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  bottomNavText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomNavTextActive: {
    color: '#FFFFFF',
  },
});
