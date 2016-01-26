require.config({
    paths: {
        'jquery': '/bower_components/jquery/dist/jquery.min'
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
