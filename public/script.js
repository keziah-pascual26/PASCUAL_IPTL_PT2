document.addEventListener('DOMContentLoaded', () => {
    loadStudents();

    const toggleButton = document.getElementById('toggle-student-list');
    const studentListContainer = document.getElementById('student-list-container');
    const addStudentButton = document.getElementById('add-student-btn'); // Add student button

    toggleButton.addEventListener('click', () => {
        if (studentListContainer.style.display === 'none') {
            studentListContainer.style.display = 'block';
            toggleButton.textContent = 'Hide Student List';
        } else {
            studentListContainer.style.display = 'none';
            toggleButton.textContent = 'Show Student List';
        }
    });

    document.getElementById('student-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('Form submitted');

        const formData = new FormData();
        formData.append('studentNumber', document.getElementById('studentNumber').value);
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('photo', document.getElementById('photo').files[0]);
        formData.append('gender', document.getElementById('gender').value);
        formData.append('address', document.getElementById('address').value);
        formData.append('contact', document.getElementById('contact').value);

        try {
            const response = await fetch('http://127.0.0.1:5000/students', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                return;
            }

            console.log("Student added successfully");
            document.getElementById('student-form').reset();
            loadStudents();
        } catch (error) {
            console.error("Fetch error:", error);
        }
    });
});

// Function to load students from the database
async function loadStudents() {
    try {
        const response = await fetch('http://127.0.0.1:5000/students');
        if (!response.ok) throw new Error("Failed to fetch students");

        const students = await response.json();
        const studentList = document.getElementById('student-list');

        studentList.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.studentNumber}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.gender}</td>
                <td>${student.address}</td>
                <td>${student.contact}</td>
                <td><img src="${student.photo}" width="80" height="80" style="border-radius: 5px;"></td>
                <td>
                    <button onclick="editStudent('${student._id}', '${student.studentNumber}', '${student.name}', '${student.email}', '${student.gender}', '${student.address}', '${student.contact}', '${student.photo}')">Edit</button>
                    <button onclick="deleteStudent('${student._id}')">Delete</button>
                </td>
            `;
            studentList.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading students:", error);
    }
}

// Function to delete a student
async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            await fetch(`http://127.0.0.1:5000/students/${id}`, { method: 'DELETE' });
            loadStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }
}

// Function to edit a student
function editStudent(id, studentNumber, name, email, gender, address, contact, photo) {
    // Fill form fields with existing data
    document.getElementById('studentNumber').value = studentNumber;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('gender').value = gender;
    document.getElementById('address').value = address;
    document.getElementById('contact').value = contact;

    // Disable Add Student button and change its style
    const addStudentButton = document.getElementById('add-student-btn');
    addStudentButton.disabled = true;
    addStudentButton.style.backgroundColor = 'gray';
    addStudentButton.style.color = 'white';

    // Remove previous update and cancel buttons if they exist
    let buttonContainer = document.getElementById('form-button-container');
    if (buttonContainer) buttonContainer.remove();

    // Create a container for buttons
    buttonContainer = document.createElement('div');
    buttonContainer.id = 'form-button-container';
    buttonContainer.className = 'form-buttons';

    // Create update button
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Student';
    updateButton.id = 'update-student-btn';
    updateButton.onclick = async () => {
        const formData = new FormData();
        formData.append('studentNumber', document.getElementById('studentNumber').value);
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('photo', document.getElementById('photo').files[0]);
        formData.append('gender', document.getElementById('gender').value);
        formData.append('address', document.getElementById('address').value);
        formData.append('contact', document.getElementById('contact').value);

        try {
            await fetch(`http://127.0.0.1:5000/students/${id}`, {
                method: 'PUT',
                body: formData
            });

            resetForm(); // Clear form and re-enable Add button
            loadStudents();
        } catch (error) {
            console.error("Error updating student:", error);
        }
    };

    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.id = 'cancel-edit-btn';
    cancelButton.onclick = resetForm;

    // Append buttons to the container
    buttonContainer.appendChild(updateButton);
    buttonContainer.appendChild(cancelButton);

    // Append the button container below the form
    document.getElementById('student-form').appendChild(buttonContainer);
}

// Function to reset the form and re-enable the Add Student button
function resetForm() {
    document.getElementById('student-form').reset();

    // Enable Add Student button and restore its original style
    const addStudentButton = document.getElementById('add-student-btn');
    addStudentButton.disabled = false;
    addStudentButton.style.backgroundColor = ''; // Restore default
    addStudentButton.style.color = '';

    // Remove update and cancel buttons
    let buttonContainer = document.getElementById('form-button-container');
    if (buttonContainer) buttonContainer.remove();
}


