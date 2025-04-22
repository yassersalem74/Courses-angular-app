
# Course Management Application

This is an **Angular-based** web application designed to manage **courses** and **subcourses**. The application uses **PrimeNG** components and **Angular dialog services** to provide an interactive user experience for adding and editing course details.

## Features

- **Course Management**: Allows users to create, edit, and delete courses.
- **Subcourse Management**: Enables users to create and manage subcourses under each course.
- **PrimeNG Integration**: Utilizes PrimeNG components such as calendars, dialogs, and form controls for a rich UI.
- **Dynamic Dialog Forms**: Utilizes Angular dialog services to manage dynamic forms for adding or editing courses and subcourses.

## Technologies Used

- **Angular**: A platform and framework for building client-side applications with TypeScript.
- **PrimeNG**: A set of rich UI components for Angular.



### Installing Dependencies

Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/course-management-app.git
```

Navigate to the project directory and install the dependencies:

```bash
cd course-management-app
npm install
```

### Running the Application

To start the development server, run:

```bash
ng serve
```

This will compile the application and make it available at `http://localhost:4200/`.

## Usage

1. **Add a Course**: Click the "Add Course" button to open a dialog form where you can enter course details.
2. **Add a Subcourse**: After selecting a course, click the "Add Subcourse" button to open a dynamic form for adding subcourse details.
3. **Edit/Delete**: Each course and subcourse has options to edit or delete it.

## Development

### Folder Structure

The folder structure is organized as follows:

- **`src/app/components`**: Contains reusable components.
- **`src/app/services`**: Contains services for managing courses and subcourses.
- **`src/app/models`**: Contains TypeScript models for Course and Subcourse.

### Components and Dialogs

The application utilizes **Angular dialogs** for dynamic forms. The course and subcourse dialogs are configured to be opened based on user actions, allowing for smooth data entry and editing.

### PrimeNG Integration

PrimeNG components such as `p-calendar`, `p-dialog`, and `p-inputText` are used to create an intuitive interface. These components are configured in the Angular module and are styled using the default PrimeNG themes.

## Contributing

Feel free to fork the repository and submit pull requests. When contributing, please ensure that your code follows the **Angular style guide** and that **tests** are written for new features.

### Steps for Contributing:

1. **Fork** the repository.
2. **Create a new branch** for your feature or bug fix.
3. **Write unit tests** if applicable.
4. **Submit a pull request** with a detailed description of your changes.

