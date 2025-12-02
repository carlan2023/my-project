// const form = document.getElementById("stockForm");

// form.addEventListener("submit", function (e) {
//   e.preventDefault();

//   const productName = document.getElementById("productName");
//   const category = document.getElementById("category");
//   const quantity = document.getElementById("quantity");
//   const price = document.getElementById("price");
//   const image = document.getElementById("image");

//   let valid = true;

//   [productName, category, quantity, price, image].forEach((input) =>
//     input.classList.remove("is-invalid")
//   );

//   if (!productName.value) {
//     productName.classList.add("is-invalid");
//     valid = false;
//   }
//   if (!category.value) {
//     category.classList.add("is-invalid");
//     valid = false;
//   }
//   if (quantity.value < 1) {
//     quantity.classList.add("is-invalid");
//     valid = false;
//   }
//   if (price.value < 100) {
//     price.classList.add("is-invalid");
//     valid = false;
//   }
//   if (!image.value) {
//     image.classList.add("is-invalid");
//     valid = false;
//   }

//   if (valid) {
//     alert(
//       `✅ ${quantity.value} x ${productName.value} added to inventory at UGX ${price.value} each.`
//     );
//     form.reset();
//   } else {
//     alert("⚠️ Please fill out the form correctly.");
//   }
// });
