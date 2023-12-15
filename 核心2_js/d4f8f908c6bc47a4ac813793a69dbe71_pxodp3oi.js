viewModel.on("beforePush", (data) => {
  let dataObj = data.params.data;
  let canPush = true;
  if (dataObj.isClosed != undefined && dataObj.isClosed == true) {
    bills.push(dataObj.code);
    canPush = false;
  }
  if (!canPush) {
    cb.utils.alert("温馨提示，单据已经关闭,不能再下推/变更，请刷新重试！[" + bills.toString() + "]", "error");
  }
  return canPush;
});
viewModel.on("afterWorkflowBeforeQueryAsync", function (data) {
  //流程走完触发
});
viewModel.on("afterRule", function (data) {
  let caigourenyuanList = viewModel.get("QYSQD_caigourenyuanList").getValue();
  if (caigourenyuanList == undefined) {
    return;
  }
  let rest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getUsrRoleApi", {}, function (err, res) {}, viewModel, { async: false });
  let staffId = rest.result.data.currentUser.staffId;
  for (var j in caigourenyuanList) {
    if (caigourenyuanList[j].caigourenyuan == staffId) {
      viewModel.get("QYcpxxList").setColumnState("caigoudanjiayuce", "bShowIt", true);
      viewModel.get("QYcpxxList").setColumnState("caigoujineyuce", "bShowIt", true);
      viewModel.get("QYcpxxList").setColumnState("caigoudanjiayuce", "bHidden", false);
      viewModel.get("QYcpxxList").setColumnState("caigoujineyuce", "bHidden", false);
      break;
    }
  }
});
viewModel.on("afterProcessWorkflow", function (data) {
  hideObjFromDB();
});
viewModel.on("afterLoadData", function (data) {
  hideObjFromDB();
  let usr = cb.rest.AppContext.user;
  let billnum = viewModel.getParams().billNo;
  let gridModel = viewModel.getGridModel("QYzhuangguifanganList");
  if (gridModel.getRows().length == 0) {
    let rowDatas = [{}];
    gridModel.appendRow({ _status: "Insert" });
  }
  let gridModel2 = viewModel.getGridModel("QYcpxxList");
  if (gridModel2.getRows().length == 0) {
    let rowDatas = [{}];
    gridModel2.appendRow({ _status: "Insert" });
  }
  zhuangGuiFangAn();
  shouHouTiaoShuVisible();
  let visibleVal = false;
  let mode = viewModel.getParams().mode;
  let verifystate = viewModel.get("verifystate").getValue();
  let isClosed = viewModel.get("isClosed").getValue();
  if (mode == "browse" && verifystate == "2" && !isClosed) {
    visibleVal = true;
  }
  viewModel.get("flowbutton34qi").setVisible(visibleVal);
  let prospectCustName = viewModel.get("prospectCustName").getValue();
  if (prospectCustName != undefined && prospectCustName != "") {
    viewModel.get("prospectCust_MingChen").setValue(prospectCustName);
  }
  piChangeHandle();
  setXpVisible();
  if (mode == "browse") {
    viewModel.get("button98dc").setVisible(false);
  }
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
viewModel.get("bumen_name") &&
  viewModel.get("bumen_name").on("beforeBrowse", function (data) {
    // 部门--参照弹窗打开前
    let shiyebu = viewModel.get("shiyebu").getValue();
    if (shiyebu == undefined || shiyebu == "") {
      cb.utils.alert("请先选择事业部!", "info");
      return false;
    }
    let condition = { isExtend: true, simpleVOs: [] };
  });
viewModel.get("bumen_name") &&
  viewModel.get("bumen_name").on("afterBrowse", function (data) {
    // 部门--参照加载完成后--只显示该事业部下所有部门
    let shiyebu = viewModel.get("shiyebu").getValue();
    let treeModel = viewModel.get("bumen_name").getCache("vm").get("tree");
    treeModel.on("afterSetDataSource", function (paramsData) {
      let deptList = paramsData[0].children;
      if (deptList == undefined || deptList.length == 0) {
        return;
      }
      for (var idx in deptList) {
        let dept = deptList[idx];
        if (dept.id == shiyebu) {
          treeModel.setDataSource([dept]);
          treeModel.execute("refresh");
          return;
        }
      }
    });
  });
viewModel.get("QYSQD_caigourenyuanList") &&
  viewModel.get("QYSQD_caigourenyuanList").on("beforeBrowse", function (data) {
    // 采购人员--参照弹窗打开前
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
viewModel.get("yewuyuan_name") &&
  viewModel.get("yewuyuan_name").on("beforeBrowse", function (data) {
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
viewModel.get("kehuzhuangyuan_name") &&
  viewModel.get("kehuzhuangyuan_name").on("beforeBrowse", function (data) {
    // 客户专员--参照弹窗打开前
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
viewModel.get("PHcpxxList") &&
  viewModel.get("PHcpxxList").on("afterCellValueChange", function (data) {
    let gridModel = viewModel.get("PHcpxxList");
    let cellName = data.cellName;
    let rowIndex = data.rowIndex;
    let rowData = viewModel.get("PHcpxxList").getRows()[rowIndex];
    let xssl = rowData.xssl;
    xssl = xssl == null || xssl == "" ? 0 : xssl;
    if (cellName == "xssl") {
      let caigoudanjiayuce = rowData.caigoudanjiayuce;
      caigoudanjiayuce = caigoudanjiayuce == null || caigoudanjiayuce == "" ? 0 : caigoudanjiayuce;
      rowData.caigoujineyuce = xssl * caigoudanjiayuce;
      gridModel.updateRow(rowIndex, rowData);
    } else if (cellName == "caigoudanjiayuce") {
      let caigoudanjiayuce = data.value;
      caigoudanjiayuce = caigoudanjiayuce == null || caigoudanjiayuce == "" ? 0 : caigoudanjiayuce;
      rowData.caigoujineyuce = xssl * caigoudanjiayuce;
      gridModel.updateRow(rowIndex, rowData);
    } else if (cellName == "caigoujineyuce") {
      let caigoujineyuce = data.value;
      caigoujineyuce = caigoujineyuce == null || caigoujineyuce == "" ? 0 : caigoujineyuce;
      if (xssl == 0) {
        xssl = 1;
        rowData.xssl = 1;
      }
      rowData.caigoudanjiayuce = (caigoujineyuce / xssl).toFixed(2);
      gridModel.updateRow(rowIndex, rowData);
    }
    calSumAmount(gridModel);
  });
function calSumAmount(gridModel) {
  //修正批改单价的时候没有触发计算合计的问题
  let rowDatas = gridModel.getRows();
  let sumAmount = 0;
  for (var idx in rowDatas) {
    sumAmount = sumAmount + rowDatas[idx].caigoujineyuce;
  }
  viewModel.get("caigouchengbenyugu").setValue(sumAmount);
}
viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    let gridModel = viewModel.get("PHcpxxList");
    calSumAmount(gridModel);
  });
viewModel.get("btnSaveAndAdd") &&
  viewModel.get("btnSaveAndAdd").on("click", function (data) {
    let gridModel = viewModel.get("PHcpxxList");
    calSumAmount(gridModel);
  });