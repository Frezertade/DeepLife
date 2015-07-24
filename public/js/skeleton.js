var BASE_URL = "";

var gettext = new Gettext({ 'domain' : 'messages' });

function __(msgid) {
    return gettext.gettext(msgid);
}

function _p(msgid, args) {
    return Gettext.strargs(__(msgid), args);
}
