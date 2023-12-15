viewModel.get("button19vf") &&
  viewModel.get("button19vf").on("click", function (data) {
    // 按钮--单击
    let params = {
      code: "20221111002",
      sf_code: "sf_20221111001",
      name: "测试业务机会20221111002",
      person: "20221111002",
      stage: "20221111002",
      client: 2336405602702336
    };
    cb.rest.invokeFunction("AT1601184E09C80009.openCatalog.insertBusiness", { request: params }, function (err, res) {
      debugger;
    });
  });