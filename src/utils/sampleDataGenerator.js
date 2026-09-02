// Sample Data Generator: Generates 100 realistic campus facility tickets
const BUILDINGS = ['Block A', 'Block B', 'Block C', 'Library', 'Science Lab', 'Admin Block'];
const FLOORS = ['1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor'];
const ROOM_TYPES = ['Room 101', 'Room 102', 'Room 204', 'Room 302', 'Room 305', 'Room 401', 'Lab 01', 'Lab 03', 'Auditorium 1', 'Digital Hub 3', 'Conference Room A'];
const FACULTY_NAMES = [
  'Prof. Sarah Jenkins', 'Dr. Rajesh Patel', 'Prof. Anita Roy', 'Dr. Vikram Singh',
  'Prof. David Miller', 'Dr. Meera Nambiar', 'Prof. Robert Chen', 'Dr. Sanjay Gupta',
  'Prof. Elena Rostova', 'Dr. Karthik Sundaram', 'Librarian Michael Scott'
];
const DEPARTMENTS = ['Computer Science', 'Electrical Engineering', 'Mechanical Eng', 'Humanities', 'Physics & Chemistry', 'Library Services', 'Business School'];
const TECHNICIANS = ['Arun Kumar', 'Priya Sharma', 'Marcus Vance', 'David Chen', 'Ramesh Kumar', 'Suresh Raina'];

const PROBLEM_TEMPLATES = [
  { equipment: 'AC', category: 'HVAC', problems: ['AC not cooling', 'Water leakage from ceiling unit', 'AC making loud rattling noise', 'Remote display unreadable', 'Thermostat sensor error'] },
  { equipment: 'TV', category: 'AV Equipment', problems: ['No power on display', 'Screen flickering red tint', 'Smart TV Wi-Fi disconnected', 'Remote control missing', 'Audio distorted from TV speakers'] },
  { equipment: 'Projector', category: 'AV Equipment', problems: ['No display signal', 'Projector lamp replacement warning', 'Blurry projection focus', 'HDMI port loose in wall plate', 'Projector auto thermal shutdown'] },
  { equipment: 'Electrical', category: 'Power & Lights', problems: ['Flickering Overhead LED Panels', 'Wall power socket dead', 'Circuit breaker tripped', 'Light switch broken', 'UPS backup warning beep'] },
  { equipment: 'Network', category: 'IT & Wi-Fi', problems: ['Wi-Fi Access Point Offline', 'Ethernet cable port damaged', 'High packet loss in classroom', 'IP address allocation conflict', 'Smart Board network dropped'] },
  { equipment: 'Other', category: 'General Maintenance', problems: ['Door lock jammed', 'Whiteboard marker tray broken', 'Classroom podium leg wobbling', 'Window glass latch loose', 'Ceiling tile water stain'] },
];

const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES = ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

export const generate100SampleComplaints = () => {
  const list = [];
  const now = new Date();

  for (let i = 100; i >= 1; i--) {
    const template = PROBLEM_TEMPLATES[Math.floor(Math.random() * PROBLEM_TEMPLATES.length)];
    const problemText = template.problems[Math.floor(Math.random() * template.problems.length)];
    const bld = BUILDINGS[Math.floor(Math.random() * BUILDINGS.length)];
    const floor = FLOORS[Math.floor(Math.random() * FLOORS.length)];
    const room = ROOM_TYPES[Math.floor(Math.random() * ROOM_TYPES.length)];
    const reportedBy = FACULTY_NAMES[Math.floor(Math.random() * FACULTY_NAMES.length)];
    const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const assignedTech = (status === 'Submitted') ? '' : TECHNICIANS[Math.floor(Math.random() * TECHNICIANS.length)];

    const id = `CMP-2026-${String(i).padStart(5, '0')}`;
    const tokenNo = `TKN-${String(i).padStart(4, '0')}`;
    const daysAgo = Math.floor(Math.random() * 10);
    const dateObj = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const reportedTime = daysAgo === 0 ? 'Today ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `${daysAgo} days ago`;

    const timeline = [
      { time: reportedTime, title: 'Complaint Submitted', desc: `Reported via CampusCare AI by ${reportedBy}` }
    ];

    if (assignedTech) {
      timeline.push({ time: '30 mins later', title: 'Assigned to Technician', desc: `Dispatched to ${assignedTech}` });
    }
    if (status === 'In Progress' || status === 'Resolved' || status === 'Closed') {
      timeline.push({ time: '1 hour later', title: 'Work In Progress', desc: 'Technician inspecting equipment on-site' });
    }
    if (status === 'Resolved' || status === 'Closed') {
      timeline.push({ time: '2 hours later', title: 'Resolved', desc: 'Technician completed repairs and verified operation' });
    }
    if (status === 'Closed') {
      timeline.push({ time: '3 hours later', title: 'Resolution Confirmed', desc: 'Faculty confirmed fix with 5-star rating' });
    }

    list.push({
      id,
      tokenNo,
      building: bld,
      room,
      floor,
      equipment: template.equipment,
      category: template.category,
      problem: problemText,
      description: `${template.equipment} issue reported in ${bld} ${room}. ${problemText}. Requires technician attendance.`,
      priority,
      status,
      reportedBy,
      department: dept,
      reportedTime,
      assignedTech,
      evidenceUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      timeline,
      workNotes: status === 'Submitted' ? '' : 'Technician conducted standard diagnostic check.',
      rating: (status === 'Closed') ? 5 : undefined,
    });
  }

  return list;
};
