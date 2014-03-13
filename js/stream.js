 var stream = {
    // Constants
    BUFFERLENGTH: 1024,

    // Variables
    analyser: null,
    audioContext: null,
    localStream: null,
    buffer: null,

    startMedia: function () {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();          
        this.buffer = new Uint8Array(this.BUFFERLENGTH);
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
    },
}