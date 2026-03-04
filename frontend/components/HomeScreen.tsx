import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Image, Linking } from 'react-native';

export default function HomeScreen({ userData }: { userData: any }) {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState({
    resumeAnalysis: 0,
    skillMatches: 0,
    biasDetections: 0,
    automatedScreenings: 0,
    timeSaved: 0,
    candidatePool: 0,
    activeJobs: 0,
    pendingReviews: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [skillTrends, setSkillTrends] = useState<any[]>([]);
  const [candidatePipeline, setCandidatePipeline] = useState({
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    hired: 0,
  });

  const handleFileUpload = async () => {
    try {
      // For web platform
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
        
        input.onchange = (event: any) => {
          const files = Array.from(event.target.files);
          processFiles(files);
        };
        
        input.click();
      } else {
        // For mobile platforms - use expo-document-picker if available
        Alert.alert('File Upload', 'File upload is available on web platform. Please use web version to upload resumes.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open file picker. Please try again.');
      console.error('File upload error:', error);
    }
  };

  const processFiles = (files: any[]) => {
    const newFiles = files.map((file, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uri: Platform.OS === 'web' ? URL.createObjectURL(file) : file.uri,
      uploadTime: new Date().toLocaleString(),
      file: file, // Store actual file object for preview
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    Alert.alert('Success', `Uploaded ${newFiles.length} file(s) successfully!`);
  };

  const openFilePreview = (file: any) => {
    if (Platform.OS === 'web' && file.uri) {
      // Open file in new tab for web
      Linking.openURL(file.uri);
    } else {
      Alert.alert('File Preview', 'File preview is available on web platform.');
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const renderFilePreview = (file: any) => (
    <TouchableOpacity 
      key={file.id} 
      style={[styles.filePreview, styles.clickableFilePreview]}
      onPress={() => openFilePreview(file)}
    >
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{file.name}</Text>
        <Text style={styles.fileDetails}>
          {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1]?.toUpperCase() || 'FILE'} • {file.uploadTime}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeFile(file.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Invenia AI</Text>
        <Text style={styles.subtitle}>Intelligent Recruitment Command Center</Text>
      </View>

      <View style={styles.content}>
        {/* AI Performance Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🤖 AI Performance Overview</Text>
          <View style={styles.aiMetricsGrid}>
            <View style={styles.aiMetricCard}>
              <Text style={styles.aiMetricValue}>{aiInsights.resumeAnalysis}</Text>
              <Text style={styles.aiMetricLabel}>Resumes Analyzed</Text>
              <Text style={styles.aiMetricTrend}>📈 This Week</Text>
            </View>
            <View style={styles.aiMetricCard}>
              <Text style={styles.aiMetricValue}>{aiInsights.skillMatches}</Text>
              <Text style={styles.aiMetricLabel}>Skill Matches</Text>
              <Text style={styles.aiMetricTrend}>🎯 High Accuracy</Text>
            </View>
            <View style={styles.aiMetricCard}>
              <Text style={styles.aiMetricValue}>{aiInsights.biasDetections}</Text>
              <Text style={styles.aiMetricLabel}>Bias Detections</Text>
              <Text style={styles.aiMetricTrend}>⚖️ Fair Hiring</Text>
            </View>
            <View style={styles.aiMetricCard}>
              <Text style={styles.aiMetricValue}>{aiInsights.timeSaved}h</Text>
              <Text style={styles.aiMetricLabel}>Time Saved</Text>
              <Text style={styles.aiMetricTrend}>⏱️ Automation</Text>
            </View>
          </View>
        </View>

        {/* Candidate Pipeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Candidate Pipeline</Text>
          <View style={styles.pipelineContainer}>
            <View style={styles.pipelineStage}>
              <View style={[styles.pipelineDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.pipelineNumber}>{candidatePipeline.applied}</Text>
              <Text style={styles.pipelineLabel}>Applied</Text>
            </View>
            <View style={styles.pipelineArrow}>→</View>
            <View style={styles.pipelineStage}>
              <View style={[styles.pipelineDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.pipelineNumber}>{candidatePipeline.screening}</Text>
              <Text style={styles.pipelineLabel}>Screening</Text>
            </View>
            <View style={styles.pipelineArrow}>→</View>
            <View style={styles.pipelineStage}>
              <View style={[styles.pipelineDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.pipelineNumber}>{candidatePipeline.interview}</Text>
              <Text style={styles.pipelineLabel}>Interview</Text>
            </View>
            <View style={styles.pipelineArrow}>→</View>
            <View style={styles.pipelineStage}>
              <View style={[styles.pipelineDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.pipelineNumber}>{candidatePipeline.offer}</Text>
              <Text style={styles.pipelineLabel}>Offer</Text>
            </View>
            <View style={styles.pipelineArrow}>→</View>
            <View style={styles.pipelineStage}>
              <View style={[styles.pipelineDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.pipelineNumber}>{candidatePipeline.hired}</Text>
              <Text style={styles.pipelineLabel}>Hired</Text>
            </View>
          </View>
        </View>

        {/* AI Recommendations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧠 AI Recommendations</Text>
          <View style={styles.recommendationList}>
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationIcon}>💡</View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Optimize Job Descriptions</Text>
                <Text style={styles.recommendationText}>
                  AI suggests adding more inclusive language to attract diverse candidates
                </Text>
              </View>
            </View>
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationIcon}>🎯</View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>High-Potential Candidates</Text>
                <Text style={styles.recommendationText}>
                  3 candidates show exceptional skill alignment with your active roles
                </Text>
              </View>
            </View>
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationIcon}>⚡</View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Screening Efficiency</Text>
                <Text style={styles.recommendationText}>
                  Automate initial screening to save 2+ hours daily
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Skill Trends Analysis */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📈 Skill Trends Analysis</Text>
          <View style={styles.skillTrendsContainer}>
            <View style={styles.skillTrendItem}>
              <Text style={styles.skillName}>React Native</Text>
              <View style={styles.skillBar}>
                <View style={[styles.skillProgress, { width: '0%' }]} />
              </View>
              <Text style={styles.skillPercentage}>0%</Text>
            </View>
            <View style={styles.skillTrendItem}>
              <Text style={styles.skillName}>Machine Learning</Text>
              <View style={styles.skillBar}>
                <View style={[styles.skillProgress, { width: '0%' }]} />
              </View>
              <Text style={styles.skillPercentage}>0%</Text>
            </View>
            <View style={styles.skillTrendItem}>
              <Text style={styles.skillName}>Data Analysis</Text>
              <View style={styles.skillBar}>
                <View style={[styles.skillProgress, { width: '0%' }]} />
              </View>
              <Text style={styles.skillPercentage}>0%</Text>
            </View>
            <View style={styles.skillTrendItem}>
              <Text style={styles.skillName}>Cloud Computing</Text>
              <View style={styles.skillBar}>
                <View style={[styles.skillProgress, { width: '0%' }]} />
              </View>
              <Text style={styles.skillPercentage}>0%</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚀 Quick Actions</Text>
          <View style={styles.actionList}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>➕ Create Job</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleFileUpload}>
              <Text style={styles.actionText}>📄 Upload Resumes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>🤖 AI Screening</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>📊 Generate Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>🎯 Find Candidates</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>⚙️ AI Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* File Upload Preview Section */}
        {uploadedFiles.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📋 Uploaded Resumes</Text>
            <View style={styles.fileList}>
              {uploadedFiles.map(renderFilePreview)}
            </View>
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={() => setUploadedFiles([])}
            >
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>💡 Tips</Text>
          <View style={styles.tipList}>
            <Text style={styles.tip}>• Start by creating your first job posting</Text>
            <Text style={styles.tip}>• Upload candidate resumes for AI screening</Text>
            <Text style={styles.tip}>• Monitor AI recommendations and insights</Text>
            <Text style={styles.tip}>• Review candidate match scores and analytics</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  textAlign: 'center',
  },
  actionList: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tipList: {
    gap: 8,
  },
  tip: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  // File Upload Styles
  fileList: {
    gap: 12,
  },
  filePreview: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 4,
  },
  clickableFilePreview: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  removeButton: {
    backgroundColor: '#EF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearAllButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  clearAllText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // AI Performance Styles
  aiMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  aiMetricCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  aiMetricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  aiMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  aiMetricTrend: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
  },
  // Pipeline Styles
  pipelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  pipelineStage: {
    alignItems: 'center',
    flex: 1,
  },
  pipelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  pipelineNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  pipelineLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  pipelineArrow: {
    fontSize: 16,
    color: '#9CA3AF',
    marginHorizontal: 8,
  },
  // Recommendation Styles
  recommendationList: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recommendationIcon: {
    fontSize: 20,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  // Skill Trends Styles
  skillTrendsContainer: {
    gap: 12,
  },
  skillTrendItem: {
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
  skillBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillProgress: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  skillPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    width: 40,
    textAlign: 'right',
  },
});
