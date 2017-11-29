/**
 * VNodeApp tests
 */
describe('VNodeApp Suite', function() {
    beforeEach(function() {

    });
    describe('health check', function() {
        it('should have a models map', function() {
            chai.expect(lucca.models).to.not.be.undefined;
        });
        it('should have a views map', function() {
            chai.expect(lucca.views).to.not.be.undefined;
        });
        it('should have a receivers map', function() {
            chai.expect(lucca.recv).to.not.be.undefined;
        });
        it('should have a renderer', function() {
            chai.expect(lucca.renderer).to.not.be.undefined;
        });
    });
    describe('#model', function() {
        var m;
        beforeEach(function() {
            m = lucca.model('test');
        });
        afterEach(function() {
            m = null;
        });
        it('should return a Model', function() {
            chai.expect(m).to.not.be.undefined;
            chai.expect(m.constructor.name).to.equal('BaseModel');
        });
        it('should store a created model', function() {
            chai.expect(lucca.models.get('test')).to.equal(m);
        });
    });
    describe('#view', function() {
        var v;
        beforeEach(function() {
            v = lucca.view('test');
        });
        afterEach(function() {
            v = null;
        });
        it('should return a View', function() {
            chai.expect(v).to.not.be.undefined;
            chai.expect(v.constructor.name).to.equal('VNodeView');
        });
        it('should store a created view', function() {
            chai.expect(lucca.views.get('test')).to.equal(v);
        });
    });
    describe('#vm', function() {
        var r;
        beforeEach(function() {
            r = lucca.vm('test');
        });
        afterEach(function() {
            r = null;
        });
        it('should return a Receiver', function() {
            chai.expect(r.constructor.name).to.equal('BaseReceiver');
        });
        it('should store a created receiver', function() {
            chai.expect(lucca.recv.get('test')).to.equal(r);
        });
    });
    describe('#tick', function() {
        var prevTick;
        var prevActionTick;
        beforeEach(function() {
            prevTick = lucca.tick;
            prevActionTick = lucca.actionTick;
            window.requestAnimationFrame = function(tickFn) {
                window.requestAnimationFrame.called = true;
            }
            lucca.actionTick = function() {
                lucca.actionTick.called = true;
            }
        });
        afterEach(function() {
            lucca.tick = prevTick;
            lucca.actionTick = prevActionTick;
            prevTick = null;
            prevActionTick = null;
        });
        it('should call rAF', function() {
            lucca.tick();
            chai.expect(window.requestAnimationFrame.called).to.equal(true);
        });
        it('should call actionTick', function() {
            lucca.tick();
            chai.expect(lucca.actionTick.called).to.equal(true);
        });
    });
    describe('#init', function() {
        var prevMount;
        beforeEach(function() {
            lucca.model("test");
            lucca.view("test");
            lucca.vm("test").model("test").view("test");
            prevMount = lucca.renderer.mount;
            lucca.renderer.mount = function() {
                lucca.renderer.mount.called = true;
            }
        });
        afterEach(function() {
            lucca.renderer.mount = prevMount;
            prevMount = null;
        })
        it('should call the renderer', function() {
            lucca.init(document.body);
            chai.expect(lucca.renderer.mount.called).to.equal(true);
        })
    });
});