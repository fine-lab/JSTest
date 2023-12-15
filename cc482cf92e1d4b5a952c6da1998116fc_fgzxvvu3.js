viewModel.get("button29ka") &&
  viewModel.get("button29ka").on("click", function (data) {
    // 信用查询--单击
    const gridModel1 = viewModel.get("nfykm001List");
    gridModel1.clear();
    gridModel1.setPageSize(10);
    cb.rest.invokeFunction("9bee5f55d64f4b3a9d6122ed533241ad", {}, function (err, res) {
      var dataArr = res.dataArr;
      for (var i = 0; i < dataArr.length; i++) {
        gridModel1.appendRow({ item87ph: dataArr[i].bizId, quotaRuleId: dataArr[i].quotaRuleId });
      }
    });
    viewModel.communication({
      type: "modal",
      payload: {
        mode: "inner",
        groupCode: "modal20hc",
        viewModel: viewModel,
        data: {}
      }
    });
  });