viewModel.get("dict_name") &&
  viewModel.get("dict_name").on("afterValueChange", function (data) {
    //代码描述--值改变后
    check();
  });
viewModel.get("dict_code") &&
  viewModel.get("dict_code").on("afterValueChange", function (data) {
    //代码值--值改变后
    check();
  });
viewModel.get("dict_type") &&
  viewModel.get("dict_type").on("afterSelect", function (data) {
    //代码类型--选择后
    check();
  });
function check() {
  var param = {
    dict_type: viewModel.get("dict_type").getValue() ? viewModel.get("dict_type").getValue() : null,
    dict_name: viewModel.get("dict_name").getValue() ? viewModel.get("dict_name").getValue() : null,
    dict_code: viewModel.get("dict_code").getValue() ? viewModel.get("dict_code").getValue() : null,
    id: viewModel.get("id").getValue() ? viewModel.get("id").getValue() : null
  };
  cb.rest.invokeFunction("AT161E5DFA09D00001.backOpenApiFunction.checkExistForm", param, function (err, res) {
    if (res && res.exist) {
      cb.utils.alert(res.msg, "error");
    }
  });
}
viewModel.on("beforeOpen", function (args) {
  if (args.params.cCommand == "cmdUnstop") {
    var data = JSON.parse(args.data.data);
    data.confirming_person = cb.rest.AppContext.user.userName;
    args.data.data = JSON.stringify(data);
  }
});
viewModel.on("beforeClose", function (args) {
  if (args.params.cCommand == "cmdStop") {
    var data = JSON.parse(args.data.data);
    data.confirming_person = "";
    args.data.data = JSON.stringify(data);
  }
});
viewModel.on("beforeDelete", function (args) {
  var data = JSON.parse(args.data.data);
  cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.rangeIfQuote", { ids: [data.id] }, function (err, res) {
    if (res && res.exist) {
      cb.utils.alert(res.msg, "error");
      return false;
    } else {
      cb.utils.confirm(
        "确定删除吗?",
        () => {
          cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.rangeDelete", { ids: [data.id] }, function (err, res) {
            cb.utils.alert("删除成功", "success");
            viewModel.execute("refresh");
          });
        },
        () => {}
      );
    }
  });
  return false;
});