/* eslint-disable node/no-unsupported-features/node-builtins */
// (mainJs(jQuery, window.moment, window.ClipboardJS, window.IcarusThemeSettings));

function loadMainJs($, moment, ClipboardJS, config) {
    if (!$('.columns .column-right-shadow').children().length) {
        $('.columns .column-right-shadow').append($('.columns .column-right').children().clone());
    }

    $('.article img:not(".not-gallery-item")').each(function () {
        // wrap images with link and add caption if possible
        if ($(this).parent('a').length === 0) {
            $(this).wrap('<a class="gallery-item" href="' + $(this).attr('src') + '"></a>');
            if (this.alt) {
                $(this).after('<p class="has-text-centered is-size-6 caption">' + this.alt + '</p>');
            }
        }
    });

    // render images
    if (typeof ($.fn.lightGallery) === 'function') {
        $('.article').lightGallery({ selector: '.gallery-item', mode: 'lg-fade' });
    }
    if (typeof ($.fn.justifiedGallery) === 'function') {
        if ($('.justified-gallery > p > .gallery-item').length) {
            $('.justified-gallery > p > .gallery-item').unwrap();
        }
        $('.justified-gallery').justifiedGallery({ rowHeight: 230, margins: 4 });
    }

    if (typeof moment === 'function') {
        $('.article-meta time').each(function () {
            $(this).text(moment($(this).attr('datetime')).fromNow());
        });
    }

    $('.article > .content > table').each(function () {
        if ($(this).width() > $(this).parent().width()) {
            $(this).wrap('<div class="table-overflow"></div>');
        }
    });

    function adjustNavbar() {
        const navbarWidth = $('.navbar-main .navbar-start').outerWidth() + $('.navbar-main .navbar-end').outerWidth();
        if ($(document).outerWidth() < navbarWidth) {
            $('.navbar-main .navbar-menu').addClass('justify-content-start');
        } else {
            $('.navbar-main .navbar-menu').removeClass('justify-content-start');
        }
    }
    adjustNavbar();
    $(window).resize(debounce(adjustNavbar, 200));

    function toggleFold(codeBlock, isFolded) {
        const $toggle = $(codeBlock).find('.fold i');
        !isFolded ? $(codeBlock).removeClass('folded') : $(codeBlock).addClass('folded');
        !isFolded ? $toggle.removeClass('fa-angle-right') : $toggle.removeClass('fa-angle-down');
        !isFolded ? $toggle.addClass('fa-angle-down') : $toggle.addClass('fa-angle-right');
    }

    function createFoldButton(fold) {
        return '<span class="fold">' + (fold === 'unfolded' ? '<i class="fas fa-angle-down"></i>' : '<i class="fas fa-angle-right"></i>') + '</span>';
    }

    $('figure.highlight table').wrap('<div class="highlight-body">');
    if (typeof config !== 'undefined'
        && typeof config.article !== 'undefined'
        && typeof config.article.highlight !== 'undefined') {

        $('figure.highlight').addClass('hljs');
        $('figure.highlight .code .line span').each(function () {
            const classes = $(this).attr('class').split(/\s+/);
            if (classes.length === 1) {
                $(this).addClass('hljs-' + classes[0]);
                $(this).removeClass(classes[0]);
            }
        });


        const clipboard = config.article.highlight.clipboard;
        const fold = config.article.highlight.fold.trim();

        $('figure.highlight').each(function () {
            if ($(this).find('figcaption').length) {
                $(this).find('figcaption').addClass('level is-mobile');
                $(this).find('figcaption').append('<div class="level-left">');
                $(this).find('figcaption').append('<div class="level-right">');
                $(this).find('figcaption div.level-left').append($(this).find('figcaption').find('span'));
                $(this).find('figcaption div.level-right').append($(this).find('figcaption').find('a'));
            } else {
                if (clipboard || fold) {
                    $(this).prepend('<figcaption class="level is-mobile"><div class="level-left"></div><div class="level-right"></div></figcaption>');
                }
            }
        });

        if (typeof ClipboardJS !== 'undefined' && clipboard) {
            $('figure.highlight').each(function () {
                const id = 'code-' + Date.now() + (Math.random() * 1000 | 0);
                const button = '<a href="javascript:;" class="copy" title="Copy" data-clipboard-target="#' + id + ' .code"><i class="fas fa-copy"></i></a>';
                $(this).attr('id', id);
                $(this).find('figcaption div.level-right').append(button);
            });
            new ClipboardJS('.highlight .copy'); // eslint-disable-line no-new
        }

        if (fold) {
            $('figure.highlight').each(function () {
                if ($(this).find('figcaption').find('span').length > 0) {
                    const span = $(this).find('figcaption').find('span');
                    if (span[0].innerText.indexOf('>folded') > -1) {
                        span[0].innerText = span[0].innerText.replace('>folded', '');
                        $(this).find('figcaption div.level-left').prepend(createFoldButton('folded'));
                        toggleFold(this, true);
                        return;
                    }
                }
                $(this).find('figcaption div.level-left').prepend(createFoldButton(fold));
                toggleFold(this, fold === 'folded');
            });

            $('figure.highlight figcaption .fold').click(function () {
                const $code = $(this).closest('figure.highlight');
                toggleFold($code.eq(0), !$code.hasClass('folded'));
            });
        }
    }

    const $toc = $('#toc');
    if ($toc.length > 0) {
        const $mask = $('<div>');
        $mask.attr('id', 'toc-mask');

        $('body').append($mask);

        function toggleToc() { // eslint-disable-line no-inner-declarations
            $toc.toggleClass('is-active');
            $mask.toggleClass('is-active');
        }

        $toc.on('click', toggleToc);
        $mask.on('click', toggleToc);
        $('.navbar-main .catalogue').on('click', toggleToc);
    }

    // hexo-util/lib/is_external_link.js
    function isExternalLink(input, sitehost, exclude) {
        try {
            sitehost = new URL(sitehost).hostname;
        } catch (e) { }

        if (!sitehost) return false;

        // handle relative url
        var data;
        try {
            data = new URL(input, 'http://' + sitehost);
        } catch (e) {
            return false;
        }

        // handle mailto: javascript: vbscript: and so on
        if (data.origin === 'null') return false;

        const host = data.hostname;

        if (exclude) {
            exclude = Array.isArray(exclude) ? exclude : [exclude];

            if (exclude && exclude.length) {
                for (const i of exclude) {
                    if (host === i) return false;
                }
            }
        }

        if (host !== sitehost) return true;

        return false;
    }

    if (typeof config !== 'undefined'
        && typeof config.site.url !== 'undefined'
        && typeof config.site.external_link !== 'undefined'
        && config.site.external_link.enable) {
        $('.article .content a').filter((i, link) => {
            return link.href
                && !$(link).attr('href').startsWith('#')
                && link.classList.length === 0
                && isExternalLink(link.href,
                    config.site.url,
                    config.site.external_link.exclude);
        }).each((i, link) => {
            link.relList.add('noopener');
            link.target = '_blank';
        });
    }
    // load toc fold or show
    loadToc();
}

function loadMathJax() { //加载mathjax
    $.getScript("//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_CHTML", function () {
        MathJax.Hub.Config({ tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] } });
        var math = document.getElementsByClassName("entry-content")[0];
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, math]);
    });
}

$(document).ready(function () {
    loadMainJs(jQuery, window.moment, window.ClipboardJS, window.IcarusThemeSettings);
    console.info('%c CHKAOS %c - Find the calm in the chaos', 'background: #000; color: #fff; font-weight:900;font-size:24px','background: rgb(254,154,0); color: #000; font-weight:900;font-size:24px');
    console.log(`联系方式vx：chkaos2020\n`)
    // 跨站脚本攻击提醒
    console.info("跨站脚本攻击提醒：如果您不清楚即将粘贴代码的作用，请勿继续操作！")
});