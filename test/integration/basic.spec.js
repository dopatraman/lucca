function testthis() {
    console.log('hey');
}
window.onload = function() {
    lucca.model('sidepanel')
        .define({
            title: 'My Sidepanel',
            content: 'My Content'
        })
        .handle('main', function(prevModel) {
            prevModel.title = 'MainNow';
            prevModel.content = 'MainContent';
        })
        .handle('default', function(prevModel) {
            prevModel.title = 'My Sidepanel';
            prevModel.content = 'My Content';
        });
    lucca.view('sidepanel')
        .define((h, v, i, a) => {
            console.log(a);
            return h('div.container', {}, [
                h('div.title', {
                    onclick:a.toMain
                }, [i('title')]),
                h('div.content', {}, [i('content')])
            ])
        })
        .registerActions('toMain', 'toDefault')
    lucca.vm('sidepanel')
        .model('sidepanel')
        .view('sidepanel')
        .accept({
            'toMain':'main',
            'toDefault':'default'
        });
    lucca.init(document.body);
    lucca.tick();
}