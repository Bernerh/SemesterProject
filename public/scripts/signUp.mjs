export function addEventListenerSignUp() {
    const signupForm = document.querySelector("#signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const formData = new FormData(this);
            const data = {
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password")
            };

            fetch("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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
                alert("Account successfully created!");
               
            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation:", error);
                alert(`Failed to create account: ${error.message}`);

            });
        });
    }
}
