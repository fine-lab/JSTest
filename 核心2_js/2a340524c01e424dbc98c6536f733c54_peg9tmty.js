cb.defineInner([], function () {
  var MyExternal = {
    // 下载xlsx文件
    downloadExcelFile(url, fileName) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          link.click();
          link.parentNode.removeChild(link);
        } else {
          console.error("Error downloading Excel file:", xhr.statusText);
        }
      };
      xhr.onerror = function () {
        console.error("Error downloading Excel file:", xhr.statusText);
      };
      xhr.send();
    },
    downloadTemplate(code) {
      var sql = "select id, parameter_file from AT161E5DFA09D00001.AT161E5DFA09D00001.config_parameters where parameter_code = '" + code + "'";
      cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: sql }, function (err, res) {
        if (res.res.length > 0) {
          var parameter_file = res.res[0].parameter_file;
          window.YYCooperationBridge.YYFormFileGetAllListByObjectId([{ objectId: parameter_file, objectName: "iuap-yonbuilder-runtime" }], false, "", "", "", "", "").then((res) => {
            window.YYCooperationBridge.YYGetDownloadUrlV2({
              fileId: res[0].fileId
            }).then((res) => {
              window.open(res);
            });
          });
        }
      });
    }
  };
  return MyExternal;
});