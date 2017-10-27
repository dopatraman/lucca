/**
 * Base Model Tests
 */
describe("BaseModel Suite", function() {
    var model;
    beforeEach(function() {
        model = lucca.model("hello");
    });
    describe('#define', function() {
        it('should define a model', function() {
            model.define({
                hello:'world'
            });
            chai.expect(model.data.get('hello')).to.equal('world');
        })
    })
})