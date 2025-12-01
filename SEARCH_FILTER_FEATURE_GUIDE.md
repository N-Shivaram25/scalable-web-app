# Projects Search & Filter Feature Guide

## UI Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  TOPBAR                                                              │
├────────────────────────────────────────┬──────────────────────────────┤
│  Search Projects... [Search Box]       │ [Filter] [Sort] [Notifications]│
│  ┌──────────────────┐                  │                               │
│  │ All statuses ▼   │                  │ Profile Avatar │ User Name    │
│  └──────────────────┘                  │                               │
│  ┌──────────────────┐                  │                               │
│  │ Sort: Recent ▼   │                  │                               │
│  └──────────────────┘                  │                               │
└─────────────────────────────────────────┴──────────────────────────────┘
```

## Feature Implementation

### 1. Search Bar
- **Location:** Dashboard top-left
- **Functionality:** Real-time search as user types
- **Searches:** Project name field
- **State:** `search` variable
- **Code:**
```jsx
<input
  placeholder="Search projects..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page
  }}
/>
```

### 2. Status Filter Dropdown
- **Label:** "All statuses"
- **Options:** 
  - All
  - New
  - Active
  - Review
  - Staging
  - Closed
- **State:** `statusFilter` variable
- **Code:**
```jsx
<select 
  value={statusFilter} 
  onChange={(e) => { 
    setStatusFilter(e.target.value); 
    setPage(1); 
  }}
>
  <option value="all">All statuses</option>
  <option value="new">New</option>
  <option value="active">Active</option>
  <option value="review">Review</option>
  <option value="staging">Staging</option>
  <option value="closed">Closed</option>
</select>
```

### 3. Sort Dropdown
- **Label:** "Sort:"
- **Options:**
  - Recent (sorted by updated date, newest first)
  - Name (alphabetical sort)
- **State:** `sortBy` variable
- **Code:**
```jsx
<select 
  value={sortBy} 
  onChange={(e) => setSortBy(e.target.value)}
>
  <option value="updated">Sort: Recent</option>
  <option value="name">Sort: Name</option>
</select>
```

### 4. Filtering Logic (Backend-style filtering on frontend)
```jsx
const filtered = items
  // Search by name
  .filter((it) => 
    it.name.toLowerCase().includes(search.toLowerCase())
  )
  // Filter by status
  .filter((it) => 
    statusFilter === "all" 
      ? true 
      : it.status.toLowerCase() === statusFilter.toLowerCase()
  )
  // Sort
  .sort((a, b) => {
    if (sortBy === "name") 
      return a.name.localeCompare(b.name);
    return new Date(b.updatedAt || b.updated) - 
           new Date(a.updatedAt || a.updated);
  });
```

### 5. Pagination
- **Items per page:** 6
- **Shows:** "Page X / Y" indicator
- **Navigation:** Prev/Next buttons
- **Code:**
```jsx
const PAGE_SIZE = 6;
const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
const pageItems = filtered.slice(
  (page - 1) * PAGE_SIZE, 
  page * PAGE_SIZE
);
```

### 6. Result Count
- **Display:** "Showing {filtered.length} results"
- **Updates:** In real-time as filters change
- **Code:**
```jsx
<div className="table-topbar">
  <div className="muted">
    Showing {filtered.length} results
  </div>
</div>
```

## Interaction Flow

### User Types in Search
```
User inputs: "react"
  ↓
search state updates to "react"
  ↓
filtered array recomputes
  ↓
Only projects with "react" in name display
  ↓
pageItems recalculate
  ↓
Table updates automatically
```

### User Changes Status Filter
```
User selects: "Active"
  ↓
statusFilter state updates
  ↓
page resets to 1
  ↓
filtered array recomputes
  ↓
Only "Active" projects display
  ↓
Result count updates
  ↓
pageItems recalculate
  ↓
Table updates
```

### User Changes Sort
```
User selects: "Name"
  ↓
sortBy state updates
  ↓
filtered array re-sorts alphabetically
  ↓
pageItems recalculate
  ↓
Table order changes
```

### User Changes Page
```
User clicks: "Next"
  ↓
page state increments
  ↓
pageItems slice recalculates
  ↓
Table shows next 6 items
  ↓
Pagination buttons update disabled state
```

## Styling

### Container Structure
```css
.search {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search input {
  width: 420px;
  max-width: calc(100% - 260px);
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(15,23,42,0.06);
  background: white;
}

.search .filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(15,23,42,0.06);
  background: white;
}
```

## Table Display

### Columns
| Name | Owner | Status | Updated | Action |
|------|-------|--------|---------|--------|
| Project name | User who owns | Badge | Last updated date | Edit/Delete |

### Status Badges
```css
.badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: white;
  display: inline-block;
}

.badge.new { background: #64748b; }
.badge.active { background: #2563eb; }
.badge.review { background: #f59e0b; }
.badge.staging { background: #06b6d4; }
.badge.closed { background: #ef4444; }
```

## Mobile Responsiveness

The search input and filters stack vertically on smaller screens:
```css
@media (max-width: 768px) {
  .search {
    flex-direction: column;
    width: 100%;
  }
  
  .search input {
    width: 100%;
    max-width: 100%;
  }
  
  .search .filters {
    width: 100%;
    flex-wrap: wrap;
  }
}
```

## Performance Optimization

1. **Search is debounced implicitly** - React's state updates naturally batch
2. **Filtering happens on UI side** - No network requests for each keystroke
3. **Pagination prevents rendering large lists** - Only shows 6 items at a time
4. **Memoization ready** - Can add `useMemo` for computed filtered arrays if needed

## Example Scenarios

### Scenario 1: Find all "Active" projects
1. User selects "Active" from Status filter dropdown
2. Search box remains empty
3. Sort is set to "Recent"
4. Result: Shows Active projects sorted by most recently updated

### Scenario 2: Search for specific project by name
1. User types "landing-page" in search box
2. Status filter remains "All statuses"
3. Projects are filtered by name matching
4. Result: Shows only projects with "landing-page" in the name

### Scenario 3: Find older completed projects
1. User selects "Closed" from Status filter
2. User selects "Sort: Name" from sort dropdown
3. Projects filtered by "Closed" and sorted alphabetically
4. Result: Shows completed projects in alphabetical order

## States Involved

```javascript
const [search, setSearch] = useState("");           // Search query
const [statusFilter, setStatusFilter] = useState("all"); // Status filter
const [sortBy, setSortBy] = useState("updated");   // Sort field
const [page, setPage] = useState(1);               // Current page
const [items, setItems] = useState([]);            // All projects from API

// Computed values
const filtered = items
  .filter(by search)
  .filter(by status)
  .sort(by selected order);

const totalPages = Math.ceil(filtered.length / 6);
const pageItems = filtered.slice((page-1)*6, page*6);
```

## Backend Integration

**API Endpoint:** `GET /api/projects`
- Returns all projects for the authenticated user
- Filtered, sorted, and paginated on the frontend
- No backend search/filter logic needed
- User isolation handled by userId in backend

**Authentication:** 
- Requires `Authorization: Bearer {token}` header
- Token validated by auth middleware
- Returns only user's own projects
