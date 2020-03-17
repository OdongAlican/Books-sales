document.querySelector(".signBtn").addEventListener("click", signBtn);
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
    const containerLogin = document.querySelector(".containerLogin");

    generalSection.insertBefore(div, containerLogin);

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

function signBtn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = {
    email,
    password
  };

  if (email === "" || password === "") {
    validate.showAlert(
      "Please fill in all fields",
      "alert alert-danger col-md-3 mx-auto"
    );
  } else {
    console.log("hey");
    http
      .post("http://localhost:3000/api/user/login", data)
      .then(data => {
        console.log(data.json());
      })
      .then(data => {
        if (data) {
          alert("logged in");
          redirect: window.location.replace("../index.html");
        } else {
          alert("wrong password or email");
        }
      })
      .catch(err => err);
  }
}
