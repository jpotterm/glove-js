var utilities = utilities || {};


utilities.addCommas = function(n) {
    var s = n.toString();
    var result = "";

    for (var i = 0, len = s.length; i < len; ++i) {
        if (i % 3 == 0 && i != 0) {
            result = ',' + result;
        }

        result = s[len - 1 - i] + result;
    }

    return result;
};

utilities.abbreviateNumber = function(value) {
    var newValue = value;

    if (value >= 1000) {
        var suffixes = ['', 'k', 'm', 'b','t'];
        var suffixNum = Math.floor((''+value).length / 3);
        var shortValue = '';

        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) break;
        }

        if (shortValue % 1 != 0) shortNum = shortValue.toFixed(1);

        newValue = shortValue + suffixes[suffixNum];
    }

    return newValue;
};

utilities.formatFileSize = function(bytes) {
    if (typeof bytes !== 'number') {
        return '';
    }
    if (bytes >= 1000000000) {
        return (bytes / 1000000000).toFixed(2) + ' GB';
    }
    if (bytes >= 1000000) {
        return (bytes / 1000000).toFixed(2) + ' MB';
    }
    return (bytes / 1000).toFixed(2) + ' KB';
};

utilities.repeat = function(s, n) {
    var result = '';

    for (var i = 0; i < n; ++i) {
        result += s;
    }

    return result;
};

utilities.zeroFill = function(n, pad) {
    var s = n.toString();

    return utilities.repeat('0', pad - s.length) + s;
};

utilities.pluralize = function(word, count) {
    if (count > 1) {
        return word + 's';
    } else {
        return word;
    }
};

utilities.toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

utilities.splitUnquotedWhitespace = function(str) {
    return str.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
};

utilities.stripPunctuation = function(s) {
    return s.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,'');
};

utilities.sector = function(cx, cy, r, startAngle, endAngle) {
    var rad = Math.PI / 180,
        x1 = cx + r * Math.cos(-startAngle * rad),
        x2 = cx + r * Math.cos(-endAngle * rad),
        xm = cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
        y1 = cy + r * Math.sin(-startAngle * rad),
        y2 = cy + r * Math.sin(-endAngle * rad),
        ym = cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad),
        res = [
            "M", cx, cy,
            "L", x1, y1,
            "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2,
            "z"
        ];

    res.middle = { x: xm, y: ym };
    return res;
};
