# Data Source Toggle - Frontend Feature

## Overview

⚠️ **WARNING**: The Data Source Toggle has been **DISABLED** to prevent AWS charges.

This component previously allowed users to switch between mock data and real AWS billing data, but AWS access has been completely removed due to unexpected billing charges reaching $120.

## Features

### **Visual Toggle Interface**

- **Mock Button**: Switch to fake data for testing
- **Real Button**: Switch to real AWS billing data
- **Auto Button**: Use backend's default setting

### **Real-time Status Display**

- Current data source indicator
- AWS connection status
- Backend configuration info
- Loading states and error handling

### **Seamless Integration**

- Works with all existing API endpoints
- Automatic URL parameter injection
- Toast notifications for user feedback
- Responsive design for mobile devices

## Architecture

### **Components Created**

```
frontend/src/
├── contexts/
│   └── DataSourceContext.tsx      ← Global state management
├── components/
│   ├── DataSourceToggle.tsx       ← Main toggle component
│   └── DataSourceToggleDemo.tsx   ← Demo/example component
├── hooks/
│   └── useApiWithDataSource.ts    ← API integration hook
└── api/
    └── costApi.ts                 ← Updated with data source support
```

### **How It Works**

1. **Context Provider**: Manages global data source state
2. **Toggle Component**: Beautiful UI for switching sources
3. **API Hook**: Automatically adds `?source=real` or `?source=mock` to API calls
4. **Backend Integration**: Works with your hybrid backend system

## User Interface

### **Header Integration**

The toggle appears in the header next to the theme toggle:

```
[Menu] Dashboard > Overview    [Mock] [Real] [Auto]  [Theme] [User]
```

### **Status Indicators**

- **Real AWS Data**: Green indicator when using real data
- **Mock Data**: Yellow indicator when using mock data
- **Loading**: Shows loading state during API calls
- **Error**: Shows error state if connection fails

### **Toast Notifications**

When users switch data sources, they see helpful feedback:

```
Data Source Changed
Switched to Real AWS Data
```

## Technical Details

### **Data Source Types**

```typescript
type DataSource = "mock" | "real" | "auto";
```

- **`mock`**: Force mock data (ignores backend setting)
- **`real`**: Force real AWS data (ignores backend setting)
- **`auto`**: Use backend's default (respects `USE_REAL_DATA` env var)

### **API URL Building**

```typescript
// Automatically converts:
'/api/cost' → '/api/cost?source=real'
'/api/clusters' → '/api/clusters?source=mock'
```

### **Context Usage**

```typescript
const { dataSource, setDataSource, isRealData } = useDataSource();

// Switch to real data
setDataSource("real");

// Check current state
console.log(isRealData); // true/false
```

## Usage Examples

### **Basic Toggle Usage**

```typescript
import { useDataSource } from "../contexts/DataSourceContext";

function MyComponent() {
  const { dataSource, setDataSource, isRealData } = useDataSource();

  return (
    <div>
      <p>Current source: {dataSource}</p>
      <p>Using real data: {isRealData ? "Yes" : "No"}</p>
      <button onClick={() => setDataSource("real")}>Switch to Real Data</button>
    </div>
  );
}
```

### **API Calls with Data Source**

```typescript
import { useCostApi } from "../api/costApi";

function CostComponent() {
  const { fetchCostData } = useCostApi();

  const loadData = async () => {
    // This automatically uses the selected data source
    const data = await fetchCostData();
    console.log("Data source:", data.data_source);
  };

  return <button onClick={loadData}>Load Cost Data</button>;
}
```

## Benefits

### **For Users**

- **No Restart Required**: Switch data sources instantly
- **Visual Feedback**: Clear indicators of current state
- **Error Handling**: Graceful fallbacks if AWS is unavailable
- **Mobile Friendly**: Responsive design works on all devices

### **For Developers**

- **Type Safety**: Full TypeScript support
- **Centralized State**: Single source of truth for data source
- **Backward Compatible**: Existing code continues to work
- **Easy Testing**: Switch between mock and real data easily

## Integration with Backend

The frontend toggle works seamlessly with your backend's hybrid system:

### **Backend Endpoints**

```
GET /api/cost?source=mock     ← Force mock data
GET /api/cost?source=real     ← Force real AWS data
GET /api/cost                 ← Use backend default
```

### **Environment Override**

```env
# Backend default setting
USE_REAL_DATA=false  # Backend uses mock by default
```

### **Frontend Override**

```typescript
// User clicks "Real" button
setDataSource("real");
// → All API calls get ?source=real parameter
// → Backend ignores USE_REAL_DATA and uses real data
```

## Testing

### **Manual Testing**

1. Start the frontend: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Look for toggle in header
4. Click different buttons and observe:
   - Status indicators change
   - Toast notifications appear
   - API calls use different data sources

### **Component Testing**

```typescript
// Test the toggle component
import { render, screen, fireEvent } from "@testing-library/react";
import DataSourceToggle from "./DataSourceToggle";

test("switches to real data when clicked", () => {
  render(<DataSourceToggle />);
  const realButton = screen.getByText("Real");
  fireEvent.click(realButton);
  // Assert state change
});
```

## Styling

The toggle uses your existing design system:

- **Colors**: Respects theme (light/dark mode)
- **Typography**: Consistent with app fonts
- **Spacing**: Uses design system spacing tokens
- **Animations**: Smooth transitions and hover effects

## Future Enhancements

### **Potential Features**

- **Data Source Analytics**: Show statistics about each data source
- **Persistence**: Remember user's preferred data source
- **Notifications**: Alert when AWS connection is lost
- **Comparison Mode**: Side-by-side mock vs real data
- **Smart Defaults**: Auto-detect best data source based on context

## Summary

The Data Source Toggle transforms your app from a development tool into a **production-ready** application that can:

- **Switch data sources instantly** without restarts
- **Provide clear visual feedback** about current state
- **Handle errors gracefully** when AWS is unavailable
- **Work seamlessly** with your existing backend
- **Scale to production** with real AWS billing data

**Your users can now toggle between mock and real data with a simple click!**
