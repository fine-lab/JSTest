viewModel.get("button3ah") &&
  viewModel.get("button3ah").on("click", function (data) {
    // 取消--单击
    viewModel.communication({
      type: "return"
    });
  });
viewModel.get("button8mk") &&
  viewModel.get("button8mk").on("click", function (data) {
    // 确定--单击
    let params = viewModel.getParams();
    let currentRowData = params.currentRowData;
    let inputData = viewModel.getData();
    let submitData = {
      billid: currentRowData.id,
      bt: currentRowData.nhBusinessType,
      cz: "2",
      type: currentRowData.nhCertificates,
      ryid: currentRowData.nhname,
      czy: cb.rest.AppContext.user.userId,
      czy_name: cb.rest.AppContext.user.userName,
      ywy: inputData.item16qe,
      czsj: inputData.item12pa
    };
    cb.rest.invokeFunction("AT15BFE8B816C80007.backend.BorrowAction", { submitData }, function (err, res) {
      if (err) {
        cb.utils.alert(err);
        return;
      }
      if (res && res.result === 1) {
        viewModel.getCache("parentViewModel").getCache("FilterViewModel").get("search").fireEvent("click", {});
        cb.utils.alert(res.message);
        viewModel.communication({
          type: "return"
        });
      } else {
        cb.utils.alert(res.message);
        viewModel.communication({
          type: "return"
        });
      }
    });
  });