//前端函数调用API函数
viewModel.get("button24ei") &&
  viewModel.get("button24ei").on("click", function (data) {
    // 按钮--单击
    const gridModel = viewModel.getGridModel();
    console.log(gridModel.getSelectedRows());
    const listModel = gridModel.getSelectedRows();
    for (var i = 0; i < listModel.length; i++) {
      console.log(listModel[i].ming);
      console.log(listModel[i].bianma);
      console.log(listModel[i].shifuyihuixie);
      console.log(listModel[i].item72gh);
      const data = {};
      data["id"] = listModel[i].id;
      data["uname"] = listModel[i].ming;
      data["upwd"] = 123456;
      cb.rest.invokeFunction("GT1972AT1.TEST01.CRMT0001", { data }, function (err, res) {
        console.log(res);
        if (res != null) {
          const data = JSON.parse(res.apiResponse);
          console.log(data);
          if (data.returnCode == "200") {
            cb.utils.alert(res.apiResponse, "success");
          } else {
            cb.utils.alert("单据回写失败，请稍后重试！", "error");
          }
        } else {
          cb.utils.alert("单据回写失败，请稍后重试！", "error");
        }
      });
    }
  });