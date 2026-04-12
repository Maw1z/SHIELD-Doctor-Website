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
<img width="1600" height="829" alt="image" src="https://github.com/user-attachments/assets/9393520a-21ac-44c6-bafb-f5825d5ea1d2" />




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
> Patient Management
> <img width="1920" height="996" alt="image" src="https://github.com/user-attachments/assets/a88196e8-8881-4321-aa3f-a7ed244c66a3" />

> Vitals Monitoring
> <img width="1920" height="996" alt="image" src="https://github.com/user-attachments/assets/a245a325-8523-4287-a359-8108a5ffd499" />

> Appointments
> <img width="1920" height="995" alt="image" src="https://github.com/user-attachments/assets/2b5681f5-5c07-40f4-8159-05fe7aa739c2" />


---

## System Architecture

SHIELD uses a client-server architecture with clear separation of concerns:

### Architecture Diagram
> <img width="831" height="547" alt="image" src="https://github.com/user-attachments/assets/80d1ce64-162a-4383-a219-9b53066e5cf6" />

- **Data Flow**: Patient vitals are collected through the companion mobile app, transmitted securely to the backend, and processed by the risk assessment engine. Physicians access real-time insights through this web dashboard.

- **Frontend (Client)**: React application with TypeScript that provides an intuitive physician interface. Uses Recharts for vital sign visualization and TanStack React Table for efficient patient data rendering.

- **Backend (Server)**: Flask REST API handling all business logic, database operations, and Firebase authentication verification. Implements request validation, error handling, and CORS security protocols.

- **Database**: PostgreSQL for persistent storage of patient records, vitals, appointments, and alerts with proper indexing for query performance.

- **Authentication**: Firebase Authentication for secure doctor login/signup with token-based session management.

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

---

## Installation Guide

### Prerequisites

Before installing the doctor portal, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **pip** - Python package manager (comes with Python)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/)

### Backend Setup (Flask Server)

1. **Navigate to the server directory**
   ```bash
   cd server
   ```

2. **Create a Python virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment variables**
   - Copy the `.env.example` file to `.env` in the `server` directory:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and fill in your actual credentials:
     ```
     PGHOST='your-neon-host.c-3.us-east-1.aws.neon.tech'
     PGDATABASE='neondb'
     PGUSER='neondb_owner'
     PGPASSWORD='your_password'
     PGSSLMODE='require'
     PGCHANNELBINDING='require'
     FIREBASE_SERVICE_ACCOUNT='your_firebase_service_account_json'
     SECRET_KEY='your_secret_key_here'
     ```
   - **Never commit the `.env` file to version control** - it contains sensitive credentials

6. **Set up the PostgreSQL database**
   - If using Neon (recommended): Your database is already created in the cloud. Just ensure your `.env` has the correct connection credentials.
   - If using local PostgreSQL: Run `createdb shield_db`

7. **Run the Flask server**
   ```bash
   python server.py
   ```
   The server will start at `http://localhost:5000`

### Frontend Setup (React Application)

1. **Navigate to the client directory**
   ```bash
   cd client
   ```

2. **Install Node dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   - Create a `.env.local` file in the `client` directory
   - Add the following variables:
     ```
     VITE_API_BASE_URL=http://localhost:5000/api
     VITE_FIREBASE_API_KEY=your_firebase_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_firebase_app_id
     ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

### Firebase Setup

1. **Create a Firebase project**
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Create a new project for SHIELD

2. **Enable Authentication**
   - In the Firebase Console, go to Authentication
   - Enable Email/Password authentication method

3. **Generate credentials**
   - For the backend: Download the service account key (JSON file) and place it in the `server` directory
   - For the frontend: Copy your Firebase configuration from Project Settings

### Building for Production

**Frontend Build**
```bash
cd client
npm run build
# or
yarn build
```
The optimized build will be created in the `client/dist` directory.

**Backend Deployment**
- Deploy the `server` directory to your hosting platform (Vercel, Heroku, etc.)
- Ensure environment variables are configured on the hosting platform


## License

This project is licensed under the [MIT License](#license).
