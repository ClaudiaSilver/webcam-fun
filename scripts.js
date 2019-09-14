const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    // Getting the video and audio from the webcam
    navigator.mediaDevices.getUserMedia({ video: true, audio: false}) // returns a promise
        .then(localMediaStream => {
            console.log(localMediaStream);
            //video.src = window.URL.createObjectURL(localMediaStream);// deprecated since 2018! use below:
            video.srcObject = localMediaStream;
            video.play();
        })
        // if user denies access to webcam:
        .catch(err => {
            console.error(`Oh no!`, err);
        })
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
    }, 16); // every 16 milliseconds
}

function takePhoto() {
    // play the sound:
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    
}

getVideo(); // runs on page load


video.addEventListener('canplay', paintToCanvas); // canplay is emitted by video once it's playing
