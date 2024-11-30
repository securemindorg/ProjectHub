# Welcome to ProjectHub! 

**ProjectHub** is a lightweight and intuitive project management app designed to help you organize your tasks, notes, and projects—all while keeping your data private and stored locally on your device.

With **ProjectHub**, you can:
- Manage hierarchical project structures.
- Track tasks using To-Do lists.
- Maintain rich, Markdown-enabled notes.
- Handle role-based user management with an easy-to-use admin panel.
- Switch seamlessly between light and dark modes.
- Customize local data storage paths for each project without relying on cloud storage.

Whether you're managing personal tasks or collaborating with a team, ProjectHub provides a seamless, secure, and user-friendly experience. Get started today to structure your workflow like never before!

![image](https://github.com/user-attachments/assets/5ff45ff7-c3eb-4cdc-8ba6-c3ab247d2252)


---

## Key Features

- **Task Management**: Add, edit, delete, and mark tasks as complete.
- **Note-Taking**: Create, edit, and organize notes with Markdown support.
- **Projects**: Create, rename, delete, and configure storage directories for projects.
- **User Management**: Register, manage roles (Admin/User), and delete users from the admin panel.
- **Customizable Storage**: Configure a data storage directory for each project.
- **Dark Mode**: Switch between light and dark themes.
- **Admin Panel**: Manage users, projects, and storage paths with ease.
- **Local Storage**: Keep all your data secure and private, stored locally on your device.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/projecthub.git
   cd projecthub```
   
2. Install dependencies:

``` npm install ```

3. Start the development server:

```npm run dev```

4. Open the app in your browser at http://localhost:5173

## Getting Started

#### Initial Setup

1. On the first launch, you'll be prompted to set up the data storage directory and register an **Admin User**.
   - Enter the desired data storage path.
   - Provide a username and password for the admin account.

2. Login with the newly created admin credentials.

3. Start managing your projects, tasks, and notes!

---

## Docker Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/projecthub.git
   cd projecthub```

2. Build the container:

   ``` sudo docker build -f Dockerfile.dev -t projecthub-main:latest . ```

3. Run the container:

   ``` sudo docker run -d -it --rm -p 3000:3000 -p 5173:5173 --name ProjectHub --network=host -v /home/user/data:/app/data projecthub-main:latest ```

   you can set the data directory location to be whatever you want during the initial setup in the web interface

5. Open the app in your browser at http://localhost:5173


https://github.com/user-attachments/assets/06d0660c-857f-43b3-adca-df27f897c134
   
---

## Usage Guide

### Dashboard
- View all projects and tasks at a glance.
- Use the sidebar to switch between projects or access the admin panel.

### Admin Panel
- **Add New Users**:
  1. Enter a username and password in the provided fields.
  2. Click **Add User**.
- **Toggle Admin Roles**:
  - Click the shield icon next to a user's name to toggle their admin status.
- **Delete Users**:
  - Click the trash icon next to a user's name. A confirmation prompt will appear.
- **Manage Project Storage Directories**:
  1. Click the folder icon next to the project name.
  2. Use the directory browser to select or update the project's storage path.

### Managing Projects
- **Add New Project**: Use the "New Project" button in the sidebar to create a project.
- **Rename Project**: Click on a project's name in the dashboard or project view to rename it.
- **Delete Project**: Use the trash icon in the admin panel to delete a project. Confirm the action when prompted.

### Task Management
- Add tasks to any project using the input field in the project view.
- Mark tasks as complete by checking the associated checkbox.
- Edit or delete tasks using the edit or trash icons next to the task name.

### Note-Taking
- Add notes to projects using the Markdown editor in the project view.
- Edit notes directly by clicking into the note's text area.
- Delete notes using the trash icon associated with each note.

---

## Advanced Features

### Storage Settings
1. Projects can optionally have a designated storage directory for local data.
2. To configure storage paths for a project:
   - Navigate to the admin panel.
   - Click the folder icon next to the desired project.
   - Use the directory browser to select or update the directory.
   - Save the changes to finalize the configuration.

3. Storage paths allow data like notes and tasks to persist locally for each project.

### Role-Based Access
- **Admin Users**:
  - Have full access to manage users, projects, and storage settings.
- **Regular Users**:
  - Limited to managing only their assigned projects.

---

## Current Development Roadmap

### Completed
- ✅ Task and note management
- ✅ Project creation, renaming, and deletion
- ✅ Markdown editor
- ✅ Admin panel with user and project management
- ✅ Dark mode
- ✅ Project-specific storage configuration
- ✅ User authentication and role-based access

### Upcoming Features
- 📱 Mobile-friendly interface
- ⛓ Hierarchical project organization
- 🕒 Timestamps for tasks and notes
- 📊 Dashboard improvements for sorting and filtering tasks

Contributing
We welcome contributions! Here's how you can get involved:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
```git checkout -b feature-name```
3. Commit your changes and push to your fork:
```git commit -m "Add new feature"```
```git push origin feature-name```
4. Create a pull request, and we'll review your changes!
 
## Disclaimer
This application has not undergone any formal security testing and is not intended for use in production environments. It is provided as-is, without any warranties or guarantees of functionality, reliability, or security.

By using this software, you acknowledge that it is still in development and accept any risks associated with its use. Contributions and feedback are welcome to improve the project.
