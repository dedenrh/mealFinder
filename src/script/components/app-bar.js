class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <h2>CariResepMasakan</h2>
    `;
  }
}

customElements.define("app-bar", AppBar);
