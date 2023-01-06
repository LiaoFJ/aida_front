const isEmail = (email)=>{
    let  reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    let result = reg.test(email)
    return result
}

const getUploadUrl = () =>{
    let url = process.env.VUE_APP_BASE_URL || ''
    return url
}	
 
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr =atob(arr[1]);    
    var n = bstr.length;     
    var u8arr =new Uint8Array(n); 
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime });
}

function blobToFile(blob, fileName){
    blob.lastModifiedDate =new Date();
    blob.name = fileName;
    return blob;
}

function dataURLtoFile(dataurl, filename){
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    var blob = dataURLtoBlob(dataurl);
    return blobToFile(blob, filename);
}

const base64toFile = (dataurl, filename = 'file') => {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
    })

}

function rgbToHsv([R, G, B]) {
    R /= 255
    G /= 255
    B /= 255
    const max = Math.max(R, G, B)
    const min = Math.min(R, G, B)
    const range = max - min
    let V = max
    let S = V === 0 ? 0 : range / V
    let H = 0
    if (R === V) H = (60 * (G - B)) / range
    if (G === V) H = 120 + (60 * (B - R)) / range
    if (B === V) H = 240 + (60 * (R - G)) / range
   
    if (range === 0) H = 0
    if (H < 0) H += 360
    H = (H / 2) * (256 / 180)
    S *= 255
    V *= 255

    H = parseInt(H)
    S = parseInt(S)
    V = parseInt(V) 
    return [H, S, V]
  }

  const formatTime = (timestamp, fmt) =>{
    // date = new Date(), fmt = 'MM/dd/yyyy';
    let date = new Date();
    date.setTime(timestamp * 1000);

    if (!fmt) {
        formatRule ? (fmt = formatRule) : (fmt = "YYYY-MM-DD hh:mm:ss");
    }
    // console.log(formatRule)
    let o = {
        'M+': date.getMonth() + 1, // 月份
        'D+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S+': date.getMilliseconds(), // 毫秒
        'a': date.getHours() > 12
            ? 'PM'
            : 'AM' // 上午还是下午
    };
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    if(/(a)/.test(fmt)&&o['h+']>12){
        o['h+'] = o['h+'] - 12
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
                ? (o[k])
                : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }

    return fmt;
}

const isMoible = () => {
    let is_mobile = navigator.userAgent.toLowerCase().match(/(ipad|ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;
    if(is_mobile){
        return true
    }else{
        return false
    }
}



export{
    isEmail,
    getUploadUrl,
    dataURLtoFile,
    blobToFile,
    base64toFile,
    rgbToHsv,
    formatTime,
    dataURLtoBlob,
    isMoible,
}