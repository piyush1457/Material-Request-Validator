# Material Request Validator

A lightweight web application for retail fit-out projects that helps project managers review material requests against expected consumption benchmarks.

## Product

Material Request Validator is an exception-detection tool for retail fit-out projects. It compares requested material quantities against project-specific expected consumption benchmarks, identifies unusual requests before approval, and captures reasons for exceptions.

The system does NOT claim that its calculated quantity is the objectively correct quantity. It provides a benchmark for exception detection and human review.

## Problem

On retail fit-out projects, site teams request materials such as tiles, adhesive, paint, or plasterboard through informal channels. Project managers may not have a quick way to compare a request against expected material consumption for the work being performed. As a result, unusual requests can be approved without sufficient context.

This product aims to identify unusual requests BEFORE approval and capture the reason for the exception.

## Users

- **Site Engineer** (Primary): Raises material requests, enters quantities, provides context for unusual requests
- **Project Manager** (Secondary): Reviews material requests, identifies unusual quantities, reviews exception reasons, monitors consumption patterns
- **Procurement** (Tertiary): Sees approved/requested quantities, identifies requests requiring attention

For this MVP, authentication and separate role permissions are not implemented. Role labels are shown in the UI where useful.

## Solution

The application follows a clear workflow:

1. **Select Project** → Choose from existing retail fit-out projects with defined tasks and areas
2. **Create Request** → Select task, material, and enter requested quantity
3. **Validate** → System calculates expected quantity based on task area and material consumption benchmarks
4. **Review Result** → Request is classified as Normal, Review, or Flagged based on variance
5. **Capture Reason** → For Review and Flagged statuses, an exception reason is required
6. **Dashboard** → Project managers monitor all requests with KPIs, charts, and exception lists

## Assumptions

- **Benchmark rates are illustrative** — Demo benchmark rates are illustrative. Production values would be based on company-approved standards or historical project data.
- **The tool is an exception-detection aid, not an automated approval authority** — Human review remains necessary because material requirements can change due to rework, additional scope, damage, design changes, and site conditions.
- **Data persists locally** — Uses localStorage for demo purposes. No backend required.
- **Single-user demo** — No authentication or role-based access control implemented.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for development and build
- **Tailwind CSS v4** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

## What Works

- ✅ Project management (create, edit, delete projects with tasks)
- ✅ Material request form with project/task/material selection
- ✅ Real-time validation against benchmarks
- ✅ Three-tier status system (Normal / Review / Flagged)
- ✅ Exception reason capture with predefined options and custom text
- ✅ Dashboard with KPI cards (Total, Normal, Review, Flagged)
- ✅ Charts: Expected vs Requested comparison, Status distribution pie chart
- ✅ Request table with filtering by status
- ✅ Exception list highlighting requests requiring attention
- ✅ localStorage persistence (survives page refresh)
- ✅ Demo data pre-populated (2 projects, 5 tasks, 4 materials, 12 requests)
- ✅ Responsive, professional B2B design
- ✅ Reset demo data functionality

## What Is Mocked

- Authentication and user roles
- Backend API and database
- Real company-approved consumption rates
- Real procurement system integration
- Notifications and approval workflows
- Multi-user collaboration

## Future Improvements

- Historical consumption benchmarks based on actual project data
- Company-specific rate cards and material catalogs
- Multi-project analytics and portfolio views
- Procurement system integration (PO generation, delivery tracking)
- WhatsApp/request ingestion for informal site requests
- Mobile/offline workflow for site engineers
- Anomaly detection based on historical project patterns
- Role-based access control and audit trails
- Export to Excel/PDF for reporting

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd material-request-validator
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Demo Data

The application comes pre-populated with realistic demo data:

**Projects:**
- Reliance Retail — Indiranagar (Flooring: 120 sq m, Wall Painting: 300 sq m, Ceiling: 120 sq m)
- Retail Store — Koramangala (Flooring: 85 sq m, Wall Painting: 210 sq m)

**Materials with Benchmarks:**
- Floor Tiles: 1.0 sq m per sq m, 8% wastage
- Tile Adhesive: 4.5 kg per sq m, 10% wastage
- Wall Paint: 0.1 litre per sq m per coat, 10% wastage
- Plasterboard: 1.05 sq m per sq m, 10% wastage
- Ceiling Tiles: 1.0 sq m per sq m, 5% wastage
- Grout: 0.5 kg per sq m, 15% wastage
- Primer: 0.08 litre per sq m, 10% wastage

**Sample Requests (12 total):**
- Normal requests within expected range
- Review requests (above allowed, within 15% of allowed)
- Flagged requests (significantly above allowed)
- Flagged requests with exception reasons (Rework, Damaged Material, Additional Scope, etc.)

## Validation Logic

For a selected task:
- `expectedQuantity = taskArea × materialConsumptionRate`
- `allowedQuantity = expectedQuantity × (1 + wastageMargin)`
- `variancePercentage = ((requestedQuantity - expectedQuantity) / expectedQuantity) × 100`

**Status Classification:**
- **NORMAL**: requestedQuantity ≤ allowedQuantity
- **REVIEW**: requestedQuantity > allowedQuantity AND requestedQuantity ≤ allowedQuantity × 1.15
- **FLAG**: requestedQuantity > allowedQuantity × 1.15

## Deployment

The application is ready to deploy to Vercel, Netlify, or any static hosting service.

```bash
npm run build
# Deploy the dist/ folder
```

## License

MIT License - Built for demonstration purposes.