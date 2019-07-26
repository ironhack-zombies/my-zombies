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

function checkConfirmPassword() {
    if (!document.getElementById('password').value || !document.getElementById('password_conf').value) return;
    if (document.getElementById('password').value ==
        document.getElementById('password_conf').value) {
        document.getElementById('password').classList.remove("notMatching");
        document.getElementById('password_conf').classList.remove("notMatching");
        document.getElementById('registerBtn').removeAttribute("disabled");
    } else {
        document.getElementById('passwordConfMessage').classList.remove("hidden");
        document.getElementById('registerBtn').setAttribute("disabled", "");
        document.getElementById('password').classList.add("notMatching");
        document.getElementById('password_conf').classList.add("notMatching");
    }
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// document.getElementById("defaultOpen").click();

window.onload = strap;