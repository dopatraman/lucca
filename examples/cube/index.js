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
            return h.tml(`div.container`, {
                classes: {
                    'top': i['currentFace'] == 'top',
                    'left': i['currentFace'] == 'left',
                    'right': i['currentFace'] == 'right',
                    'default': i['currentFace'] == 'default'
                }
            }, [
                h.tml('div.cubecontainer', {}, [
                    h.tml('div.cube', {
                        style: `transform:rotateX(${i['rotateX']}deg) rotateY(${i['rotateY']}deg) rotateZ(${i['rotateZ']}deg)`
                    }, [
                        h.tml('div.top.face', {}, [
                            h.tml('div.text', {}, ['Top'])
                        ]),
                        h.tml('div.right.face', {}, [
                            h.tml('div.text', {}, ['Right'])
                        ]),
                        h.tml('div.left.face', {}, [
                            h.tml('div.text', {}, ['Left'])
                        ]),
                        h.tml('div.bottom.face', {}, [])
                    ])
                ]),
                h.tml('div.buttonbar', {}, [
                    h.tml('div.button', {
                        onclick: a.toCube
                    }, ['Top']),
                    h.tml('div.button', {
                        onclick: a.toWow
                    }, ['Left']),
                    h.tml('div.button', {
                        onclick: a.toSuch
                    }, ['Right']),
                    h.tml('div.button', {
                        onclick: a.toDefault
                    }, ['Default'])
                ])
            ])
        })
        .registerActions('toCube', 'toWow', 'toSuch', 'toDefault')
    
    lucca.init(document.body);
    lucca.tick();

}