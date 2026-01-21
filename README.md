# Blockchain-Enabled ERP + CRM System

A comprehensive, enterprise-grade **ERP + CRM system prototype** with **blockchain integration** and **analytics dashboards**. Built as a capstone project demonstrating modern web development practices and blockchain data integrity concepts.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)
![React](https://img.shields.io/badge/React-18-61DAFB)

## 🚀 Quick Start (Demo Ready in < 5 Minutes)

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone/navigate to project directory
cd "capstone project"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials
The system includes pre-built role-based access. On the login page, simply click any role to instantly log in:

| Role | Description | Access Level |
|------|-------------|--------------|
| **Admin** | Full system access | All dashboards, settings, audit logs |
| **Manager** | Operations oversight | All dashboards, orders, inventory |
| **Sales Executive** | Customer-facing | CRM dashboard, customers, orders |
| **Auditor** | Compliance review | Audit logs, blockchain verification |
| **Support Agent** | Customer support | Support tickets, customer info |

---

## 📊 System Overview

### Four Analytics Dashboards

1. **Executive Dashboard** (`/dashboard`)
   - High-level KPIs (Revenue, Orders, Customers, Growth)
   - Revenue trend visualization
   - Order status distribution
   - Recent activity feed
   - Low stock alerts

2. **ERP Analytics** (`/dashboard/erp`)
   - Inventory health metrics
   - Order fulfillment rates
   - Processing time analysis
   - Supply chain insights
   - Stock level monitoring

3. **CRM Analytics** (`/dashboard/crm`)
   - Customer acquisition funnel
   - Lead conversion rates
   - Customer satisfaction scores
   - Revenue by customer segment
   - Customer lifetime value

4. **Blockchain Analytics** (`/dashboard/blockchain`)
   - Transaction volume trends
   - Block confirmation times
   - Network hash rate simulation
   - Smart contract activity
   - Real-time transaction feed

### Core Modules

| Module | Path | Features |
|--------|------|----------|
| **Orders** | `/dashboard/orders` | Create orders, status updates, invoice generation |
| **Invoices** | `/dashboard/invoices` | Payment tracking, status management, PDF generation |
| **Customers** | `/dashboard/customers` | Customer profiles, status tracking, contact info |
| **Inventory** | `/dashboard/inventory` | Stock levels, restock alerts, category filters |
| **Support** | `/dashboard/support` | Ticket creation, priority management, resolution tracking |
| **Audit Log** | `/dashboard/audit` | Activity history, blockchain verification |
| **Settings** | `/dashboard/settings` | User preferences, notifications, security |

---

## 🔗 Blockchain Integration

### How It Works

Every critical operation in the system is "recorded" on a simulated blockchain:

```
User Action → Application State Update → Blockchain Transaction Generated → Audit Log Created
```

### Blockchain-Tracked Operations
- ✅ Order Creation & Status Changes
- ✅ Invoice Generation & Payments
- ✅ Customer Registration
- ✅ Inventory Restocking
- ✅ Support Ticket Resolution

### Verification Panel
The system includes a blockchain verification panel that simulates:
- Transaction hash validation
- Block confirmation status
- Timestamp verification
- Data integrity checks

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.0 |
| **Styling** | Tailwind CSS 3.4 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **State** | React Context API |
| **Date Handling** | date-fns |

### Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── dashboard/            # Protected dashboard routes
│   │   ├── erp/             # ERP Analytics
│   │   ├── crm/             # CRM Analytics
│   │   ├── blockchain/      # Blockchain Analytics
│   │   ├── orders/          # Order management
│   │   ├── invoices/        # Invoice management
│   │   ├── customers/       # Customer management
│   │   ├── inventory/       # Inventory management
│   │   ├── support/         # Support tickets
│   │   ├── audit/           # Audit logs
│   │   └── settings/        # User settings
│   ├── login/               # Login page
│   └── page.tsx             # Home redirect
├── components/
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── Charts.tsx       # All Recharts implementations
│   │   ├── KPICard.tsx      # KPI display cards
│   │   ├── ChartCard.tsx    # Chart container wrapper
│   │   ├── DataTables.tsx   # Reusable data tables
│   │   ├── BlockchainActivityPanel.tsx
│   │   ├── BlockchainVerificationPanel.tsx
│   │   └── LowStockAlerts.tsx
│   ├── layout/              # Layout components
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Header.tsx       # Top header bar
│   │   └── DashboardLayout.tsx
│   └── ui/                  # Reusable UI primitives
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Input.tsx
│       └── Loaders.tsx
├── contexts/
│   ├── AppContext.tsx       # Global state (data, CRUD operations)
│   └── AuthContext.tsx      # Authentication & role management
├── data/
│   ├── mockData.ts          # Mock data generators
│   └── analyticsService.ts  # Analytics calculation functions
├── lib/
│   └── utils.ts             # Utility functions
└── types/
    └── index.ts             # TypeScript type definitions
```

### Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   UI Layer  │ ──▶ │ AppContext   │ ──▶ │ Blockchain Sim  │
│  (Components)│     │ (State Mgmt) │     │ (Transaction Gen)│
└─────────────┘     └──────────────┘     └─────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Audit Log   │
                    │  (History)   │
                    └──────────────┘
```

---

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Primary blue (#3B82F6), Blockchain purple (#7C3AED)
- **Typography**: Inter font family
- **Spacing**: 4px base unit system
- **Shadows**: Subtle elevation with soft shadows
- **Animations**: Fade-in transitions, loading states

### Responsive Design
- Mobile-first approach
- Collapsible sidebar for mobile
- Adaptive grid layouts
- Touch-friendly interactions

### Accessibility
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states for interactive elements

---

## 📈 Mock Data

The system generates realistic demo data on initialization:

| Entity | Count | Description |
|--------|-------|-------------|
| **Customers** | 50 | Varied company profiles with contact info |
| **Orders** | 100 | Mix of statuses (pending, processing, completed) |
| **Invoices** | 80 | Payment statuses, due dates, amounts |
| **Products** | 12 | Categories, stock levels, pricing |
| **Blockchain Txns** | 200 | Transaction history with hashes |
| **Audit Logs** | 100 | System activity records |
| **Support Tickets** | 20 | Various priorities and statuses |

---

## 🔧 Configuration

### Environment Variables
No environment variables required for demo mode.

### Tailwind Configuration
Custom theme extensions in `tailwind.config.js`:
- Primary color palette
- Blockchain accent colors
- Custom animations

---

## 📝 Key Components

### KPICard
Displays key performance indicators with trend indicators:
```tsx
<KPICard
  title="Total Revenue"
  value="$125,430"
  change={12.5}
  changeType="increase"
  icon={<DollarSign />}
/>
```

### Charts
Nine pre-built chart types using Recharts:
- `RevenueLineChart`
- `OrderStatusPieChart`
- `InventoryBarChart`
- `CustomerFunnelChart`
- `BlockchainTransactionsChart`
- `RevenueByCategoryChart`
- `OrderVolumeChart`
- `CustomerGrowthChart`
- `BlockchainNetworkChart`

### Modal
Reusable modal component:
```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Create Order" size="lg">
  {/* Modal content */}
</Modal>
```

---

## 🧪 Demo Scenarios

### Scenario 1: Create an Order
1. Navigate to Orders page
2. Click "Create Order"
3. Fill in customer and product details
4. Submit → Order appears in list
5. Check Blockchain panel → New transaction recorded

### Scenario 2: Verify Blockchain Record
1. Navigate to Audit Log
2. Find a record with blockchain hash
3. Click "View" → "Verify"
4. Watch verification animation
5. See confirmed status

### Scenario 3: Track Inventory
1. Navigate to Inventory
2. Filter by "Low Stock"
3. Click "Restock" on any product
4. Enter quantity
5. Stock level updates with blockchain record

---

## 🚧 Limitations & Notes

- **No Backend**: All data is generated client-side and resets on page refresh
- **Simulated Blockchain**: No actual blockchain network connection
- **Demo Authentication**: No real security, role selection is immediate
- **Browser Storage**: Session data stored in localStorage

---

## 🎓 Academic Context

This project demonstrates:
- Modern React patterns (hooks, context, composition)
- TypeScript for type safety
- Component-driven architecture
- State management without external libraries
- Responsive design principles
- Data visualization techniques
- Role-based access control concepts
- Blockchain integration concepts

---

## 📄 License

MIT License - For educational purposes

---

## 👨‍💻 Development

```bash
# Development server
npm run dev

# Type checking
npm run lint

# Production build
npm run build

# Start production server
npm start
```

---

Built with ❤️ for Capstone Project 2024
