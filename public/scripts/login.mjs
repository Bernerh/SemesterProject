export function addEventListenerLogin(container) {
    container.querySelector("#loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const loggedInMessage = document.createElement('p');
                    loggedInMessage.textContent = `Logged in with mail ${data.email}`;
                    container.appendChild(loggedInMessage);
                    localStorage.setItem('token', data.token);
                } else {
                    alert('Login failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}

export function addEventListenerDelete(container) {
    container.querySelector("#deleteUserButton").addEventListener("click", async function (event) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("/users", {
                method: "DELETE",
                headers: {
                    authorization: token,
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    });
}

export function addEventListenerEdit(container) {
    const editForm = container.querySelector("#editUserForm");
    
        editForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const token = localStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to edit your account.");
                return;
            }

            const formData = new FormData(this);
            const data = {
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password") || undefined
            };

            fetch(`/users`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: token,
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text || "Network response was not ok"); });
                }
                return response.json();
            })
            .then(() => {
                alert("Account successfully updated!");
            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation:", error);
                alert(`Failed to update account: ${error.message}`);
            });
        });
}
