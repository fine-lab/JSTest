viewModel.on("afterLoadData", function (data) {
  let mode = viewModel.getParams().mode;
  var girdModel = viewModel.getGridModel("Zcfa_NmList");
  if (mode.toLowerCase() === "add") {
    girdModel.appendRow({});
  }
});
viewModel.on("afterMount", function (params) {
  hideObjFromDB();
});
viewModel.on("afterProcessWorkflow", function (data) {
  hideObjFromDB();
});
function hideObjFromDB() {
  var billNo = viewModel.getParams().billNo;
  cb.rest.invokeFunction(
    "GT3734AT5.APIFunc.getLimitFieldApi",
    { billNo: billNo },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("权限控制异常");
      } else {
        if (res.data.length > 0) {
          let data = res.data;
          for (let i in data) {
            let dataObj = data[i];
            let fieldParamsList = dataObj.FieldParamsList;
            let isList = dataObj.isList;
            for (j in fieldParamsList) {
              let fieldParams = fieldParamsList[j];
              let fieldName = fieldParams.fieldName;
              let isMain = fieldParams.isMain;
              let childrenField = fieldParams.childrenField;
              let isVisilble = fieldParams.isVisilble;
              if (isList) {
                //列表单据
                viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
              } else {
                //单据
                if (isMain) {
                  //主表
                  viewModel.get(fieldName).setVisible(isVisilble);
                  viewModel.get(fieldName).setState("bShowIt", isVisilble);
                  viewModel.get(fieldName).setState("bHidden", !isVisilble);
                } else {
                  viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                  viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
                }
              }
            }
          }
        }
      }
    },
    viewModel,
    { domainKey: "yourKeyHere" }
  );
}
viewModel.get("cpjl_name") &&
  viewModel.get("cpjl_name").on("beforeBrowse", function (data) {
    // 产品经理--参照弹窗打开前
    let mainOrgId = "yourIdHere"; //河南国立控股有限公司
    let condition = { isExtend: true, simpleVOs: [] };
    let op = "eq";
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: op,
      value1: mainOrgId
    });
    this.setFilter(condition);
  });
viewModel.get("StaffNew_name") &&
  viewModel.get("StaffNew_name").on("beforeBrowse", function (data) {
    // 销售业务员--参照弹窗打开前
    let mainOrgId = "yourIdHere"; //河南国立控股有限公司
    let condition = { isExtend: true, simpleVOs: [] };
    let op = "eq";
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: op,
      value1: mainOrgId
    });
    this.setFilter(condition);
  });
const calcByValChange = () => {
  let shazhs = viewModel.get("shazhs").getValue(); //售后安装费用(含税)
  if (shazhs == undefined || shazhs == null || shazhs == "") {
    shazhs = 0;
  }
  let gcdkhyfhs = viewModel.get("gcdkhyfhs").getValue(); //工厂-客户运费(含税)
  if (gcdkhyfhs == undefined || gcdkhyfhs == null || gcdkhyfhs == "") {
    gcdkhyfhs = 0;
  }
  let ybfy = viewModel.get("ybfy").getValue(); //延保费用(含税)
  if (ybfy == undefined || ybfy == null || ybfy == "") {
    ybfy = 0;
  }
  let gczzsbscj = viewModel.get("gczzsbscj").getValue(); //工厂自制设备市场指导价(含税)
  if (gczzsbscj == undefined || gczzsbscj == null || gczzsbscj == "") {
    gczzsbscj = 0;
  }
  let wgjscj = viewModel.get("wgjscj").getValue(); //外购件市场指导价(含税)
  if (wgjscj == undefined || wgjscj == null || wgjscj == "") {
    wgjscj = 0;
  }
  viewModel.get("hsjzjhs").setValue(Number(gczzsbscj) + Number(wgjscj));
  viewModel.get("zdxsxj").setValue(Number(shazhs) + Number(gcdkhyfhs) + Number(ybfy) + Number(gczzsbscj) + Number(wgjscj)); //zdxsxj--最低销售限价
};
viewModel.get("gczzsbscj") &&
  viewModel.get("gczzsbscj").on("afterValueChange", function (data) {
    // 工厂自制设备市场指导价(含税)--值改变后
    calcByValChange();
  });
viewModel.get("shazbhs") &&
  viewModel.get("shazbhs").on("afterValueChange", function (data) {
    // 售后安装费用(不含税)--值改变后
    let shazbhs = viewModel.get("shazbhs").getValue(); //售后安装费用(不含税)
    if (shazbhs == undefined || shazbhs == null || shazbhs == "") {
      shazbhs = 0;
    }
    viewModel.get("shazhs").setValue((shazbhs * 1.13).toFixed(0));
    calcByValChange();
  });
viewModel.get("wgjbhs") &&
  viewModel.get("wgjbhs").on("afterValueChange", function (data) {
    // 外购件采购价(不含税)--值改变后
  });
viewModel.get("gcdkhyfbhs") &&
  viewModel.get("gcdkhyfbhs").on("afterValueChange", function (data) {
    // 工厂-客户运费(不含税)--值改变后
  });