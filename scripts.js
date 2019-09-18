const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

console.log(strip);

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
        // take the pixels out
        let pixels = ctx.getImageData(0,0, width, height);
        // mess with them
        //pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);
        //ctx.globalAlpha = 0.1; // sets the alpha(i.e. transparency value)
        //pixels = greenScreen(pixels);
        // put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16); // every 16 milliseconds
}

function takePhoto() {
    // play the sound:
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas and create download link
    const data = canvas.toDataURL('image/jpeg'); // returns base 64 text-based representation of the picture
    const link = document.createElement('a'); // backticks don't work here
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Fartface" />`
    // link.textContent = 'Download Image';
    strip.insertBefore(link, strip.firstChild);   
}

function redEffect(pixels) {
    // loop over every single pixel:
    for(let i = 0; i < pixels.data.length; i += 4) { //increment by 4 because of the 4 RGBA values which repeat in groups of 4
        pixels.data[i] = pixels.data[i] + 200; // red channel
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // green channel
        pixels.data[i + 2] =  pixels.data[i + 2] * 0.5; // blue channel
    }
    return pixels;
}
// this effect pulls apart the reds, greens and blues of the image
function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) { //increment by 4 because of the 4 RGBA values which repeat in groups of 4
        pixels.data[i - 150] = pixels.data[i]; // red channel
        pixels.data[i + 100] = pixels.data[i + 1]; // green channel
        pixels.data[i - 150] =  pixels.data[i + 2]; // blue channel
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {}; // holds min and max green (to be replaced by background etc.)

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.nodeValue;
    });
    //  loop over every pixel
    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin 
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            // take out alpha (otherwise it would be totally transparent)
            pixels.data[i + 3] = 0;
            } 
             
    }
    return pixels;
}


getVideo(); // runs on page load


video.addEventListener('canplay', paintToCanvas); // canplay is emitted by video once it's playing
