viewModel.get("button22de") &&
  viewModel.get("button22de").on("click", function (data) {
    //保存--单击
    var currentState = viewModel.getParams();
    var id = viewModel.get("sysDept").getValue();
    var code = viewModel.get("DeptCode").getValue();
    var sql = "";
    var sql1 = "";
    var sql2 = "";
    if (!!id) {
      sql1 += "select id from org.func.BaseOrg where code='" + code + "' and id!='" + id + "' and dr=0";
    } else {
      sql1 += "select id from org.func.BaseOrg where code='" + code + "' and dr=0";
    }
    console.log(sql1);
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql: sql1, domainKey: "yourKeyHere" }, function (err, res) {
      var list1 = res.recordList;
      if (list1.length > 0) {
        cb.utils.confirm(
          "保存失败！ 编码重复，请重新输入",
          function () {},
          function (args) {}
        );
      } else {
        var btn = viewModel.get("btnSave");
        btn.execute("click");
      }
    });
  });
viewModel.get("DeptCode") &&
  viewModel.get("DeptCode").on("afterValueChange", function (data) {
    //部门编码--值改变后
    console.log("编码改变");
    console.log(data.value);
    var id = viewModel.get("sysDept").getValue();
    var code = viewModel.get("DeptCode").getValue();
    let sql1 = "";
    if (!!id) {
      sql1 += "select id from org.func.BaseOrg where code='" + code + "' and id!='" + id + "' and dr=0";
    } else {
      sql1 += "select id from org.func.BaseOrg where code='" + code + "' and dr=0";
    }
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql: sql1, domainKey: "yourKeyHere" }, function (err, res) {
      var list1 = res.recordList;
      if (list1.length > 0) {
        viewModel.get("item90eg").setValue("编码重复");
      } else {
        viewModel.get("item90eg").setValue("编码正确");
      }
    });
  });