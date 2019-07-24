function strap() {
  let checkboxes = document.getElementsByClassName("togglePwd");
  if (checkboxes && checkboxes.length > 0) checkboxes[0].addEventListener("click", e => {
    e.currentTarget.classList.toggle("fa-eye")
    e.currentTarget.classList.toggle("fa-eye-slash")
    let pwd = document.getElementById("password");
    if (pwd) {
      switch (pwd.getAttribute("type")) {
        case "password":
          pwd.setAttribute("type", "text")
          break;
        case "text":
          pwd.setAttribute("type", "password")
          break;
      }
    }
  })
}






window.onload = strap;