 navigator.getMedia = (navigator.getUserMedia ||
                      navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia ||
                      navigator.msGetUserMedia);

var errorLogger = function (err) {
    if (err)
        console.log(err);
}

var stream = {
    // Constants
    BUFFERLENGTH: 1024,

    // Variables
    analyser: null,
    audioContext: null,
    localStream: null,
    buffer: null,
    task: null,

    startMedia: function (id) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();          
        this.buffer = new Uint8Array(this.BUFFERLENGTH);
        this.task = id;
        this.initUserMedia({audio: true}, this.gotStream.bind(this), errorLogger);

    },

    initUserMedia: function (obj, cb, err) {
        navigator.getMedia(obj, cb, err);
    },

    gotStream: function (localStream) {
        this.localStream = localStream;
        var mediaStreamSource = this.audioContext.createMediaStreamSource(localStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        mediaStreamSource.connect(this.analyser);
        analyser.updatePitch(this.task);
    },
}