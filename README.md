# 🚀 About This Project

This repository contains the **frontend code** for Gardner Academy’s ERP system, with a focus on the development and documentation of the **payrolls** and **calendar** modules.

---

## 📁 Project Structure

### 📡 Services

The `services` directory contains the necessary services to consume the [API-Payroll](https://github.com/Tureright/API-Payrolls). First, you need to obtain the general endpoint provided by Google Apps Script to access a web application deployed on its platform. The URL provided by Google Apps Script looks like this:

```ts
https://script.google.com/macros/s/...
```

Afterwards, this endpoint must be modified to access the functions implemented in the API-Payroll.

For GET requests, actions and parameters can be appended to the end of the URL:

```ts
export async function getAllEmployees() {
  const res = await fetch(`${API_URL_EMP}?action=getAllEmployees`);
  return handleResponse(res);
}
```

On the other hand, for POST requests, actions and parameters must be sent inside the request body:

```ts
export async function createEmployee(employeeData: any) {
  const res = await fetch(
    API_URL_EMP,
    defaultPostOpts({ action: "createEmployee", employeeData })
  );
  return handleResponse(res);
}
```

---

### 🧠 Custom Hooks

The `hooks` directory contains custom hooks designed to manage the data obtained through the services exposed by the [API-Payroll](https://github.com/Tureright/API-Payrolls). These hooks are implemented using the TanStack React Query library, which simplifies data management in React applications by automatically handling states (`loading`, `success`, `error`), caching, refetching, and synchronizing data between client and server.

Thanks to this integration, components can consume API services declaratively, without worrying about repetitive HTTP request logic or state management.

For example, the following `useEmployees` hook fetches the employee list from the backend using `useQuery`. It is given a unique query key `"employees"` to identify the query, and a query function `getAllEmployees` responsible for making the server request:

```ts
export function useEmployees() {
  return useQuery({ queryKey: ["employees"], queryFn: getAllEmployees });
}
```

By using `useEmployees` inside a component, you gain direct access to the data (`data`), loading state (`isLoading`), errors (`error`), and helper functions like `refetch`, all efficiently managed by React Query.

---

### 🎨 Interfaces

The system’s interfaces were developed based on previously designed prototypes in Figma. You can access the prototype via the following link: [Prototype Link](https://www.figma.com/proto/Xj2fuzCF88ieMJCUBITzUB/Wireframes-DTIC?page-id=0%3A1&node-id=1-97&p=f&viewport=101%2C538%2C0.18&t=xUDkH9xECF4jqyf1-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A97).

**Features:**

* 🧬 **Atomic Design Approach**: A partial atomic design approach was adopted, implementing only atoms, molecules, and full pages due to the project’s limited scope.

* 💅 **Tailwind CSS**: This framework was used for styling components, along with a small design system defining typography, font sizes, spacing, colors, and borders.

---

### 🧭 `routes.js`

This file defines the main routes of the application, specifying the URL, associated component, visibility in the menu (`showInMenu`), and the organizational units (`allowedOUs`) authorized to access each view.

Each route corresponds to a functional section of the system, such as payroll roles, enrollment, or calendar management.

Example of a route configuration:

```js
{
  title: "Payroll Roles",
  url: "/payrolls",
  component: Payrolls,
  showInMenu: true,
  allowedOUs: ["/Management", "/Development", "/System Manager"]
}
```

This centralized approach facilitates navigation and authorization management, making the system scalable and maintainable.

---

### 🧩 `App.jsx`

The `App.jsx` file defines the main routing structure using `react-router-dom`. It sets up the routes that render different functional modules of the application, such as payroll roles, billing, enrollment, reports, calendars, and teacher profiles.

This component organizes internal navigation via the `<Router>` component and dynamically renders views based on the user’s permitted modules. It also manages shared elements like the navigation bar (`<Navbar />`) and the global notification system (`<Toaster />`).

All routes are contained within the `AppRoutes` component, which loads initial user data and displays an appropriate interface based on the user’s context within the system.

---

### 📌 `Navbar.jsx`

The `Navbar` component is responsible for rendering the app’s sidebar navigation menu. This menu is generated dynamically from the routes defined in `routes.js`, showing only those marked with `showInMenu: true`.

Additionally, it applies an `"active"` class to the current route to visually highlight the user’s current page. The institutional logo is also displayed at the top of the menu.

The list of visible routes is filtered according to the user’s information (`userData`) and the authorized organizational units (`allowedOUs`) defined for each route, allowing the menu to adapt flexibly to the user’s profile.

---

## 🔐 Authentication and Authorization

The ERP system is built as a web application deployed on Google Apps Script within an organization’s Google Workspace. Therefore, accessing the app’s features requires proper authentication with an email address belonging to one of the organizational units in the organization’s Admin Directory.

Only authorized users can access protected views within the system.
