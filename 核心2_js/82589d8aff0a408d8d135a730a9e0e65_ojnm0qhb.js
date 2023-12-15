viewModel.on("customInit", function (data) {
  viewModel.getParams().autoLoad = false;
});
viewModel.get("button14cd") &&
  viewModel.get("button14cd").on("click", function (data) {
    // 打印预览--单击
    var args = cb.utils.extend(
      true,
      {},
      {
        cCommand: "cmdBatchPrintpreview",
        cAction: "printpreview",
        cSvcUrl: "/bill",
        cHttpMethod: "POST",
        authOperate: false,
        fieldName: "button14cd",
        fieldRuntimeState: false,
        cItemName: "button14cd",
        cCaption: "打印预览",
        cShowCaption: "打印预览",
        bEnum: false,
        cControlType: "button",
        iStyle: 0,
        bVmExclude: 0,
        iOrder: 10,
        uncopyable: false,
        bEnableFormat: false,
        key: "yourkeyHere",
        cExtProps: '{"cSubId":"GT14722AT8","isMain":false,"bEnable":["browse"],"virtualField":true,"bVisible":["browse"],"uiObject":"controls","ideDesignType":"ysmdd","order":10}',
        cSubId: "yourIdHere",
        isMain: false,
        bEnable: ["browse"],
        virtualField: true,
        bVisible: ["browse"],
        uiObject: "controls",
        ideDesignType: "ysmdd",
        order: 10,
        domainKey: "yourKeyHere",
        needClear: false,
        cmdParameter: '{"printcode":"temp","meta":1,"classifyCode":"cc6125ff","params":{"billno":"cc6125ff"}}'
      },
      {
        key: "yourkeyHere"
      }
    );
    args.cShowCaption = this._get_data("cShowCaption");
    args.cCaption = this._get_data("cCaption");
    var self = this;
    args.disabledCallback = function () {
      self.setDisabled(true);
    };
    args.enabledCallback = function () {
      self.setDisabled(false);
    };
    viewModel.biz.do("printpreview", viewModel, args);
  });
viewModel.get("button11gh") &&
  viewModel.get("button11gh").on("click", function (data) {
    var proxy = viewModel.setProxy({
      settle: {
        url: "/scmbc/rack/syn",
        method: "get",
        contentType: "application/json;charset=utf-8",
        dataType: "json"
      }
    });
    //传参
    var param = {};
    proxy.settle(param, function (err, result) {
      if (!err.success) {
        cb.utils.alert(err.message, "error");
        return;
      }
      cb.utils.alert("同步完成。");
    });
  });