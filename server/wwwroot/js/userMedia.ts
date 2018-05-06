
const onFailSoHard = () => {
    alert("Cannot get access to AUDIO");
};

const CHECK_USER_MEDIA = () => {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: true }, function () {}, onFailSoHard);
    } else if ((navigator as any).webkitGetUserMedia) {
        (navigator as any).webkitGetUserMedia("audio", function () {}, onFailSoHard);
    } else {
        alert("User media does not support");
    }
};

export default CHECK_USER_MEDIA;