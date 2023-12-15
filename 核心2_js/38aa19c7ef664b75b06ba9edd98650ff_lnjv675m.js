viewModel.get("sysManageOrg_name") &&
  viewModel.get("sysManageOrg_name").on("beforeBrowse", function (data) {
    //组织名称--参照弹窗打开前
  });
viewModel.get("OrgCode") &&
  viewModel.get("OrgCode").on("afterValueChange", function (data) {
    //部门编码--值改变后
    console.log("编码改变");
    console.log(data.value);
    viewModel.get("item900ua").setValue(data.value);
    console.log("copy编码修改为");
    console.log(viewModel.get("item900ua").getValue());
    var id = viewModel.get("id").getValue();
    let sql1 = "";
    if (!!id) {
      sql1 += "select id from GT34544AT7.GT34544AT7.GxsOrg where OrgCode='" + data.value + "' and id!='" + id + "' and dr=0";
    } else {
      sql1 += "select id from GT34544AT7.GT34544AT7.GxsOrg where OrgCode='" + data.value + "' and dr=0";
    }
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql: sql1 }, function (err, res) {
      var list1 = res.recordList;
      if (list1.length > 0) {
        viewModel.get("item843cg").setValue("编码重复");
      } else {
        viewModel.get("item843cg").setValue("编码正确");
      }
    });
  });
viewModel.get("codeNO") &&
  viewModel.get("codeNO").on("afterValueChange", function (data) {
    //编码序号--值改变后
    console.log("编码序号改变");
  });
viewModel.get("button8vg") &&
  viewModel.get("button8vg").on("click", function (data) {
    //保存--单击
    var currentState = viewModel.getParams();
    // 保存--单击
    var id = viewModel.get("id").getValue();
    var code = viewModel.get("OrgCode").getValue();
    var name = viewModel.get("name").getValue();
    var sql = "";
    var sql1 = "";
    var sql2 = "";
    if (!!id) {
      sql1 += "select id from GT34544AT7.GT34544AT7.GxsOrg where name='" + name + "' and OrgCode='" + code + "' and id!='" + id + "' and dr=0";
    } else {
      sql1 += "select id from GT34544AT7.GT34544AT7.GxsOrg where name='" + name + "' and OrgCode='" + code + "' and dr=0";
    }
    console.log(sql1);
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql: sql1 }, function (err, res) {
      var list1 = res.recordList;
      if (list1.length > 0) {
        viewModel.get("codeNO").setValue("");
        cb.utils.confirm(
          "保存失败！ 编码或名称重复，请重新输入",
          function () {},
          function (args) {}
        );
      } else {
        const codes = code.split("_");
        let au = true;
        for (let i in codes) {
          let c = codes[i];
          if (c.length < 3) {
            au = false;
            break;
          }
        }
        var btn = viewModel.get("btnSave");
        if (au) {
          btn.execute("click");
        } else {
          cb.utils.confirm(
            "保存失败，请检查所属组织是否正确",
            function () {},
            function (args) {}
          );
        }
      }
    });
  });
viewModel.get("item900ua") &&
  viewModel.get("item900ua").on("afterValueChange", function (data) {
    //编码copy--值改变后
    console.log("copy编码改变");
    console.log(data.value);
  });