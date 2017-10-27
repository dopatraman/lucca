/**
 * Sidepanel Scenario Tests
 */

 describe('Sidepanel Suite', function() {
     describe('create a side panel', function() {
         it('should create a side panel', function() {
            lucca.model('sidepanel')
                .define({
                    title: 'My Sidepanel',
                    content: 'My Content'
                })
                .handle('main', function(prevModel) {
                    prevModel.title = 'Main Now';
                    prevModel.content = 'Main Content';
                })
                .handle('default', function(prevModel) {
                    prevModel.title = 'My Sidepanel';
                    prevModel.content = 'My Content';
                })
            lucca.view('sidepanel')
                .define((h, v, i, a) => {
                    return h('div.container', {}, [
                        h('div.title', {}, [i('title')]),
                        h('div.content', {}, [i('content')])
                    ])
                });
            lucca.vm('sidepanel')
                .model('sidepanel')
                .view('sidepanel')
                .accept({
                    'toMain':'main',
                    'toDefault':'default'
                });
            lucca.init(document.body);
            lucca.tick();
         });
     });
 });