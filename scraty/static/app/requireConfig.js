require.config({
    paths: {
        'jquery': '/bower_components/jquery/dist/jquery.min',
        'knockout': '/bower_components/knockout/dist/knockout'
    },
    shim: {
        'jquery': {
            exports: '$'
        }
    }
});

require(['hello', 'jquery'], function(Hello, $ ) {
    var app = new Hello.App();
    app.start();
});
