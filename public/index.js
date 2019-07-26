function strap() {
    let togglePwd = document.getElementsByClassName("togglePwd");
    if (togglePwd && togglePwd.length > 0) togglePwd[0].addEventListener("click", e => {
        let icon = e.currentTarget.childNodes[0];
        //e.currentTarget.classList.toggle("btn-secondary")
        icon.classList.toggle("fa-eye")
        icon.classList.toggle("fa-eye-slash")
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

function checkRegisterForm() {
    let valid = true;
    if (document.getElementById('password').value && document.getElementById('password_conf').value) {
        if (document.getElementById('password').value ==
            document.getElementById('password_conf').value) {
            document.getElementById('password').classList.remove("notValid");
            document.getElementById('password_conf').classList.remove("notValid");
        } else {
            document.getElementById('password').classList.add("notValid");
            document.getElementById('password_conf').classList.add("notValid");
        }
    } else {
        valid = false;
    }

    if (!document.getElementById('registerEmail').value) {
        valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(document.getElementById('registerEmail').value)) {
        valid = false;
        document.getElementById('registerEmail').classList.add("notValid");
    } else {
        document.getElementById('registerEmail').classList.remove("notValid");
    }

    if (!document.getElementById('registerUsername').value) {
        valid = false;
    } else {
        // @Todo username taken validation
    }

    if (valid) {
        document.getElementById('registerBtn').removeAttribute("disabled");
    } else {
        document.getElementById('registerBtn').setAttribute("disabled", "");
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

function openTab1(evt, tabName) {
    var i, tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent1");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks1");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

window.onload = strap;