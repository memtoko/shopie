/**
* global md5
*/
function getGravatar(email) {
    let _default = '//www.gravatar.com/avatar/000?s=200';
    // This regex match all email, maybe.
    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(email)) {
        return _default;
    }
    let emailMd5 = md5(email);
    return `//www.gravatar.com/avatar/{ $emailMd5 }.jpg?s=200`;
}

export default getGravatar;
