"use strict";

if (AnalyserNode && !AnalyserNode.prototype.getFloatTimeDomainData) {
  var uint8 = new Uint8Array(2048);
  AnalyserNode.prototype.getFloatTimeDomainData = function(array) {
    this.getByteTimeDomainData(uint8);
    for (var i = 0, imax = array.length; i < imax; i++) {
      array[i] = (uint8[i] - 128) * 0.0078125;
    }
  };
}

// necessary for getFloatTimeDomainData to work in Safari