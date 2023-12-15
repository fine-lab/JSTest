var gridModel = viewModel.getGridModel();
// 自定义排序，排序字段 huodongmingchen
viewModel.get("button22sg") &&
  viewModel.get("button22sg").on("click", function (data) {
    //按钮--单击
    viewModel.communication({
      type: "menu",
      payload: {
        menuCode: "FP",
        carryData: {
          query: "xxx",
          title: "往来核销"
        }
      }
    });
  });