require.config({
    paths: {
        'jquery': '/bower_components/jquery/dist/jquery.min',
        'jqueryui': '/bower_components/jquery-ui/jquery-ui.min',
        'knockout': '/bower_components/knockout/dist/knockout',
        'markdown': '/node_modules/markdown/lib/markdown',
        'colorpicker': '/bower_components/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min'
    },
    shim: {
        'jqueryui': {
            exports: '$',
            deps: ['jquery', 'colorpicker']
        },
        'markdown': {
            exports: 'markdown'
        }
    }
});

require(['hello', 'jqueryui'], function(Hello, $ ) {
    var app = new Hello.App();
    app.start();
});
