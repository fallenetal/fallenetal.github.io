function zoomIn(thumb, mask, zoon, obj) {
    this.thumb = $(thumb)
    this.mask = $(mask)
    this.zoon = $(zoon)
    this.multiple = obj.multiple

    this.thumb.append('<img src="' + obj.Img + '" alt="插件图片">')

    this.zoon.css({
        backgroundImage: 'url(' + obj.Img + ')'
    })

    this.move()
}

zoomIn.prototype.move = function () {
    this.mask.css({
        width: this.thumb.width() / this.multiple,
        height: this.thumb.height() / this.multiple,
    })

    this.zoon.css({
        backgroundSize: this.multiple * 100 + '%'
    })

    var _thumb = this.thumb
    var _mask = this.mask
    var _zoon = this.zoon

    this.thumb.mousemove(function (event) {
        var maskX = event.offsetX - _mask.width() / 2
        var maskY = event.offsetY - _mask.height() / 2

        if (maskX < 0) {
            maskX = 0
        }
        if (maskX > _thumb.width() - _mask.width()) {
            maskX = _thumb.width() - _mask.width()
        }
        if (maskY < 0) {
            maskY = 0
        }
        if (maskY > _thumb.height() - _mask.height()) {
            maskY = _thumb.height() - _mask.height()
        }

        _mask.css({
            left: maskX,
            top: maskY
        })

        _zoon.css({
            backgroundPosition: -(_zoon.width() / _mask.width()) * maskX + 'px ' + -(_zoon.height() / _mask.height()) * maskY + 'px'
        })
    })

    this.thumb.hover(
        function () {
            _mask.css({
                opacity: '1',
                transition:'none'
            })
            _zoon.css({
                opacity: '1'
            })
        },
        function () {
            _mask.css({
                opacity: '0',
                transition:'all .2s'
            })
            _zoon.css({
                opacity: '0'
            })
        })
}