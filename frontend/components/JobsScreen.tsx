import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { api } from '../services/api';

export default function JobsScreen({ userData }: { userData: any }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
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

      <View style={styles.jobActions}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => handleViewDetails(job)}
        >
          <Text style={styles.primaryButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => handleEditJob(job)}
        >
          <Text style={styles.secondaryButtonText}>Edit Job</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.aiButton}
          onPress={() => {/* AI Optimize - keep as placeholder */}}
        >
          <Text style={styles.aiButtonText}>🤖 AI Optimize</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.secondaryButton, { backgroundColor: '#EF4444' }]}
          onPress={() => handleDeleteJob(job.id.toString())}
        >
          <Text style={styles.secondaryButtonText}>Delete</Text>
        </TouchableOpacity>
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
  jobActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
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
  aiButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
});
