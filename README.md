# vuejs-training

# Employee Management System (Vue 3)

## Features

### 1. Authentication

### 2. Employee management, which includes:

### + View employee list

### + View employee detail

### + Edit employee's information

### 3. User can view and edit profile information

### 4. Role-based structure (admin / user pages)

### 5. Reusable UI components (Loading, Error state)

### 6. Centralized state management (Pinia stores)

### 7. Modular API layer (Axios services)

### 8. Clean layout separation (AuthLayout / MainLayout)

## Technologies used

### Front-end: Vue 3

### State Management: Pinia

### Routing: Vue Router

### HTTP Client: Axios

### Styling: Ant-design framework

### Build Tool: Vite

## Project structure

```
src/
├── api/ # API layer (Axios services)
│ ├── clientApi.js # Shared API configuration
│ ├── authApi.js # Authentication APIs
│ └── employeeApi.js # Employee APIs
│
├── assets/
│ └── images/ # Static images
│
├── components/
│ ├── common/ # Reusable components
│ │ ├── AppLoading.vue
│ │ └── ErrorResult.vue
│ │
│ └── employee/ # Employee-related components
│ └── EmployeeTable.vue
│
├── layouts/ # Page layouts
│ ├── AuthLayout.vue # Layout for authentication pages
│ └── MainLayout.vue # Main layout (Sidebar, Header)
│
├── pages/
│ ├── auth/
│ │ └── LoginPage.vue
│ │
│ ├── system/
│ │ └── NotFound.vue
│ │
│ ├── admin/
│ │ └── AdminDashboard.vue
│ │
│ ├── employee/
│ │ ├── EmployeeList.vue
│ │ └── EmployeeDetail.vue
│ │
│ └── user/
│ └── UserProfile.vue
│
├── router/
│ └── index.js # Vue Router configuration
│
├── stores/ # Pinia stores
│ ├── UIStore.js # UI state
│ ├── auth.js # Authentication state
│ └── employee.js # Employee state
```

## Installation and Setup

### 1. Clone the repository

```
git clone https://github.com/rk-huynhdd/vuejs-training.git

```

### 2. Install dependencies

```
npm install
```

### 3. Run the project

```
npm run dev
```

### open browser and go to

```
ttp://localhost:5173
```
