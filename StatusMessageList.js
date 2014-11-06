if (!cloudstorage) {
    var cloudstorage = {};
}

cloudstorage.StatusMessageList = function(domNode, flashDuration) {
    this.idCounter = 0;
    this.messageList = [];
    this.domNode = domNode;
    this.defaultFlashDuration = flashDuration;
    this.loadingCount = 0;
};

cloudstorage.StatusMessageList.prototype.pushLoader = function() {
    ++this.loadingCount;
    this.updateDom();
};

cloudstorage.StatusMessageList.prototype.popLoader = function() {
    --this.loadingCount;
    this.updateDom();
};

cloudstorage.StatusMessageList.prototype.add = function(message, key, cssClasses) {
    if (!key) {
        key = '';
    }

    if (!cssClasses) {
        cssClasses = [];
    }

    var id = this.getNextId();

    this.messageList.push({
        'id': id,
        'message': message,
        'key': key,
        'cssClasses': cssClasses
    });

    this.updateDom();

    return id;
};

cloudstorage.StatusMessageList.prototype.update = function(id, message, cssClasses) {
    if (!cssClasses) {
        cssClasses = [];
    }

    var statusMessage = this.get(id)[1];

    if (statusMessage == null) {
        if (typeof id == 'string') {
            this.add(message, id, cssClasses);
        } else {
            this.add(message, null, cssClasses);
        }
    } else {
        statusMessage.message = message;
        statusMessage.cssClasses = cssClasses;
    }

    this.updateDom();
};

cloudstorage.StatusMessageList.prototype.flash = function(message, cssClasses, duration) {
    var instance = this;

    if (!cssClasses) {
        cssClasses = [];
    }

    if (!duration) {
        duration = this.defaultFlashDuration;
    }

    var itemId = this.add(message, null, cssClasses);

    var timeout = setTimeout(function() {
        instance.remove(itemId);
    }, duration);
};

cloudstorage.StatusMessageList.prototype.get = function(id) {
    var isKey = (typeof id == 'string');

    for (var i = 0; i < this.messageList.length; ++i) {
        var statusMessage = this.messageList[i];

        if (isKey) {
            if (statusMessage.key == id) {
                return [i, statusMessage];
            }
        } else {
            if (statusMessage.id == id) {
                return [i, statusMessage];
            }
        }
    }

    return [null, null];
};

cloudstorage.StatusMessageList.prototype.remove = function(id) {
    var i = this.get(id)[0];

    if (i == null)  return;

    this.messageList.splice(i, 1);
    this.updateDom();
};

cloudstorage.StatusMessageList.prototype.getNextId = function() {
    return ++this.idCounter;
};

cloudstorage.StatusMessageList.prototype.updateDom = function() {
    var loader = this.domNode.find('li.loader');
    var loaderDisplayed = loader.length != 0;

    if (this.loadingCount != 0) {
        if (!loaderDisplayed) {
            this.domNode.prepend('<li class="loader"></li>');
        }
    } else {
        loader.remove();
    }

    this.domNode.find('li.message').remove();

    for (var i = 0; i < this.messageList.length; ++i) {
        var statusMessage = this.messageList[i];

        if (statusMessage.message != null && statusMessage.message.length > 0) {
            this.domNode.append('<li class="message ' + statusMessage.cssClasses.join(' ') + '">' + statusMessage.message + '</li>');
        }
    }
};
