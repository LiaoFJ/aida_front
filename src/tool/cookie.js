const setCookie = (name,value) => {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*30);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

const getCookie = (name) => {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
}

function WriteCookie(name) {
    var now = new Date();
    now.setMonth( now.getMonth() - 1 );
    cookievalue = escape(document.myform.customer.value) + ";"
    
    document.cookie = name + '=' + cookievalue;
    document.cookie = "expires=" + now.toUTCString() + ";"
    document.write("Setting Cookies : " + "name=" + cookievalue );
  }

export {
    setCookie,
    getCookie,
    WriteCookie
}