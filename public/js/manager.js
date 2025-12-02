const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

const form = document.getElementById("managerForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");
  const role = document.getElementById("role");

  let valid = true;

  [name, email, phone, password, role].forEach((input) =>
    input.classList.remove("is-invalid")
  );

  if (!name.value) {
    name.classList.add("is-invalid");
    valid = false;
  }
  if (!emailRegex.test(email.value)) {
    email.classList.add("is-invalid");
    valid = false;
  }
  if (!phone.value) {
    phone.classList.add("is-invalid");
    valid = false;
  }
  if (!passwordRegex.test(password.value)) {
    password.classList.add("is-invalid");
    valid = false;
  }
  if (!role.value) {
    role.classList.add("is-invalid");
    valid = false;
  }

  if (valid) {
    alert(`✅ Manager ${name.value} registered successfully!`);
    form.reset();
  } else {
    alert("⚠️ Please fill out the form correctly.");
  }
});
