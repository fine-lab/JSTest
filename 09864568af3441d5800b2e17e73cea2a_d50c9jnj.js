viewModel.on("customInit", function (data) {
  //固定资产变动单列表--页面初始化
  var viewModel = this;
  //动态引入js-xlsx库
  let secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT37522AT1/xlsx.common.extend.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
});
viewModel.get("button26ih") &&
  viewModel.get("button26ih").on("click", function () {
    //加载js-xlsx
    cb.utils.loadingControl.start(); //开启一次loading
    loadJsXlsx(viewModel);
    //触发文件点击事件
    selectFile(function () {
      debugger;
      let excelData = viewModel.getCache("workbookInfoDatas") || [];
      var serviceUrl = viewModel.getAppContext().serviceUrl;
      if (excelData.length > 0) {
        cb.utils.alert("开始导入并构建变动单", "success");
        cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/FA/changeExcelData?domainKey=developplatform"], function (a) {
          a.resolveExcelData({ viewModel: viewModel, excelData: excelData[0], serviceUrl: serviceUrl })
            .then(a.batchCheckSn)
            .then(a.batchCreateBillChange)
            .then((result) => {
              cb.utils.loadingControl.end(); //关闭loading
              let allMessage = "";
              result &&
                result.map((item) => {
                  if (item.status == "rejected") {
                    allMessage += item.reason;
                  }
                });
              if (!allMessage && allMessage == "") {
                cb.utils.alert("导入成功！", "success");
              } else {
                cb.utils.alert(allMessage, "error");
              }
              viewModel.execute("refresh");
            })
            .catch((error) => {
              cb.utils.loadingControl.end(); //关闭loading
              cb.utils.alert(error, "error");
              viewModel.execute("refresh");
            });
        });
      }
    });
  });