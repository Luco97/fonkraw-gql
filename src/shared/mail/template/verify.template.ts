export const html_template_verify: string = `<div
class="container"
style="
  width: 32rem;
  margin: 0 auto;
  font-family: sans-serif;
  background-color: #ed2553;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
"
>
<header
  class="header"
  style="padding: 3rem; height: 6rem; background-color: #1f1f1f"
>
  <h1 class="title" style="color: #fff; text-align: center">
    Thanks for register on {{ appName }}, {{ username }}
  </h1>
</header>
<div
  class="info"
  style="
    padding: 4rem 2.5rem;
    color: #fff;
    background-color: #1f1f1f;
    display: flex;
    flex-direction: column;
    gap: 15px;
  "
>
  <p class="text" style="font-weight: 600">
    Ya ql verifica tu correo haciendo click en esta wea de link:
  </p>
  <hr style="margin: 1rem 0; border-radius: 10px" />
  <a
    href="{{ domain }}{{ path }}{{ uuid }}"
    class="link"
    style="
      padding: 1.2rem 2.2rem;
      font-weight: 600;
      border-radius: 9px;
      background-color: #ed2553;
      color: #fff;
      transition: all 0.3s;
      text-decoration: none;
      font-size: 1.1rem;
      align-self: center;
    "
    >Activar cuenta</a
  >
</div>
<footer
  class="footer"
  style="padding: 2rem; background-color: #1f1f1f; color: #fff"
>
  <h2>footer cosas</h2>
</footer>
</div>`;

const styles: string = `
/* .container {
    width: 32rem;
    margin: 0 auto;
    font-family: sans-serif;
    background-color: #ed2553;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-sizing: border-box;
  }
  
  .header {
    padding: 3rem;
    height: 6rem;
    background-color: #1f1f1f;
  }
  
  .title {
    color: #fff;
    text-align: center;
  }
  
  .text {
    font-weight: 600;
  }
  
  .info {
    padding: 4rem 2.5rem;
    color: #fff;
    background-color: #1f1f1f;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .link:link,
  .link:visited {
    padding: 1.2rem 2.2rem;
    font-weight: 600;
    border-radius: 9px;
    background-color: #ed2553;
    color: #fff;
    transition: all 0.3s;
    text-decoration: none;
    font-size: 1.1rem;
    align-self: center;
  }
  
  .link:hover,
  .link:active {
    background-color: #ce2149;
  }
  
  .footer {
    padding: 2rem;
    background-color: #1f1f1f;
    color: #fff;
  } */
  `;
