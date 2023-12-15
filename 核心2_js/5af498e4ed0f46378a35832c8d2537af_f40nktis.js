viewModel.on("customInit", function (data) {
  // 正式客户--页面初始化   && cb.rest.interMode !== "mobile"
  viewModel.on("afterLoadData", (args) => {
    if (viewModel.getParams()["mode"] == "add" || viewModel.getParams()["mode"] == "edit") {
      if (viewModel.getCache("parentViewModel")?.modelType == "CUST_cust_custregularappcard_VM" || viewModel.getCache("parentViewModel")?.modelType == "CUST_cust_customerchangeapplycard_VM") {
        viewModel.get("merchantDefine!define1")?.setVisible(true);
        viewModel.get("merchantDefine!define2")?.setVisible(true);
        viewModel.get("merchantDefine!define3")?.setVisible(true);
        viewModel.get("merchantDefine!define4")?.setVisible(true);
        viewModel.get("merchantDefine!define5")?.setVisible(true);
        viewModel.get("merchantDefine!define6")?.setVisible(true);
        viewModel.get("merchantDefine!define7")?.setVisible(true);
        viewModel.get("merchantDefine!define1")?.setState("bIsNull", false);
        viewModel.get("merchantDefine!define2")?.setState("bIsNull", false);
        viewModel.get("merchantDefine!define3")?.setState("bIsNull", false);
        viewModel.get("merchantDefine!define4")?.setState("bIsNull", false);
        viewModel.get("merchantDefine!define5")?.setState("bIsNull", false);
        viewModel.get("merchantDefine!define6")?.setState("bIsNull", false);
        viewModel.get("merchantDefine!define7")?.setState("bIsNull", false);
      } else {
        viewModel.get("merchantDefine!define1")?.setVisible(false);
        viewModel.get("merchantDefine!define2")?.setVisible(false);
        viewModel.get("merchantDefine!define3")?.setVisible(false);
        viewModel.get("merchantDefine!define4")?.setVisible(false);
        viewModel.get("merchantDefine!define5")?.setVisible(false);
        viewModel.get("merchantDefine!define6")?.setVisible(false);
        viewModel.get("merchantDefine!define7")?.setVisible(false);
        viewModel.get("merchantDefine!define1")?.setState("bIsNull", true);
        viewModel.get("merchantDefine!define2")?.setState("bIsNull", true);
        viewModel.get("merchantDefine!define3")?.setState("bIsNull", true);
        viewModel.get("merchantDefine!define4")?.setState("bIsNull", true);
        viewModel.get("merchantDefine!define5")?.setState("bIsNull", true);
        viewModel.get("merchantDefine!define6")?.setState("bIsNull", true);
        viewModel.get("merchantDefine!define7")?.setState("bIsNull", true);
      }
    }
  });
  viewModel.get("btnEdit")?.on("click", function () {
    viewModel.get("merchantDefine!define1")?.setVisible(false);
    viewModel.get("merchantDefine!define2")?.setVisible(false);
    viewModel.get("merchantDefine!define3")?.setVisible(false);
    viewModel.get("merchantDefine!define4")?.setVisible(false);
    viewModel.get("merchantDefine!define5")?.setVisible(false);
    viewModel.get("merchantDefine!define6")?.setVisible(false);
    viewModel.get("merchantDefine!define7")?.setVisible(false);
    viewModel.get("merchantDefine!define1")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define2")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define3")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define4")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define5")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define6")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define7")?.setState("bIsNull", true);
  });
});