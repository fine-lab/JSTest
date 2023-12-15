const gzsjGridModel = viewModel.get("snrulebList");
const gzfpGridModel = viewModel.get("snrule_distributeList");
let gridModelMng = viewModel.get("snrule_lshmngList");
viewModel.on("modeChange", function (data) {
  //获取列表所有数据
  const rows = gridModelMng.getRows();
  let action = "button24ij";
  const actionsStates = [];
  if (rows.length > 0) {
    rows.forEach((row) => {
      const actionState = {};
      if (data == "edit") {
        //设置按钮可用
        actionState[action] = { visible: true };
      } else {
        //设置按钮不可用
        actionState[action] = { visible: false };
      }
      actionsStates.push(actionState);
    });
    gridModelMng.setActionsState(actionsStates);
  }
});
gzfpGridModel.on("afterCellValueChange", function (data) {
  let orgid = viewModel.get("org_id").getValue();
  let cellName = data.cellName;
  let param = {};
  if (cellName == "pk_material_name") {
    //物料参照
    param = {
      orgid: orgid,
      pk_material: data.value.id,
      pk_marbasclass: ""
    };
  } else if (cellName == "matclass_name") {
    //物料分类
    param = {
      orgid: orgid,
      pk_material: "",
      pk_marbasclass: data.value.id
    };
  }
  let proxy = viewModel.setProxy({
    queryData: {
      url: "/scmbc/snrule/check",
      method: "get"
    }
  });
  const result = proxy.queryDataSync(param);
  if (!result.error.success) {
    cb.utils.alert(result.error.msg, "error");
    gzfpGridModel.deleteRows([data.rowIndex]);
    return false;
  }
});
gridModelMng.on("afterCellValueChange", function (data) {
  gridModelMng.setCellValue(data.rowIndex, "modifier", viewModel.getAppContext().user.userId);
  gridModelMng.setCellValue(data.rowIndex, "modifyTime", new Date().format("yyyy-MM-dd hh:mm:ss"));
});
viewModel.on("beforeDelete", function (params) {
  var selected = JSON.parse(params.data.data);
  //校验规则是否已分配
  const snruleId = selected.id;
  if (snruleId != null && snruleId != "") {
    const proxy = viewModel.setProxy({
      queryData: {
        url: "scmbc/snrule/checkDistributeById",
        method: "get"
      }
    });
    //传参
    const param = { snruleId };
    const result = proxy.queryDataSync(param);
    if (!result.error.success) {
      cb.utils.alert(result.error.msg, "error");
      return false;
    }
  }
});
viewModel.on("beforeSave", function (args) {
  if (gridModelMng.getRows().length > 0) {
    cb.utils.alert("该规则已存在流水数据，不能修改规则数据项！", "error");
    return false;
  }
  let rows = viewModel.get("snrulebList").getRows();
  let len = 0;
  //是否有流水号或者随机码
  let islsh = false;
  //选择日期数量
  let dateCount = 0;
  //选择物料数量
  let materCount = 0;
  for (let i = 0; i < rows.length; i++) {
    let data = rows[i];
    if (data.ruleitem == "constval") {
      len += data.constvalue.length;
    } else if (data.ruleitem == "sysdate_yy" || data.ruleitem == "productdate_yy") {
      len += 2;
      dateCount++;
    } else if (data.ruleitem == "sysdate_yyyy" || data.ruleitem == "sysdate_yymm" || data.ruleitem == "productdate_yyyy" || data.ruleitem == "productdate_yymm") {
      len += 4;
      dateCount++;
    } else if (data.ruleitem == "sysdate_yyyymm" || data.ruleitem == "sysdate_yymmdd" || data.ruleitem == "productdate_yyyymm" || data.ruleitem == "productdate_yymmdd") {
      len += 6;
      dateCount++;
    } else if (data.ruleitem == "sysdate_yyyymmdd" || data.ruleitem == "productdate_yyyymmdd") {
      len += 8;
      dateCount++;
    } else {
      if (data.ilen == null || data.ilen == "") {
        len += 0;
      } else {
        len += data.ilen;
      }
      if (data.ruleitem == "lsh" || data.ruleitem == "randomcode") {
        islsh = true;
        if (data.ruleitem == "lsh") {
          const validateNumber = (str) => /^[1-9]\d*$/.test(str);
          let ilenB = validateNumber(data.ilen);
          let lpadcharB = validateNumber(data.lpadchar);
          let errorMes;
          if (!ilenB) {
            errorMes = "数据项【流水号】的长度必须为大于0的正整数";
          }
          if (!data.lpadchar) {
            if (!!errorMes) {
              errorMes += ",前补位不能为空";
            } else {
              errorMes = "数据项【流水号】的前补位不能为空";
            }
          }
          if (!!errorMes) {
            cb.utils.alert(errorMes + "！");
            return false;
          }
        }
      } else if (data.ruleitem == "mat_code") {
        materCount++;
      } else if (data.ruleitem == "mat_zjm") {
        materCount++;
      } else if (data.ruleitem == "mat_erpcode") {
        materCount++;
      }
    }
  }
  if (len >= 100) {
    cb.utils.alert("规则数据项总长度不能超过100！");
    return false;
  }
  if (!islsh) {
    cb.utils.alert("规则中必须包含流水号或者随机码！");
    return false;
  }
  if (dateCount > 1) {
    cb.utils.alert("规则中日期格式只能有一种！");
    return false;
  }
  if (materCount > 1) {
    cb.utils.alert("规则中物料标识只能有一种！");
    return false;
  }
});