viewModel.on("customInit", function (data) {
  var currentState = viewModel.getParams();
  console.log("状态");
  console.log(currentState.mode);
  setTimeout(function () {
    viewModel.get("item1142kc").setValue(currentState.mode);
    // 类型编码
    var value = viewModel.get("CoopOrgClassCode").getValue();
    // 行政级次
    var gg = viewModel.get("government_grade").getValue();
    // 系统上级
    var param = viewModel.get("sysparent_name");
    // 系统上级编码
    var paramcode = viewModel.get("sysparentcode");
    if (currentState.mode == "edit") {
      // 所属基层社
      // 只要不是M或E类型的公司就隐藏
      if (!(value == "M" || value == "E")) {
        param.setVisible(false);
      } else {
        if ((gg == "6" && value == "M") || value == "E") {
          param.setState("bIsNull", false);
        }
      }
      var OrgCode = viewModel.get("OrgCode").getValue();
      viewModel.get("item1233hg").setValue(OrgCode);
      console.log("编辑状态设置必填");
    } else if (currentState.mode == "add") {
      console.log("新增状态隐藏");
      var pripain = viewModel.get("item521qc_name");
      pripain.setVisible(false);
    }
    if (gg == "6" && value == "M") {
      param.setVisible(true);
      param.setState("bIsNull", false);
    } else if (value == "F" || value == "E") {
      param.setVisible(true);
      param.setState("bIsNull", true);
    } else if (value == "Z" && (gg == "5" || gg == "6")) {
      param.setVisible(true);
      param.setState("bIsNull", false);
    }
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
      var paramid = viewModel.get("sysparent");
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
          param.setState("bIsNull", true);
          cdata = datasource;
          break;
        case "E":
        case "F":
        case "M":
          cdata = datasource.slice(4, 6);
          if (code == "M") {
            param.setVisible(false);
            param.setState("bIsNull", true);
          } else {
            param.setVisible(true);
            param.setState("bIsNull", true);
          }
          viewModel.get("government_grade").select(cdata[0].value);
          break;
      }
      viewModel.get("government_grade").setDataSource(cdata);
    } else {
      viewModel.get("government_grade").setDataSource(datasource);
      var param = viewModel.get("sysparent_name");
      param.setVisible(false);
      param.setState("bIsNull", true);
    }
  }, 100);
});
viewModel.get("CoopOrgClass_name") &&
  viewModel.get("CoopOrgClass_name").on("afterValueChange", function (data) {
    // 组织类型--值改变后
    console.log("值改变");
    console.log(data);
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
    if (!!data.value) {
      // 组织类型--参照弹窗确认按钮点击前
      console.log("选项确定");
      console.log(data);
      var { code } = data.value;
      var cdata = [];
      var param = viewModel.get("sysparent_name");
      var paramcode = viewModel.get("sysparentcode");
      var paramid = viewModel.get("sysparent");
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
          paramid.setValue("");
          param.setValue("");
          param.setVisible(false);
          param.setState("bIsNull", true);
          cdata = datasource;
          break;
        case "E":
        case "F":
        case "M":
          cdata = datasource.slice(4, 6);
          if (code == "M") {
            paramid.setValue("");
            param.setValue("");
            param.setVisible(false);
            param.setState("bIsNull", true);
          } else {
            param.setVisible(true);
            param.setState("bIsNull", true);
          }
          viewModel.get("government_grade").select(cdata[0].value);
          break;
        default:
      }
      viewModel.get("government_grade").setDataSource(cdata);
    } else {
      viewModel.get("government_grade").setDataSource(datasource);
      var param = viewModel.get("sysparent_name");
      param.setVisible(false);
      param.setState("bIsNull", true);
    }
  });
viewModel.get("government_grade") &&
  viewModel.get("government_grade").on("afterValueChange", function (data) {
    // 行政级次--值改变后
    console.log("government_grade 改变");
    var value = viewModel.get("CoopOrgClassCode").getValue();
    var paramid = viewModel.get("sysparent");
    console.log(value);
    console.log(data.value);
    var param = viewModel.get("sysparent_name");
    var paramcode = viewModel.get("sysparentcode");
    if (data.value.value == "6" && value == "M") {
      param.setVisible(true);
      param.setState("bIsNull", false);
    } else if (value == "F" || value == "E") {
      param.setVisible(true);
      param.setState("bIsNull", true);
    } else if (value == "Z" && (data.value.value == "5" || data.value.value == "6")) {
      param.setVisible(true);
      param.setState("bIsNull", false);
    } else {
      paramid.setValue("");
      param.setValue("");
      param.setVisible(false);
      param.setState("bIsNull", true);
    }
  });
viewModel.get("verifystate") &&
  viewModel.get("verifystate").on("afterSetDataSource", function (data) {
    // 单据状态--设置数据源后
    console.log("审批状态 =>");
    console.log(data);
  });
viewModel.get("button8zh") &&
  viewModel.get("button8zh").on("click", function (data) {
    var currentState = viewModel.getParams();
    // 保存--单击
    var id = viewModel.get("id").getValue();
    var ManageOrg = viewModel.get("ManageOrg").getValue();
    var name = viewModel.get("name").getValue();
    var code = viewModel.get("OrgCode").getValue();
    var taxpayerid = viewModel.get("taxpayerid").getValue();
    let table = "GT34544AT7.GT34544AT7.GxsOrg";
    let params1 = { ManageOrg: { value: ManageOrg }, name: { value: name, type: "String" } };
    let res1 = cb.rest.invokeFunction("GT9912AT31.common.checkParamRepeat", { table, params: params1, id }, function (err, res) {}, viewModel, { async: false });
    let repeat1 = res1.result.repeat;
    let params2 = { OrgCode: { value: code, type: "String" } };
    let res2 = cb.rest.invokeFunction("GT9912AT31.common.checkParamRepeat", { table, params: params2, id }, function (err, res) {}, viewModel, { async: false });
    let repeat2 = res2.result.repeat;
    let repeat3 = false;
    if (taxpayerid !== "") {
      let params3 = { taxpayerid: { value: taxpayerid, type: "String" } };
      let res3 = cb.rest.invokeFunction("GT9912AT31.common.checkParamRepeat", { table, params: params3, id }, function (err, res) {}, viewModel, { async: false });
      repeat3 = res3.result.repeat;
    }
    let str = "";
    if (repeat1) {
      str += " 单位名称重复 ";
    }
    if (repeat2) {
      str += " 编码重复 ";
    }
    if (repeat3) {
      str += " 纳税识别号重复 ";
    }
    if (!repeat1 && !repeat2 && !repeat3) {
      var btn = viewModel.get("btnSave");
      btn.execute("click");
    } else {
      cb.utils.confirm(
        "保存失败=>" + str + "请重新输入",
        function () {},
        function (args) {}
      );
    }
  });
viewModel.get("codeNO") &&
  viewModel.get("codeNO").on("afterValueChange", function (data) {
    //编码序号--值改变后
    console.log(data);
    let orgid = viewModel.get("CoopOrgClassCode").getValue();
  });
viewModel.get("ManageOrg_name") &&
  viewModel.get("ManageOrg_name").on("beforeBrowse", function (data) {
    //管理单位--参照弹窗打开前
    let result = cb.rest.invokeFunction("GT9912AT31.auth.queryMyMainOrgs", { serviceCode: "1548776038999261193" }, function (err, res) {}, viewModel, { async: false });
    let mainorgs = result.result.res.data;
    var myFilter = { isExtend: true, simpleVOs: [] };
    myFilter.simpleVOs.push({
      logicOp: "and",
      conditions: [
        {
          field: "sysOrg",
          op: "in",
          value1: mainorgs
        },
        {
          field: "isManageOrg",
          op: "eq",
          value1: "1"
        }
      ]
    });
    viewModel.get("ManageOrg_name").setFilter(myFilter);
  });
viewModel.get("sysparentcode") &&
  viewModel.get("sysparentcode").on("afterValueChange", function (data) {
    let code = data.value;
    console.log("上级编码更新 " + code);
    //对应系统上级节点编码--值改变后
  });
viewModel.get("CoopOrgClassCode") &&
  viewModel.get("CoopOrgClassCode").on("afterValueChange", function (data) {
    //供销社系统组织类型编码--值改变后
    console.log("类型编码更新 " + data.value);
  });
viewModel.get("OrgCode") &&
  viewModel.get("OrgCode").on("afterValueChange", function (data) {
    // 组织编码--值改变后
    console.log("OrgCode 改变");
    var id = viewModel.get("id").getValue();
    var OrgCode = data.value;
    let table = "GT34544AT7.GT34544AT7.GxsOrg";
    let params = { OrgCode: { value: OrgCode, type: "String" } };
    if (OrgCode !== undefined) {
      let res = cb.rest.invokeFunction("GT9912AT31.common.checkParamRepeat", { table, params, id }, function (err, res) {}, viewModel, { async: false });
      let repeat = res.result.repeat;
      if (repeat !== undefined) {
        console.log(repeat);
        if (repeat) {
          viewModel.get("item1436wd").setValue("编码重复!");
        } else {
          viewModel.get("item1436wd").setValue("编码正常!");
        }
      }
    }
  });
viewModel.get("taxpayerid") &&
  viewModel.get("taxpayerid").on("afterValueChange", function (data) {
    //纳税人识别号/统一社会信用代码--值改变后
    var id = viewModel.get("id").getValue();
    var taxpayerid = data.value;
    let table = "GT34544AT7.GT34544AT7.GxsOrg";
    let params = { taxpayerid: { value: taxpayerid } };
    let res = cb.rest.invokeFunction("GT9912AT31.common.checkParamRepeat", { table, params, id }, function (err, res) {}, viewModel, { async: false });
    let repeat = res.result.repeat;
    console.log(repeat);
    if (repeat) {
      viewModel.get("item1436wd").setValue("纳税人识别号重复!");
    } else {
      viewModel.get("item1436wd").setValue("纳税人识别号正常!");
    }
  });
viewModel.get("name") &&
  viewModel.get("name").on("afterValueChange", function (data) {
    //单位名称--值改变后
    console.log("name改变");
    var id = viewModel.get("id").getValue();
    var name = data.value;
    let table = "GT34544AT7.GT34544AT7.GxsOrg";
    let params = { name: { value: name, type: "String" } };
    if (name !== undefined) {
      let res = cb.rest.invokeFunction("GT9912AT31.common.checkParamRepeat", { table, params, id }, function (err, res) {}, viewModel, { async: false });
      let repeat = res.result.repeat;
      console.log(repeat);
      if (repeat) {
        viewModel.get("item1436wd").setValue("名称重复!");
      } else {
        viewModel.get("item1436wd").setValue("名称正常!");
      }
    }
  });
viewModel.get("CoopOrgClass_name") &&
  viewModel.get("CoopOrgClass_name").on("beforeBrowse", function (data) {
    //组织类型--参照弹窗打开前
    var myFilter = { isExtend: true, simpleVOs: [] };
    myFilter.simpleVOs.push({
      field: "code",
      op: "in",
      value1: ["X", "D", "M", "E", "Z", "F", "C", "S", "I"]
    });
    viewModel.get("CoopOrgClass_name").setFilter(myFilter);
  });