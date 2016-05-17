/* Common JS */
/* global $ */

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    crossDomain: false,
    beforeSend(xhr, settings) {
        if (!csrfSafeMethod(settings.type))
            xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"));
    }
});

// UI Stuff
function initUIElementBehavior() {
    // Call this function whenever relevant UI elements are dynamically added to the page
    $("button, .button, input[type='button'], input[type='submit'], input[type='reset']").mouseup(() => {
        $(this).blur();
    });
}

function showWaitScreen() {
    $("body").append("<div class='please-wait'><h2>Please wait..</h2><h4>This operation may take between 30 and 60 seconds to complete.</h4></div>");
}

$(() => {
    initUIElementBehavior();

    $(".nav a").click(event => {
        if (event.metaKey) return;
        $(".nav .selected").removeClass("selected");
        $(this).parent().addClass("selected");
    });

    $(".header h1").click(() => {
        if (event.metaKey) return;
        $(".nav .selected").removeClass("selected");
        $(".nav li").slice(0, 1).addClass("selected");
    });

    // On sortable tables, use the data-auto-sort parameter to
    // automatically sort by that field.
    $("table[data-sortable] thead th[data-auto-sort]").click();
});
