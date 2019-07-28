function togglePwd(e) {
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
        tablinks[i].classList.remove("active");

    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
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
        tablinks[i].classList.remove("active");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// extra
var $Presents = $('#Presents'),
    $box = $('.box'),
    $PresentB = $('#PresentB'),
    $sIcons = $('.sIcon'),
    $socialLinkP = $('.socialLinkP');

/* Jump Presents */
tlJumpPresent = new TimelineMax({ paused: true });

$box.mouseenter(function() {

    $PresentBox = $(this).find('.PresentBox'),
        $PresentBoxShadow = $(this).find('.PresentBoxShadow');

    tlJumpPresent
        .to($PresentBox, 0.5, { scaleX: 0.8, transformOrigin: "bottom center", y: -20, ease: Power4.easeInOut })
        .to($PresentBox, 0.2, { scaleX: 1, transformOrigin: "bottom center", y: 0, ease: Bounce.easeOut })
        .to($PresentBoxShadow, 0.5, { scaleX: 0.8, transformOrigin: "bottom center", ease: Power4.easeInOut }, "0")
        .to($PresentBoxShadow, 0.2, { scaleX: 1, transformOrigin: "bottom center", ease: Bounce.easeOut }, "0.5");

    tlJumpPresent.play();

});

$box.click(function() {
    event.preventDefault();

    $thisBox = this,
        $PresentBoxRibbon = $(this).find('.PresentBoxRibbon'),
        $PresentBoxTop = $(this).find('.boxTop'),
        $PresentBoxTopShadow = $(this).find('.boxTopShadow'),
        $PresentRibbonSide = $(this).find('.ribbonSide'),
        $socialLinkP = $(this).find('.socialLinkP');

    /* Open Present */
    tlOpenPresent = new TimelineMax({ paused: true });
    tlOpenPresent
        .to($PresentBoxRibbon, 0.4, { yPercent: 252, ease: Power4.easeInOut })
        .to($PresentBoxTop, 0.4, { yPercent: -80, ease: Power4.easeOut }, "0")
        .to($PresentBoxTopShadow, 0.2, { autoAlpha: 0 }, "0")
        .to($PresentRibbonSide, 0.4, { scaleY: 0.3, transformOrigin: "bottom center", onComplete: stopHover, onCompleteParams: [$thisBox] }, "0.2")

    .to($PresentBoxTop, 0.4, { rotation: -90, transformOrigin: "left center", ease: Power4.easeInOut }, "0")
        .to($PresentBoxTop, 0.3, { yPercent: 400, transformOrigin: "left center", ease: Bounce.easeOut }, "0.4")
        .to($PresentBoxTop, 0.4, { rotation: -180, transformOrigin: "left center", ease: Power4.easeIn }, "0.7")
        .to($socialLinkP, 0.6, { scale: 1.4, yPercent: -130, transformOrigin: "top center", ease: Power4.easeInOut }, "-=0.4");

    tlOpenPresent.play();

    function stopHover(element) {
        $(element).unbind('mouseenter click');
        $(element).css('cursor: default');
    }

});