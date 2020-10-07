var myGridView = function (options) {
    "use strict";
    var mygridview = new GridView();
    if (typeof options === 'object') mygridview.init(options);
    return mygridview;
}

class GridView {
    constructor() {
        this.options = {};
        this.defaults = {
            pjaxId: '#dt-pjax',
            gridViewClass: '.grid-view',
            dtClass: '.dt-widget',
            contentClass: '.dt-grid-content',
            paneScroll: ['.pane-hScroll', '.pane-vScroll'],
            pageParam: 'page',
            urlChangePageSize: null,
        };
    }

    setCloseButton() {
        var $this = this;
        $($this.options.dtClass + " .filters input, " + this.options.dtClass + " .filters select").each(function () {
            "" != $(this).val() ? $(this).closest("td").append('<button class="btn btn-default btn-close-filter" title="Xóa"><i class="material-icons">clear</i></button>') : $(this).closest("td").find(".btn-close-filter").remove()
        })
    }

    init(options) {
        this.options = $.extend(this.defaults, options);
        this.setWidthContent();
        this.setHeightContent();
        this.setWidthCol();
        this.setEvents();
    }

    setWidthColOnResize() {
        var i = 0;
        $(this.options.dtClass).find("table thead tr").eq(0).children("th").each(function () {
            var t = $(this).attr("width") > $(this).outerWidth() ? $(this).attr("width") : $(this).outerWidth();
            0 == i ? $("colgroup col:first-child").css("width", $(this).attr("width")) : $("colgroup col:nth-child(" + (i + 1) + ")").css("width", t), i++
        });
    }

    setHeightContent() {
        var content = $(this.options.contentClass) || null;
        if (content != null) {
            var minus = content.attr('data-minus') || null, data = minus != null ? JSON.parse(minus) : {},
                hContent = $(window).height() - $(this.options.dtClass).find('table thead').outerHeight();
            for (var k = 0; k < Object.keys(data).length; k++) {
                if (k == 0) {
                    if (data[0] != null && !isNaN(data[0])) hContent -= data[0];
                } else {
                    if ($(data[k]) != undefined && $(data[k]).length > 0) {
                        // console.log($(data[k]), $(data[k]).outerHeight());
                        hContent -= $(data[k]).outerHeight();
                    }
                }
            }
            var breadcrumb = 0;
            if ($('.breadcrumb').outerHeight() != null) {
                breadcrumb = $('.breadcrumb').outerHeight();
            }
            hContent -= breadcrumb;
            content.height(hContent);
        }
    }

    setWidthCol() {
        var i = 0, e = $(this.options.dtClass).find("table thead tr").eq(0).children("th"), l = e.length,
            s = $(window).width();
        e.each(function () {
            var t = null != $(this).attr("width") ? $(this).attr("width") : $(this).outerWidth();
            0 == i ? $("colgroup col:first-child").css("width", $(this).attr("width")) : $("colgroup col:nth-child(" + (i + 1) + ")").css("width", t), i++
        });
    }

    setEventScroll() {
        var $this = this;
        jQuery('body').find($this.options.paneScroll[0]).unbind('scroll').bind('scroll', function () {
            $($this.options.paneScroll[1]).width($($this.options.paneScroll[0]).width() + $($this.options.paneScroll[0]).scrollLeft());
        })
    }

    setWidthContent() {
        var contentWidth = $(this.options.gridViewClass).outerWidth();
        $(this.options.paneScroll).css('width', contentWidth);
    }

    setEvents() {
        var $this = this;
        $(document).on('pjax:send', function () {
            $($this.options.dtClass).find('tbody').myLoading({fixed: true,});
        }), $(document).on('pjax:success', function (e) {
            if ("#" + e.target.id == $this.options.pjaxId) {
                $this.setWidthContent(), $this.setHeightContent(), $this.setWidthCol(), $this.setEventScroll(), $this.setCloseButton()
            }
            $(".ui.dropdown").dropdown();
        }), $(window).on('resize', function () {
            $this.setWidthContent(), $this.setHeightContent(), $this.setWidthCol()
        }), $this.setEventScroll(), $this.setCloseButton(), $("body").on("click", ".btn-close-filter", function () {
            var t = $(this).closest("td").find("input"), e = $(this).closest("td").find("select");
            $($this.options.dtClass).find('tbody').myLoading('Loading...');
            t.length && (t.val(""), t.trigger('change'), $(this).closest("td").find(".btn-close-filter").remove()), e.length && (e.prop("selectedIndex", 0), e.trigger('change'), $(this).closest("td").find(".btn-close-filter").remove());
        }), $('body').on('change', '.go-to-page', function () {
            var currentUrl = window.location.href, arrUrl = currentUrl.split($this.options.pageParam + '='), urlChange;
            if (currentUrl.indexOf($this.options.pageParam) === -1) {
                urlChange = currentUrl + (currentUrl.indexOf('?') === -1 ? '?' : '&') + $this.options.pageParam + '=' + $(this).val();
            } else {
                var char = currentUrl.indexOf('?' + $this.options.pageParam) !== -1 ? '?' : '&',
                    pageParam = char + $this.options.pageParam + '=', pageParamLength = pageParam.length,
                    tmp = currentUrl.slice(currentUrl.indexOf(pageParam) + pageParamLength),
                    suffUrl = tmp.indexOf('&') === -1 ? "" : tmp.slice(tmp.indexOf('&')),
                    preUrl = currentUrl.slice(0, currentUrl.indexOf(pageParam) + pageParamLength);
                urlChange = preUrl + $(this).val() + suffUrl;
            }
            $.when($.pjax.reload({url: urlChange, method: 'POST', container: $this.options.pjaxId})).done(function () {
                var currentUrl = window.location.href, arrUrl = currentUrl.split($this.options.pageParam + '=');
                if (typeof (arrUrl[1]) !== 'undefined' && arrUrl[1] !== null) {
                    var page = arrUrl[1].split('&');
                }
                $('.go-to-page').val(page[0]);
            });
        }), $('body').on('change', '#page-size-widget', function () {
            var currentUrl = window.location.href, pageNum = $(this).val();
            if (pageNum == 0) return false;
            $.get($this.options.urlChangePageSize, {'perpage': pageNum}, function () {
                $.pjax.defaults.timeout = false;
                $.pjax.reload({url: currentUrl, method: 'POST', container: $this.options.pjaxId});
            });
        });
    }
}