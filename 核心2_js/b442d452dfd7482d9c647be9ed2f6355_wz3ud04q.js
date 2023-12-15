viewModel.get("customer_name") &&
  viewModel.get("customer_name").on("afterValueChange", function (data) {
    // 客户--值改变后
    let name = viewModel.get("customer_name").getValue();
    console.log("name--------", name);
    cb.rest.invokeFunction("AT15EF3AA409680008.afterFun.testApi", { name: name }, function (err, res) {
      viewModel.get("state").setValue(res.res.res[0].phone);
      let resArr = res.res;
      console.log(resArr.res[0], "res0");
      console.log(res[0]);
      console.log(err, "----err");
      console.log(res, "----res");
    });
  });
viewModel.get("button25cj") &&
  viewModel.get("button25cj").on("click", function (data) {
    // 设置明细--单击
    let name = viewModel.get("customer_name").getValue();
    cb.rest.invokeFunction("AT15EF3AA409680008.afterFun.testYonQL", { name: name }, function (err, res) {
      let obj = res.res.res[0];
      console.log(obj, "----obj--", data);
      viewModel.get("customer_name").viewModel.get("sheetid").setValue(obj.id);
      console.log(err, "----err---", obj);
      console.log(res, "----res");
    });
    viewModel.get("sheetid");
  });
viewModel.get("button26pk") &&
  viewModel.get("button26pk").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT15EF3AA409680008.afterFun.testYonQL", { name: "lc1" }, function (err, res) {
      let obj = res.res.res[0];
      viewModel.get("state").setValue(obj.phone);
      console.log(err, "----err---", obj);
      console.log(res, "----res");
    });
  });