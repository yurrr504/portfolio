var _0x550c = ['#successMsg', 'scroll', '000x000', 'addEventListener', 'mousemove', '#mousePosition', 'getBoundingClientRect', 'clientX', 'clientY', 'top', 'split', 'pop', 'toLowerCase', 'inArray', 'png', 'jpg', 'jpeg', 'false', '#x1', 'val', '#y1', '#x2', 'width', 'height', 'round', '#selectSize', 'html', 'save', 'image', 'log', '#imgCanvas', 'attr', '#imgSize', '.photowrap', 'css', 'display', 'block', 'table-cell', 'scale', 'translate', 'rotate', 'restore', 'imgAreaSelect', '1:imgHeight/imgWidth', 'get', 'getContext', '#imgFile', 'change', 'prop', 'files', 'onload', 'result', 'readAsDataURL', '#fileCheckMsg', 'replace', 'click', '#imgPercent', '#leftRotateBtn', '#imgExpand', '#imgMinus', '#reversal1Btn', '#reversal2Btn', '#darknessBtn', 'getImageData', 'putImageData', '#autoResize', '#cropImage', 'src', 'toDataURL', 'cropImage', '#notSelectCropMsg', '#selectAtea', '#photoUpload', '#notSelectImageMsg', '#imageSizeMsg', '#dataURL', '#bs_photo', 'serialize', '/bs/fileUpload_uway.php', 'json'];
(function(_0x41bdc0, _0x3b9b28) {
    var _0x2f8a0c = function(_0x2436d9) {
        while (--_0x2436d9) {
            _0x41bdc0['push'](_0x41bdc0['shift']());
        }
    };
    _0x2f8a0c(++_0x3b9b28);
}(_0x550c, 0x1e6));
var _0x56ae = function(_0x370ae1, _0x578a4d) {
    _0x370ae1 = _0x370ae1 - 0x0;
    var _0x105764 = _0x550c[_0x370ae1];
    return _0x105764;
};
var photoeditor = {};
var view;
var canvas;
var ctx;
var currentAngle = 0x0;
var currentPercent = 0x64;
var imgWidth;
var imgHeight;
var file;
var orgWidth;
var orgHeight;
var reversal1 = ![];
var reversal2 = ![];
var percentFlag = ![];
var autoResize = ![];
var ias;
var imageLoad = ![];
function getMousePos(_0x4b81bb, _0x4d74cb) {
    var _0x32719f = _0x4b81bb[_0x56ae('0x0')]();
    return {
        'x': _0x4d74cb[_0x56ae('0x1')] - _0x32719f['left'],
        'y': _0x4d74cb[_0x56ae('0x2')] - _0x32719f[_0x56ae('0x3')]
    };
}
function percentCal(_0x292610, _0x151bd2, _0x558098) {
    var _0xd7aec1 = _0x151bd2 * _0x292610 / 0x64;
    var _0x230f38 = _0x558098 * _0x292610 / 0x64;
    return {
        'w': _0xd7aec1,
        'h': _0x230f38
    };
}
function brightnessFilter(_0x948b6c, _0x29929c) {
    var _0x5dd881 = _0x948b6c['data'];
    _0x29929c = 0x14 * _0x29929c;
    for (var _0x18d5c9 = 0x0; _0x18d5c9 < _0x5dd881['length']; _0x18d5c9 += 0x4) {
        _0x5dd881[_0x18d5c9] += _0x29929c / 0x3;
        _0x5dd881[_0x18d5c9 + 0x1] += _0x29929c / 0x3;
        _0x5dd881[_0x18d5c9 + 0x2] += _0x29929c / 0x3;
    }
    return _0x948b6c;
}
function fileCheck(_0x333808) {
    _0x333808 = _0x333808[_0x56ae('0x4')]('.')[_0x56ae('0x5')]()[_0x56ae('0x6')]();
    if ($[_0x56ae('0x7')](_0x333808, ['gif', _0x56ae('0x8'), _0x56ae('0x9'), _0x56ae('0xa'), 'bmp']) == -0x1) {
        console['log'](_0x56ae('0xb'));
        return ![];
    } else {
        console['log']('true');
        return !![];
    }
}
function preview(_0x39753a, _0xf81284) {
    $(_0x56ae('0xc'))[_0x56ae('0xd')](_0xf81284['x1']);
    $(_0x56ae('0xe'))[_0x56ae('0xd')](_0xf81284['y1']);
    $(_0x56ae('0xf'))['val'](_0xf81284['x2']);
    $('#y2')['val'](_0xf81284['y2']);
    $('#w')[_0x56ae('0xd')](_0xf81284[_0x56ae('0x10')]);
    $('#h')[_0x56ae('0xd')](_0xf81284[_0x56ae('0x11')]);
    var _0x32d742 = Math[_0x56ae('0x12')](_0xf81284['width']) + 'x' + Math[_0x56ae('0x12')](_0xf81284[_0x56ae('0x11')]);
    $(_0x56ae('0x13'))[_0x56ae('0x14')](_0x32d742);
}
function drawImg() {
    ctx[_0x56ae('0x15')]();
    var _0x4d5611 = 0x0;
    var _0x52a03d = 0x0;
    var _0x22dccb = new Image();
    if (photoeditor['cropImage'] == null) {
        _0x22dccb = photoeditor[_0x56ae('0x16')];
    } else {
        _0x22dccb = photoeditor['cropImage'];
    }
    if (autoResize == !![]) {
        imgWidth = 0x74;
        imgHeight = 0x9c;
    } else if (percentFlag == ![]) {
        imgWidth = orgWidth;
        imgHeight = orgHeight;
    } else {
        var _0x16033c = percentCal(currentPercent, orgWidth, orgHeight);
        imgWidth = _0x16033c['w'];
        imgHeight = _0x16033c['h'];
    }
    if (currentAngle == -0xb4) {
        currentAngle = 0xb4;
    } else if (currentAngle == 0x168) {
        currentAngle = 0x0;
    }
    console[_0x56ae('0x17')](currentAngle);
    if (currentAngle == 0x0) {
        $(_0x56ae('0x18'))[_0x56ae('0x19')]('width', imgWidth + 'px');
        $(_0x56ae('0x18'))[_0x56ae('0x19')](_0x56ae('0x11'), imgHeight + 'px');
        $(_0x56ae('0x1a'))[_0x56ae('0x14')](imgWidth + 'x' + imgHeight);
        _0x4d5611 = 0x0;
        _0x52a03d = 0x0;
    } else if (currentAngle == 0x5a) {
        $(_0x56ae('0x18'))[_0x56ae('0x19')](_0x56ae('0x10'), imgHeight + 'px');
        $(_0x56ae('0x18'))[_0x56ae('0x19')](_0x56ae('0x11'), imgWidth + 'px');
        $(_0x56ae('0x1a'))[_0x56ae('0x14')](imgHeight + 'x' + imgWidth);
        _0x4d5611 = 0x0;
        _0x52a03d = -imgHeight;
    } else if (currentAngle == 0xb4) {
        $(_0x56ae('0x18'))[_0x56ae('0x19')]('width', imgWidth + 'px');
        $(_0x56ae('0x18'))['attr']('height', imgHeight + 'px');
        $(_0x56ae('0x1a'))[_0x56ae('0x14')](imgWidth + 'x' + imgHeight);
        _0x4d5611 = -imgWidth;
        _0x52a03d = -imgHeight;
    } else if (currentAngle == 0x10e || currentAngle == -0x5a) {
        $(_0x56ae('0x18'))[_0x56ae('0x19')](_0x56ae('0x10'), imgHeight + 'px');
        $(_0x56ae('0x18'))[_0x56ae('0x19')](_0x56ae('0x11'), imgWidth + 'px');
        $(_0x56ae('0x1a'))[_0x56ae('0x14')](imgHeight + 'x' + imgWidth);
        _0x4d5611 = -imgWidth;
        _0x52a03d = 0x0;
    }
    if ($(_0x56ae('0x18'))[_0x56ae('0x10')]() > 0x1e0 || $('#imgCanvas')['height']() > 0x172) {
        $(_0x56ae('0x1b'))[_0x56ae('0x1c')](_0x56ae('0x1d'), _0x56ae('0x1e'));
    } else {
        $('.photowrap')[_0x56ae('0x1c')](_0x56ae('0x1d'), _0x56ae('0x1f'));
    }
    if (reversal1 == !![]) {
        if (currentAngle == 0x5a || (currentAngle == 0x10e || currentAngle == -0x5a)) {
            ctx['translate'](0x0, imgWidth);
            ctx[_0x56ae('0x20')](0x1, -0x1);
        } else {
            ctx[_0x56ae('0x21')](imgWidth, 0x0);
            ctx[_0x56ae('0x20')](-0x1, 0x1);
        }
    }
    if (reversal2 == !![]) {
        if (currentAngle == 0x5a || (currentAngle == 0x10e || currentAngle == -0x5a)) {
            ctx[_0x56ae('0x21')](imgHeight, 0x0);
            ctx[_0x56ae('0x20')](-0x1, 0x1);
        } else {
            ctx[_0x56ae('0x21')](0x0, imgHeight);
            ctx[_0x56ae('0x20')](0x1, -0x1);
        }
    }
    ctx[_0x56ae('0x22')](currentAngle * Math['PI'] / 0xb4);
    ctx['drawImage'](_0x22dccb, _0x4d5611, _0x52a03d, imgWidth, imgHeight);
    ctx[_0x56ae('0x23')]();
    ias = $(_0x56ae('0x18'))[_0x56ae('0x24')]({
        'aspectRatio': _0x56ae('0x25'),
        'onSelectChange': preview,
        'instance': !![],
        'zIndex': 0xa
    });
}
$(document)['ready'](function() {
    view = $(_0x56ae('0x1b'))[_0x56ae('0x26')](0x0);
    canvas = $(_0x56ae('0x18'))[_0x56ae('0x26')](0x0);
    ctx = canvas[_0x56ae('0x27')]('2d');
    $(_0x56ae('0x28'))['on'](_0x56ae('0x29'), function() {
        if (fileCheck($(_0x56ae('0x28'))[_0x56ae('0xd')]()) && $('#imgFile')[_0x56ae('0xd')]() != '') {
            photoeditor['cropImage'] = null;
            autoResize = ![];
            reversal1 = ![];
            reversal2 = ![];
            percentFlag = ![];
            photoeditor[_0x56ae('0x16')] = new Image();
            file = $(_0x56ae('0x28'))[_0x56ae('0x2a')](_0x56ae('0x2b'))[0x0];
            reader = new FileReader();
            reader[_0x56ae('0x2c')] = function() {
                photoeditor['image'][_0x56ae('0x2c')] = function() {
                    currentAngle = 0x0;
                    currentPercent = 0x64;
                    $(_0x56ae('0x28'))[_0x56ae('0x14')](currentPercent + '%');
                    orgWidth = photoeditor[_0x56ae('0x16')][_0x56ae('0x10')];
                    orgHeight = photoeditor[_0x56ae('0x16')][_0x56ae('0x11')];
                    drawImg();
                    imageLoad = !![];
                    $(_0x56ae('0x28'))['val']('');
                }
                ;
                photoeditor[_0x56ae('0x16')]['src'] = reader[_0x56ae('0x2d')];
            }
            ;
            reader[_0x56ae('0x2e')](file);
        } else if ($(_0x56ae('0x28'))[_0x56ae('0xd')]() == '') {
            return;
        } else {
            if ($('#fileCheckMsg')[_0x56ae('0xd')]() != '') {
                var _0xd1836d = $(_0x56ae('0x2f'))[_0x56ae('0xd')]();
                _0xd1836d = _0xd1836d[_0x56ae('0x30')](/\\n/gi, '\x0a');
                alert(_0xd1836d);
            }
            return;
        }
    });
    $('#returnImgBtn')[_0x56ae('0x31')](function() {
        photoeditor['cropImage'] = null;
        autoResize = ![];
        reversal1 = ![];
        reversal2 = ![];
        percentFlag = ![];
        currentPercent = 0x64;
        currentAngle = 0x0;
        $(_0x56ae('0x32'))[_0x56ae('0x14')](currentPercent + '%');
        orgWidth = photoeditor[_0x56ae('0x16')][_0x56ae('0x10')];
        orgHeight = photoeditor['image'][_0x56ae('0x11')];
        drawImg();
    });
    $(_0x56ae('0x33'))[_0x56ae('0x31')](function() {
        currentAngle += -0x5a;
        drawImg();
    });
    $('#rightRotateBtn')[_0x56ae('0x31')](function() {
        currentAngle += 0x5a;
        drawImg();
    });
    $(_0x56ae('0x34'))[_0x56ae('0x31')](function() {
        _0x49c095();
        autoResize = ![];
        currentPercent += 0xa;
        $(_0x56ae('0x32'))['html'](currentPercent + '%');
        if (percentFlag == 0x64) {
            percentFlag = ![];
        } else {
            percentFlag = !![];
        }
        drawImg();
    });
    $(_0x56ae('0x35'))[_0x56ae('0x31')](function() {
        _0x49c095();
        autoResize = ![];
        if (currentPercent == 0xa)
            return;
        currentPercent += -0xa;
        if (percentFlag == 0x64) {
            percentFlag = ![];
        } else {
            percentFlag = !![];
        }
        $('#imgPercent')[_0x56ae('0x14')](currentPercent + '%');
        drawImg();
    });
    $(_0x56ae('0x36'))['on'](_0x56ae('0x31'), function() {
        if (reversal1) {
            reversal1 = ![];
        } else {
            reversal1 = !![];
        }
        drawImg();
    });
    $(_0x56ae('0x37'))['on'](_0x56ae('0x31'), function() {
        if (reversal2) {
            reversal2 = ![];
        } else {
            reversal2 = !![];
        }
        drawImg();
    });
    $('#brightnessBtn')['on'](_0x56ae('0x31'), function() {
        var _0x45b3d0 = ctx['getImageData'](0x0, 0x0, canvas[_0x56ae('0x10')], canvas[_0x56ae('0x11')]);
        var _0x1459bb = brightnessFilter(_0x45b3d0, 0x1);
        ctx['putImageData'](_0x1459bb, 0x0, 0x0);
    });
    $(_0x56ae('0x38'))['on'](_0x56ae('0x31'), function() {
        var _0x274e8e = ctx[_0x56ae('0x39')](0x0, 0x0, canvas[_0x56ae('0x10')], canvas[_0x56ae('0x11')]);
        var _0x2881b3 = brightnessFilter(_0x274e8e, -0x1);
        ctx[_0x56ae('0x3a')](_0x2881b3, 0x0, 0x0);
    });
    $(_0x56ae('0x3b'))['on'](_0x56ae('0x31'), function() {
        autoResize = !![];
        percentFlag = ![];
        orgWidth = 0x74;
        orgHeight = 0x9c;
        _0x49c095();
        drawImg();
    });
    $(_0x56ae('0x3c'))['on'](_0x56ae('0x31'), function() {
        var _0x1a7bce;
        if ($(_0x56ae('0xc'))[_0x56ae('0xd')]() != null && $('#x1')['val']() != '') {
            _0x1a7bce = new Image();
            _0x1a7bce[_0x56ae('0x3d')] = canvas[_0x56ae('0x3e')]();
            _0x1a7bce[_0x56ae('0x2c')] = function() {
                ctx[_0x56ae('0x15')]();
                $(_0x56ae('0x18'))[_0x56ae('0x19')](_0x56ae('0x10'), $('#w')[_0x56ae('0xd')]() + 'px');
                $(_0x56ae('0x18'))[_0x56ae('0x19')](_0x56ae('0x11'), $('#h')[_0x56ae('0xd')]() + 'px');
                ctx['drawImage'](_0x1a7bce, $(_0x56ae('0xc'))[_0x56ae('0xd')](), $(_0x56ae('0xe'))[_0x56ae('0xd')](), $('#w')[_0x56ae('0xd')](), $('#h')[_0x56ae('0xd')](), 0x0, 0x0, $('#w')[_0x56ae('0xd')](), $('#h')[_0x56ae('0xd')]());
                ctx['restore']();
                photoeditor[_0x56ae('0x3f')] = new Image();
                photoeditor[_0x56ae('0x3f')][_0x56ae('0x3d')] = canvas[_0x56ae('0x3e')]();
                photoeditor[_0x56ae('0x3f')]['onload'] = function() {
                    $(_0x56ae('0x1a'))[_0x56ae('0x14')](photoeditor[_0x56ae('0x3f')][_0x56ae('0x10')] + 'x' + photoeditor[_0x56ae('0x3f')][_0x56ae('0x11')]);
                    orgWidth = photoeditor[_0x56ae('0x3f')]['width'];
                    orgHeight = photoeditor[_0x56ae('0x3f')][_0x56ae('0x11')];
                    imgWidth = orgWidth;
                    imgHeight = orgHeight;
                    autoResize = ![];
                    reversal1 = ![];
                    reversal2 = ![];
                    percentFlag = ![];
                    currentPercent = 0x64;
                    currentAngle = 0x0;
                }
                ;
                _0x49c095();
            }
            ;
        } else {
            if ($(_0x56ae('0x40'))[_0x56ae('0xd')]() != '') {
                var _0x409789 = $(_0x56ae('0x40'))[_0x56ae('0xd')]();
                _0x409789 = _0x409789[_0x56ae('0x30')](/\\n/gi, '\x0a');
                alert(_0x409789);
            }
        }
    });
    $(_0x56ae('0x41'))['on']('click', function() {
        ias[_0x56ae('0x24')]({
            'x1': 0x0,
            'y1': 0x0,
            'x2': imgWidth / 0x3,
            'y2': imgHeight / 0x3
        });
    });
    $(_0x56ae('0x42'))['on']('click', function() {
        if (!imageLoad) {
            if ($(_0x56ae('0x43'))['val']() != '') {
                var _0x1adfee = $(_0x56ae('0x43'))[_0x56ae('0xd')]();
                _0x1adfee = _0x1adfee[_0x56ae('0x30')](/\\n/gi, '\x0a');
                alert(_0x1adfee);
            }
        } else if (imgWidth >= 0x258 || imgHeight >= 0x258 || imgWidth < 0x74 || imgHeight < 0x9c) {
            if ($(_0x56ae('0x44'))[_0x56ae('0xd')]() != '') {
                var _0x1adfee = $(_0x56ae('0x44'))['val']();
                _0x1adfee = _0x1adfee[_0x56ae('0x30')](/\\n/gi, '\x0a');
                alert(_0x1adfee);
            }
        } else {
            var _0x53975a = $(_0x56ae('0x45'))[_0x56ae('0xd')](canvas[_0x56ae('0x3e')]());
            var _0x5bb3ed = $(_0x56ae('0x46'))[_0x56ae('0x47')]();
            $['ajax']({
                'type': 'POST',
                'url': _0x56ae('0x48'),
                'contentType': 'application/x-www-form-urlencoded;\x20charset=utf-8',
                'data': _0x5bb3ed,
                'datatype': _0x56ae('0x49'),
                'success': function(_0x4c3845) {
                    if ($(_0x56ae('0x4a'))[_0x56ae('0xd')]() != '') {
                        var _0x1adfee = $('#successMsg')[_0x56ae('0xd')]();
                        _0x1adfee = _0x1adfee[_0x56ae('0x30')](/\\n/gi, '\x0a');
                        alert(_0x1adfee);
                    }
                    imgUploadCallback($['trim'](_0x4c3845));
                },
                'error': function(_0x50f687) {}
            });
        }
    });
    $(_0x56ae('0x1b'))[_0x56ae('0x4b')](function() {
        _0x49c095();
    });
    function _0x49c095() {
        ias[_0x56ae('0x24')]({
            'hide': !![]
        });
        $('#x1')[_0x56ae('0xd')]('');
        $('#y1')[_0x56ae('0xd')]('');
        $(_0x56ae('0xf'))['val']('');
        $('#y2')[_0x56ae('0xd')]('');
        $('#w')[_0x56ae('0xd')]('');
        $('#h')[_0x56ae('0xd')]('');
        $(_0x56ae('0x13'))[_0x56ae('0x14')](_0x56ae('0x4c'));
    }
    canvas[_0x56ae('0x4d')](_0x56ae('0x4e'), function(_0xd10662) {
        var _0x28d814 = getMousePos(canvas, _0xd10662);
        var _0x4e67ab = Math[_0x56ae('0x12')](_0x28d814['x']) + ',' + Math[_0x56ae('0x12')](_0x28d814['y']);
        $(_0x56ae('0x4f'))[_0x56ae('0x14')](_0x4e67ab);
    });
});
