viewModel.get("button8yf") &&
  viewModel.get("button8yf").on("click", function (data) {
    // 测试连接--单击
    const gridModel = viewModel.getGridModel();
    const rowData = gridModel.getRow(data.index);
    var entityName = rowData.entityName;
    //请求地址
    var url = "semantic/model?entities=" + entityName;
    var options = {
      domainKey: "yourKeyHere"
    };
    //请求接口
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: url,
        method: "get",
        options: options
      }
    });
    proxy.settle({}, function (err, result) {
      if (err) {
        cb.utils.alert(err.msg, "error");
        return;
      } else {
        console.log(JSON.stringify(result));
        if (result.msg !== "SUCCESS") {
          cb.utils.alert("请求语义模型详情接口失败！", "error");
          return;
        }
        const columns = result.data[0].columns;
        if (columns.length < 1) {
          cb.utils.alert("未获取到语义模型详情信息，请检查实体名称是否正确！", "error");
          return;
        }
        cb.utils.alert("连接成功");
      }
    });
  });