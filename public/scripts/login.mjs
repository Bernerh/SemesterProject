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
                    document.body.insertBefore(loggedInMessage, document.body.firstChild);
                    // local storage her og save

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
