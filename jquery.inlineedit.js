/*!
 * jquery.inlineedit.js v1.6.0
 * @date 2016-10-09
 * @author Franki<franki.yu@starlight-sms.com>
 * @feedback <https://github.com/MooseFrankenstein/inlineedit/issues>
 * Licensed under the MIT license
 */
if (typeof jQuery === 'undefined') {
    throw new Error('jquery.inlineedit\'s JavaScript requires jQuery')
} + function($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 2) || (version[0] == 1 && version[1] == 2 && version[2] < 1)) {
        throw new Error('jquery.inlineedit\'s JavaScript requires jQuery version 1.2.1 or higher')
    }
}(jQuery); + function($) {
    // 开启严格模式
    'use strict';
    // 创建一个默认设置对象
    var config = {
        delay: {
            show: 50,
            hide: 75
        }
    };
    // 通过字面量创造一个对象，存储我们需要的共有方法
    var methods = {};
    // 在字面量对象中定义每个单独的方法
    methods.init = function(options) {
        // 为了更好的灵活性，对来自主函数，并进入每个方法中的选择器其中的每个单独的元素都执行代码
        $.extend(config, options);
        return this.each(function() {
            // 为每个独立的元素创建一个jQuery对象
            var $this = $(this),
                defaults = {
                    delay: {
                        show: 50,
                        hide: 75
                    }
                },
                config = $.extend(defaults, config),
                timeout,
                input = $this.children('.form-control'),
                save = $this.children('.save'),
                edit = $this.children('.edit'),
                dropdown = $this.children('.drop-toggle'),
                cancel = $this.children('.cancel');
            $this.mouseenter(function() {
                timeout = setTimeout(function() {
                    if (!$this.hasClass('focus')) {
                        $this.addClass('hover');
                    }
                }, config.delay.show);
            });
            $this.mouseleave(function() {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    $this.removeClass('hover');
                }, config.delay.hide);
            });
            $this.bind('keydown', function(event) {
                switch (event.which) {
                    // Esc键
                    case 27:
                        methods.cancel.apply(input, $this);
                        break;
                        // Tab键
                    case 9:
                        methods.save.apply(input, $this);
                        break;
                        // 回车键
                    case 13:
                        if (!input.is('textarea')) {
                            methods.save.apply(input, $this);
                        }
                        break;
                }
            });
            $(document).on('click', function(e) {
                if (!(e.target == $this[0] || $.contains($this[0], e.target))) {
                    methods.save.apply(input, $this);
                }
            });
            // 事件注册
            input.bind('click', function() {
                methods.focus.apply(input, $this);
            });
            edit.bind('click', function() {
                methods.focus.apply(input, $this);
            });
            save.bind('click', function() {
                methods.save.apply(input, $this);
            });
            cancel.bind('click', function() {
                methods.cancel.apply(input, $this);
            });
            dropdown.bind('click', function() {
                methods.dropdown.apply($this);
            });
        });
    };
    // 输入框点击方法
    methods.focus = function(wrapper) {
        $(this).focus();
        $(this).data("value", $(this).val());
        var wrapper = $(wrapper),
            isAuto = wrapper.data('open'),
            isSelect = wrapper.hasClass('select'),
            actionsBox = wrapper.data('actions-box'),
            isSelect = wrapper.hasClass('select'),
            oldValue = $(this).val();
        wrapper.removeClass('hover');
        // 设置为默认自动打开下拉框的选择器
        if (isAuto && isSelect && actionsBox) {
            wrapper.addClass('focus open');
            wrapper.find('ul.dropdown').prepend('<li><div class="btn-group btn-group-justified"><a href="javascript:void(0);" class="btn btn-default btn-sm">Select All</a><a href="javascript:void(0);" class="btn btn-default btn-sm">Deselect All</a></div></li>');
            methods.select.apply(wrapper);
            // 设置为默认不自动打开的选择器
        } else if (!isAuto && isSelect && actionsBox) {
            wrapper.addClass('focus');
            wrapper.find('ul.dropdown').prepend('<li><div class="btn-group btn-group-justified"><a href="javascript:void(0);" class="btn btn-default btn-sm">Select All</a><a href="javascript:void(0); class="btn btn-default btn-sm">Deselect All</a></div></li>');
            methods.select.apply(wrapper);
        } else if (isAuto && isSelect && !actionsBox) {
            wrapper.addClass('focus open');
            methods.select.apply(wrapper);
        } else if (!isAuto && isSelect && !actionsBox) {
            wrapper.addClass('focus');
            methods.select.apply(wrapper);
        } else {
            // 一般的输入框
            wrapper.addClass('focus');
        }
    };
    // 保存方法
    methods.save = function(wrapper) {
        var wrapper = $(wrapper);
        if (wrapper.hasClass("focus")) {
            var valid = wrapper.find('input').attr("aria-invalid");
            if (valid == "false" || typeof(valid) == "undefined") {
                $(this).blur();
                methods.saving.apply(wrapper);
                $(this).val($(this).val());
                setTimeout(function() {
                    wrapper.removeClass('focus loading saving open');
                }, 1000);
            }
        }
    };
    // 回滚方法
    methods.cancel = function(wrapper) {
        var wrapper = $(wrapper),
            oldValue = $(this).data('value');
        $(this).val(oldValue).blur();
        wrapper.removeClass('focus open');
    };
    // 下拉框取值方法
    methods.select = function() {
        var wrapper = $(this),
            dropdown = wrapper.find('.dropdown>li>a'),
            input = wrapper.children('.form-control'),
            checkbox = wrapper.find('input[type="checkbox"]');
        dropdown.bind('click', function() {
            var $checkbox = $(this).find('input[type="checkbox"]'),
                value = $(this).text();
            if (checkbox.length > 0) {
                if ($checkbox.is(':checked')) {
                    $checkbox.prop("checked", false);
                } else {
                    $checkbox.prop("checked", true);
                }
                input.val(value);
            } else {
                wrapper.removeClass('open');
            }
        });
    };
    // 下拉框方法
    methods.dropdown = function() {
        var wrapper = $(this);
        methods.loading.apply(wrapper);
        setTimeout(function() {
            wrapper.removeClass('loading').addClass('open');
        }, 1000);
    };
    // 加载数据方法
    methods.loading = function() {
        $(this).addClass('loading');
    };
    // 保存数据方法
    methods.saving = function() {
        $(this).addClass('loading saving');
    };
    // 向jQuery中被保护的“fn”命名空间中添加插件代码，用“inlineedit”作为插件的函数名称
    $.fn.inlineedit = function(method) {
        // 检验方法是否存在
        if (methods[method]) {
            // 方法是作为参数传入的，把它从参数列表中删除，因为调用方法时并不需要它
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            // 如果方法不存在，检验对象是否为一个对象（JSON对象）或者method方法没有被传入
        } else if (typeof method === 'object' || !method) {
            // 如果我们传入的是一个对象参数，或者根本没有参数，init方法会被调用，用apply方法来调用我们的方法并传入参数
            return methods.init.apply(this, arguments);
        } else {
            // 如果方法不存在或者参数没传入，则报出错误。需要调用的方法没有被正确调用
            $.error('Method ' + method + ' does not exist on $.error');
        }
    };
}(jQuery);
// 局部作用域中使用$来引用jQuery
