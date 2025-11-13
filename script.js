function saludar() {
  fetch('/api/saludo')
    .then(res => res.json())
    .then(data => alert(data.mensaje));
}
