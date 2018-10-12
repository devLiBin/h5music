/*渲染歌曲信息模块*/
(function ($, root) {
    var $scope = $(document.body) /*使用$scope来代替body*/
    function renderInfo(info) { /*渲染歌曲信息*/
        var html = '<div class="song-name">' + info.song + '</div>' +
            '<div class="singer-name">' + info.singer + '</div>' +
            '<div class="album-name">' + info.album + '</div>';
        $scope.find(".song-info").html(html)
    }

    function renderImg(src) { /*渲染图像以及高斯模糊背景*/
        var img = new Image()
        img.src = src
        img.onload = function () {
            root.blurImg(img, $scope)
            /*这是在高斯模糊JS文件中已经写好的方法，把img传进去，渲染到body上*/
            $scope.find('.song-img img').attr('src', src)
        }
    }

    function renderIsLike(islike) { /*渲染实心还是空心*/
        if (islike) {
            $scope.find(".like-btn").addClass("liking")
        } else {
            $scope.find(".like-btn").removeClass("liking")
        }
    }
    /*把所有的渲染函数都放在一个reder函数中，直接调用reder函数就可以渲染所有信息了*/
    root.render = function (data) {
        renderInfo(data)
        renderImg(data.image)
        renderIsLike(data.isLike)
    }


})(window.Zepto, window.player || (window.player = {}))
/*通过window.player暴露函数*/