/**
 * VNode Provider Tests
 */
describe("VNode Provider Suite", function() {
    describe("#provide", function() {
        it("should produce a VNode", function() {
            v = lucca.htmlProvider.provide("div", {}, [])
            chai.expect(v).to.not.be.null;
        });
        it("should provide a VNode with the proper tag name", function() {
            v = lucca.htmlProvider.provide("div", {}, [])
            chai.expect(v.vnodeSelector).to.equal('div');
        });
    });
    describe("#forEach", function() {
        it("should provide a list of VNodes after iteration", function() {
            var data = [{
                content: "hello"
            }, {
                content: "world"
            }];
            var iteratorFn = function(item) {
                return ["div", {}, item.content];
            }
            var elements = lucca.htmlProvider.forEach(data, iteratorFn);
            chai.expect(elements.length).to.equal(data.length);
            chai.expect(elements[0][0]).to.equal("div");
            chai.expect(elements[0][2]).to.equal("hello");
            chai.expect(elements[1][2]).to.equal("world");
        });
        it("should throw an error if data is not an array", function() {
            chai.expect(() => { lucca.htmlProvider.forEach({}) }).to.throw("data must be iterable to use forEach");
        })
    })
})