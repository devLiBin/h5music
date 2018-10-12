// 控制index值切换的模块
(function ($, root) {
    function controlManger(len) {
        this.index = index
        this.len = len
    }
    controlManger.prototype = {
        prev: function () {
            return this.getIndex(-1)
        },
        next: function () {
            return this.getIndex(1)
        },
        getIndex: function (val) {
            var len = this.len
            var index = this.index
            var curIndex = (index + len + val) % len
            this.index = curIndex /*计算后的index放到全局的index上*/
            return curIndex
        }
    }
    root.controlManger = controlManger /*把controlManger方法暴露在root上*/
})(window.Zepto, window.player || {})