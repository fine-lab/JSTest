viewModel.on("customInit", function (data) {
  // 收款列表--页面初始化
  viewModel.on("beforeSearch", (event) => {
    let verifystate = viewModel.getCache("FilterViewModel").get("verifystate").getFromModel().getValue();
    if (verifystate) {
      let simpleVOs = (event.params.condition.simpleVOs = []);
      simpleVOs.push({
        value1: verifystate,
        op: "eq",
        field: "verifystate"
      });
    }
  });
});