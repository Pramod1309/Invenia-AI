import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';

export default function SettingsScreen({ userData, onLogout }: { userData: any; onLogout: () => void }) {
  const [aiSettings, setAiSettings] = useState({
    screeningLevel: 'balanced',
    biasDetection: true,
    skillMatching: true,
    autoScheduling: false,
    diversityMode: 'enhanced',
    confidenceThreshold: 75,
    automationLevel: 'moderate',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    weeklyReports: true,
    urgentAlerts: true,
    candidateUpdates: true,
    aiInsights: true,
  });
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: 'limited',
    analyticsTracking: true,
    candidatePrivacy: 'enhanced',
    gdprCompliance: true,
  });
  const [integrationSettings, setIntegrationSettings] = useState({
    atsIntegration: false,
    calendarSync: false,
    emailIntegration: false,
    slackNotifications: false,
    apiAccess: false,
  });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoScreening, setAutoScreening] = useState(true);

  const renderSettingItem = (title: string, subtitle?: string, rightComponent?: React.ReactNode) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
      </View>
    </View>
  );

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
      </View>

      <View style={styles.contentInner}>
        {/* AI Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 AI Configuration</Text>
          
          {renderSettingItem(
            'Screening Level',
            'Balance between speed and accuracy',
            <View style={styles.settingOptions}>
              {['conservative', 'balanced', 'aggressive'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionButton,
                    aiSettings.screeningLevel === level && styles.optionButtonActive
                  ]}
                  onPress={() => setAiSettings(prev => ({ ...prev, screeningLevel: level }))}
                >
                  <Text style={styles.optionText}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {renderSettingItem(
            'Bias Detection',
            'Automatically detect and flag potential biases',
            <Switch
              value={aiSettings.biasDetection}
              onValueChange={(value) => setAiSettings(prev => ({ ...prev, biasDetection: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
          
          {renderSettingItem(
            'Skill Matching',
            'AI-powered candidate skill analysis',
            <Switch
              value={aiSettings.skillMatching}
              onValueChange={(value) => setAiSettings(prev => ({ ...prev, skillMatching: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
          
          {renderSettingItem(
            'Confidence Threshold',
            `${aiSettings.confidenceThreshold}% minimum match score`,
            <View style={styles.thresholdContainer}>
              <Text style={styles.thresholdValue}>{aiSettings.confidenceThreshold}%</Text>
              <View style={styles.thresholdButtons}>
                <TouchableOpacity
                  style={styles.thresholdButton}
                  onPress={() => setAiSettings(prev => ({ 
                    ...prev, 
                    confidenceThreshold: Math.max(50, prev.confidenceThreshold - 5) 
                  }))}
                >
                  <Text style={styles.thresholdButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.thresholdButton}
                  onPress={() => setAiSettings(prev => ({ 
                    ...prev, 
                    confidenceThreshold: Math.min(95, prev.confidenceThreshold + 5) 
                  }))}
                >
                  <Text style={styles.thresholdButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {renderSettingItem(
            'Automation Level',
            'Level of AI automation in recruitment',
            <View style={styles.settingOptions}>
              {['minimal', 'moderate', 'maximum'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionButton,
                    aiSettings.automationLevel === level && styles.optionButtonActive
                  ]}
                  onPress={() => setAiSettings(prev => ({ ...prev, automationLevel: level }))}
                >
                  <Text style={styles.optionText}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notifications</Text>
          
          {renderSettingItem(
            'Email Alerts',
            'Receive important updates via email',
            <Switch
              value={notificationSettings.emailAlerts}
              onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, emailAlerts: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
          
          {renderSettingItem(
            'Push Notifications',
            'Real-time mobile notifications',
            <Switch
              value={notificationSettings.pushNotifications}
              onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, pushNotifications: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
          
          {renderSettingItem(
            'AI Insights',
            'Weekly AI-powered recruitment insights',
            <Switch
              value={notificationSettings.aiInsights}
              onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, aiInsights: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
          
          {renderSettingItem(
            'Weekly Reports',
            'Detailed recruitment analytics reports',
            <Switch
              value={notificationSettings.weeklyReports}
              onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, weeklyReports: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
        </View>

        {/* Integrations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 Integrations</Text>
          
          {renderSettingItem(
            'ATS Integration',
            'Connect with existing Applicant Tracking Systems',
            <Switch
              value={integrationSettings.atsIntegration}
              onValueChange={(value) => setIntegrationSettings(prev => ({ ...prev, atsIntegration: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
          
          {renderSettingItem(
            'Calendar Sync',
            'Sync interviews with your calendar',
            <Switch
              value={integrationSettings.calendarSync}
              onValueChange={(value) => setIntegrationSettings(prev => ({ ...prev, calendarSync: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
          
          {renderSettingItem(
            'Slack Notifications',
            'Get recruitment updates in Slack',
            <Switch
              value={integrationSettings.slackNotifications}
              onValueChange={(value) => setIntegrationSettings(prev => ({ ...prev, slackNotifications: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
          
          {renderSettingItem(
            'API Access',
            'Enable API for third-party integrations',
            <Switch
              value={integrationSettings.apiAccess}
              onValueChange={(value) => setIntegrationSettings(prev => ({ ...prev, apiAccess: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Privacy & Security</Text>
          
          {renderSettingItem(
            'Data Sharing',
            'Control how candidate data is shared',
            <View style={styles.settingOptions}>
              {['none', 'limited', 'full'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionButton,
                    privacySettings.dataSharing === level && styles.optionButtonActive
                  ]}
                  onPress={() => setPrivacySettings(prev => ({ ...prev, dataSharing: level }))}
                >
                  <Text style={styles.optionText}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {renderSettingItem(
            'Analytics Tracking',
            'Help improve AI with usage analytics',
            <Switch
              value={privacySettings.analyticsTracking}
              onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, analyticsTracking: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
          
          {renderSettingItem(
            'GDPR Compliance',
            'Ensure compliance with data protection regulations',
            <Switch
              value={privacySettings.gdprCompliance}
              onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, gdprCompliance: value }))}
              trackColor={{ true: '#10B981', false: '#E5E7EB' }}
            />
          )}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Account Settings</Text>
          
          {renderSettingItem(
            'Name',
            userData?.user?.name || 'Recruiter',
            <Text style={styles.settingValue}>{userData?.user?.name || 'Recruiter'}</Text>
          )}
          
          {renderSettingItem(
            'Email',
            userData?.user?.email || 'recruiter@invenia.ai',
            <Text style={styles.settingValue}>{userData?.user?.email || 'recruiter@invenia.ai'}</Text>
          )}
          
          {renderSettingItem(
            'Department',
            'Human Resources',
            <Text style={styles.settingValue}>Human Resources</Text>
          )}
          
          {renderSettingItem(
            'Role',
            'Senior Recruiter',
            <Text style={styles.settingValue}>Senior Recruiter</Text>
          )}
        </View>

        {/* Advanced Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Advanced Settings</Text>
          
          {renderSettingItem(
            'AI Model Version',
            'Latest AI model for optimal performance',
            <Text style={styles.settingValue}>v2.4.1 (Latest)</Text>
          )}
          
          {renderSettingItem(
            'Data Export',
            'Export all recruitment data',
            <TouchableOpacity style={styles.exportButton}>
              <Text style={styles.exportButtonText}>📥 Export Data</Text>
            </TouchableOpacity>
          )}
          
          {renderSettingItem(
            'Reset AI Learning',
            'Reset AI model to default settings',
            <TouchableOpacity style={styles.resetButton}>
              <Text style={styles.resetButtonText}>🔄 Reset AI</Text>
            </TouchableOpacity>
          )}
          
          {renderSettingItem(
            'System Status',
            'Check system health and performance',
            <View style={styles.statusContainer}>
              <View style={[styles.statusIndicator, { backgroundColor: '#10B981' }]} />
              <Text style={styles.statusText}>All Systems Operational</Text>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  contentInner: {
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingContent: {
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingValue: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  settingRight: {
    alignItems: 'flex-end',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  thresholdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thresholdValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 40,
  },
  thresholdButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  thresholdButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thresholdButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  exportButton: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
