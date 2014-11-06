// -----------------------------------------------------------------------------
// Allows a Django form to be submitted via ajax and have errors displayed on
// the form.
//
// Options
//     form: The form DOM element.
//     messageElement (optional): The DOM element in which the success or error
//         messag will be shown. Defaults to form > .message.
//     fieldWrapperElement (optional): The DOM element that wraps the input
//         fields. Defaults to form > .field-wrapper.
//     processingText (optional): Text to be shown on the submit button while
//         the form submission is processing.
//     validText (optional): Message to be shown if the form is valid.
//         Defaults to 'We have received your message!'.
//     invalidText (optional): Message to be shown if the form is invalid.
//         Defaults to 'Please correct the errors below.'.
//     errorText (optional): Message to be shown if we cannot communicate with
//         the server. Defaults to 'An error has occurred, please try again.'.
//     validProperty (optional): Property name in the returned JSON that
//         indicates whether the form is valid. Defaults to 'valid'.
//     htmlProperty (optional): Property name in the returned JSON that
//         contains HTML to replace the form with. Defaults to 'form'.
// -----------------------------------------------------------------------------

function DjangoAjaxForm(options) {
    this.bindThis();

    var defaultOptions = {
        messageElement: $(options.form).find('.message'),
        fieldWrapperElement: $(options.form).find('.field-wrapper'),
        processingText: 'Processing...',
        validText: 'We have received your message!',
        invalidText: 'Please correct the errors below.',
        errorText: 'An error has occurred, please try again.',
        validProperty: 'valid',
        htmlProperty: 'form'
    };

    options = $.extend(defaultOptions, options);

    this.form = $(options.form);
    this.messageElement = $(options.messageElement);
    this.fieldWrapperElement = $(options.fieldWrapperElement);
    this.processingText = options.processingText;
    this.processingText = options.processingText;
    this.validText = options.validText;
    this.invalidText = options.invalidText;
    this.errorText = options.errorText;
    this.validProperty = options.validProperty;
    this.htmlProperty = options.htmlProperty;

    this.form.on('submit', this.submit);
}

DjangoAjaxForm.prototype.bindThis = function() {
    this.submit = $.proxy(this.submit, this);
};

DjangoAjaxForm.prototype.submit = function(e) {
    var self = this;
    e.preventDefault();

    var submitButton = this.form.find('input[type="submit"]');
    var defaultSubmitText = submitButton.val();
    var originalHtml = this.fieldWrapperElement.html();

    submitButton.val(this.processingText);
    $.ajax({
        url: this.form.attr('action'),
        type: 'POST',
        dataType: 'json',
        data: this.form.serialize(),
        success: function(data) {
            submitButton.val(defaultSubmitText);

            if (data[self.validProperty]) {
                self.messageElement.text(self.validText);
                self.messageElement.removeClass('error');
                self.messageElement.addClass('success');
            } else {
                self.messageElement.text(self.invalidText);
                self.messageElement.removeClass('success');
                self.messageElement.addClass('error');
            }

            self.fieldWrapperElement.html(data[self.htmlProperty]);
        },
        error: function(data) {
            submitButton.val(defaultSubmitText);
            self.messageElement.text(self.errorText);
        }
    });
};
