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

                    //local storage and save
                    localStorage.setItem('token', data.token);
                    console.log(`Token received and stored: ${data.token}`);
                

                    console.log(`Logged in with mail ${data.email}`);


                } else {
                    alert('Login failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    });
}

export function addEventListenerDelete(container){
    container.querySelector("#deleteUserButton").addEventListener("click", async function(event) {
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
            console.log("User deleted:", userId);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    });
}



