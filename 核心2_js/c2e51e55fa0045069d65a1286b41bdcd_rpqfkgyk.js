viewModel.on("customInit", function (data) {
  // 潜在客户--页面初始化&& cb.rest.interMode !== "mobile"
  viewModel.on("afterLoadData", (args) => {
    if (viewModel.getCache("entryMode") === "edit" || (viewModel.getParams()["mode"] == "add" && viewModel.getCache("parentViewModel")?.modelType !== "CUST_cust_custregularappcard_VM")) {
      viewModel.get("merchantDefine!define1").setVisible(false);
      viewModel.get("merchantDefine!define2").setVisible(false);
      viewModel.get("merchantDefine!define3").setVisible(false);
      viewModel.get("merchantDefine!define5").setVisible(false);
      viewModel.get("merchantDefine!define6").setVisible(false);
      viewModel.get("merchantDefine!define7").setVisible(false);
      viewModel.get("merchantDefine!define8").setVisible(false);
      viewModel.get("merchantDefine!define1").setState("bIsNull", true);
      viewModel.get("merchantDefine!define2").setState("bIsNull", true);
      viewModel.get("merchantDefine!define3").setState("bIsNull", true);
      viewModel.get("merchantDefine!define5").setState("bIsNull", true);
      viewModel.get("merchantDefine!define6").setState("bIsNull", true);
      viewModel.get("merchantDefine!define7").setState("bIsNull", true);
      viewModel.get("merchantDefine!define8").setState("bIsNull", true);
    } else {
      viewModel.get("merchantDefine!define1").setVisible(true);
      viewModel.get("merchantDefine!define2").setVisible(true);
      viewModel.get("merchantDefine!define3").setVisible(true);
      viewModel.get("merchantDefine!define5").setVisible(true);
      viewModel.get("merchantDefine!define6").setVisible(true);
      viewModel.get("merchantDefine!define7").setVisible(true);
      viewModel.get("merchantDefine!define8").setVisible(true);
    }
  });
  //潜客编辑
  viewModel.get("btnEdit").on("click", function (args) {
    viewModel.get("merchantDefine!define1").setVisible(false);
    viewModel.get("merchantDefine!define2").setVisible(false);
    viewModel.get("merchantDefine!define3").setVisible(false);
    viewModel.get("merchantDefine!define5").setVisible(false);
    viewModel.get("merchantDefine!define6").setVisible(false);
    viewModel.get("merchantDefine!define7").setVisible(false);
    viewModel.get("merchantDefine!define8").setVisible(false);
    viewModel.get("merchantDefine!define1").setState("bIsNull", true);
    viewModel.get("merchantDefine!define2").setState("bIsNull", true);
    viewModel.get("merchantDefine!define3").setState("bIsNull", true);
    viewModel.get("merchantDefine!define5").setState("bIsNull", true);
    viewModel.get("merchantDefine!define6").setState("bIsNull", true);
    viewModel.get("merchantDefine!define7").setState("bIsNull", true);
    viewModel.get("merchantDefine!define8").setState("bIsNull", true);
  });
});