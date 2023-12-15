viewModel.get("button22ff") &&
  viewModel.get("button22ff").on("click", function (data) {
    //测试按钮--单击
    //获取一个字段
    let new1 = viewModel.get("cy_jine").getValue();
    cb.rest.invokeFunction("AT19D3CA6A0868000B.cytest.testapifun", { new1: new1 }, function (err, res) {
      console.log(err);
      console.log(res);
    });
  });
viewModel.get("button26ac") &&
  viewModel.get("button26ac").on("click", function (data) {
    //批量新增--单击
    var data = {
      insertBatch: [
        { shoukuandanhao: "11", kehu: "11", jine: "11" },
        { shoukuandanhao: "12", kehu: "12", jine: "12" }
      ]
    };
    cb.rest.invokeFunction("AT19D3CA6A0868000B.backOpenApiFunction.shoukuanInsert", { data: data }, function (err, res) {});
  });