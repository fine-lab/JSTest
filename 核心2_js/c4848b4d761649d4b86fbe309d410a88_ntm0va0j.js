viewModel.get("button19hb") &&
  viewModel.get("button19hb").on("click", function (data) {
    // 调用YONQL查询--单击
    cb.rest.invokeFunction("AT17DC84EC08280005.backendFunction.queryByYonql", {}, function (err, res) {
      viewModel.get("zidingyixiang3").setValue(res.data[0].headItem_define3);
      viewModel.get("zidingyixiang5").setValue(res.data[0].headItem_define5);
      viewModel.get("zidingyixiang6").setValue(res.data[0].headItem_define6);
    });
  });