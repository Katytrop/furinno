export function MSIE() {
    const ua = window.navigator.userAgent;
    const isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    function isIE() {
        //ua = navigator.userAgent;
        const is_ie = ua.indexOf("MSIE ") > 1 || ua.indexOf("Trident/") > 1;
        return is_ie;
    }
    if(isIE()) {
        document.querySelector('html').classList.add('ie');
    }
    if(isMobile.any()) {
        document.querySelector('html').classList.add('_touch');
    }
    return isMobile;
}
MSIE();