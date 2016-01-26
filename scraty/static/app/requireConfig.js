require.config({
    paths: {
        'jquery': '/bower_components/jquery/dist/jquery.min',
        'jqueryui': '/bower_components/jquery-ui/jquery-ui.min',
        'knockout': '/bower_components/knockout/dist/knockout'
    },
    shim: {
        'jqueryui': {
            exports: '$',
            deps: ['jquery']
        }
    }
});

require(['hello', 'jqueryui'], function(Hello, $ ) {
    var app = new Hello.App();
    app.start();
});
