/**
 * VNodeView Test Suite
 */
var view;
var model;
beforeEach(function() {
    view = lucca.view('test');
    model = lucca.model('test');
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
        model.define(defaultData);
        view.define(viewConstructor);
    });
    describe('#render', function() {
        it('should call the view constructor', function() {
            var vnode = view.render(model);
            chai.expect(viewConstructor.called).to.be.true;
        });
    });
});