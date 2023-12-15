viewModel.get("btnDelete").on("click", function (params) {
  var check = true;
  var gridModel = viewModel.getGridModel();
  var selected = gridModel.getSelectedRows();
  if (selected.length == 0 || selected == undefined) {
    if (params.index != undefined) {
      selected = [];
      selected.push(gridModel.getRows()[params.index]);
    } else {
      cb.utils.alert("请选择数据");
      return false;
    }
  }
  console.log(params);
  console.log(selected);
  selected.forEach((row) => {
    var id = row.id;
    var shelvesName = row.shelvesName;
    console.log(id);
    cb.rest.invokeFunction("GT2152AT10.rule.hwdzsc1", { id: id, shelvesName: shelvesName }, function (err, res) {
      if (err) {
        console.log(err.message);
        check = false;
        cb.utils.confirm(err.message);
        return;
      } else {
        cb.utils.confirm("确定要删除吗？", function () {
          //获取选中行
          var gridModel = viewModel.getGridModel();
          var proxy = cb.rest.DynamicProxy.create({
            settle: {
              url: "bill/batchdelete?terminalType=1",
              method: "POST",
              options: {
                domainKey: "yourKeyHere",
                busiObj: null,
                serviceCode: "1503190372707205129"
              }
            }
          });
          //传参
          var reqParams = {
            billnum: "58d6a587List", //TODO：需要更改
            data: selected
          };
          proxy.settle(reqParams, function (err, result) {
            if (err) {
              cb.utils.alert(err.message, "error");
              return;
            } else {
              viewModel.execute("refresh");
            }
          });
          return;
        });
      }
    });
  });
});
viewModel.get("button18ei").on("click", function (params) {
  var check = true;
  var gridModel = viewModel.getGridModel();
  var selected = gridModel.getSelectedRows();
  if (selected.length == 0 || selected == undefined) {
    if (params.index != undefined) {
      selected = [];
      selected.push(gridModel.getRows()[params.index]);
    } else {
      cb.utils.alert("请选择数据");
      return false;
    }
  }
  console.log(params);
  console.log(selected);
  selected.forEach((row, index) => {
    var id = row.id;
    var shelvesName = row.shelvesName;
    console.log(index);
    cb.rest.invokeFunction("GT2152AT10.rule.hwdzsc1", { id: id, shelvesName: shelvesName }, function (err, res) {
      if (err) {
        console.log(err.message);
        check = false;
        cb.utils.confirm(err.message);
        return;
      } else {
        cb.utils.confirm("确定要删除吗？", function () {
          //默认异步
          //获取选中行
          var gridModel = viewModel.getGridModel();
          var proxy = cb.rest.DynamicProxy.create({
            settle: {
              url: "bill/batchdelete?terminalType=1",
              method: "POST",
              options: {
                domainKey: "yourKeyHere",
                busiObj: null,
                serviceCode: "1503190372707205129"
              }
            }
          });
          //传参
          var dataNew = [];
          dataNew.push(selected[index]);
          var reqParams = {
            billnum: "58d6a587List", //TODO：需要更改
            data: dataNew
          };
          proxy.settle(reqParams, function (err, result) {
            if (err) {
              cb.utils.alert(err.message, "error");
              return;
            } else {
              viewModel.execute("refresh");
            }
          });
          return;
        });
      }
    });
  });
});
viewModel.on("customInit", function (data) {
  // 货位记录--页面初始化
});
viewModel.on("afterMount", function () {
  const filtervm = viewModel.getCache("FilterViewModel");
  //查询区模型DOM初始化后
  filtervm.on("afterInit", function () {
    //赋予查询区字段初始值
    filtervm
      .get("baseOrg")
      .getFromModel()
      .on("beforeBrowse", function (data) {
        debugger;
        data.externalData = {
          noPermissionRequired: true
        };
      });
  });
});
viewModel.get("button18zc") &&
  viewModel.get("button18zc").on("click", function (data) {
    // 删除1--单击
  });
viewModel.get("btnDelete") &&
  viewModel.get("btnDelete").on("click", function (data) {
    // 删除--单击
  });