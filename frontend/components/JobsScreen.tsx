import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  Modal, 
  TextInput,
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as DocumentPicker from 'expo-document-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import { api } from '../services/api';

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isDesktop = width >= 1024;
const isMobile = width < 768;

export default function JobsScreen({ userData }: { userData: any }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showApplicationStages, setShowApplicationStages] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [selectedJobForApply, setSelectedJobForApply] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [aiFilters, setAiFilters] = useState({
    skillMatch: 0,
    experience: 'all',
    location: 'all',
    remote: false,
    salary: 'all',
  });

  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'Full-time',
    remote: 'On-site',
    salary: '',
    description: '',
    requirements: [],
    skills: [],
  });

  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    coverLetter: '',
    resume: '',
  });

  const [applicationStages, setApplicationStages] = useState({
    resumeUploaded: false,
    testCompleted: false,
    interviewCompleted: false,
  });

  const [resumeFile, setResumeFile] = useState<any>(null);
  const [testAnswers, setTestAnswers] = useState<any>({});
  const [interviewResponses, setInterviewResponses] = useState<{question: string, answer: string}[]>([]);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const cameraRef = useRef<any>(null);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.jobs.getAll();
      if (response.success) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      Alert.alert('Error', 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    try {
      if (!newJob.title || !newJob.department || !newJob.location || !newJob.salary || !newJob.description) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const response = await api.jobs.create(newJob);
      if (response.success) {
        Alert.alert('Success', 'Job created successfully');
        setShowCreateModal(false);
        
        // Add the new job to the local state immediately
        const createdJob = {
          ...response.data,
          // Ensure all required fields are present for display
          views: 0,
          applications: 0,
          shortlisted: 0,
          interviewed: 0,
          timeToFill: 0,
          aiMatchScore: 85,
          diversityScore: 75,
          biasRisk: 'low',
          confidence: 85,
          aiInsights: {
            recommendedSkills: newJob.skills.filter((skill: string) => skill.trim() !== ''),
            marketDemand: 'High',
            salaryCompetitiveness: 'Competitive',
            diversityPotential: 'Medium',
          },
        };
        
        setJobs(prevJobs => {
          const updatedJobs = [createdJob, ...prevJobs];
          // If a filter is active, filter the updated list
          if (selectedFilter !== 'all') {
            const filteredJobs = updatedJobs.filter(job => job.status === selectedFilter);
            return filteredJobs;
          }
          return updatedJobs;
        });
        
        setNewJob({
          title: '',
          department: '',
          location: '',
          employmentType: 'Full-time',
          remote: 'On-site',
          salary: '',
          description: '',
          requirements: [],
          skills: [],
        });
      } else {
        Alert.alert('Error', response.message || 'Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      Alert.alert('Error', 'Failed to create job');
    }
  };

  const handleUpdateJob = async () => {
    try {
      if (!selectedJob) return;

      const response = await api.jobs.update(selectedJob.id, selectedJob);
      if (response.success) {
        Alert.alert('Success', 'Job updated successfully');
        setShowEditModal(false);
        
        // Update job in local state immediately
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === selectedJob.id ? { ...response.data } : job
          )
        );
        
        setSelectedJob(null);
      } else {
        Alert.alert('Error', response.message || 'Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      Alert.alert('Error', 'Failed to update job');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await api.jobs.delete(jobId);
              if (response.success) {
                Alert.alert('Success', 'Job deleted successfully');
                // Remove job from local state immediately
                setJobs(prevJobs => prevJobs.filter(job => job.id !== parseInt(jobId)));
              } else {
                Alert.alert('Error', response.message || 'Failed to delete job');
              }
            } catch (error) {
              console.error('Error deleting job:', error);
              Alert.alert('Error', 'Failed to delete job');
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = async (job: any) => {
    try {
      const response = await api.jobs.getById(job.id);
      if (response.success) {
        setSelectedJob(response.data);
        setShowDetailsModal(true);
        // Increment views locally for immediate feedback
        setJobs(prevJobs => 
          prevJobs.map(j => 
            j.id === job.id ? { ...j, views: j.views + 1 } : j
          )
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch job details');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      Alert.alert('Error', 'Failed to fetch job details');
    }
  };

  const handleApplyNow = (job: any) => {
    setSelectedJobForApply(job);
    setShowApplyModal(true);
    // Reset form
    setApplicationForm({
      name: '',
      email: '',
      phone: '',
      experience: '',
      education: '',
      coverLetter: '',
      resume: '',
    });
    // Reset stages
    setApplicationStages({
      resumeUploaded: false,
      testCompleted: false,
      interviewCompleted: false,
    });
    setCurrentStage(1);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      Alert.alert('Error', 'Please select a file first');
      return;
    }

    try {
      console.log('Uploading resume:', resumeFile);
      
      // Handle file differently for web vs mobile
      let formData;
      
      if (Platform.OS === 'web') {
        // For web, use the blob directly
        const response = await fetch(resumeFile.uri);
        const blob = await response.blob();
        formData = new FormData();
        formData.append('resume', blob, resumeFile.name);
        console.log('Blob size:', blob.size, 'Type:', blob.type);
      } else {
        // For mobile, use the file object
        formData = new FormData();
        formData.append('resume', {
          uri: resumeFile.uri,
          type: resumeFile.type,
          name: resumeFile.name,
        } as any);
      }
      
      console.log('FormData created:', formData);
      
      // Upload file to backend
      const uploadResponse = await api.upload.resume(formData);
      
      if (uploadResponse.success) {
        // Update application stage with resume URL
        const updateResponse = await api.applications.updateStage(
          selectedJobForApply?.applicationId, 
          'resume_uploaded', 
          { resumeUrl: uploadResponse.data.url }
        );
        
        if (updateResponse.success) {
          setApplicationStages(prev => ({ ...prev, resumeUploaded: true }));
          Alert.alert('Success', 'Resume uploaded successfully!');
        }
      } else {
        Alert.alert('Error', uploadResponse.message || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      Alert.alert('Error', 'Failed to upload resume');
    }
  };

  const handleTestSubmit = async () => {
    try {
      console.log('Submitting test answers:', testAnswers);
      
      // Submit test answers to backend
      const response = await api.applications.submitTest(
        selectedJobForApply?.applicationId, 
        { testData: testAnswers }
      );
      
      if (response.success) {
        setApplicationStages(prev => ({ ...prev, testCompleted: true }));
        Alert.alert('Success', 'Test submitted successfully!');
      } else {
        Alert.alert('Error', response.message || 'Failed to submit test');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      Alert.alert('Error', 'Failed to submit test');
    }
  };

  const handleInterviewComplete = async () => {
    try {
      console.log('Submitting interview responses:', interviewResponses);
      
      // Submit interview responses to backend
      const response = await api.applications.submitInterview(
        selectedJobForApply?.applicationId, 
        { interviewData: interviewResponses }
      );
      
      if (response.success) {
        setApplicationStages(prev => ({ ...prev, interviewCompleted: true }));
        Alert.alert('Success', 'Interview completed successfully!');
        
        // Close modal after completion
        setTimeout(() => {
          setShowApplicationStages(false);
          Alert.alert('Application Complete', 'Your application has been fully submitted. You will be contacted soon!');
        }, 2000);
      } else {
        Alert.alert('Error', response.message || 'Failed to submit interview');
      }
    } catch (error) {
      console.error('Error submitting interview:', error);
      Alert.alert('Error', 'Failed to submit interview');
    }
  };

  const nextStage = () => {
    if (currentStage < 3) {
      setCurrentStage(currentStage + 1);
    }
  };

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const isStageComplete = () => {
    switch (currentStage) {
      case 1:
        return applicationStages.resumeUploaded;
      case 2:
        return applicationStages.testCompleted;
      case 3:
        return applicationStages.interviewCompleted;
      default:
        return false;
    }
  };

  // Camera and Audio functions
  const requestCameraAccess = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera permission is required for video interview');
        return false;
      }
    }
    setShowCamera(true);
    return true;
  };

  const startAudioRecording = async () => {
    try {
      console.log('Starting audio recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setAudioRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start audio recording');
    }
  };

  const stopAudioRecording = async () => {
    if (!audioRecording) return;
    
    try {
      console.log('Stopping audio recording...');
      await audioRecording.stopAndUnloadAsync();
      const uri = audioRecording.getURI();
      setAudioUri(uri);
      setIsRecording(false);
      setAudioRecording(null);
      console.log('Recording stopped, URI:', uri);
      
      // Store the audio response
      const currentResponse = interviewResponses[currentQuestionIndex] || { question: '', answer: '' };
      setInterviewResponses(prev => {
        const updated = [...prev];
        updated[currentQuestionIndex] = {
          ...currentResponse,
          answer: uri || '' // Store audio URI as answer
        };
        return updated;
      });
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to stop audio recording');
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false
      });
      console.log('Photo taken:', photo.uri);
      
      // Store the photo as part of interview response
      const currentResponse = interviewResponses[currentQuestionIndex] || { question: '', answer: '' };
      setInterviewResponses(prev => {
        const updated = [...prev];
        updated[currentQuestionIndex] = {
          ...currentResponse,
          answer: photo.uri || '' // Store photo URI as answer
        };
        return updated;
      });
      
      setShowCamera(false);
    } catch (error) {
      console.error('Failed to take picture', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  // File picker handler
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('Selected file:', file);
        
        // Create file object for upload
        const fileObj = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
          size: file.size || 0,
        };
        
        setResumeFile(fileObj);
        Alert.alert('Success', `File "${file.name}" selected successfully!`);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleSubmitApplication = async () => {
    if (!applicationForm.name || !applicationForm.email || !applicationForm.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // Submit initial application to backend
      const applicationData = {
        jobId: parseInt(selectedJobForApply?.id), // Convert to integer for SQLite
        applicantInfo: applicationForm,
        status: 'pending_stages',
        createdAt: new Date().toISOString(),
      };

      console.log('Submitting application:', applicationData);
      
      // Submit to API
      const response = await api.applications.create(applicationData);
      
      if (response.success) {
        Alert.alert('Success', 'Application submitted! Please complete the next steps.');
        setShowApplyModal(false);
        
        // Show application stages modal
        setCurrentStage(1);
        setShowApplicationStages(true);
        setSelectedJobForApply({ 
          ...selectedJobForApply, 
          applicationId: response.data.id // SQLite returns numeric id
        });
        
        // Reset form
        setApplicationForm({
          name: '',
          email: '',
          phone: '',
          experience: '',
          education: '',
          coverLetter: '',
          resume: '',
        });
        
        // Increment applications count locally for immediate feedback
        if (selectedJobForApply) {
          setJobs(prevJobs => 
            prevJobs.map(j => 
              j.id === selectedJobForApply.id ? { ...j, applications: j.applications + 1 } : j
            )
          );
        }
      } else {
        Alert.alert('Error', response.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application');
    }
  };

  const handleEditJob = (job: any) => {
    setSelectedJob(job);
    setShowEditModal(true);
  };

  const handleFilterJobs = async (status: string) => {
    try {
      setLoading(true);
      if (status === 'all') {
        await fetchJobs();
      } else {
        const response = await api.jobs.getByStatus(status);
        if (response.success) {
          setJobs(response.data);
          setSelectedFilter(status);
        }
      }
    } catch (error) {
      console.error('Error filtering jobs:', error);
      Alert.alert('Error', 'Failed to filter jobs');
    } finally {
      setLoading(false);
    }
  };

  const addRequirement = () => {
    setNewJob((prev: any) => ({
      ...prev,
      requirements: [...(prev.requirements || []), '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setNewJob((prev: any) => ({
      ...prev,
      requirements: prev.requirements.map((req: string, i: number) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index: number) => {
    setNewJob((prev: any) => ({
      ...prev,
      requirements: prev.requirements.filter((_: string, i: number) => i !== index)
    }));
  };

  const addSkill = () => {
    setNewJob((prev: any) => ({
      ...prev,
      skills: [...(prev.skills || []), '']
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setNewJob((prev: any) => ({
      ...prev,
      skills: prev.skills.map((skill: string, i: number) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index: number) => {
    setNewJob((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((_: string, i: number) => i !== index)
    }));
  };

  const renderJobCard = (job: any) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.jobMeta}>
            <Text style={styles.jobLocation}>📍 {job.department}</Text>
            <Text style={styles.jobType}>💼 {job.employmentType}</Text>
            <Text style={styles.jobRemote}>🏠 {job.remote}</Text>
          </View>
          <Text style={styles.jobSalary}>💰 {job.salary}</Text>
        </View>
        <View style={styles.jobStatusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
            <Text style={styles.statusText}>{job.status.toUpperCase()}</Text>
          </View>
          <View style={[styles.aiStatusBadge, { backgroundColor: getAIStatusColor(job.aiStatus) }]}>
            <Text style={styles.aiStatusText}>🤖 {job.aiStatus.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* AI Insights Section */}
      <View style={styles.aiInsightsContainer}>
        <Text style={styles.aiInsightsTitle}>🧠 AI Insights</Text>
        <View style={styles.aiMetricsRow}>
          <View style={styles.aiMetric}>
            <Text style={styles.aiMetricValue}>{job.aiMatchScore}%</Text>
            <Text style={styles.aiMetricLabel}>Match Score</Text>
          </View>
          <View style={styles.aiMetric}>
            <Text style={styles.aiMetricValue}>{job.diversityScore}%</Text>
            <Text style={styles.aiMetricLabel}>Diversity</Text>
          </View>
          <View style={styles.aiMetric}>
            <Text style={styles.aiMetricValue}>{job.views}</Text>
            <Text style={styles.aiMetricLabel}>Views</Text>
          </View>
          <View style={styles.aiMetric}>
            <Text style={styles.aiMetricValue}>{job.applications}</Text>
            <Text style={styles.aiMetricLabel}>Applications</Text>
          </View>
        </View>
      </View>

      {/* Skills Section */}
      <View style={styles.skillsContainer}>
        <Text style={styles.skillsTitle}>🎯 Required Skills</Text>
        <View style={styles.skillsList}>
          {job.skills.map((skill: string, index: number) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* AI Recommendations */}
      <View style={styles.aiRecommendationsContainer}>
        <Text style={styles.aiRecommendationsTitle}>💡 AI Recommendations</Text>
        <View style={styles.recommendationList}>
          <Text style={styles.recommendationItem}>
            • Market Demand: {job.aiInsights.marketDemand}
          </Text>
          <Text style={styles.recommendationItem}>
            • Salary: {job.aiInsights.salaryCompetitiveness}
          </Text>
          <Text style={styles.recommendationItem}>
            • Diversity Potential: {job.aiInsights.diversityPotential}
          </Text>
        </View>
      </View>

      {/* Pipeline Stats */}
      <View style={styles.pipelineStatsContainer}>
        <View style={styles.pipelineStat}>
          <Text style={styles.pipelineNumber}>{job.shortlisted}</Text>
          <Text style={styles.pipelineLabel}>Shortlisted</Text>
        </View>
        <View style={styles.pipelineStat}>
          <Text style={styles.pipelineNumber}>{job.interviewed}</Text>
          <Text style={styles.pipelineLabel}>Interviewed</Text>
        </View>
        <View style={styles.pipelineStat}>
          <Text style={styles.pipelineNumber}>{job.timeToFill}d</Text>
          <Text style={styles.pipelineLabel}>Time to Fill</Text>
        </View>
      </View>

      {/* Job Actions - Fixed Version */}
      <View style={styles.jobActionsContainer}>
        {isMobile ? (
          // Mobile layout - 2 rows with evenly spaced buttons
          <>
            <View style={styles.mobileActionsRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => handleViewDetails(job)}
              >
                <Text style={styles.actionButtonText} numberOfLines={1}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.applyButton]}
                onPress={() => handleApplyNow(job)}
              >
                <Text style={styles.actionButtonText} numberOfLines={1}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEditJob(job)}
              >
                <Text style={styles.editButtonText} numberOfLines={1}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mobileActionsRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.aiButton]}
                onPress={() => {/* AI Optimize */}}
              >
                <Text style={styles.aiButtonText} numberOfLines={1}>🤖 AI</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteJob(job.id.toString())}
              >
                <Text style={styles.deleteButtonText} numberOfLines={1}>Delete</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Desktop/Tablet layout - single row with full text
          <View style={styles.desktopActionsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleViewDetails(job)}
            >
              <Text style={styles.actionButtonText} numberOfLines={1}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.applyButton]}
              onPress={() => handleApplyNow(job)}
            >
              <Text style={styles.actionButtonText} numberOfLines={1}>Apply Now</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleEditJob(job)}
            >
              <Text style={styles.editButtonText} numberOfLines={1}>Edit Job</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.aiButton]}
              onPress={() => {/* AI Optimize */}}
            >
              <Text style={styles.aiButtonText} numberOfLines={1}>🤖 AI Optimize</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteJob(job.id.toString())}
            >
              <Text style={styles.deleteButtonText} numberOfLines={1}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#10B981';
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

  return (
    <View style={styles.content}>
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>💼 Jobs Management</Text>
        <View style={styles.filterContainer}>
          {['all', 'open', 'screening', 'interview'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => handleFilterJobs(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={jobs}
        renderItem={({ item }) => renderJobCard(item)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.jobsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading jobs...' : 'No jobs found. Create your first job!'}
            </Text>
          </View>
        )}
        numColumns={isDesktop ? 2 : 1}
        columnWrapperStyle={isDesktop ? styles.row : undefined}
      />

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Create Job Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Job</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Job Title *</Text>
              <TextInput
                style={styles.input}
                value={newJob.title}
                onChangeText={(text) => setNewJob(prev => ({ ...prev, title: text }))}
                placeholder="e.g. Senior Frontend Developer"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Department *</Text>
              <TextInput
                style={styles.input}
                value={newJob.department}
                onChangeText={(text) => setNewJob(prev => ({ ...prev, department: text }))}
                placeholder="e.g. Engineering"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                value={newJob.location}
                onChangeText={(text) => setNewJob(prev => ({ ...prev, location: text }))}
                placeholder="e.g. San Francisco, CA"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Employment Type</Text>
                <TextInput
                  style={styles.input}
                  value={newJob.employmentType}
                  onChangeText={(text) => setNewJob(prev => ({ ...prev, employmentType: text }))}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Remote Type</Text>
                <TextInput
                  style={styles.input}
                  value={newJob.remote}
                  onChangeText={(text) => setNewJob(prev => ({ ...prev, remote: text }))}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Salary *</Text>
              <TextInput
                style={styles.input}
                value={newJob.salary}
                onChangeText={(text) => setNewJob(prev => ({ ...prev, salary: text }))}
                placeholder="e.g. $80k-$120k"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newJob.description}
                onChangeText={(text) => setNewJob(prev => ({ ...prev, description: text }))}
                placeholder="Describe the role and responsibilities..."
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Requirements</Text>
              {newJob.requirements.length === 0 ? (
                <TouchableOpacity style={styles.addButton} onPress={addRequirement}>
                  <Text style={styles.addButtonText}>+ Add Requirement</Text>
                </TouchableOpacity>
              ) : (
                newJob.requirements.map((requirement: string, index: number) => (
                  <View key={index} style={styles.requirementRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={requirement}
                      onChangeText={(text) => updateRequirement(index, text)}
                      placeholder={`Requirement ${index + 1}`}
                    />
                    {newJob.requirements.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeRequirement(index)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
              {newJob.requirements.length > 0 && (
                <TouchableOpacity style={styles.addButton} onPress={addRequirement}>
                  <Text style={styles.addButtonText}>+ Add Requirement</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Skills</Text>
              {newJob.skills.length === 0 ? (
                <TouchableOpacity style={styles.addButton} onPress={addSkill}>
                  <Text style={styles.addButtonText}>+ Add Skill</Text>
                </TouchableOpacity>
              ) : (
                newJob.skills.map((skill: string, index: number) => (
                  <View key={index} style={styles.requirementRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={skill}
                      onChangeText={(text) => updateSkill(index, text)}
                      placeholder={`Skill ${index + 1}`}
                    />
                    {newJob.skills.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeSkill(index)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
              {newJob.skills.length > 0 && (
                <TouchableOpacity style={styles.addButton} onPress={addSkill}>
                  <Text style={styles.addButtonText}>+ Add Skill</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={handleCreateJob}
            >
              <Text style={styles.createButtonText}>Create Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Job Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Job</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Job Title</Text>
              <TextInput
                style={styles.input}
                value={selectedJob?.title || ''}
                onChangeText={(text) => setSelectedJob((prev: any) => prev ? { ...prev, title: text } : null)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <TextInput
                style={styles.input}
                value={selectedJob?.status || ''}
                onChangeText={(text) => setSelectedJob((prev: any) => prev ? { ...prev, status: text } : null)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={selectedJob?.description || ''}
                onChangeText={(text) => setSelectedJob((prev: any) => prev ? { ...prev, description: text } : null)}
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={handleUpdateJob}
            >
              <Text style={styles.createButtonText}>Update Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Job Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Job Details</Text>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {selectedJob && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Title</Text>
                  <Text style={styles.detailText}>{selectedJob.title}</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Department</Text>
                  <Text style={styles.detailText}>{selectedJob.department}</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Location</Text>
                  <Text style={styles.detailText}>{selectedJob.location}</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Salary</Text>
                  <Text style={styles.detailText}>{selectedJob.salary}</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <Text style={styles.detailText}>{selectedJob.description}</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Status</Text>
                  <Text style={styles.detailText}>{selectedJob.status}</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Applications</Text>
                  <Text style={styles.detailText}>{selectedJob.applications}</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Views</Text>
                  <Text style={styles.detailText}>{selectedJob.views}</Text>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowDetailsModal(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Apply for Job Modal */}
      <Modal
        visible={showApplyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Apply for {selectedJobForApply?.title}</Text>
            <TouchableOpacity onPress={() => setShowApplyModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={applicationForm.name}
                onChangeText={(text) => setApplicationForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={applicationForm.email}
                onChangeText={(text) => setApplicationForm(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email address"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={applicationForm.phone}
                onChangeText={(text) => setApplicationForm(prev => ({ ...prev, phone: text }))}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Years of Experience</Text>
              <TextInput
                style={styles.input}
                value={applicationForm.experience}
                onChangeText={(text) => setApplicationForm(prev => ({ ...prev, experience: text }))}
                placeholder="e.g. 3 years"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Education</Text>
              <TextInput
                style={styles.input}
                value={applicationForm.education}
                onChangeText={(text) => setApplicationForm(prev => ({ ...prev, education: text }))}
                placeholder="e.g. Bachelor's in Computer Science"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Cover Letter</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={applicationForm.coverLetter}
                onChangeText={(text) => setApplicationForm(prev => ({ ...prev, coverLetter: text }))}
                placeholder="Tell us why you're interested in this position..."
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Resume/CV Link</Text>
              <TextInput
                style={styles.input}
                value={applicationForm.resume}
                onChangeText={(text) => setApplicationForm(prev => ({ ...prev, resume: text }))}
                placeholder="Link to your resume or portfolio"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowApplyModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={handleSubmitApplication}
            >
              <Text style={styles.createButtonText}>Submit Application</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Application Stages Modal */}
      <Modal
        visible={showApplicationStages}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Application Process</Text>
            <TouchableOpacity onPress={() => setShowApplicationStages(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressStep, currentStage >= 1 && styles.progressStepActive]}>
                <Text style={[styles.progressStepText, currentStage >= 1 && styles.progressStepTextActive]}>
                  1
                </Text>
              </View>
              <View style={[styles.progressLine, currentStage >= 2 && styles.progressLineActive]} />
              <View style={[styles.progressStep, currentStage >= 2 && styles.progressStepActive]}>
                <Text style={[styles.progressStepText, currentStage >= 2 && styles.progressStepTextActive]}>
                  2
                </Text>
              </View>
              <View style={[styles.progressLine, currentStage >= 3 && styles.progressLineActive]} />
              <View style={[styles.progressStep, currentStage >= 3 && styles.progressStepActive]}>
                <Text style={[styles.progressStepText, currentStage >= 3 && styles.progressStepTextActive]}>
                  3
                </Text>
              </View>
            </View>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, currentStage >= 1 && styles.progressLabelActive]}>
                Resume Upload
              </Text>
              <Text style={[styles.progressLabel, currentStage >= 2 && styles.progressLabelActive]}>
                Test
              </Text>
              <Text style={[styles.progressLabel, currentStage >= 3 && styles.progressLabelActive]}>
                AI Interview
              </Text>
            </View>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Stage 1: Resume Upload */}
            {currentStage === 1 && (
              <View style={styles.stageContainer}>
                <Text style={styles.stageTitle}>📄 Upload Your Resume/CV</Text>
                <Text style={styles.stageDescription}>
                  Please upload your resume or CV to continue with the application process. 
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </Text>
                
                <View style={styles.uploadArea}>
                  <TouchableOpacity 
                    style={styles.uploadButton}
                    onPress={handlePickDocument}
                  >
                    <Text style={styles.uploadButtonText}>📁 Choose File</Text>
                  </TouchableOpacity>
                  {resumeFile && (
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName}>{resumeFile.name}</Text>
                      <Text style={styles.fileSize}>{Math.round(resumeFile.size / 1024)} KB</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity 
                  style={[styles.button, styles.createButton, applicationStages.resumeUploaded && styles.buttonDisabled]}
                  onPress={handleResumeUpload}
                  disabled={applicationStages.resumeUploaded}
                >
                  <Text style={styles.createButtonText}>
                    {applicationStages.resumeUploaded ? '✓ Resume Uploaded' : 'Upload Resume'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Stage 2: Written/Computer Test */}
            {currentStage === 2 && (
              <View style={styles.stageContainer}>
                <Text style={styles.stageTitle}>📝 Skills Assessment Test</Text>
                <Text style={styles.stageDescription}>
                  Please answer the following questions to assess your skills and qualifications 
                  for this position.
                </Text>
                
                <View style={styles.testContainer}>
                  <View style={styles.questionBlock}>
                    <Text style={styles.question}>1. What is your experience level with React Native?</Text>
                    <View style={styles.optionsContainer}>
                      {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((option: string, index: number) => (
                        <TouchableOpacity 
                          key={index}
                          style={[styles.option, testAnswers.q1 === option && styles.optionSelected]}
                          onPress={() => setTestAnswers((prev: any) => ({ ...prev, q1: option }))}
                        >
                          <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.questionBlock}>
                    <Text style={styles.question}>2. How many years of experience do you have in mobile development?</Text>
                    <TextInput
                      style={styles.testInput}
                      value={testAnswers.q2 || ''}
                      onChangeText={(text) => setTestAnswers((prev: any) => ({ ...prev, q2: text }))}
                      placeholder="Enter number of years"
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.questionBlock}>
                    <Text style={styles.question}>3. Describe a challenging project you've worked on:</Text>
                    <TextInput
                      style={[styles.testInput, styles.textArea]}
                      value={testAnswers.q3 || ''}
                      onChangeText={(text) => setTestAnswers((prev: any) => ({ ...prev, q3: text }))}
                      placeholder="Describe your project..."
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.button, styles.createButton, applicationStages.testCompleted && styles.buttonDisabled]}
                  onPress={handleTestSubmit}
                  disabled={applicationStages.testCompleted}
                >
                  <Text style={styles.createButtonText}>
                    {applicationStages.testCompleted ? '✓ Test Completed' : 'Submit Test'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Stage 3: AI Interview */}
            {currentStage === 3 && (
              <View style={styles.stageContainer}>
                <Text style={styles.stageTitle}>🤖 AI Interview</Text>
                <Text style={styles.stageDescription}>
                  Please answer the following questions. The AI will analyze your responses 
                  and provide feedback. Make sure you have camera and microphone access enabled.
                </Text>
                
                <View style={styles.interviewContainer}>
                  <View style={styles.questionBlock}>
                    <Text style={styles.question}>1. Tell us about yourself and your experience.</Text>
                    <View style={styles.recordingControls}>
                      <TouchableOpacity 
                        style={[styles.recordButton, isRecording && styles.recordButtonActive]}
                        onPress={isRecording ? stopAudioRecording : startAudioRecording}
                      >
                        <Text style={styles.recordButtonText}>
                          {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.cameraButton}
                        onPress={requestCameraAccess}
                      >
                        <Text style={styles.cameraButtonText}>📷 Take Photo</Text>
                      </TouchableOpacity>
                    </View>
                    {isRecording && (
                      <Text style={styles.recordingText}>Recording... Speak clearly</Text>
                    )}
                    {audioUri && (
                      <View style={styles.audioPreview}>
                        <Text style={styles.audioPreviewText}>📎 Audio Recorded</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.questionBlock}>
                    <Text style={styles.question}>2. Why are you interested in this position?</Text>
                    <View style={styles.recordingControls}>
                      <TouchableOpacity 
                        style={[styles.recordButton, isRecording && styles.recordButtonActive]}
                        onPress={() => setCurrentQuestionIndex(1)}
                      >
                        <Text style={styles.recordButtonText}>📝 Answer Question 2</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.questionBlock}>
                    <Text style={styles.question}>3. What makes you a good fit for this role?</Text>
                    <View style={styles.recordingControls}>
                      <TouchableOpacity 
                        style={[styles.recordButton, isRecording && styles.recordButtonActive]}
                        onPress={() => setCurrentQuestionIndex(2)}
                      >
                        <Text style={styles.recordButtonText}>📝 Answer Question 3</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.button, styles.createButton, applicationStages.interviewCompleted && styles.buttonDisabled]}
                  onPress={handleInterviewComplete}
                  disabled={applicationStages.interviewCompleted}
                >
                  <Text style={styles.createButtonText}>
                    {applicationStages.interviewCompleted ? '✓ Interview Completed' : 'Complete Interview'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={prevStage}
              disabled={currentStage === 1}
            >
              <Text style={styles.cancelButtonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={nextStage}
              disabled={currentStage === 3 || !isStageComplete()}
            >
              <Text style={styles.createButtonText}>
                {currentStage === 3 ? 'Complete' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.cameraContainer}>
          <View style={styles.cameraHeader}>
            <Text style={styles.cameraTitle}>📷 Take Photo</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cancelButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {cameraPermission?.granted ? (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="front"
            />
          ) : (
            <View style={styles.cameraPermissionContainer}>
              <Text style={styles.cameraPermissionText}>
                Camera permission is required to take photos
              </Text>
              <TouchableOpacity
                style={styles.requestPermissionButton}
                onPress={requestCameraAccess}
              >
                <Text style={styles.requestPermissionText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.cameraFooter}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={!cameraPermission?.granted}
            >
              <Text style={styles.captureButtonText}>📸 Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  filterHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  jobsList: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
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
  // Updated Job Actions Styles
  jobActionsContainer: {
    marginTop: 12,
    gap: 8,
  },
  mobileActionsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  desktopActionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    minWidth: isDesktop ? 100 : undefined,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    borderWidth: 0,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  applyButton: {
    backgroundColor: '#10B981',
  },
  secondaryButton: {
    backgroundColor: '#82a012',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  aiButton: {
    backgroundColor: '#8B5CF6',
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3B82F6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  // Enhanced Job Card Styles
  jobMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  jobType: {
    fontSize: 12,
    color: '#6B7280',
  },
  jobRemote: {
    fontSize: 12,
    color: '#6B7280',
  },
  jobSalary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 4,
  },
  aiInsightsContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  aiInsightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  aiMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aiMetric: {
    alignItems: 'center',
    flex: 1,
  },
  aiMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  aiMetricLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  skillsContainer: {
    marginVertical: 8,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skillText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  aiRecommendationsContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  aiRecommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  recommendationList: {
    gap: 4,
  },
  recommendationItem: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 16,
  },
  pipelineStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  pipelineStat: {
    alignItems: 'center',
  },
  pipelineNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  pipelineLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  // Modal Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  addButton: {
    backgroundColor: '#10B981',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#EF4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#10B981',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detailText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Application Stages Modal Styles
  progressContainer: {
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: '#3B82F6',
  },
  progressStepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressStepTextActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 5,
  },
  progressLineActive: {
    backgroundColor: '#3B82F6',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    flex: 1,
  },
  progressLabelActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  stageContainer: {
    padding: 20,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  stageDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    marginTop: 15,
    alignItems: 'center',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  fileSize: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  testContainer: {
    marginBottom: 20,
  },
  questionBlock: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  testInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  interviewContainer: {
    marginBottom: 20,
  },
  recordingControls: {
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#DC2626',
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  recordingText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 10,
    fontStyle: 'italic',
  },
  cameraButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 10,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  audioPreview: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  audioPreviewText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  cameraHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cameraTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  closeCameraText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  cameraPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraPermissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  requestPermissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  requestPermissionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cameraFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  captureButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
  backgroundColor: '#F59E0B', // Amber/Orange color
  borderWidth: 0,
},
editButtonText: {
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: '600',
  textAlign: 'center',
},
});