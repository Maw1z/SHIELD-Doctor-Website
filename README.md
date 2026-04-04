# SHIELD: Doctor Healthcare Management Platform

A full-stack healthcare system consisting of a **doctor-facing web platform** and a **patient-facing mobile application**, designed to enable real-time monitoring, data-driven clinical decisions, and seamless patient–doctor interaction.

---

## Overview

SHIELD is an integrated healthcare solution that bridges the gap between **patient-generated health data and clinical decision-making**.

The system is composed of two core components:
- **Doctor Web Platform**: A centralized dashboard that allows physicians to manage patient records, monitor vitals, assess risk, and handle appointments.
- **Patient Mobile Application**: A companion app used by patients to record and submit their vital signs, which are securely transmitted to the backend.

By consolidating patient data into a single ecosystem, SHIELD eliminates fragmented workflows and **enables continuous, real-time healthcare monitoring**.

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

**Data Flow**: Patient vitals are collected through the companion mobile app, transmitted securely to the backend, and processed by the risk assessment engine. Physicians access real-time insights through this web dashboard.

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

**Remote Patient Monitoring**: A patient with chronic hypertension logs home blood pressure readings through a companion app. The doctor receives an alert when readings exceed threshold parameters and can adjust medication or schedule a follow-up appointment directly from the platform.

**Appointment Management**: A patient calls to schedule a follow-up. The doctor navigates the calendar, checks the patient's recent vitals to determine appropriate timing, and books the appointment. The system automatically sends confirmation details to the patient.

**Post-Discharge Follow-Up**: After hospitalization, a patient returns home. The doctor monitors their vital signs remotely. If concerning trends appear, an alert triggers automatically, prompting early intervention before the patient deteriorates.

### User Workflows
![Clinical Workflow Example](./docs/images/workflow.png)

---

## Related Repositories

- **SHIELD Patient Mobile App**: Separate repository containing the native mobile application for patient data entry and vital sign collection. Patients use this companion app to log vitals (blood pressure, heart rate, temperature, oxygen saturation), which are transmitted securely to the backend API.

---

## Future Improvements

**Telemedicine Integration**: Add video consultation capabilities directly within the patient portal for remote appointments and follow-ups.

**Prescription Management**: Extend the system to handle digital prescriptions with pharmacy integration and medication adherence tracking.

**Advanced Filtering & Search**: Implement full-text search across patient histories and custom filter combinations for quick patient lookup.

**Integration with EHR Systems**: Build connectors for popular Electronic Health Record systems (Epic, Cerner) to sync patient data bidirectionally.

**Audit Logging**: Enhanced compliance logging for HIPAA audits tracking all data access and modifications.

---

## License

This project is provided for educational and clinical use. All rights reserved.