function decodeString(str) {
    var REG_HEX = /&#x([a-fA-F0-9]+);/g;
    return str.replace(REG_HEX, function(match, grp){
        var num = parseInt(grp, 16);
        return String.fromCharCode(num);
    });
}

export default decodeString;