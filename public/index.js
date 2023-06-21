
function Animation() {
    let baseHue = 200;
    // One full Hue rotation every 60 seconds
    let intervalTime = (6 / 360) * 1000;
    let animationInterval = null;

    function updateBaseHue() {
        baseHue = (baseHue + 1) % 360;
        document.querySelector(':root').style.setProperty('--base-hue', baseHue);
    }

    function toggleAnimations() {
        console.log('animations paused');
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        } else {
            animationInterval = setInterval(updateBaseHue, intervalTime);
        }
    }

    function isPlaying() {
        return animationInterval !== null;
    }

    return {
        toggleAnimations: toggleAnimations
    }
}

function Settings(animation) {

    function toggleAnimations() {
        animation.toggleAnimations();
        let button = document.getElementsByClassName('toggle-animations-btn')[0];
        button.classList.toggle('is-playing');
    }

    function setHighContrast() {
        console.log('high contrast');
    }

    function toggleMenu() {
        let settings = document.getElementsByClassName('settings')[0];
        settings.classList.toggle('is-open');
    }

    return {
        toggleMenu: toggleMenu,
        setHighContrast: setHighContrast,
        toggleAnimations: toggleAnimations
    }
}

let animation = Animation();
let settings = Settings(animation);

settings.toggleAnimations();