viewModel.on("afterRule", function (args) {
  let mode = viewModel.getParams().mode;
  if (mode === "add") {
    viewModel.get("city_name").setDisabled(true);
    viewModel.get("region_name").setDisabled(true);
  }
});
viewModel.get("province_name") &&
  viewModel.get("province_name").on("afterValueChange", function (data) {
    //省--值改变后
    let { value, oldValue } = data;
    if (!data.value) {
      // 空值所有状态
      viewModel.get("city_name").setDisabled(true);
      viewModel.get("city_name").setValue("");
      viewModel.get("city").setValue("");
      viewModel.get("region_name").setDisabled(true);
      viewModel.get("region_name").setValue("");
      viewModel.get("region").setValue("");
    } else if (oldValue && oldValue.id == value.id) {
    } else {
      viewModel.get("city_name").setDisabled(false);
    }
  });
viewModel.get("city_name") &&
  viewModel.get("city_name").on("afterValueChange", function (data) {
    //市--值改变后
    let { value, oldValue } = data;
    if (!data.value) {
      // 空值所有状态
      viewModel.get("region_name").setDisabled(true);
      viewModel.get("region_name").setValue("");
      viewModel.get("region").setValue("");
    } else if (oldValue && oldValue.id == value.id) {
    } else {
      viewModel.get("region_name").setDisabled(false);
    }
  });
viewModel.get("region_name") &&
  viewModel.get("region_name").on("afterValueChange", function (data) {
    //区--值改变后
  });
viewModel.get("orderinfo_id") &&
  viewModel.get("orderinfo_id").on("afterValueChange", function (data) {
    //订单号--值改变后
  });
viewModel.get("norderinfo_ordercode") &&
  viewModel.get("norderinfo_ordercode").on("afterValueChange", function (data) {
    if (!data.value) {
      viewModel.get("orderprojecList").setData([]);
      return;
    }
    //订单号--值改变后
    cb.rest.invokeFunction("6ef1dff28cee4818bf21bff49714ed5f", { ordercode: data.value.ordercode }, function (err, res) {
      if (err) return;
      viewModel.get("orderprojecList").setData(res.data || []);
    });
  });
viewModel.get("orderprojecList") &&
  viewModel.get("orderprojecList").on("afterSetDataSource", function (data) {
    //表格2--设置数据源后
    var norderType = viewModel
      .get("orderprojecList")
      .getData()
      .map((item) => item.type);
    norderType = Array.from(new Set(norderType));
    if (norderType.includes("D")) {
      viewModel.get("outordernu").setState("bIsNull", false);
    } else {
      viewModel.get("outordernu").setState("bIsNull", true);
    }
    if (norderType.length === 1) {
      if (norderType[0] === "C") {
        viewModel.get("defaultaction").setValue("2");
        viewModel.get("defaultaction").setDisabled(true);
      } else if (norderType[0] === "D") {
        viewModel.get("defaultaction").setValue("1");
        viewModel.get("defaultaction").setDisabled(true);
      }
    } else {
      viewModel.get("defaultaction").setValue("");
      viewModel.get("defaultaction").setDisabled(false);
    }
    let count = 0;
    viewModel
      .get("orderprojecList")
      .getData()
      .forEach((item) => {
        count += Number(item.amount) || 0;
      });
    viewModel.get("amount").setValue(count);
  });
viewModel.get("projectinfoList") &&
  viewModel.get("projectinfoList").on("afterSetDataSource", function (data) {
    //表格-项目信息--设置数据源后
  });
viewModel.get("item101cb") &&
  viewModel.get("item101cb").on("afterRead", function (arg) {
    let dataList = arg.file.response.content;
    const keyMap = {
      子项目名称: "projectname",
      子项目负责人: "projectmanager",
      负责人联系电话: "concat",
      子项目类型: "projectType",
      子项目日期: "date"
    };
    let gridData = [];
    dataList.forEach((row) => {
      let rowData = {};
      Object.keys(keyMap).forEach((item) => {
        rowData[keyMap[item]] = row[item];
      });
      gridData.push(rowData);
    });
    viewModel.get("projectinfoList").setData(gridData);
  });
viewModel.get("button34hj") &&
  viewModel.get("button34hj").on("click", function (data) {
    //按钮--单击
    cb.rest.invokeFunction("dd94ecc4c8594594bed632815332c6f5", { ordercode: viewModel.get("norderinfo_ordercode").getValue() }, function (err, res) {
      if (err) return;
    });
  });
viewModel.on("beforeSave", function (data) {
  var promise = new cb.promise();
  cb.rest.invokeFunction("dd94ecc4c8594594bed632815332c6f5", { ordercode: viewModel.get("norderinfo_ordercode").getValue() }, function (err, res) {
    if (err) {
      promise.reject();
      return;
    }
    let data = JSON.parse(res.data);
    if (data.code === 200 && data.staus === 1) {
      promise.resolve();
    } else {
      cb.utils.alert("订单号校验未通过！", "error");
      promise.reject();
    }
  });
  return promise;
});