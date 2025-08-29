<?php

if (! function_exists('setting')) {
    function setting($key, $default = null) {
        return app('settings')->get($key, $default);
    }
}
