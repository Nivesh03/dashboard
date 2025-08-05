# ADmyBRAND Analytics Dashboard
A modern, responsive analytics dashboard built with Next.js, React, TypeScript, and Tailwind CSS. This dashboard provides comprehensive data visualization, filtering, and reporting capabilities for marketing campaign performance analysis.

## Features
### Dashboard Overview
- Metrics Cards : Display key performance indicators with change indicators
- Interactive Charts : Visualize revenue trends, channel performance, and traffic distribution
- Recent Activity : Track latest campaign performance updates
- Quick Actions : Navigate to detailed views and reports
- Campaign Performance Preview : View campaign data with link to full table
### Analytics
- Revenue Trends : Interactive line charts with customizable date ranges
- Channel Performance : Bar charts showing performance across different channels
- Traffic Distribution : Pie charts visualizing traffic sources
- Conversion Funnel : Analyze user conversion journey
- CSV Export : Export chart data for further analysis
### Data Table
- Advanced Filtering : Filter campaign data with multiple conditions
- Sorting : Sort data by any column in ascending or descending order
- Pagination : Navigate through large datasets with customizable page sizes
- Search : Quickly find specific campaigns
- CSV Export : Export filtered data to CSV format
### Reports
- Performance Reports : Generate comprehensive campaign performance analysis
- Revenue Reports : Financial performance and ROI analysis
- Recent Reports : Access previously generated reports
- Coming Soon : Audience reports and conversion reports
### Integration Testing
- Component Integration : Test dashboard components and data flow
- User Flow Testing : End-to-end testing of user journeys
- Integration Health Dashboard : Monitor real-time status of all integrations
### UI/UX Features
- Dark/Light Mode : Toggle between dark and light themes
- Responsive Design : Optimized for desktop, tablet, and mobile devices
- Error Boundaries : Graceful error handling throughout the application
- Loading States : Enhanced loading indicators for better user experience
- Performance Monitoring : Real-time performance tracking
## Tech Stack
- Framework : Next.js (App Router)
- Language : TypeScript
- Styling : Tailwind CSS with shadcn/ui components
- State Management : React Hooks
- Charts : Recharts
- Testing : Built-in integration testing tools
## Getting Started
### Prerequisites
- Node.js 18.x or higher
- npm or yarn
### Installation
1. Clone the repository
```bash
git clone https://github.com/nivesh03/dashboard.git
cd dashboard
```
2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open http://localhost:3000 in your browser
## Build for Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```
## Project Structure
```
- /app : Next.js app router pages and layouts
- /components : React components
  - /dashboard : Dashboard-specific components
  - /ui : Reusable UI components
- /lib : Utility functions, hooks, and types
- /public : Static assets
```

## Features in Detail
### Theme Toggle
The dashboard includes a theme toggle component that allows users to switch between light, dark, and system themes. The theme preference is stored in local storage for persistence.

### CSV Export
Users can export data from charts and tables to CSV format for further analysis. The export functionality is available in the Analytics and Data pages.

### Chart Visualization
The dashboard uses Recharts to create interactive and responsive charts. Charts include line charts for revenue trends, bar charts for channel performance, and pie charts for traffic distribution.

### Data Filtering
The data table includes advanced filtering capabilities, allowing users to filter by multiple conditions such as status, ROAS, cost, and conversions.

### Integration Testing
The dashboard includes built-in integration testing tools to verify component integration and user flows. The Integration page provides a comprehensive view of the dashboard's health and functionality.

## License
MIT
