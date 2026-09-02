import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { generate100SampleComplaints } from '../utils/sampleDataGenerator';

const SAMPLE_100_TICKETS = generate100SampleComplaints();

const AppContext = createContext();

const INITIAL_BUILDINGS = [
  { id: 'b1', code: 'Block A', name: 'Science & Humanities Block', floors: 4, rooms: 24, activeIssues: 4 },
  { id: 'b2', code: 'Block B', name: 'Engineering & Tech Wing', floors: 5, rooms: 35, activeIssues: 6 },
  { id: 'b3', code: 'Block C', name: 'Management & Arts Center', floors: 3, rooms: 18, activeIssues: 2 },
  { id: 'b4', code: 'Library', name: 'Central Knowledge Hub', floors: 3, rooms: 12, activeIssues: 1 },
  { id: 'b5', code: 'Science Lab', name: 'Advanced Research Facility', floors: 2, rooms: 14, activeIssues: 3 },
  { id: 'b6', code: 'Admin Block', name: 'Administrative Building', floors: 3, rooms: 15, activeIssues: 1 },
];

const INITIAL_ROOMS = [
  { id: 'r302', building: 'Block A', floor: '3rd Floor', room: 'Room 302', capacity: 60, type: 'Smart Classroom' },
  { id: 'r204', building: 'Block B', floor: '2nd Floor', room: 'Room 204', capacity: 75, type: 'Lecture Hall' },
  { id: 'r105', building: 'Block A', floor: '1st Floor', room: 'Room 105', capacity: 45, type: 'Seminar Room' },
  { id: 'r401', building: 'Block C', floor: '4th Floor', room: 'Room 401', capacity: 120, type: 'Auditorium' },
  { id: 'r303', building: 'Library', floor: '3rd Floor', room: 'Digital Hub 3', capacity: 30, type: 'Computer Lab' },
];

const INITIAL_TECHNICIANS = [
  { id: 'tech1', name: 'Arun Kumar', specialization: 'Electrical & HVAC', activeJobs: 3, completedJobs: 128, avgResolution: '42 min', phone: '+91 98765 43210', status: 'Available', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 'tech2', name: 'Priya Sharma', specialization: 'AV & Smart Displays', activeJobs: 2, completedJobs: 94, avgResolution: '35 min', phone: '+91 98765 43211', status: 'Available', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
  { id: 'tech3', name: 'Marcus Vance', specialization: 'IT & Network Systems', activeJobs: 4, completedJobs: 142, avgResolution: '28 min', phone: '+91 98765 43212', status: 'Busy', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 'tech4', name: 'David Chen', specialization: 'Furniture & General Maintenance', activeJobs: 1, completedJobs: 86, avgResolution: '50 min', phone: '+91 98765 43213', status: 'Available', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
];

const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-2026-00125',
    tokenNo: 'TKN-0125',
    building: 'Block A',
    room: 'Room 302',
    floor: '3rd Floor',
    equipment: 'AC',
    category: 'HVAC',
    problem: 'AC not cooling',
    description: 'AC unit is powered on and running continuously, but releasing ambient room temperature air without cooling.',
    priority: 'High',
    status: 'In Progress',
    reportedBy: 'Prof. Sarah Jenkins',
    department: 'Computer Science',
    reportedTime: '10:32 AM Today',
    assignedTech: 'Arun Kumar',
    evidenceUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    timeline: [
      { time: '10:32 AM', title: 'Complaint Submitted', desc: 'Reported via CampusCare AI Assistant by Prof. Sarah Jenkins' },
      { time: '10:38 AM', title: 'Reviewed & Assigned', desc: 'Manager dispatched ticket to Arun Kumar (HVAC Lead)' },
      { time: '10:47 AM', title: 'Technician Accepted', desc: 'Arun Kumar confirmed job acceptance and requested room access' },
      { time: '11:15 AM', title: 'Work In Progress', desc: 'Technician on-site inspecting compressor filter unit' },
    ],
    workNotes: 'Refrigerant pressure checked. Air filter needs cleaning and sensor reset in progress.',
  },
  {
    id: 'CMP-2026-00124',
    tokenNo: 'TKN-0124',
    building: 'Block B',
    room: 'Room 204',
    floor: '2nd Floor',
    equipment: 'Projector',
    category: 'AV Equipment',
    problem: 'No display signal',
    description: 'Projector lamp turns green but HDMI connection does not project video feed to wall screen.',
    priority: 'High',
    status: 'Assigned',
    reportedBy: 'Dr. Rajesh Patel',
    department: 'Electrical Engineering',
    reportedTime: '09:45 AM Today',
    assignedTech: 'Priya Sharma',
    evidenceUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    timeline: [
      { time: '09:45 AM', title: 'Complaint Submitted', desc: 'Reported via Quick Category Report' },
      { time: '09:50 AM', title: 'Assigned to Technician', desc: 'Dispatched to Priya Sharma (AV Specialist)' },
    ],
    workNotes: '',
  },
  {
    id: 'CMP-2026-00120',
    tokenNo: 'TKN-0120',
    building: 'Library',
    room: 'Digital Hub 3',
    floor: '3rd Floor',
    equipment: 'Network',
    category: 'IT & Wi-Fi',
    problem: 'Wi-Fi Access Point Offline',
    description: 'Campus Wi-Fi AP-04 dropping packets for all 30 student workstations.',
    priority: 'Critical',
    status: 'Submitted',
    reportedBy: 'Librarian Michael Scott',
    department: 'Library Services',
    reportedTime: '08:15 AM Today',
    assignedTech: 'Marcus Vance',
    evidenceUrl: '',
    timeline: [
      { time: '08:15 AM', title: 'Complaint Submitted', desc: 'Reported via Manual Form' },
    ],
    workNotes: '',
  },
  {
    id: 'CMP-2026-00118',
    tokenNo: 'TKN-0118',
    building: 'Block C',
    room: 'Room 401',
    floor: '4th Floor',
    equipment: 'Electrical',
    category: 'Power & Lights',
    problem: 'Flickering Overhead LED Panels',
    description: 'Two main rows of LED lights flickering violently causing eye strain.',
    priority: 'Medium',
    status: 'Resolved',
    reportedBy: 'Prof. Anita Roy',
    department: 'Humanities',
    reportedTime: 'Yesterday 04:20 PM',
    assignedTech: 'Arun Kumar',
    evidenceUrl: '',
    timeline: [
      { time: 'Yesterday 04:20 PM', title: 'Complaint Submitted', desc: 'Reported by Prof. Anita Roy' },
      { time: 'Yesterday 04:35 PM', title: 'Assigned', desc: 'Assigned to Arun Kumar' },
      { time: 'Yesterday 05:10 PM', title: 'Resolved', desc: 'Replaced faulty ballast transformer.' },
      { time: 'Yesterday 05:25 PM', title: 'Confirmed Fixed', desc: 'Prof. Anita Roy confirmed resolution with 5-star rating' }
    ],
    rating: 5,
    feedback: 'Super fast response! Technician replaced the ballast in 15 minutes before evening lecture.',
  }
];

const INITIAL_KNOWLEDGE_BASE = [
  {
    id: 'kb1',
    equipment: 'AC',
    problem: 'Not Cooling',
    possibleCauses: ['Incorrect remote mode setting', 'Filter dust blockage', 'Low refrigerant level', 'Compressor overload'],
    troubleshootingStep: 'Ensure the AC remote mode is set explicitly to COOL (snowflake icon) and temperature setting is below 24°C.',
    escalationTrigger: 'If mode is COOL and temperature is below 24°C but air remains warm after 5 minutes.',
  },
  {
    id: 'kb2',
    equipment: 'Projector',
    problem: 'No Display / Black Screen',
    possibleCauses: ['HDMI cable loose', 'Source input wrong', 'Lamp shutter closed', 'Overheating safety auto-cutoff'],
    troubleshootingStep: 'Check that the HDMI cable is plugged tightly into both wall port and laptop, and press "Source" on remote to select HDMI 1.',
    escalationTrigger: 'If cable connection and HDMI source are verified, but screen displays "No Signal" or lamp error indicator blinks.',
  },
  {
    id: 'kb3',
    equipment: 'Network',
    problem: 'Wi-Fi / Internet Disconnected',
    possibleCauses: ['AP PoE port reset', 'DNS resolution lag', 'DHCP IP pool full'],
    troubleshootingStep: 'Verify if your device is connected to "Campus-Faculty-5G" network and retry reconnecting.',
    escalationTrigger: 'If multiple devices in room cannot fetch IP address.',
  },
];

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', title: 'Technician Dispatched', message: 'Arun Kumar has accepted your AC request for Block A - Room 302.', time: '10:47 AM', read: false, complaintId: 'CMP-2026-00125' },
  { id: 'n2', title: 'Ticket Progress Update', message: 'Work is now In Progress for AC in Block A - Room 302.', time: '11:15 AM', read: false, complaintId: 'CMP-2026-00125' },
  { id: 'n3', title: 'Feedback Requested', message: 'Please rate the maintenance service for CMP-2026-00118 (Overhead LED Panels).', time: 'Yesterday', read: true, complaintId: 'CMP-2026-00118' },
];

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('faculty');
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'
  const [mobileTab, setMobileTab] = useState('home'); 
  const [desktopTab, setDesktopTab] = useState('dashboard'); 

  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [technicians, setTechnicians] = useState(INITIAL_TECHNICIANS);
  const [buildings] = useState(INITIAL_BUILDINGS);
  const [rooms] = useState(INITIAL_ROOMS);
  const [knowledgeBase, setKnowledgeBase] = useState(INITIAL_KNOWLEDGE_BASE);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeComplaintDetail, setActiveComplaintDetail] = useState(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [prefilledEquipment, setPrefilledEquipment] = useState('AC');
  const [isCampusMapEnabled, setIsCampusMapEnabled] = useState(false);
  const [isSseConnected, setIsSseConnected] = useState(false);

  // Load user session from AsyncStorage on startup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const saved = await AsyncStorage.getItem('campuscare_user');
        if (saved) {
          const user = JSON.parse(saved);
          setCurrentUser(user);
          setUserRole(user.role || 'faculty');
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.warn("Error loading user session:", err);
      }
    };
    loadSession();
  }, []);

  // Sync Server URL resolution (Auto-detects host PC IP in Expo Go on mobile)
  const getSyncServerUrl = async () => {
    try {
      const customUrl = await AsyncStorage.getItem('campuscare_server_url');
      if (customUrl && customUrl.trim()) return customUrl.trim().replace(/\/$/, '');
    } catch (e) {}

    let host = 'localhost';
    try {
      if (typeof window !== 'undefined' && window.location && window.location.hostname) {
        host = window.location.hostname;
      } else {
        const Constants = require('expo-constants').default;
        const hostUri = Constants?.expoConfig?.hostUri || Constants?.manifest?.debuggerHost || Constants?.experienceUrl || '';
        if (hostUri) {
          const extractedIp = hostUri.split(':')[0];
          if (extractedIp && extractedIp !== 'localhost' && extractedIp !== '127.0.0.1') {
            host = extractedIp;
          }
        }
      }
    } catch (e) {
      console.warn("Could not auto-detect host IP:", e);
    }
    return `http://${host}:5173`;
  };

  const broadcastSync = async (type, payload = {}) => {
    try {
      const syncUrl = await getSyncServerUrl();
      fetch(`${syncUrl}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...payload }),
      }).catch(err => console.warn("Network sync POST failed:", err));
    } catch (err) {
      console.warn("Network sync error:", err);
    }
  };

  // Real-Time EventSource (SSE) Listener & Fallback Polling Engine
  useEffect(() => {
    let eventSource = null;
    let isMounted = true;
    let reconnectTimeout = null;
    let pollingInterval = null;

    const setupSse = async () => {
      try {
        const syncUrl = await getSyncServerUrl();
        const eventsUrl = `${syncUrl}/api/events`;

        // Hydrate from db_storage.json via sync-server REST API
        fetch(`${syncUrl}/api/sync`)
          .then(res => res.json())
          .then(data => {
            if (isMounted && data && Array.isArray(data.complaints)) {
              if (data.complaints.length > 0) setComplaints(data.complaints);
              if (Array.isArray(data.notifications) && data.notifications.length > 0) {
                setNotifications(data.notifications);
              }
              setIsSseConnected(true);
            }
          })
          .catch(err => {
            console.warn("Initial REST DB sync attempt pending server start:", err.message);
          });

        if (typeof window !== 'undefined' && 'EventSource' in window) {
          if (eventSource) eventSource.close();
          eventSource = new EventSource(eventsUrl);

          eventSource.onopen = () => {
            if (isMounted) setIsSseConnected(true);
          };

          eventSource.onmessage = (e) => {
            if (!isMounted || !e.data) return;
            // Handle ping comments or heartbeats
            if (e.data.startsWith(':')) return;

            try {
              const data = JSON.parse(e.data);
              const { type, complaint, id, state } = data;

              if (type === 'INIT' && state && Array.isArray(state.complaints) && state.complaints.length > 0) {
                setComplaints(state.complaints);
              } else if (type === 'NEW_COMPLAINT' && complaint) {
                setComplaints(prev => [complaint, ...prev.filter(c => c.id !== complaint.id)]);
                const tokenLabel = complaint.tokenNo || complaint.id;
                addNotification(
                  'Real-Time Ticket Alert',
                  `New Token #${tokenLabel} reported for ${complaint.equipment} in ${complaint.building} ${complaint.room}!`,
                  complaint.id
                );
                showToast(`🔔 Real-Time Alert: Token #${tokenLabel} reported by ${complaint.reportedBy || 'User'}!`, 'info');
              } else if (type === 'UPDATE_COMPLAINT' && complaint) {
                setComplaints(prev => prev.map(c => c.id === complaint.id ? complaint : c));
              } else if (type === 'DELETE_COMPLAINT' && id) {
                setComplaints(prev => prev.filter(c => c.id !== id));
              } else if (type === 'CLEAR_ALL') {
                setComplaints([]);
                setNotifications([]);
              }
            } catch (err) {
              console.warn("Error parsing SSE JSON payload:", err);
            }
          };

          eventSource.onerror = () => {
            if (!isMounted) return;
            setIsSseConnected(false);
            if (eventSource) eventSource.close();
            // Schedule auto-reconnect attempt after 4s
            reconnectTimeout = setTimeout(() => {
              if (isMounted) setupSse();
            }, 4000);
          };
        }
      } catch (err) {
        console.warn("SSE setup error:", err);
        if (isMounted) setIsSseConnected(false);
      }
    };

    setupSse();

    // Fallback REST polling every 5 seconds if SSE connection drops or is unavailable
    pollingInterval = setInterval(async () => {
      if (!isMounted) return;
      try {
        const syncUrl = await getSyncServerUrl();
        const res = await fetch(`${syncUrl}/api/sync`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.complaints)) {
            setIsSseConnected(true);
          }
        }
      } catch (e) {
        setIsSseConnected(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, []);

  // Login handler
  const login = async (userData) => {
    const user = {
      name: userData.name || 'Prof. Sarah Jenkins',
      email: userData.email || 'sarah.jenkins@university.edu',
      role: userData.role || 'faculty',
      department: userData.department || 'Faculty Staff',
      defaultBuilding: userData.defaultBuilding || 'Block A',
      defaultRoom: userData.defaultRoom || 'Room 302',
      defaultFloor: userData.defaultFloor || '3rd Floor',
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentUser(user);
    setUserRole(user.role);
    setIsLoggedIn(true);
    await AsyncStorage.setItem('campuscare_user', JSON.stringify(user));

    if (user.role === 'admin') {
      setViewMode('desktop');
    } else {
      setViewMode('mobile');
      setMobileTab('home');
    }
    showToast(`Welcome back, ${user.name}! Logged into ${user.defaultBuilding} · ${user.defaultRoom}.`, 'success');
  };

  // Update Active Classroom Location handler
  const updateUserLocation = async (newLocation) => {
    if (!newLocation || !newLocation.trim()) return;
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        defaultRoom: newLocation.trim(),
      };
      AsyncStorage.setItem('campuscare_user', JSON.stringify(updated));
      return updated;
    });
    showToast(`Active classroom location updated to "${newLocation.trim()}"!`, 'success');
  };

  // Google Login handler
  const loginWithGoogle = async (googleEmail = '', googleName = '') => {
    const user = {
      name: googleName || 'Faculty User',
      email: googleEmail || 'faculty.user@gmail.com',
      photoURL: '',
      role: 'faculty',
      department: 'Faculty Staff',
      defaultBuilding: 'Block A',
      defaultRoom: 'Room 302',
      defaultFloor: '3rd Floor',
      isGoogleUser: true,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentUser(user);
    setUserRole(user.role);
    setIsLoggedIn(true);
    await AsyncStorage.setItem('campuscare_user', JSON.stringify(user));
    setViewMode('mobile');
    setMobileTab('home');
    showToast(`Signed in with Google Gmail (${user.email})!`, 'success');
    return user;
  };

  // Logout handler
  const logout = async () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('campuscare_user');
    showToast('Successfully signed out of CampusCare AI.', 'info');
  };

  // Toast notification
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const addNotification = (title, message, complaintId = '') => {
    const id = `n_${Date.now()}`;
    const newNotif = {
      id,
      title,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      complaintId,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Create Complaint
  const createComplaint = async (newComplaintData) => {
    const nextNum = complaints.length + 126;
    const newId = `CMP-2026-00${nextNum}`;
    const newTokenNo = newComplaintData.tokenNo || `TKN-${String(nextNum).padStart(4, '0')}`;
    
    const newComplaint = {
      id: newId,
      tokenNo: newTokenNo,
      building: newComplaintData.building || currentUser?.defaultBuilding || 'Block A',
      room: newComplaintData.room || currentUser?.defaultRoom || 'Room 302',
      floor: newComplaintData.floor || currentUser?.defaultFloor || '3rd Floor',
      equipment: newComplaintData.equipment || 'General Facility',
      category: newComplaintData.category || 'Maintenance',
      problem: newComplaintData.problem || 'Equipment Issue',
      description: newComplaintData.description || 'Reported via CampusCare AI Assistant.',
      priority: newComplaintData.priority || 'High',
      status: 'Submitted',
      reportedBy: newComplaintData.reportedBy || currentUser?.name || 'Prof. Sarah Jenkins',
      department: currentUser?.department || 'Faculty Staff',
      reportedTime: 'Just now',
      assignedTech: '',
      evidenceUrl: newComplaintData.evidenceUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      timeline: [
        { time: 'Just now', title: 'Complaint Submitted', desc: `Submitted by ${newComplaintData.reportedBy || currentUser?.name || 'Prof. Sarah Jenkins'} (Token #${newTokenNo})` },
      ],
      workNotes: '',
    };

    setComplaints(prev => [newComplaint, ...prev.filter(c => c.id !== newId)]);
    broadcastSync('NEW_COMPLAINT', { complaint: newComplaint });

    addNotification('Complaint Submitted', `Token #${newTokenNo} (${newId}) created for ${newComplaint.equipment} in ${newComplaint.building} - ${newComplaint.room}.`, newId);
    showToast(`Token #${newTokenNo} generated! Ticket created for ${newComplaint.building} ${newComplaint.room}.`, 'success');
    return newComplaint;
  };

  // Delete Complaint
  const deleteComplaint = (complaintId) => {
    setComplaints(prev => prev.filter(c => c.id !== complaintId));
    broadcastSync('DELETE_COMPLAINT', { id: complaintId });
    if (activeComplaintDetail && activeComplaintDetail.id === complaintId) {
      setActiveComplaintDetail(null);
    }
    showToast(`Ticket ${complaintId} has been deleted.`, 'info');
  };

  // Clear All History
  const clearAllHistory = () => {
    setComplaints([]);
    setNotifications([]);
    setActiveComplaintDetail(null);
    broadcastSync('CLEAR_ALL');
    showToast('Database and all complaint history cleared successfully!', 'info');
  };

  // Assign Technician
  const assignTechnician = (complaintId, techName) => {
    const originalTicket = complaints.find(c => c.id === complaintId);
    const updatedTimeline = originalTicket ? [
      ...originalTicket.timeline,
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), title: 'Assigned to Technician', desc: `Assigned to ${techName}` }
    ] : [{ time: 'Just now', title: 'Assigned to Technician', desc: `Assigned to ${techName}` }];

    const updatedTicket = {
      ...(originalTicket || {}),
      id: complaintId,
      assignedTech: techName,
      status: (originalTicket && originalTicket.status === 'Submitted') ? 'Assigned' : (originalTicket?.status || 'Assigned'),
      timeline: updatedTimeline,
    };

    setComplaints(prev => prev.map(c => c.id === complaintId ? updatedTicket : c));
    broadcastSync('UPDATE_COMPLAINT', { complaint: updatedTicket });

    addNotification('Technician Assigned', `Technician ${techName} has been assigned to ticket ${complaintId}.`, complaintId);
    showToast(`Ticket ${complaintId} assigned to ${techName}.`, 'success');
  };

  // Add Technician
  const addTechnician = (techData) => {
    const newId = `tech_${Date.now()}`;
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newTech = {
      id: newId,
      name: techData.name || 'New Technician',
      specialization: techData.specialization || 'Electrical & General Maintenance',
      activeJobs: 0,
      completedJobs: 0,
      avgResolution: '30 min',
      phone: techData.phone || '+91 98765 00000',
      status: techData.status || 'Available',
      avatar: techData.avatar || randomAvatar,
    };

    setTechnicians(prev => [...prev.filter(t => t.id !== newId), newTech]);
    showToast(`Technician ${newTech.name} added successfully!`, 'success');
  };

  // Delete Technician
  const deleteTechnician = (techId) => {
    const techToDelete = technicians.find(t => t.id === techId);
    setTechnicians(prev => prev.filter(t => t.id !== techId));
    showToast(`Technician ${techToDelete?.name || ''} removed from roster.`, 'info');
  };

  // Update Complaint Status
  const updateComplaintStatus = (complaintId, newStatus, workNotes = '') => {
    const originalTicket = complaints.find(c => c.id === complaintId);
    const updatedTimeline = originalTicket ? [
      ...originalTicket.timeline,
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), title: `Status: ${newStatus}`, desc: workNotes || `Status updated to ${newStatus}` }
    ] : [{ time: 'Just now', title: `Status: ${newStatus}`, desc: workNotes || `Status updated to ${newStatus}` }];

    const updatedTicket = {
      ...(originalTicket || {}),
      id: complaintId,
      status: newStatus,
      workNotes: workNotes || (originalTicket?.workNotes || ''),
      timeline: updatedTimeline,
    };

    setComplaints(prev => prev.map(c => c.id === complaintId ? updatedTicket : c));
    broadcastSync('UPDATE_COMPLAINT', { complaint: updatedTicket });

    addNotification('Status Update', `Ticket ${complaintId} status changed to "${newStatus}".`, complaintId);
    showToast(`Status updated to ${newStatus} for ${complaintId}.`, 'info');
  };

  // Confirm Resolution
  const confirmResolution = (complaintId, isFixed, rating = 5, feedback = '') => {
    const originalTicket = complaints.find(c => c.id === complaintId);

    if (isFixed) {
      const updatedTimeline = originalTicket ? [
        ...originalTicket.timeline,
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), title: 'Resolution Confirmed', desc: `Faculty confirmed resolution (${rating}★). Ticket Closed.` }
      ] : [{ time: 'Just now', title: 'Resolution Confirmed', desc: `Faculty confirmed resolution (${rating}★). Ticket Closed.` }];

      const updatedTicket = {
        ...(originalTicket || {}),
        id: complaintId,
        status: 'Closed',
        rating,
        feedback,
        timeline: updatedTimeline,
      };

      setComplaints(prev => prev.map(c => c.id === complaintId ? updatedTicket : c));
      broadcastSync('UPDATE_COMPLAINT', { complaint: updatedTicket });
      showToast(`Thank you! Ticket ${complaintId} is now officially closed.`, 'success');
    } else {
      const updatedTimeline = originalTicket ? [
        ...originalTicket.timeline,
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), title: 'Resolution Rejected', desc: 'Faculty reported issue is not fully fixed. Ticket reopened.' }
      ] : [{ time: 'Just now', title: 'Resolution Rejected', desc: 'Faculty reported issue is not fully fixed. Ticket reopened.' }];

      const updatedTicket = {
        ...(originalTicket || {}),
        id: complaintId,
        status: 'In Progress',
        timeline: updatedTimeline,
      };

      setComplaints(prev => prev.map(c => c.id === complaintId ? updatedTicket : c));
      broadcastSync('UPDATE_COMPLAINT', { complaint: updatedTicket });
      showToast(`Ticket ${complaintId} reopened for maintenance technician.`, 'warning');
    }
  };

  // AI Prompt Parser
  const parseAiPrompt = (userInput) => {
    const text = userInput.toLowerCase();
    
    let equipment = 'Other Facility';
    let category = 'General Maintenance';
    if (text.includes('ac') || text.includes('air conditioner') || text.includes('cooling') || text.includes('fan')) {
      equipment = 'AC';
      category = 'HVAC';
    } else if (text.includes('projector') || text.includes('display') || text.includes('hdmi') || text.includes('screen')) {
      equipment = 'Projector';
      category = 'AV Equipment';
    } else if (text.includes('tv') || text.includes('television') || text.includes('monitor')) {
      equipment = 'TV';
      category = 'AV Equipment';
    } else if (text.includes('wifi') || text.includes('wi-fi') || text.includes('internet') || text.includes('network')) {
      equipment = 'Network';
      category = 'IT & Network';
    } else if (text.includes('light') || text.includes('electrical') || text.includes('power') || text.includes('plug') || text.includes('socket')) {
      equipment = 'Electrical';
      category = 'Power & Electrical';
    } else if (text.includes('speaker') || text.includes('audio') || text.includes('mic') || text.includes('sound')) {
      equipment = 'Audio';
      category = 'AV Equipment';
    } else if (text.includes('chair') || text.includes('table') || text.includes('desk') || text.includes('furniture') || text.includes('bench')) {
      equipment = 'Furniture';
      category = 'Facilities';
    }

    let room = currentUser?.defaultRoom || 'Room 302';
    let building = currentUser?.defaultBuilding || 'Block A';
    let floor = currentUser?.defaultFloor || '3rd Floor';
    
    const roomMatch = text.match(/(room\s*|rm\s*)?(\d{3})/i);
    if (roomMatch) {
      room = `Room ${roomMatch[2]}`;
      const roomNum = parseInt(roomMatch[2]);
      if (roomNum >= 400) floor = '4th Floor';
      else if (roomNum >= 300) floor = '3rd Floor';
      else if (roomNum >= 200) floor = '2nd Floor';
      else floor = '1st Floor';
    }

    if (text.includes('block b') || text.includes('building b')) building = 'Block B';
    else if (text.includes('block c') || text.includes('building c')) building = 'Block C';
    else if (text.includes('library')) building = 'Library';
    else if (text.includes('lab')) building = 'Science Lab';

    let issue = 'Equipment malfunction reported during class';
    if (text.includes('not cooling') || text.includes('no cooling')) issue = 'AC running but not cooling classroom';
    else if (text.includes('not working') || text.includes('not turning on')) issue = 'Power failure / device not turning on';
    else if (text.includes('no display') || text.includes('not displaying')) issue = 'No display output to projector/screen';
    else if (text.includes('water leak')) issue = 'Water leakage from ceiling AC unit';

    const kbItem = knowledgeBase.find(k => k.equipment.toLowerCase() === equipment.toLowerCase());
    const troubleshootingAdvice = kbItem 
      ? kbItem.troubleshootingStep 
      : 'Please verify that power cables and wall switches are turned ON before logging ticket.';

    return {
      equipment,
      category,
      building,
      floor,
      room,
      issue,
      priority: 'High',
      troubleshootingAdvice,
    };
  };

  // Run Live Demo Scenario
  const runLiveDemo = async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    showToast('Starting 30-Second Live Demo Scenario...', 'info');

    setUserRole('faculty');
    setViewMode('mobile');
    setMobileTab('ai');
    await new Promise(r => setTimeout(r, 1200));

    showToast('AI Assistant created ticket CMP-2026-00125 (AC - Block A Room 302)', 'success');
    await new Promise(r => setTimeout(r, 2000));

    setUserRole('admin');
    setViewMode('desktop');
    setDesktopTab('dashboard');
    showToast('Maintenance Operations Dashboard received live ticket CMP-2026-00125', 'info');
    await new Promise(r => setTimeout(r, 2500));

    assignTechnician('CMP-2026-00125', 'Arun Kumar');
    setDesktopTab('table');
    await new Promise(r => setTimeout(r, 2500));

    updateComplaintStatus('CMP-2026-00125', 'In Progress', 'Technician on-site refilling AC gas & cleaning filter.');
    await new Promise(r => setTimeout(r, 2500));

    updateComplaintStatus('CMP-2026-00125', 'Resolved', 'Filter cleaned, coolant topped up. Temp measured at 19°C.');
    await new Promise(r => setTimeout(r, 2500));

    setViewMode('mobile');
    setMobileTab('requests');
    showToast('Faculty received resolution confirmation prompt.', 'info');
    await new Promise(r => setTimeout(r, 2000));

    confirmResolution('CMP-2026-00125', true, 5, 'AC is working brilliantly now! Class resumed comfortably.');
    setIsDemoRunning(false);
    showToast('Live Demo Scenario Completed Successfully!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        login,
        loginWithGoogle,
        logout,
        updateUserLocation,
        userRole,
        setUserRole,
        viewMode,
        setViewMode,
        mobileTab,
        setMobileTab,
        desktopTab,
        setDesktopTab,
        complaints,
        technicians,
        buildings,
        rooms,
        knowledgeBase,
        setKnowledgeBase,
        notifications,
        activeComplaintDetail,
        setActiveComplaintDetail,
        createComplaint,
        deleteComplaint,
        clearAllHistory,
        assignTechnician,
        addTechnician,
        deleteTechnician,
        updateComplaintStatus,
        confirmResolution,
        parseAiPrompt,
        runLiveDemo,
        isDemoRunning,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        prefilledEquipment,
        setPrefilledEquipment,
        isCampusMapEnabled,
        setIsCampusMapEnabled,
        isSseConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
