viewModel.get("button6ub") &&
  viewModel.get("button6ub").on("click", function (data) {
    // 测试连接--单击
    cb.utils.loadingControl.start();
    const gridModel = viewModel.getGridModel();
    const rowData = gridModel.getRow(data.index);
    var entityName = rowData.entityName;
    var options = {
      domainKey: "yourKeyHere",
      mask: true
    };
    //判断数据源类型  语义模型 关系型数据源
    var data_source_type = rowData.data_source_type;
    if (data_source_type == "1") {
      var url = "semantic/model?entities=" + entityName;
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
    } else {
      //请求接口
      var url = "/spc/api/v1/ds/TestConnection?id=" + rowData.id;
      var getPro = cb.rest.DynamicProxy.create({
        settle: {
          url: url,
          method: "get",
          options: options
        }
      });
      getPro.settle({}, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return;
        } else {
          console.log(JSON.stringify(res));
          cb.utils.alert("连接成功");
        }
      });
    }
    cb.utils.loadingControl.end();
  });
viewModel.get("button9pj") &&
  viewModel.get("button9pj").on("click", function (data) {
    // 数据初始化--单击
    // 初始化数据--单击
    //请求地址
    var url = "/spc/api/v1/chart/SpcTenantInit";
    var options = {
      domainKey: "yourKeyHere"
    };
    //请求接口
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: url,
        method: "post",
        options: options
      }
    });
    proxy.settle({}, function (err, result) {
      if (err) {
        cb.utils.alert(err.msg, "error");
        return;
      } else {
        console.log(JSON.stringify(result));
        cb.utils.alert("刷新成功");
      }
    });
  });