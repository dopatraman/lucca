window.onload = function() {
    lucca.model('textbind')
        .define({
            title: 'My Sidepanel'
        })
        .handle('main', function(prevModel) {
            prevModel.title = 'MainNow';
        })
        .handle('default', function(prevModel) {
            prevModel.title = 'My Sidepanel';
        })
        .handle('userText', function(prevModel, evt) {
            if (evt.srcElement.value) {
                prevModel.title = evt.srcElement.value;
            }
            else {
                prevModel.title = 'Empty!'
            }
            
        })
    lucca.view('textbind')
        .define((h, v, i, a) => {
            console.log(a);
            return h('div.container', {}, [
                h('div.title', {
                    onclick:a.toMain,
                }, [i('title')]),
                h('input', {type:'text', onkeyup:a.typing})
            ])
        })
        .registerActions('toMain', 'toDefault', 'typing')
    lucca.vm('textbind')
        .model('textbind')
        .view('textbind')
        .accept({
            'toMain':'main',
            'toDefault':'default',
            'typing': 'userText'
        });
    lucca.init(document.body);
    lucca.tick();
}