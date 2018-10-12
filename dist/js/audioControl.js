// 控制音频播放
(function ($, root) {
    function audioControl() { /*控制音频函数*/
        this.audio = new Audio() /*通过new Audio把audio挂到全局上*/
        this.status = "pause" /*最开始默认是暂停的状态*/
    }
    audioControl.prototype = { /*把功能写在audioControl函数的原型上*/
        play: function () {
            this.audio.play() /*调用audio自带的play属性进行播放*/
            this.status = "play" /*同时状态也为播放的状态*/
        },
        pause: function () {
            this.audio.pause() /*调用audio自带的pause属性进行暂停*/
            this.status = "pause" /*同时状态也为暂停的状态*/
        },
        getAudio: function (src) { /*获取音频资源*/
            this.audio.src = src
            this.audio.load() /*自带的load属性，加载音频资源*/
        },
        playTo: function (time) { /*音频跳转*/
            this.audio.currentTime = time
            /*利用audio自带的currentTime属性设置音频播放的位置（自带跳转功能）*/
            this.play()
        }
    }
    root.audioControl = audioControl
})(window.Zepto, window.player || (window.player = {}))