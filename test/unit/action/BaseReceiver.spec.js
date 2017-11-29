/**
 * BaseReceiver Tests
 */
describe("BaseReceiver Suite", function() {
    var recv;
    afterEach(function() {
        recv = null;
    })
    describe("#init", function() {
        it("should throw an error for a null model", function() {
            recv = lucca.vm("test");
            chai.expect(() => { recv.init(new Map(), new Map()) }).to.throw("model undefined is null")
        });
        it("should throw an error for a null view", function() {
            m = lucca.model("test");
            recv = lucca.vm("test").model("test");
            chai.expect(() => { recv.init(lucca.models, new Map()) }).to.throw("view undefined is null")
        });
    });
    describe("#triggerStateChange", function() {
        it("should throw an error for a null model", function() {
            recv = lucca.vm("test");
            chai.expect(() => { recv.triggerStateChange("test") }).to.throw("model cannot be null")
        });
    });
    describe("#getRenderTree", function() {
        it("should throw an error for a null view", function() {
            recv = lucca.vm("test");
            chai.expect(() => { recv.getRenderTree() }).to.throw("view cannot be null")
        });
    });
});