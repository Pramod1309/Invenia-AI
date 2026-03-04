import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function AnalyticsScreen({ userData }: { userData: any }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [aiInsights, setAiInsights] = useState({
    hiringVelocity: 0,
    qualityScore: 0,
    diversityIndex: 0,
    costPerHire: 0,
    timeToFill: 0,
    offerAcceptance: 0,
    candidateSatisfaction: 0,
    retentionRate: 0,
  });
  const [predictions, setPredictions] = useState({
    nextMonthHiring: 0,
    skillDemand: [],
    salaryTrends: [],
    marketConditions: 'Stable',
  });
  const [benchmarkData, setBenchmarkData] = useState({
    industry: 0,
    competitors: 0,
    bestPractice: 0,
  });

  const analyticsData = {
    week: {
      totalApplications: 0,
      screenedCandidates: 0,
      averageMatchScore: 0,
      timeSaved: 0,
      jobsPosted: 0,
    },
    month: {
      totalApplications: 0,
      screenedCandidates: 0,
      averageMatchScore: 0,
      timeSaved: 0,
      jobsPosted: 0,
    },
    year: {
      totalApplications: 0,
      screenedCandidates: 0,
      averageMatchScore: 0,
      timeSaved: 0,
      jobsPosted: 0,
    },
  };

  const renderMetricCard = (title: string, value: string | number, subtitle?: string, color: string = '#3B82F6') => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{title}</Text>
        {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  );

  const renderChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>📊 Application Trends</Text>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.chartPlaceholderText}>No data available</Text>
        <Text style={styles.chartSubtext}>Start recruiting to see analytics</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Analytics</Text>
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.contentInner}>
        {/* AI-Powered Performance Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 AI Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            {renderMetricCard(
              'Hiring Velocity',
              `${aiInsights.hiringVelocity} days`,
              'Avg time to hire',
              '#10B981'
            )}
            {renderMetricCard(
              'Quality Score',
              `${aiInsights.qualityScore}%`,
              'Candidate quality',
              '#3B82F6'
            )}
            {renderMetricCard(
              'Diversity Index',
              `${aiInsights.diversityIndex}%`,
              'Workplace diversity',
              '#8B5CF6'
            )}
            {renderMetricCard(
              'Cost per Hire',
              `$${aiInsights.costPerHire}`,
              'Total hiring cost',
              '#F59E0B'
            )}
            {renderMetricCard(
              'Time to Fill',
              `${aiInsights.timeToFill} days`,
              'Average fill time',
              '#10B981'
            )}
            {renderMetricCard(
              'Offer Acceptance',
              `${aiInsights.offerAcceptance}%`,
              'Accepted offers',
              '#10B981'
            )}
            {renderMetricCard(
              'Retention Rate',
              `${aiInsights.retentionRate}%`,
              '1-year retention',
              '#10B981'
            )}
            {renderMetricCard(
              'Candidate Satisfaction',
              `${aiInsights.candidateSatisfaction}/5`,
              'Experience rating',
              '#8B5CF6'
            )}
          </View>
        </View>

        {/* AI Predictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔮 AI Predictions & Forecasting</Text>
          <View style={styles.predictionContainer}>
            <View style={styles.predictionCard}>
              <Text style={styles.predictionTitle}>Next Month Hiring</Text>
              <Text style={styles.predictionValue}>{predictions.nextMonthHiring} candidates</Text>
              <Text style={styles.predictionTrend}>📈 Based on current pipeline</Text>
            </View>
            <View style={styles.predictionCard}>
              <Text style={styles.predictionTitle}>Market Conditions</Text>
              <Text style={styles.predictionValue}>{predictions.marketConditions}</Text>
              <Text style={styles.predictionTrend}>📊 AI analysis</Text>
            </View>
          </View>
          
          <View style={styles.skillDemandContainer}>
            <Text style={styles.skillDemandTitle}>🎯 In-Demand Skills (AI Prediction)</Text>
            <View style={styles.skillDemandList}>
              <View style={styles.skillDemandItem}>
                <Text style={styles.skillName}>React Native</Text>
                <View style={styles.demandBar}>
                  <View style={[styles.demandProgress, { width: '0%' }]} />
                </View>
                <Text style={styles.demandPercentage}>0%</Text>
              </View>
              <View style={styles.skillDemandItem}>
                <Text style={styles.skillName}>Machine Learning</Text>
                <View style={styles.demandBar}>
                  <View style={[styles.demandProgress, { width: '0%' }]} />
                </View>
                <Text style={styles.demandPercentage}>0%</Text>
              </View>
              <View style={styles.skillDemandItem}>
                <Text style={styles.skillName}>Cloud Architecture</Text>
                <View style={styles.demandBar}>
                  <View style={[styles.demandProgress, { width: '0%' }]} />
                </View>
                <Text style={styles.demandPercentage}>0%</Text>
              </View>
              <View style={styles.skillDemandItem}>
                <Text style={styles.skillName}>Data Science</Text>
                <View style={styles.demandBar}>
                  <View style={[styles.demandProgress, { width: '0%' }]} />
                </View>
                <Text style={styles.demandPercentage}>0%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Benchmarking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Industry Benchmarking</Text>
          <View style={styles.benchmarkContainer}>
            <View style={styles.benchmarkItem}>
              <Text style={styles.benchmarkLabel}>Your Performance</Text>
              <Text style={styles.benchmarkValue}>0%</Text>
              <View style={styles.benchmarkBar}>
                <View style={[styles.benchmarkProgress, { width: '0%', backgroundColor: '#10B981' }]} />
              </View>
            </View>
            <View style={styles.benchmarkItem}>
              <Text style={styles.benchmarkLabel}>Industry Average</Text>
              <Text style={styles.benchmarkValue}>{benchmarkData.industry}%</Text>
              <View style={styles.benchmarkBar}>
                <View style={[styles.benchmarkProgress, { width: '0%', backgroundColor: '#6B7280' }]} />
              </View>
            </View>
            <View style={styles.benchmarkItem}>
              <Text style={styles.benchmarkLabel}>Top Performers</Text>
              <Text style={styles.benchmarkValue}>{benchmarkData.bestPractice}%</Text>
              <View style={styles.benchmarkBar}>
                <View style={[styles.benchmarkProgress, { width: '0%', backgroundColor: '#8B5CF6' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧠 AI-Powered Insights</Text>
          <View style={styles.insightsList}>
            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>🎯</View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Optimal Posting Times</Text>
                <Text style={styles.insightText}>
                  AI analysis shows Tuesday and Thursday mornings receive 40% more qualified applications
                </Text>
              </View>
            </View>
            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>💰</View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Salary Optimization</Text>
                <Text style={styles.insightText}>
                  Current salary ranges are 15% below market average for key roles
                </Text>
              </View>
            </View>
            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>⚖️</View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Bias Detection</Text>
                <Text style={styles.insightText}>
                  No significant bias detected in current screening process
                </Text>
              </View>
            </View>
            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>🚀</View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Process Efficiency</Text>
                <Text style={styles.insightText}>
                  AI automation can reduce screening time by 75%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Advanced Analytics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Advanced Analytics</Text>
          <View style={styles.analyticsGrid}>
            <TouchableOpacity style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>📊 Funnel Analysis</Text>
              <Text style={styles.analyticsDescription}>Track candidate journey</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>🎯 Source Performance</Text>
              <Text style={styles.analyticsDescription}>Best recruitment channels</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>⏱️ Time Analytics</Text>
              <Text style={styles.analyticsDescription}>Process bottlenecks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>💰 Cost Analysis</Text>
              <Text style={styles.analyticsDescription}>ROI by channel</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#3B82F6',
  },
  periodText: {
    fontSize: 14,
    color: '#6B7280',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  // Prediction Styles
  predictionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  predictionCard: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  predictionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  predictionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  predictionTrend: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Skill Demand Styles
  skillDemandContainer: {
    marginTop: 16,
  },
  skillDemandTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  skillDemandList: {
    gap: 12,
  },
  skillDemandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    width: 120,
  },
  demandBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  demandProgress: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  demandPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    width: 40,
    textAlign: 'right',
  },
  // Benchmark Styles
  benchmarkContainer: {
    gap: 16,
  },
  benchmarkItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  benchmarkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  benchmarkValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  benchmarkBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  benchmarkProgress: {
    height: '100%',
    borderRadius: 4,
  },
  // AI Insights Styles
  insightsList: {
    gap: 12,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  // Advanced Analytics Styles
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analyticsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  analyticsDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  chartSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
