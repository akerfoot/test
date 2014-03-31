
<!--
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
-->

test = test || {};
test.audio = test.audio || {};

(function() {
    function process(event) {
        // Get left/right input and output arrays
        var inputArrayL = event.inputBuffer.getChannelData(0);
        var inputArrayR = event.inputBuffer.getChannelData(1);
        var outputArrayL = event.outputBuffer.getChannelData(0);
        var outputArrayR = event.outputBuffer.getChannelData(1);

        var n = inputArrayL.length;

        for (var i = 0; i < n; ++i) {
            var sampleL = Math.sin(phaseL);
            var sampleR = Math.sin(phaseR);

            phaseL += pitchRate * phaseIncrL;
            phaseR += pitchRate * phaseIncrR;
            if (phaseL > kTwoPi) phaseL -= kTwoPi;
            if (phaseR > kTwoPi) phaseR -= kTwoPi;

            // Amplitude modulation effect
            outputArrayL[i] = inputArrayL[i] * sampleL;
            outputArrayR[i] = inputArrayR[i] * sampleR;
        }
    }

    function pitchHandler(event, ui) {
        pitchCents = ui.value;
        pitchRate = Math.pow(2.0, pitchCents / 1200.0); // convert from cents to rate
        var pitch = kBaseFrequency * pitchRate;

        var info = document.getElementById("pitch-value");
        info.innerHTML = "modulation frequency = " + pitch + " Hertz";
    }

    // Export these functions to the test.audio namespace object.
    test.audio.process = process;
    test.audio.onUIchange = pitchHandler;
})();