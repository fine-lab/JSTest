viewModel.get("button7uj") &&
  viewModel.get("button7uj").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button8ee") &&
  viewModel.get("button8ee").on("click", function (data) {
    // 确认--单击
    const parentViewModel = viewModel.getCache("parentViewModel");
    const optropinions = viewModel.get("optropinions").getValue();
    cb.rest.invokeFunction(
      "AT177016BE17B80006.apiFunction.updateOpptState",
      {
        id: parentViewModel.getParams().id,
        define27: parentViewModel.get("optactiontype").getValue(),
        define32: optropinions
      },
      function (err, res) {
        if (res) {
          parentViewModel.getParams().mode = "add";
          parentViewModel.get("optropinions").setData(optropinions);
          //执行保存
          parentViewModel.get("btnSave").execute("click");
          viewModel.communication({ type: "modal", payload: { data: false } });
          cb.loader.runCommandLine(
            "bill",
            {
              billtype: "voucherList",
              billno: "ybf7cfce10List",
              params: {}
            },
            parentViewModel
          );
        }
      }
    );
  });