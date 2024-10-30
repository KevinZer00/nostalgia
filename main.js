const canvas = document.getElementById('tv-screen');
const ctx = canvas.getContext('2d');

// canvas dimensions
const width = canvas.width;
const height = canvas.height;

// load GIF 
const gif1 = document.getElementById('gif1');
const gif2 = document.getElementById('gif2');
const gif3 = document.getElementById('gif3');
const gif4 = document.getElementById('gif4');

// load audio clips
const tvPowerOn = document.getElementById('tv-power-on');
const audio1 = document.getElementById('audio1');
const audio2 = document.getElementById('audio2');
const audio3 = document.getElementById('audio3');
const audio4 = document.getElementById('audio4');
const audio5 = document.getElementById('audio5');

// power button state
let tvIsOn = false;

// wait for user to click power button to turn TV on
document.getElementById('tv-screen').addEventListener('click', () => {
    if (!tvIsOn) {
        tvIsOn = true;
        tvPowerOn.play();
        document.getElementById('tv-screen').style.backgroundColor = ' '; // remove black background
        draw(); 
    }
});

// function to format the text
function wrapText(text, maxWidth) {
    const words = text.split(' ');
    let line = '';
    const lines = [];
    
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    return lines;
}

// function to create glitch effect
function drawGlitch() {
    const imageData = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        if (Math.random() < 0.05) {
            imageData.data[i] = 255;
            imageData.data[i + 1] = 0;
            imageData.data[i + 2] = 0;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

// function to create static noise on screen
function drawStatic() {
    const imageData = ctx.createImageData(width, height);
    const buffer = new Uint32Array(imageData.data.buffer);
    for (let i = 0; i < buffer.length; i++) {
        const grayscale = Math.random() * 255; // random grayscale color

        // set RGBA values
        const r = grayscale; // red
        const g = grayscale; // green
        const b = grayscale; // blue
        const a = 25; // alpha

        // convert RGBA to 32-bit number 
        buffer[i] = (a << 24) | (r << 16) | (g << 8) | b;
    }

    ctx.putImageData(imageData, 0, 0);
}

let currentIndex = 0; // track current message

let eventQueue = [
    { type: 'message', content: 'Hi there.', duration: 1000 },
    { type: 'message', content: 'Do you like the feeling of nostalgia?', duration: 500 },
    { type: 'message', content: "Of course you do. Who doesn't?", duration: 500 },
    { type: 'message', content: "Remember the good, old morning TV shows?", duration: 650 },
    { type: 'gif-audio', gifId: 'gif1', audioId: 'audio1', duration: 650 },
    { type: 'message', content: 'Such simple yet beautiful shows they were.', duration: 500 },
    { type: 'message', content: 'As a young child, you were mesmerized by them.', duration: 500 },
    { type: 'message', content: 'You would sit there for hours, eyes wide open.', duration: 500 },
    { type: 'message', content: 'But do you remember the ones that didn’t quite feel right?', duration: 500 },
    { type: 'gif-audio', gifId: 'gif2', audioId: 'audio2',  duration: 1000 },
    { type: 'message', content: 'You couldn’t put your finger on it...', duration: 500 },
    { type: 'message', content: 'Something about them seemed wrong.', duration: 500 },
    { type: 'message', content: 'And yet, you couldn’t look away.', duration: 500 },
    { type: 'gif-audio', gifId: 'gif3', audioId: 'audio3',  duration: 850 },
    { type: 'message', content: 'You watched them, didn’t you?', duration: 500 },
    { type: 'message', content: 'They weren’t meant for you.', duration: 500 },
    { type: 'message', content: 'But you kept watching anyway.', duration: 500 },
    { type: 'message', content: 'You were a bad kid.', duration: 500 },
    { type: 'audio', content: 'Do you hear that?', audioId: 'audio4',  duration: 1600 },
    { type: 'message', content: 'It’s coming from the TV...', duration: 1600 },
    { type: 'gif-audio', gifId: 'gif4', audioId:'audio5',  duration: 10000 }

]

let currentEventIndex = 0;
let currentEventFrameCount = 0;

let frameCount = 0; // frame count for timing effects
let gifTime = 0; // track how long GIF has displayed
let gifDuration = 500; // show GIF for 5 seconds

let fontSize = 30;
// function to draw the text
function drawText(content) {
    ctx.fillStyle = 'white';
    ctx.font = '30px monospace';
    ctx.textAlign = 'center';

    const maxWidth = width * 0.8; // max width is 80% of canvas width
    const lines = wrapText(content, maxWidth);

    // calculate the vertical position to center the text
    const lineHeight = fontSize + 10; // add extra space between lines
    const totalTextHeight = lines.length * lineHeight;
    let y = (height - totalTextHeight) / 2; // start drawing from vertically centered position

    // draw each line
    lines.forEach((line) => {
        ctx.fillText(line, width / 2, y); // centered horizontally
        y += lineHeight; // move to next line
    });
}

//function to hide GIFs
function hideGifs() {
    gif1.style.display = 'none';
    gif2.style.display = 'none';
    gif3.style.display = 'none';
    gif4.style.display = 'none';
}
// function to handle event queue
function handleEvent() {
    const event = eventQueue[currentEventIndex]; // retrieve current event

    ctx.clearRect(0, 0, width, height);   // clear screen 
    drawStatic(); // create static
    drawGlitch();

    hideGifs();

    if (event.type === 'message') {
        drawText(event.content); // render text
    } else if (event.type === 'gif') {
        const gifElement = document.getElementById(event.gifId); // specified GIF
        gifElement.style.display = 'block'; // make selected GIF visible
    } else if (event.type === 'audio') {
        drawText(event.content);
        const audioElement = document.getElementById(event.audioId); // specified audio
        audioElement.play(); // play audio clip
    } else if (event.type === 'gif-audio') {
        // handle GIF and audio clip simultaneously
        const gifElement = document.getElementById(event.gifId); 
        gifElement.style.display = 'block';

        const audioElement = document.getElementById(event.audioId); // specified audio
        audioElement.play(); // play audio clip
    
    }

    currentEventFrameCount++; // increase frame count to next

    // check if event's duration has passed
    if (currentEventFrameCount >= event.duration) {
        currentEventIndex++ // move to next event
        currentEventFrameCount = 0;

        if (currentEventIndex >= eventQueue.length) {
            currentEventIndex = 0;
        }
    }
}



// main function to draw everything
function draw() {
    if (tvIsOn) {
        handleEvent(); // handle current event
        drawGlitch();
        requestAnimationFrame(draw); // repeat animation loop
    }
}

draw();
