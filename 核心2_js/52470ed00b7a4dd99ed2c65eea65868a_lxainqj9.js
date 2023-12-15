setTimeout(function () {
  let file = null;
  getFileFromUrl("https://www.example.com/").then((response) => {
    file = response.file;
    let fileName = response.fileName;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      debugger;
      //这里测试把base64下载下来
      downloadFileByBase64(reader.result, fileName);
    };
  });
}, 2000);
function getFileFromUrl(url) {
  return new Promise((resolve, reject) => {
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Accept", "application/octet-stream");
    xhr.responseType = "blob";
    // 加载时处理
    xhr.onload = (args) => {
      // 获取返回结果
      blob = xhr.response;
      let attachName = decodeURI(xhr.getResponseHeader("content-disposition"));
      let fileName = attachName.slice(22, -1);
      debugger;
      let file = new File([blob], fileName, { type: "application/pdf" });
      // 返回结果
      resolve({ file: file, fileName: fileName });
    };
    xhr.onerror = (e) => {
      reject(e);
    };
    // 发送
    xhr.send();
  });
}
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
//下载方法
function downloadFile(url, name) {
  var a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", name);
  a.setAttribute("target", "_blank");
  let clickEvent = document.createEvent("MouseEvents");
  clickEvent.initEvent("click", true, true);
  a.dispatchEvent(clickEvent);
}
function downloadFileByBase64(base64, name) {
  var myBlob = dataURLtoBlob(base64);
  var myUrl = URL.createObjectURL(myBlob);
  downloadFile(myUrl, name);
}