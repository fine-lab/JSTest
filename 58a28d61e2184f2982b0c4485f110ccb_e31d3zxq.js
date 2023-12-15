viewModel.on("customInit", function (data) {
  //购进入库验收模态框
  viewModel.on("afterLoadData", function () {
    if (viewModel.getParams().mode == "add") {
      viewModel.get("billId").setValue(viewModel.getParams().billId);
      viewModel.get("billEntryId").setValue(viewModel.getParams().billEntryId);
    }
  });
  viewModel.on("afterSave", function () {
    let file = viewModel.get("file").getValue();
    let fileNo = viewModel.get("fileNo").getValue();
    var parentViewModel = viewModel.getCache("parentViewModel");
    //调用api接口进行更新
    let returnPromise = new cb.promise();
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.uploadFile",
      {
        billId: viewModel.getParams().billId,
        billEntryId: viewModel.getParams().billEntryId,
        file: file,
        fileNo: fileNo
      },
      function (err, res) {
        if (res != undefined) {
          parentViewModel.execute("refresh"); //刷新父页面
          returnPromise.resolve();
        }
        if (err != undefined) {
          cb.utils.alert(err.message, "error");
          returnPromise.reject();
        }
        return returnPromise;
      }
    );
  });
});