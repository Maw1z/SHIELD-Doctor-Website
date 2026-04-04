# SHIELD: Doctor Healthcare Management Platform

A comprehensive healthcare management system designed for physicians to monitor patient wellness, manage appointments, and assess clinical risks in real time.

---

## Overview

SHIELD is a full-stack web application that streamlines clinical workflows for medical practitioners. It provides physicians with an integrated platform to manage patient information, track vital signs, schedule appointments, and receive intelligent alerts for patients at risk. The system bridges the gap between scattered patient records and actionable clinical insights, enabling doctors to make faster, more informed care decisions.

The platform addresses a critical pain point in modern healthcare: fragmented patient data. By consolidating patient vitals, medical history, appointment scheduling, and risk assessments in a single interface, SHIELD eliminates administrative friction and enables doctors to focus on patient outcomes.

### Dashboard Overview
![SHIELD Dashboard](./docs/images/dashboard.png)

---

## Key Features

- **Patient Management**: Comprehensive patient profiles with complete medical history, contact information, and clinical records accessible from a single dashboard
- **Real-Time Vitals Monitoring**: Track patient vital signs (heart rate, blood pressure, oxygen saturation, temperature) with visual trend analysis and anomaly detection
- **Intelligent Risk Scoring**: Automated risk assessment algorithm that evaluates patient health metrics and flags high-priority cases for immediate clinical review
- **Appointment Scheduling**: Integrated calendar system with conflict detection, appointment history, and automated scheduling workflows
- **Clinical Alerts System**: Smart alerting mechanism that notifies doctors of critical patient events, vital sign anomalies, and appointment reminders
- **Doctor Notes & Documentation**: Structured note-taking system tied to patient records for continuity of care
- **Multi-Patient Dashboard**: Sortable, filterable patient list with customizable columns and quick-access patient details
- **Responsive Design**: Full functionality across desktop, tablet, and mobile devices for clinical flexibility

### Feature Highlights
![Patient Management](./docs/images/patient-management.png)
![Vitals Monitoring](./docs/images/vitals-monitoring.png)
![Appointments](./docs/images/appointments.png)

---

## System Architecture

SHIELD uses a client-server architecture with clear separation of concerns:

```
Patient/Doctor Request
         ↓
React Frontend (TypeScript)
    ↓        ↓        ↓
  Auth    Data    Vitals
       ↓
  REST API Layer (Flask)
    ↓        ↓        ↓
  Auth    Patient  Vitals
  Routes  Routes   Routes
       ↓
  PostgreSQL Database
       ↓
Firebase Authentication
```

### Architecture Diagram
![System Architecture Diagram](./docs/images/architecture.png)

**Data Flow**: Patient vitals are collected through the companion mobile app (in a separate repository)[link to repo], transmitted securely to the backend, and processed by the risk assessment engine. Physicians access real-time insights through this web dashboard.

**Frontend (Client)**: React application with TypeScript that provides an intuitive physician interface. Uses Recharts for vital sign visualization and TanStack React Table for efficient patient data rendering.

**Backend (Server)**: Flask REST API handling all business logic, database operations, and Firebase authentication verification. Implements request validation, error handling, and CORS security protocols.

**Database**: PostgreSQL for persistent storage of patient records, vitals, appointments, and alerts with proper indexing for query performance.

**Authentication**: Firebase Authentication for secure doctor login/signup with token-based session management.

---

## Technology Stack

**Frontend**
- React 19 (UI framework)
- TypeScript (type safety)
- Vite (build tool)
- Tailwind CSS (utility-first styling)
- TanStack React Table (data table management)
- Recharts (data visualization)
- Firebase SDK (authentication client)
- Axios (HTTP client)
- React Router (client-side routing)

**Backend**
- Flask (Python web framework)
- PostgreSQL (relational database)
- Firebase Admin SDK (server-side authentication)
- python-dotenv (environment configuration)

**DevOps & Deployment**
- Vercel (frontend deployment)
- ESLint & TypeScript (code quality)

---

## Implementation Highlights

**Intelligent Risk Assessment Algorithm**: The platform implements a weighted risk scoring system that evaluates multiple patient metrics (vital sign deviations, trend analysis, historical patterns) to classify patients into risk tiers. This enables proactive clinical intervention rather than reactive emergency response.

**Real-Time Vitals Processing**: The system efficiently handles continuous vitals data ingestion with server-side validation and client-side caching to minimize API calls while maintaining data freshness.

**Secure Authentication Flow**: Doctor authentication uses Firebase tokens verified on every API request. The backend validates credentials before granting access to any patient-sensitive data, ensuring HIPAA-compliant access controls.

**Optimized Patient Queries**: Database queries are structured with proper indexing on frequently-filtered fields (doctor_id, patient_status, vitals_timestamp) to maintain sub-150ms response times even with large patient rosters.

**Responsive Data Visualization**: Vital sign charts scale dynamically based on time range and automatically adjust Y-axis bounds to highlight clinically relevant variations without misrepresenting stable data.

---

## Use Cases

**Daily Clinical Rounds**: A physician starts their day by viewing their patient dashboard. High-risk patients are highlighted with alert flags, allowing the doctor to prioritize which patients to review first. They click into each patient to see recent vital trends and doctor notes from previous visits.

**Remote Patient Monitoring**: A patient with chronic hypertension logs home blood pressure readings through a companion app. The doctor receives an alert when readings exceed threshold parameters and can adjust medication or schedule a follow-up appointment directly from the platform.

**Appointment Management**: A patient calls to schedule a follow-up. The doctor navigates the calendar, checks the patient's recent vitals to determine appropriate timing, and books the appointment. The system automatically sends confirmation details to the patient.

**Post-Discharge Follow-Up**: After hospitalization, a patient returns home. The doctor monitors their vital signs remotely. If concerning trends appear, an alert triggers automatically, prompting early intervention before the patient deteriorates.

### User Workflows
![Clinical Workflow Example](./docs/images/workflow.png)

---

## Related Repositories

- **SHIELD Patient Mobile App**: Separate repository containing the native mobile application for patient data entry and vital sign collection. Patients use this companion app to log vitals (blood pressure, heart rate, temperature, oxygen saturation), which are transmitted securely to the backend API.

---

## Project Structure


```
SHIELD-Doctor-Website/
├── client/                      # React + TypeScript frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── pages/          # Full-page views
│   │   │   ├── patient_details/ # Patient detail components
│   │   │   ├── appointments/    # Appointment UI
│   │   │   └── ui/             # Design system (Radix + Tailwind)
│   │   ├── hooks/              # Custom React hooks (usePatients, useVitals, etc.)
│   │   ├── api/                # Axios API client
│   │   └── firebase/           # Firebase configuration
│   └── vite.config.ts          # Build configuration
│
├── server/                      # Flask backend
│   ├── routes/                  # API endpoint definitions
│   ├── controllers/             # Business logic
│   ├── app/
│   │   ├── db.py               # Database initialization
│   │   └── __init__.py         # Flask app factory
│   ├── server.py               # Entry point
│   └── requirements.txt        # Python dependencies
```

---

## Future Improvements

**Telemedicine Integration**: Add video consultation capabilities directly within the patient portal for remote appointments and follow-ups.

**Prescription Management**: Extend the system to handle digital prescriptions with pharmacy integration and medication adherence tracking.

**Advanced Filtering & Search**: Implement full-text search across patient histories and custom filter combinations for quick patient lookup.

**Integration with EHR Systems**: Build connectors for popular Electronic Health Record systems (Epic, Cerner) to sync patient data bidirectionally.

**Audit Logging**: Enhanced compliance logging for HIPAA audits tracking all data access and modifications.

---

## Contributors

This project was developed as a capstone initiative [Edit Needed]
---

## License

This project is provided for educational and clinical use. All rights reserved.