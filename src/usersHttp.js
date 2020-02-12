document.querySelector(".createBtn").addEventListener("click", createUser);
class UserHTTP {
  async post(url, data) {
    const response = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const resData = await response.json();
    return resData;
  }
}

class Validator {
  showAlert(massage, className) {
    this.clearAlert();
    const div = document.createElement("div");
    div.className = className;
    div.appendChild(document.createTextNode(massage));
    const generalSection = document.querySelector(".generalSection");
    const containerSign = document.querySelector(".containerSign");

    generalSection.insertBefore(div, containerSign);

    setTimeout(() => {
      this.clearAlert();
    }, 2000);
  }

  clearAlert() {
    const currentAlert = document.querySelector(".alert");

    if (currentAlert) {
      currentAlert.remove();
    }
  }
}

const validate = new Validator();
const http = new UserHTTP();
function createUser(event) {
  event.preventDefault();
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("Password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const data = {
    firstName,
    lastName,
    email,
    password
  };

  if (
    firstName === "" ||
    lastName === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    validate.showAlert(
      "Please fill in all fields",
      "alert alert-danger col-md-3 mx-auto"
    );
  } else if (confirmPassword !== password) {
    validate.showAlert(
      "Passwords do not match",
      "alert alert-danger col-md-3 mx-auto"
    );
  } else {
    http
      .post("http://localhost:3000/api/user/createUser", data)
      .then(data => {
        validate.showAlert(
          "User succesfully Added",
          "alert alert-primary col-md-3 mx-auto"
        );
      })
      .catch(err => console.log(err));
  }
}
