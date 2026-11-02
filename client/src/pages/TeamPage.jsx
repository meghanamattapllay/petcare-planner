import React from 'react';

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: 'SIDDARTHA RAJ',
      role: 'Frontend: Pet Profiles',
      rollNo: '2303A51917',
      branch: 'CSE',
      tasks: [
        'Build custom responsive styles and animation for pet profile cards',
        'Enhance add/edit pet modal with image upload and avatar previews',
        'Implement individual pet detail view with comprehensive medical history',
        'Add client-side form validation for pet inputs (age, species, weight)',
        'Refine responsive layouts across tablet and mobile viewports',
      ],
      deliverable: 'Pet profile pages, forms, and reusable UI components.',
      status: 'IN PROGRESS / CONTRACT READY',
    },
    {
      id: 2,
      name: 'CHIPPA VASU',
      role: 'Backend: Authentication',
      rollNo: '2303A51618',
      branch: 'CSE',
      tasks: [
        'Finalize User Mongoose model and password salt/hashing using bcryptjs',
        'Complete JWT token generation and authorization header verification in authMiddleware.js',
        'Implement password change and profile update endpoints (/api/auth/profile)',
        'Add role-based authorization check (owner vs admin permissions)',
        'Verify token expiration handling and HTTP security headers',
      ],
      deliverable: 'Secure authentication APIs, user model, and auth middleware.',
      status: 'IN PROGRESS / CONTRACT READY',
    },
    {
      id: 3,
      name: 'BODASU NITHIN',
      role: 'Backend: Database & APIs',
      rollNo: '2303A51803',
      branch: 'CSE',
      tasks: [
        'Finalize Pet and CareRecord Mongoose schema indexes and relationships',
        'Link each pet and care record strictly to authenticated req.user.id',
        'Implement input sanitization and schema-level validation',
        'Complete CareRecord CRUD APIs (Create, Read, Update, Delete)',
        'Conduct Postman API tests and document sample request/response payloads',
      ],
      deliverable: 'Pet and care record APIs with database integration & Postman collection.',
      status: 'IN PROGRESS / CONTRACT READY',
    },
    {
      id: 4,
      name: 'MATAPALLY MEGHANA',
      role: 'Reminders & Timeline',
      rollNo: '2303A52505',
      branch: 'CSE (AIML)',
      tasks: [
        'Fine-tune dynamic date calculation algorithm (due today, overdue count, days left)',
        'Implement multi-attribute search and filter by pet, care type, and date range',
        'Develop visual timeline component tracking past administered pet care',
        'Add browser notification alerts or email reminder triggers for overdue items',
        'Test empty states, leap years, and edge cases for appointment scheduling',
      ],
      deliverable: 'Care timeline, reminder calculation engine, search, and filtering.',
      status: 'IN PROGRESS / CONTRACT READY',
    },
    {
      id: 5,
      name: 'GODISHALA KRUTHIK ROSHAN',
      role: 'Frontend & Backend Integration',
      rollNo: '2303A52339',
      branch: 'CSE (AIML)',
      tasks: [
        'Created GitHub repository structure & workspace organization',
        'Built full MERN architecture (Client + Server + DB configuration)',
        'Implemented centralized Axios API Client & Vite proxy handshake',
        'Wired live health check endpoint (/api/health) and status indicators',
        'Configured .env.example, environment isolation & security middleware',
        'Prepared API Documentation, architecture specifications, and README',
        'Integrated frontend views and established modular contracts for all members',
      ],
      deliverable: 'Fully integrated application skeleton, API bridge, and final submission package.',
      status: 'COMPLETED & LIVE',
    },
  ];

  return (
    <div className="page-container">
      <div className="section-header">
        <div>
          <h2 className="page-title">Team Work Distribution & Progress Board</h2>
          <p className="page-subtitle">
            Team: <strong>PawTech Innovators</strong> · Project: <strong>PetCare Planner</strong>
          </p>
        </div>
      </div>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-card">
            <div className="team-card-header">
              <div className="member-main">
                <span className="member-num">#{member.id}</span>
                <div>
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                </div>
              </div>
              <span className={`status-badge-chip ${member.status.startsWith('COMPLETED') ? 'chip-completed' : 'chip-ready'}`}>
                {member.status}
              </span>
            </div>

            <div className="member-meta">
              <span><strong>Roll:</strong> {member.rollNo}</span>
              <span><strong>Branch:</strong> {member.branch}</span>
            </div>

            <div className="member-tasks-section">
              <h4>Assigned Module Tasks:</h4>
              <ul className="tasks-list">
                {member.tasks.map((task, idx) => (
                  <li key={idx} className={member.status.startsWith('COMPLETED') ? 'task-done' : 'task-pending'}>
                    <span className="task-bullet">{member.status.startsWith('COMPLETED') ? '✓' : '○'}</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>

            <div className="deliverable-box">
              <strong>Official Deliverable:</strong>
              <p>{member.deliverable}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
