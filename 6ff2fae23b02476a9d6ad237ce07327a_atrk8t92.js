// 取证/还证
viewModel.get("button27uc").on("click", (params) => {
  let data = {
    billtype: "Voucher", // 单据类型
    billno: "nhzzqzhzref", // 单据号，可通过预览指定页面后，在浏览器地址栏获取，在Voucher后面的字符串既是
    params: {
      mode: "add", // (编辑态edit、新增态add、浏览态edit + readOnly:true)
      readOnly: false // 必填，否则调整到卡片页后，不调用默认的接口
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel); // bill 打开列表弹窗
});
viewModel.get("button45ed").on("click", () => {
  cb.rest.invokeFunction(
    "AT15BFE8B816C80007.backend.appendRow",
    {
      url: "AT15BFE8B816C80007.AT15BFE8B816C80007.nhzzjyjl",
      billNo: "nhzzmg",
      object: {}
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err, "error");
        return false;
      }
      if (res && res.data) {
        debugger;
      }
    }
  );
});
viewModel.on("customInit", function (data) {
  // 证照管理详情--页面初始化
  viewModel.on("afterLoadMeta", function (data) {
    // 隐藏一个主表字段
    viewModel.get("btnBizFlowPush").setVisible(false);
    viewModel.get("btnModelPreview").setVisible(false);
  });
});
viewModel.get("button56za") && viewModel.get("button56za").on("click", function (data) {});