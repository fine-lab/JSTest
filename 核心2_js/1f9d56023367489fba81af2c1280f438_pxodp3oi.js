viewModel.getGridModel().on("afterSetDataSource", () => {
  //获取列表所有数据
  const rows = viewModel.getGridModel().getRows();
  //从缓存区获取按钮
  const actions = viewModel.getGridModel().getCache("actions");
  if (!actions) return;
  const actionsStates = [];
  rows.forEach((data) => {
    const actionState = {};
    actions.forEach((action) => {
      //设置按钮可用不可用
      actionState[action.cItemName] = { visible: true };
      if (action.cItemName == "btnEdit") {
        if (data.verifystate == 2) {
          actionState[action.cItemName] = { visible: false };
        }
      }
    });
    actionsStates.push(actionState);
  });
  setTimeout(function () {
    viewModel.getGridModel().setActionsState(actionsStates);
  }, 50);
});
viewModel.on("beforeBatchpush", (data) => {
  let dataArray = data.params.data;
  let canPush = true;
  let bills = [];
  for (var i in dataArray) {
    let dataObj = dataArray[i];
    if (dataObj.isClosed != undefined && dataObj.isClosed == true) {
      bills.push(dataObj.code);
      canPush = false;
    }
  }
  if (!canPush) {
    cb.utils.alert("温馨提示，单据已经关闭,不能再下推，请刷新重试！[" + bills.toString() + "]", "error");
  }
  return canPush;
});
viewModel.get("button26od") &&
  viewModel.get("button26od").on("click", function (data) {
    // 关闭--单击
    let idx = data.index;
    let dataRows = viewModel.getGridModel("qysqd_1567146954139369476").getRows();
    let dataObj = dataRows[idx];
    let id = dataObj.id;
    let code = dataObj.code;
    let isClosed = dataObj.isClosed;
    let verifystate = dataObj.verifystate;
    let bustype = dataObj.bustype;
    if (isClosed) {
      cb.utils.alert("温馨提示，该单据已经关闭！[" + code + "]", "info");
      return;
    }
    if (verifystate != "2") {
      cb.utils.alert("单据未审核,不用关闭,删了重录吧!", "info");
      return;
    }
    let saleOrderBillNo = dataObj.saleOrderBillNo;
    if ((saleOrderBillNo != undefined && saleOrderBillNo != null && saleOrderBillNo != "") || code != "") {
      if (saleOrderBillNo == undefined) {
        saleOrderBillNo = "X";
      }
      //检测是否关闭--销售订单未关闭则不能关闭该申请单
      let chkEnabled = true;
      if (chkEnabled) {
        let rest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getSOrderApi", { saleOrderBillNo: saleOrderBillNo, code: code }, function (err, res) {}, viewModel, { async: false });
        if (rest.result.rst) {
          let dataObject = rest.result.data;
          if (dataObject.length > 0 && dataObject[0].status != 2) {
            cb.utils.alert("温馨提示，下游单据未关闭，不能执行关闭操作！[" + dataObject[0].code + "]", "error");
            return;
          } else {
            if (dataObject.length > 0 && !rest.result.hasRedOrder && bustype == "1567789575732985866") {
              cb.utils.alert("直运签约，下游单据已关闭，但尚未下推红字订单，不能执行关闭操作！[" + dataObject[0].code + "]", "error");
              return;
            }
          }
        }
      }
    }
    cb.utils.confirm(
      "确定要关闭签约申请单[" + code + "]吗？关闭作废单据不可逆!",
      function () {
        cb.rest.invokeFunction("GT3734AT5.APIFunc.closePIApi", { id: id, code: code, shiyebu: dataObj.shiyebu, schemeBillId: dataObj.schemeBillId }, function (err, res) {
          if (err == null) {
            cb.utils.alert("温馨提示，该单据关闭成功！[" + code + "]", "info");
            viewModel.execute("refresh");
          }
        });
      },
      function (args) {}
    );
  });
function synFieldLimit() {
  var billNo = viewModel.getParams().billNo;
  cb.rest.invokeFunction("GT3734AT5.APIFunc.getLimitFieldApi", { billNo: billNo }, function (err, res) {
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
            let isVisilble = dataObj.isVisilble;
            if (isList) {
              //列表单据
              viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
              viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
            } else {
              //单据
              if (isMain) {
                //主表
                viewModel.get(fieldName).setVisible(isVisilble);
              } else {
                viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
              }
            }
          }
        }
      }
    }
  });
}
viewModel.on("customInit", function (data) {
  // 签约申请单--页面初始化
  let gridModel = viewModel.getGridModel("qysqd_1567146954139369476");
  gridModel.on("cellJointQuery", function (args) {
    let cellName = args.cellName;
    if ("schemeBillNo" != cellName) {
      return;
    }
    let shiyebu_name = args.row.shiyebu_name;
    let billno = "c783f00c"; //建机
    if (shiyebu_name.includes("环保")) {
      billno = "69939af7";
    } else if (shiyebu_name.includes("游乐")) {
      billno = "b8a7fc44";
    }
    let dataBody = {
      billtype: "Voucher",
      billno: billno,
      domainKey: "yourKeyHere",
      mode: "browse",
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态browse)
        isBrowse: true,
        readOnly: true,
        id: args.row.schemeBillId
      }
    };
    cb.loader.runCommandLine("bill", dataBody, viewModel);
  });
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
              let isVisilble = dataObj.isVisilble;
              if (isList) {
                //列表单据
                viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
              } else {
                //单据
                if (isMain) {
                  //主表
                  viewModel.get(fieldName).setVisible(isVisilble);
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
});
viewModel.on("beforeSearch", function (args) {
  let rest = cb.rest.invokeFunction("GT3734AT5.APIFunc.zhuanYFilterApi", {}, function (err, res) {}, viewModel, { async: false });
  let resObj = rest.result;
  let ywyCount = resObj.ywyCount;
  let keHuZhuanYCount = resObj.keHuZhuanYCount;
  let roleData = resObj.roleData;
  let staffId = resObj.staffId;
  let user = cb.rest.AppContext.user;
  let userName = user.userName;
  let excludedUserNames = ["张醒", "陈宁", "左利霞", "董柯良", "刘双瑜", "赵婷婷"];
  if (!excludedUserNames.includes(userName) && keHuZhuanYCount > 0) {
    if (roleData.length > 0) {
      if (roleData[0].ywyRole) {
        //原来做过客户专员，现在又做业务员的情况，不再按照客户专员进行限制
        return;
      }
    }
    args.isExtend = true;
    var commonVOs = args.params.condition.commonVOs; //通用检查查询条件
    commonVOs.push({
      itemName: "kehuzhuangyuan",
      op: "eq",
      value1: staffId
    });
  }
});
viewModel.get("button241hh") && viewModel.get("button241hh").on("click", function (data) {});
viewModel.get("button27ze") &&
  viewModel.get("button27ze").on("click", function (data) {
    //按钮--单击
    //保存潜客code按钮--单击
    let allDatas = viewModel.getGridModel().getAllData();
    for (let i = 0; i < allDatas.length; i++) {
      let datas = allDatas[i];
      console.log("code:" + datas + " id:" + datas.id + "length:" + datas.kehumingchen);
      let idCustomer = datas.kehumingchen;
      id = datas.id;
      let result = cb.rest.invokeFunction("GT3734AT5.APIFunc.checkRefData", { id: idCustomer }, function (err, res) {}, viewModel, { async: false });
      code = result.result.res[0];
      console.log("code:" + code + " id:" + id);
      if (code == "" || code == undefined) {
        code = "";
      } else {
        code = code.extendCustomerCode;
      }
      let fieldResp = cb.rest.invokeFunction("GT3734AT5.APIFunc.saveCCode", { id: id, code: code }, function (err, res) {}, viewModel, { async: false });
    }
    alert("保存成功!");
  });