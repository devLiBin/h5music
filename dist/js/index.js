var $ = window.Zepto; /*用$符来代替zepto*/
// console.log(window)
var root = window.player
var $scope = $(document.body) /*获取到body*/
var index = 0
var songList /*所有的歌曲列表（总数据）*/
var controlManger /*控制切换歌曲的index值*/
var audio = new root.audioControl() /*利用audio变量来取到在audioControl中暴露出来的方法*/

function bindEvent() { /*点击事件*/
    $scope.on("play:change", function (event, index, flag) { /*play:change是自己定义的事件*/
        audio.getAudio(songList[index].audio) /*获取音频资源*/
        if (audio.status == 'play' || flag) {
            audio.play()
            // root.pro.start()
        }
        root.pro.renderAllTime(songList[index].duration) /*渲染一首歌的总时间*/
        console.log(songList[index].duration)
        root.render(songList[index]) /*渲染该条音频数据中的所有的资源*/
    })

    $scope.on('click', '.prev-btn', function () {
        var index = controlManger.prev() /*调用controlManger模块中的next方法获取上一首歌的index值*/
        $scope.trigger("play:change", index); /*渲染第index首歌的总时间*/
        /*当点击切换上一首的时候要判断当前的状态是播放还是暂停；不能把当前这首歌播放过的时间带到下一首歌*/
        if (audio.status == "play") {
            root.pro.start(0); /*如果当前为播放状态，先进行置空，然后再让时间开始走*/
        } else {
            root.pro.update(0); /*如果是暂停状态，就让左侧时间区域重置*/
        }
    })
    $scope.on('click', '.next-btn', function () {
        var index = controlManger.next() /*调用controlManger模块中的next方法获取下一首歌的index值*/
        $scope.trigger("play:change", index); /*渲染歌曲总时间*/
        /*当点击切换下一首的时候要判断当前的状态是播放还是暂停；不能把当前这首歌播放过的时间带到下一首歌*/
        if (audio.status == "play") {
            root.pro.start(0); /*如果当前为播放状态，先进行置空，然后再让时间开始走*/
        } else {
            root.pro.update(0); /*如果是暂停状态，就让左侧时间区域重置*/
        }
    })
    $scope.on('click', '.play-btn', function () { /*播放歌曲状态*/
        if (audio.status == 'play') {
            audio.pause() /*如果为播放状态，再点击就应该暂停*/
            root.pro.stop() /*暂停后时间也应该停止走*/
        } else {
            audio.play() /*如果为暂停状态，再点击就应该播放*/
            root.pro.start() /*开始播放时间也应该继续走*/
        }
        $(this).toggleClass('playing') /*播放和暂停按钮样式的切换*/
    })
}

function bindTouch() {
    var $slider = $scope.find('.slider-point') /*获取到小圆点*/
    var offset = $scope.find('.pro-bottom').offset() /*获取到下面的进度条（固定的那条）的位置*/
    var left = offset.left /*进度条的left值*/
    var width = offset.width /*进度条的总宽度*/
    $slider.on('touchstart', function () {
        root.pro.stop() /*当鼠标开始拖拽的时候，让时间停止自动走*/
    }).on('touchmove', function (e) {
        // console.log(e)
        var x = e.changedTouches[0].clientX
        /*changedTouches[0].clientX 是小圆点拖动后事件源对象中的拖动后的x的距离*/
        var per = (x - left) / width /*获取百分比*/
        if (per > 0 && per <= 1) { /*防止拖出去*/
            root.pro.update(per) /*把获取到的百分比传入到更新区域函数中*/
        }
    }).on('touchend', function (e) {
        /*获取到结束的位置，当拖动到结束的位置时，音乐也应该跳转到对应的时间点*/
        var x = e.changedTouches[0].clientX
        var per = (x - left) / width
        if (per > 0 && per <= 1) {
            var curTime = per * songList[controlManger.index].duration /*获取到拖动结束位置时的歌曲的总时长*/
            console.log(curTime)
            audio.playTo(curTime) /*用audio模块控制音频，跳转到对应的歌曲的时长位置curTime处*/
            $scope.find('.play-btn').addClass('playing') /*跳转完后接着播放歌曲，按钮就应该变成播放中的状态*/
            audio.status = 'play'; /*变成播放状态*/
            root.pro.start(per) /*跳转完接着播放时，时间应该继续走*/
        }
    })
}

function getData(url) { /*获取数据*/
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            root.render(data[0]) /*成功后默认渲染第1首歌*/
            songList = data /*把获取到的数据变成一个全局变量*/
            bindEvent() /*点击按钮*/
            bindTouch() /*滑动拖拽进度条*/
            controlManger = new root.controlManger(data.length) /*控制切歌的index值*/
            console.log(data[0])
            $scope.trigger("play:change", 0)
            /*一成功获取数据后就执行play：change事件（播放音乐)，由于传的0，所以默认播放第1首歌*/
        },
        error: function () {
            console.log("error")
        }
    })
}
getData("../mock/data.json") /*mock本地数据的地址*/