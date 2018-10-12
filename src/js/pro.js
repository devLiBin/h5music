(function ($, root) {
    var $scope = $(document.body)
    var curDuration /*歌曲的总时间*/
    var frameID /*定时器实现同步刷新的变量*/
    var startTime /*当前的开始时间*/
    var lastPer = 0 /*暂停后走过的时间*/

    /*渲染每一首歌的总时间*/
    function renderAllTime(time) { /*这个形参time就是传过来的每一首歌的总时间*/
        lastPer = 0 /*切换下一首歌的时候让走过的时间重置为0（左侧时间）*/
        curDuration = time
        time = formatTime(time) /*先调用formatTime函数把时间格式转换*/
        $scope.find(".all-time").html(time) /*把转换后的时间插入到总时间结构中*/
    }

    /*时间格式转换：例如253s = 04 ：13*/
    function formatTime(t) {
        t = Math.round(t) /* 把百分比小数取整*/
        var m = Math.floor(t / 60) /*分钟*/
        var s = t - m * 60 /*秒钟*/
        if (m < 10) {
            m = '0' + m
        }
        if (s < 10) {
            s = '0' + s
        }
        return m + ':' + s /*最终需要渲染的格式*/
    }

    /*时间开始走*/
    function start(p) {
        cancelAnimationFrame(frameID) /*每次一进来都要清空计时器*/
        lastPer = p == undefined ? lastPer : p
        startTime = new Date().getTime() /*获取到当前的开始时间*/
        function frame() {
            var curTime = new Date().getTime() /*开始后每次走过的时间*/
            var percent = lastPer + (curTime - startTime) / (curDuration * 1000) /*获取百分比时间*/
            if (percent <= 1) { /*防止超出歌曲总时间*/
                update(percent)
                frameID = requestAnimationFrame(frame) /*实现同步频率记录*/
            } else {
                cancelAnimationFrame(frameID)
            }
        }
        frame()
    }

    /*时间停止走*/
    function stop() {
        cancelAnimationFrame(frameID)
        var stopTime = new Date().getTime() /*点击暂停时走过的时间*/
        lastPer = lastPer + (stopTime - startTime) / (curDuration * 1000)
    }
    /*更新区域函数： 左侧时间 + 进度条运动*/
    function update(per) {
        var curTime = per * curDuration /*这里的per对应start函数里的percent（时间走过的百分比值）*/
        curTime = formatTime(curTime) /*调用时间格式转换函数转换格式*/
        // console.log(curTime)
        $scope.find('.cur-time').html(curTime) /*把走动的时间插入到左侧时间区域*/
        var perX = (per - 1) * 100 + "%" /*per - 1变成一个负的值，然后乘以百分数，变成一个负的百分值*/
        // console.log(perX)
        $scope.find(".pro-top").css({
            transform: 'translateX(' + perX + ')' /*实现进度条走动*/
        })
    }
    root.pro = { /*把以下变量都暴露在root上，方便在其他模块中调用*/
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        update: update
    }
})(window.Zepto, window.player || (window.player = {}))