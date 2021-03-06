$.fn.myLoading = function (variables) {
    var el = this, defaultSize = 'md', listSize = {'lg': 'large', 'md': 'medium', 'sm': 'small'},
        options = jQuery.extend({msg: null, timeout: null, fixed: false, opacity: false, size: null,}, variables),
        classContainer = '';
    if (options.msg === null) options.msg = 'Đang tải dữ liệu...';
    if (options.size === null || Object.keys(listSize).includes(options.size) === false) options.size = defaultSize;
    classContainer += ' ' + listSize[options.size];
    classContainer += options.fixed === true ? ' fixed' : '';
    el.myUnloading(false);
    el.addClass('myLoading loading').append('<div class="myLoading-container opacity' + classContainer + '"><div class="myLoading-indicator"><div class="myLoading-indicator-spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div><div class="myLoading-indicator-text">' + options.msg + '</div></div></div>');
    el.children('.myLoading-container').show();
    if (options.timeout !== null) {
        setTimeout(function () {
            el.myUnloading();
        }, options.timeout);
    }
    return el;
}
$.fn.myUnloading = function (animate) {
    var el = this;
    if ([true, false].indexOf(animate) === -1) animate = true;
    if (animate !== true) {
        el.children('.myLoading-container').remove();
        el.removeClass('loading').addClass('myLoading');
    } else {
        $.when(el.children('.myLoading-container').children('.myLoading-indicator').fadeOut(500)).done(function () {
            el.children('.myLoading-container').remove();
            el.removeClass('loading').addClass('myLoading');
        });
    }
    return el;
}