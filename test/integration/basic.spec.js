function testthis() {
    console.log('hey');
}
window.onload = function() {
    lucca.model('sidepanel')
        .define({
            title: 'My Sidepanel',
            content: 'My Content',
            test: 'hello'
        })
        .handle('main', function(prevModel) {
            prevModel.title = 'MainNow';
            prevModel.content = 'MainContent';
        })
        .handle('default', function(prevModel) {
            prevModel.title = 'My Sidepanel';
            prevModel.content = 'My Content';
        })
        .handle('userText', function(prevModel, evt) {
            if (evt.srcElement.value) {
                prevModel.content = evt.srcElement.value;
            }
            else {
                prevModel.content = 'Empty!'
            }
            
        })
    lucca.view('sidepanel')
        .define((h, v, i, a) => {
            console.log(a);
            return h('div.container', {}, [
                h('div.title', {
                    onclick:a.toMain,
                }, [i('title')]),
                h('div.content', {}, [i('content')]),
                h('input', {type:'text', onkeyup:a.typing})
            ])
        })
        .registerActions('toMain', 'toDefault', 'typing')
    lucca.vm('sidepanel')
        .model('sidepanel')
        .view('sidepanel')
        .accept({
            'toMain':'main',
            'toDefault':'default',
            'typing': 'userText'
        });
    lucca.init(document.body);
    lucca.tick();
}