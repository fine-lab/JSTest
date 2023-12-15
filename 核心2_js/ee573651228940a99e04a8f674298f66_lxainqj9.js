viewModel.on("beforeSubmit", function () {
  //事件发生之前，可以进行特色化处理，以此为例，可以进行保存之前数据校验，通过return true;否则return false;
  debugger;
  var viewModel = this;
  let result = cb.rest.invokeFunction("GT89699AT3.backOpenApiFunction.Test0001", {}, function (err, res) {}, viewModel, { async: false });
  var resultData = result.result;
  var id = resultData.res1[0].id;
  var a1 = viewModel.get("applier").getValue();
  if (id != null && a1 != null && id != a1) {
    return false;
  }
});
//引入cdn 域名换成自己环境的  我这里是https://dbox.diwork.com
viewModel.on("afterWorkflowBeforeQueryAsync", (args) => {
  window.YYCooperationBridge.ready(() => {
    window.YYCooperationBridge.YYGetFilesIncludeDelete({
      businessType: "iuap-yonbuilder-runtime",
      businessId: viewModel.get("attachfile").getValue()
    }).then((fileRes) => {
      console.log(fileRes);
      const fileId = fileRes.data[0].id; //这里获取到了fileId 多个文件自行处理
      const qzId = 0; //固定值
      const open = false; //固定值
      var filenames = fileRes.data[0].fileName;
      var fileExtension = fileRes.data[0].fileExtension;
      var billno = viewModel.get("code").getValue();
      let res = window.YYCooperationBridge.YYGetDownloadUrl(fileId);
      let file = null;
      getFileFromUrl(res).then((response) => {
        file = response.file;
        let fileName = file.name;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          console.log(reader.result);
          debugger;
          cb.rest.invokeFunction("GT89699AT3.backOpenApiFunction.testattachid", { billno: billno, fileExtension: fileExtension, fileName: fileName, filePath: reader.result }, function (err, res) {
            debugger;
          });
          //这里测试把base64下载下来
        };
      });
    });
  });
});
function getFileFromUrl(url) {
  return new Promise((resolve, reject) => {
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
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
viewModel.on("customInit", function (data) {
  // 用印申请单--页面初始化
});