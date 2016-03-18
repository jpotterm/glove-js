// -----------------------------------------------------------------------------
// A queue that only lets one ajax request proceed at a time. If other requests
// are made it will save the most recent one to run after the current request
// has finished.
//
// Example
//     var queue = new AjaxDroppingQueue();
//     function makeRequest() {
//         return $.post('http://example.com');
//     }
//     queue.onNext(makeRequest);
//     queue.onNext(makeRequest); // Skipped
//     queue.onNext(makeRequest); // Queued
// -----------------------------------------------------------------------------

function AjaxDroppingQueue(options) {
    this.bindThis();

    this.loading = false;
    this.onDeck = null;
}

AjaxDroppingQueue.prototype.bindThis = function() {
    this.complete = this.complete.bind(this);
};

AjaxDroppingQueue.prototype.onNext = function(f) {
    if (this.loading) {
        this.onDeck = f;
    } else {
        this.execute(f);
    }
};

AjaxDroppingQueue.prototype.complete = function() {
    this.loading = false;
    if (this.onDeck != null) {
        var f = this.onDeck;
        this.onDeck = null;
        this.execute(f);
    }
};

AjaxDroppingQueue.prototype.execute = function(f) {
    var promise = f();
    promise.always(this.complete);
    this.loading = true;
};
