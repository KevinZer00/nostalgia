const canvas = document.getElementById('tv-screen');
const ctx = canvas.getContext('2d');

// canvas dimensions
const width = canvas.width;
const height = canvas.height;

// load GIF 
const gif = document.getElementById('gif');

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
    { type: 'message', content: 'Hi there.', duration: 500 },
    { type: 'message', content: 'Do you like the feeling of nostalgia?', duration: 500 },
    { type: 'message', content: "Of course you do. Who doesn't?", duration: 500 },
    { type: 'message', content: "Remember those Saturday morning cartoons?", duration: 500 },
    { type: 'gif', duration: 500 },
    { type: 'message', content: 'Such simple yet beautiful cartoons they were.', duration: 500 }
]

let currentEventIndex = 0;
let currentEventFrameCount = 0;

let frameCount = 0; // frame count for timing effects
let glitchFrames = 0;
let isGlitching = false;
let showGif = false;
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

// function to handle event queue
function handleEvent() {
    const event = eventQueue[currentEventIndex]; // retrieve current event

    if (event.type === 'message') {
        ctx.clearRect(0, 0, width, height);   // clear screen 
        drawStatic(); // create static
        drawText(event.content); // render text
    } else if (event.type === 'gif') {
        gif.style.display = 'block'; // make GIF visible
    }

    currentEventFrameCount++; // increase frame count to next

    // check if event's duration has passed
    if (currentEventFrameCount >= event.duration) {
        currentEventIndex++ // move to next event
        currentEventFrameCount = 0;

        // hide the GIF is next even is not a GIF
        if (event.type === 'gif') {
            gif.style.display = 'none'; // hide GIF when moving to next event
        }

        if (currentEventIndex >= eventQueue.length) {
            currentEventIndex = 0;
        }
    }
}

/*
// function to create glitching effect of texts
function drawGlitch() {
    if (isGlitching) {
        ctx.fillStyle = 'red';
        ctx.font = '40px monospace';
        ctx.fillText(messages[currentIndex], Math.random() * 20 + 50, Math.random() * 10 + 150); // jitter position
    }
}
*/


// main function to draw everything
function draw() {
    handleEvent(); // handle current event

    requestAnimationFrame(draw); // repeat animation loop
   
    /*
    // if it's not meant to be glitching, display as usual
    if (!isGlitching) {
        drawText();
    }

    // trigger glitch effect only for third message
    if (currentIndex === 2 && Math.random() > 0.98 && !isGlitching) {
        isGlitching = true;
        glitchFrames = 0;
    }

    // handle glitch effect for third message
    if (isGlitching) {
        drawGlitch();
        glitchFrames++;
        if (glitchFrames > 10) {
            isGlitching = false;
        }
    }
    */

}

draw();




// CHANGE CHANNELS FUNCTION
