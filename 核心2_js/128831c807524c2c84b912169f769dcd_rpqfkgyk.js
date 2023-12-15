viewModel.on("customInit", function (data) {
  // 正式客户--页面初始化   && cb.rest.interMode !== "mobile"
  viewModel.on("afterLoadData", (args) => {
    if (viewModel.getParams()["mode"] == "add" || viewModel.getParams()["mode"] == "edit") {
      viewModel.get("merchantDefine!define1")?.setVisible(false);
      viewModel.get("merchantDefine!define2")?.setVisible(false);
      viewModel.get("merchantDefine!define3")?.setVisible(false);
      viewModel.get("merchantDefine!define5")?.setVisible(false);
      viewModel.get("merchantDefine!define6")?.setVisible(false);
      viewModel.get("merchantDefine!define7")?.setVisible(false);
      viewModel.get("merchantDefine!define8")?.setVisible(false);
      viewModel.get("merchantDefine!define1")?.setState("bIsNull", true);
      viewModel.get("merchantDefine!define2")?.setState("bIsNull", true);
      viewModel.get("merchantDefine!define3")?.setState("bIsNull", true);
      viewModel.get("merchantDefine!define5")?.setState("bIsNull", true);
      viewModel.get("merchantDefine!define6")?.setState("bIsNull", true);
      viewModel.get("merchantDefine!define7")?.setState("bIsNull", true);
      viewModel.get("merchantDefine!define8")?.setState("bIsNull", true);
    }
  });
  viewModel.get("btnEdit")?.on("click", function () {
    viewModel.get("merchantDefine!define1")?.setVisible(false);
    viewModel.get("merchantDefine!define2")?.setVisible(false);
    viewModel.get("merchantDefine!define3")?.setVisible(false);
    viewModel.get("merchantDefine!define5")?.setVisible(false);
    viewModel.get("merchantDefine!define6")?.setVisible(false);
    viewModel.get("merchantDefine!define7")?.setVisible(false);
    viewModel.get("merchantDefine!define8")?.setVisible(false);
    viewModel.get("merchantDefine!define1")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define2")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define3")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define5")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define6")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define7")?.setState("bIsNull", true);
    viewModel.get("merchantDefine!define8")?.setState("bIsNull", true);
  });
});