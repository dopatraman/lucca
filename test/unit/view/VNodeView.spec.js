/**
 * VNodeView Test Suite
 */
var view;
beforeEach(function() {
    view = lucca.view('test');
});
describe('VNodeView Suite', function() {     
    var viewConstructor;
    var defaultData;
    beforeEach(function() {
        viewConstructor = function(h, v, i, a) {
            viewConstructor.called = true;
            viewConstructor.arguments = arguments;
        };
        defaultData = {
            'hello':'world'
        };
        view.define(viewConstructor);
    });
    describe('#render', function() {
        it('should call the view constructor', function() {
            var vnode = view.render(defaultData);
            chai.expect(viewConstructor.called).to.be.true;
        });
    });
});