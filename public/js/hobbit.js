$(function(){
    $(window).on('load resize', adjustIframe)
})
  
function adjustIframe() {
$(parent.document.getElementById("responsive-iframe")).css("height", $("html").css("height"));
}

$(document).ready(() => {
    adjustIframe()
})