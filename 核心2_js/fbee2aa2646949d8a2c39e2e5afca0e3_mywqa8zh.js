viewModel.get("moblie") &&
  viewModel.get("moblie").on("afterValueChange", function (data) {
    // 手机号--值改变后
    var code = viewModel.get("code").getValue();
    viewModel.clear(); //清除数据
    viewModel.get("moblie").setValue(data.value);
    viewModel.get("code").setValue(code);
    cb.rest.invokeFunction("GT4984AT22.frontCustomFunction.entryapply", { mobile: data.value }, function (err, res) {
      if (err != null) {
        cb.utils.alert("查询手机号出错");
      } else {
        if (res.length != 0) {
          console.log(res.res[0]);
          let data = {
            billtype: "Voucher", // 单据类型
            billno: "fe11cf59", // 单据号
            params: {
              mode: "edit", // (编辑态edit、新增态add)
              //传参
              id: res.res[0].staff_position0521Fk_id
            }
          };
          //打开一个单据，并在当前页面显示
          cb.loader.runCommandLine("bill", data, viewModel);
        }
      }
    });
  });