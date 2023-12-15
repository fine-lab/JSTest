viewModel.get("button13kf") &&
  viewModel.get("button13kf").on("click", function (data) {
    //按钮--单击
    //客户名称--值改变后
    var id = viewModel.get("id").getValue();
    var DeptCode = viewModel.get("DeptCode").getValue();
    var sql = "";
    if (!!id) {
      sql += "select id from GT1559AT25.GT1559AT25.GxyCustomerDept where DeptCode='" + DeptCode + "' and id!='" + id + "' and dr=0 ";
    } else {
      sql += "select id from GT1559AT25.GT1559AT25.GxyCustomerDept where DeptCode='" + DeptCode + "' and dr=0 ";
    }
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      var list = res.recordList;
      if (list.length > 0) {
        viewModel.get("item341we").setValue("编码重复!");
        cb.utils.confirm(
          "保存失败=>编码重复，请重新输入",
          function () {},
          function (args) {}
        );
      } else {
        viewModel.get("item341we").setValue("编码正确!");
        var btn = viewModel.get("btnSave");
        btn.execute("click");
      }
    });
  });
viewModel.get("DeptCode") &&
  viewModel.get("DeptCode").on("afterValueChange", function (data) {
    //部门编码--值改变后
    var id = viewModel.get("id").getValue();
    var DeptCode = viewModel.get("DeptCode").getValue();
    var sql = "";
    if (!!id) {
      sql += "select id from GT1559AT25.GT1559AT25.GxyCustomerDept where DeptCode='" + DeptCode + "' and id!='" + id + "' and dr=0 ";
    } else {
      sql += "select id from GT1559AT25.GT1559AT25.GxyCustomerDept where DeptCode='" + DeptCode + "' and dr=0 ";
    }
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      var list = res.recordList;
      if (list.length > 0) {
        viewModel.get("item341we").setValue("编码重复!");
      } else {
        viewModel.get("item341we").setValue("编码正确!");
      }
    });
  });