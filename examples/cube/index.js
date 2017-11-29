window.onload = function() {
    lucca.vm('cube')
        .model('cube')
        .view('cube')
        .accept({
            'toCube':'top',
            'toWow':'left',
            'toSuch':'right',
            'toDefault':'default'
        });
    lucca.model('cube')
        .define({
            rotateX:-20,
            rotateY:45,
            rotateZ:0,
            currentFace:'default'
        })
        .handle('right', function(prevModel) {
            prevModel.rotateX = 0;
            prevModel.rotateY = 0;
            prevModel.rotateZ = 0;
            prevModel.currentFace = 'right';
        })
        .handle('left', function(prevModel) {
            prevModel.rotateX = 0;
            prevModel.rotateY = 91;
            prevModel.rotateZ = 0;
            prevModel.currentFace = 'left';
        })
        .handle('top', function(prevModel) {
            prevModel.rotateX = -91;
            prevModel.rotateY = 0;
            prevModel.rotateZ = 0;
            prevModel.currentFace = 'top';
        })
        .handle('default', function(prevModel) {
            prevModel.rotateX = -20;
            prevModel.rotateY = 45;
            prevModel.rotateZ = 0;
            prevModel.currentFace = 'default';
        })
    lucca.view('cube')
        .define(function(h, v, i, a) {
            return h(`div.container`, {
                classes: {
                    'top': i('currentFace') == 'top',
                    'left': i('currentFace') == 'left',
                    'right': i('currentFace') == 'right',
                    'default': i('currentFace') == 'default'
                }
            }, [
                h('div.cubecontainer', {}, [
                    h('div.cube', {
                        style: `transform:rotateX(${i('rotateX')}deg) rotateY(${i('rotateY')}deg) rotateZ(${i('rotateZ')}deg)`
                    }, [
                        h('div.top.face', {}, [
                            h('div.text', {}, ['Cube'])
                        ]),
                        h('div.right.face', {}, [
                            h('div.text', {}, ['Such'])
                        ]),
                        h('div.left.face', {}, [
                            h('div.text', {}, ['Wow'])
                        ]),
                        h('div.bottom.face', {}, [])
                    ])
                ]),
                h('div.buttonbar', {}, [
                    h('div.button', {
                        onclick: a.toCube
                    }, ['Top']),
                    h('div.button', {
                        onclick: a.toWow
                    }, ['Left']),
                    h('div.button', {
                        onclick: a.toSuch
                    }, ['Right']),
                    h('div.button', {
                        onclick: a.toDefault
                    }, ['Default'])
                ])
            ])
        })
        .registerActions('toCube', 'toWow', 'toSuch', 'toDefault')
    
    lucca.init(document.body);
    lucca.tick();

}