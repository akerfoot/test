/**
Copyright 2010, Google Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

    * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
    * Neither the name of Google Inc. nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

o3djs.require('o3djs.shader');

// Temporary patch until all browsers support unprefixed context.
if (window.hasOwnProperty('AudioContext') && !window.hasOwnProperty('webkitAudioContext'))
    window.webkitAudioContext = AudioContext;

// init() once the page has finished loading.
window.onload = init;

var context;
var source = 0;
var jsProcessor = 0;
var analyser;
var analyserView1;

function loadSample(url) {
    // Load asynchronously

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        context.decodeAudioData(
            request.response,
            function(buffer) {
                source.buffer = buffer;
                source.loop = true;
                source.start(0);

                draw();
            },

            function(buffer) {
                console.log("Error decoding source!");
            }
        );
    };

    request.send();
}

if ( !window.requestAnimationFrame ) {

    window.requestAnimationFrame = ( function() {

        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

                window.setTimeout( callback, 1000 / 60 );

            };

    } )();

}


function draw() {
    analyserView1.doFrequencyAnalysis();
    // setTimeout(draw, 0);
    window.requestAnimationFrame(draw);
}

function initAudio() {
    context = new webkitAudioContext();
    source = context.createBufferSource();

    // This AudioNode will do the amplitude modulation effect directly in JavaScript
    jsProcessor = context.createScriptProcessor(4096);
    jsProcessor.onaudioprocess = test.audio.process;

    analyser = context.createAnalyser();
    analyser.fftSize = 2048;

    // Connect the processing graph: source -> jsProcessor -> analyser -> destination
    source.connect(jsProcessor);
    jsProcessor.connect(analyser);
    analyser.connect(context.destination);

    // Load the sample buffer for the audio source
    loadSample("sounds/Seamonkey%20%28Nonbot%27s%20Bootleg%20Remix%29.mp3");
}

function init() {
    analyserView1 = new AnalyserView("view1");
    initAudio();
    analyserView1.initByteBuffer();

    // Create a slider to control the modulation frequency with a 6 octave range (-3 -> +3)
    addSlider("pitch");
    configureSlider("pitch", 0.0, -3600.0, 3600.0, test.audio.onUIchange);
}
