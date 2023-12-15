viewModel.on("customInit", function (data) {
  var currentState = viewModel.getParams();
  console.log("状态");
  console.log(currentState.mode);
  setTimeout(function () {}, 1000);
  setTimeout(function () {
    // 类型编码
    var value = viewModel.get("CoopOrgClassCode").getValue();
    // 行政级次
    var gg = viewModel.get("government_grade").getValue();
    // 系统上级
    var param = viewModel.get("sysparent_name");
    // 系统上级编码
    var paramcode = viewModel.get("sysparentcode");
    var datasource = [
      {
        value: "1",
        text: "中央",
        nameType: "string"
      },
      {
        value: "2",
        text: "省级",
        nameType: "string"
      },
      {
        value: "3",
        text: "市级",
        nameType: "string"
      },
      {
        value: "4",
        text: "县级",
        nameType: "string"
      },
      {
        value: "5",
        text: "乡镇",
        nameType: "string"
      },
      {
        value: "6",
        text: "村级",
        nameType: "string"
      }
    ];
    if (!!value) {
      // 组织类型--参照弹窗确认按钮点击前
      var code = value;
      var cdata = [];
      switch (code) {
        case "X":
        case "I":
        case "S":
        case "C":
          cdata = datasource;
          var area = viewModel.get("sysAreaOrgCode").getValue();
          if (area.slice(3) == "0000000000") {
            viewModel.get("government_grade").select(cdata[1].value);
          } else if (area.slice(5) == "00000000") {
            viewModel.get("government_grade").select(cdata[2].value);
          } else if (area.slice(7) == "000000") {
            viewModel.get("government_grade").select(cdata[3].value);
          }
          break;
        case "Z":
          param.setVisible(false);
          cdata = datasource;
          break;
        case "E":
        case "F":
        case "M":
          cdata = datasource.slice(4, 6);
          viewModel.get("government_grade").select(cdata[0].value);
          break;
      }
      viewModel.get("government_grade").setDataSource(cdata);
    } else {
      viewModel.get("government_grade").setDataSource(datasource);
    }
  }, 100);
});
viewModel.get("ManageOrg_name") &&
  viewModel.get("ManageOrg_name").on("beforeBrowse", function (data) {
    //集团公司（上级单位）--参照弹窗打开前
    let returnPromise = new cb.promise();
    cb.rest.invokeFunction("GT9912AT31.auth.queryMyMainOrgs", { serviceCode: "3a1393e1-383e-4256-a3e7-a89692eda1ec" }, function (err, res) {
      let mainorgs = res.res.data;
      console.log(mainorgs);
      data.treeCondition = { isExtend: true, simpleVOs: [] };
      data.treeCondition.simpleVOs.push({
        logicOp: "and",
        conditions: [
          {
            field: "sysOrg",
            op: "in",
            value1: mainorgs
          },
          {
            field: "isbizunit",
            op: "eq",
            value1: "1"
          },
          {
            field: "isManageOrg",
            op: "eq",
            value1: "1"
          }
        ]
      });
      returnPromise.resolve();
    });
    return returnPromise;
  });
viewModel.get("parent_name") &&
  viewModel.get("parent_name").on("beforeBrowse", function (data) {
    //集团公司（上级单位）--参照弹窗打开前
    let returnPromise = new cb.promise();
    cb.rest.invokeFunction("GT9912AT31.auth.queryMyMainOrgs", { serviceCode: "3a1393e1-383e-4256-a3e7-a89692eda1ec" }, function (err, res) {
      let mainorgs = res.res.data;
      console.log(mainorgs);
      let ManageOrg = viewModel.get("ManageOrg").getValue();
      data.treeCondition = { isExtend: true, simpleVOs: [] };
      data.treeCondition.simpleVOs.push({
        logicOp: "and",
        conditions: [
          {
            field: "sysOrg",
            op: "in",
            value1: mainorgs
          },
          {
            field: "verifystate",
            op: "eq",
            value1: "2"
          },
          {
            field: "isbizunit",
            op: "eq",
            value1: "1"
          },
          {
            field: "path",
            op: "like",
            value1: ManageOrg
          }
        ]
      });
      returnPromise.resolve();
    });
    return returnPromise;
  });
viewModel.get("button9jc") &&
  viewModel.get("button9jc").on("click", function (data) {
    //重置组织编码--单击
    var OrgCode = viewModel.get("OrgCode").getValue();
    viewModel.get("item726th").setValue(OrgCode);
  });
viewModel.get("button7ib") &&
  viewModel.get("button7ib").on("click", function (data) {
    var currentState = viewModel.getParams();
    // 保存--单击
    var id = viewModel.get("id").getValue();
    var ManageOrg = viewModel.get("ManageOrg").getValue();
    var name = viewModel.get("name").getValue();
    var code = viewModel.get("OrgCode").getValue();
    var taxpayerid = viewModel.get("taxpayerid").getValue();
    var sql = "";
    var sql1 = "";
    var sql2 = "";
    if (!!id) {
      sql += "select id from GT34544AT7.GT34544AT7.GxsOrg where name='" + name + "' and ManageOrg='" + ManageOrg + "' and id!='" + id + "' and dr=0";
      sql1 += "select id from GT34544AT7.GT34544AT7.GxsOrg where OrgCode='" + code + "' and id!='" + id + "' and dr=0";
      if (taxpayerid !== "") {
        sql2 += "select id from GT34544AT7.GT34544AT7.GxsOrg where taxpayerid='" + taxpayerid + "' and id!='" + id + "' and dr=0";
      }
    } else {
      sql += "select id from GT34544AT7.GT34544AT7.GxsOrg where name='" + name + "' and ManageOrg='" + ManageOrg + "' and dr=0";
      sql1 += "select id from GT34544AT7.GT34544AT7.GxsOrg where OrgCode='" + code + "' and dr=0";
      if (taxpayerid !== "") {
        sql2 += "select id from GT34544AT7.GT34544AT7.GxsOrg where taxpayerid='" + taxpayerid + "' and dr=0";
      }
    }
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      var list = res.recordList;
      if (list.length > 0) {
        viewModel.get("name").setValue("");
        cb.utils.confirm(
          "保存失败=>单位名称重复或为空，请重新输入",
          function () {},
          function (args) {}
        );
      } else {
        cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql: sql1 }, function (err, res) {
          var list1 = res.recordList;
          if (list1.length > 0) {
            viewModel.get("codeNO").setValue("");
            cb.utils.confirm(
              "保存失败=>编码重复或为空，请重新输入",
              function () {},
              function (args) {}
            );
          } else {
            if (taxpayerid !== "") {
              cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql: sql2 }, function (err, res) {
                var list2 = res.recordList;
                if (list2.length > 0) {
                  viewModel.get("taxpayerid").setValue("");
                  cb.utils.confirm(
                    "保存失败=>纳税识别号重复或为空，请重新输入",
                    function () {},
                    function (args) {}
                  );
                } else {
                  var btn = viewModel.get("btnSave");
                  btn.execute("click");
                }
              });
            } else {
              var btn = viewModel.get("btnSave");
              btn.execute("click");
            }
          }
        });
      }
    });
  });