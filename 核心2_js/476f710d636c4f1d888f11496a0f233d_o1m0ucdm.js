var gridModel = viewModel.get("order_id");
console.log("----------------");
console.log(gridModel);
viewModel.get("order_id") &&
  viewModel.get("order_id").on("afterValueChange", function (data) {
    // 订单名称--值改变后
    console.log(data);
    cb.rest.invokeFunction("AT15EF163808080001.backOpenApiFunction.testSearch", { id: data.value }, function (err, res) {
      if (err != null) {
        cb.utils.alert("查询异常");
        console.log(err);
      } else {
        if (res.record.length > 0) {
          viewModel.get("order_name").setValue(res.record[0].order_name);
        }
      }
    });
  });