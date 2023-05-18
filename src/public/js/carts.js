const socketClient = io();

socketClient.on("cart", data => {
  render(data);
});

function render(data) {
  if (!data) {
    const html = `<h1>Carrito seleccionado sin productos, por favor revise el id o introduzca algun producto 🫱🏽‍🫲🏽</h1>`;
    return (document.getElementById("cart").innerHTML = html);
  }

  const html = data.products
    .map(item => {
      return `<div class="productsCard">
      <h3>${item.product.title}</h3>
      <img src="${item.product.thumbnail}" />
      <h4>Precio: ${item.product.price}</h4>
      <h5>Cantidad: ${item.quantity}</h5>
    </div>
      `;
    })
    .join(" ");
  document.getElementById("cart").innerHTML = html;
}

function searchCart() {
  const cartsId = document.getElementById("cartsId").value;
  socketClient.emit("cart", cartsId);
  const form = document.getElementById("searchCart");
  form.reset();
}
