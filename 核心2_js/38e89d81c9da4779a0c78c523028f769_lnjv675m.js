viewModel.on("customInit", function (data) {
  // 可使用组织管理详情--页面初始化
  let mode = viewModel.getParams().mode;
  //隐藏期间
  viewModel.get("generalLedger_code").setVisible(false);
  viewModel.get("assets_code").setVisible(false);
  viewModel.get("receivables_code").setVisible(false);
  viewModel.get("pay_code").setVisible(false);
  viewModel.get("cashManagement_code").setVisible(false);
  viewModel.get("stock_code").setVisible(false);
  viewModel.get("inventory_code").setVisible(false);
  //隐藏职能
  viewModel.get("adminOrg").setVisible(false);
  viewModel.get("salesOrg").setVisible(false);
  viewModel.get("purchaseOrg").setVisible(false);
  viewModel.get("inventoryOrg").setVisible(false);
  viewModel.get("financeOrg").setVisible(false);
  //隐藏职能状态开关
  viewModel.get("item1944yb").setVisible(false);
  viewModel.get("item2011ec").setVisible(false);
  viewModel.get("item2079nd").setVisible(false);
  viewModel.get("item2148ee").setVisible(false);
  viewModel.get("item2218ac").setVisible(false);
});
viewModel.on("beforeSave", function (args) {
  let promise = new cb.promise();
  let data = JSON.parse(args.data.data);
  if (data._status == "Insert") {
    let OrderOrgCode = data.OrderOrgCode;
    let GxyServiceCode = data.GxyServiceCode;
    let org_id = data.org_id;
    cb.rest.invokeFunction("GT3AT33.sysOrg.orgRepeat", { OrderOrgCode: OrderOrgCode, GxyServiceCode: GxyServiceCode, org_id: org_id }, function (err, res) {
      if (err != null) {
        cb.utils.alert("校验组织是否重复添加时出错" + JSON.stringify(err), "error");
      }
      let org_id = undefined;
      if (res.res.length > 0) {
        org_id = res.res[0].org_id;
      }
      if (org_id !== null && org_id !== undefined) {
        cb.utils.alert("组织已存在！请返回列表后进行编辑操作", "error");
        return false;
        promise.reject();
      }
      promise.resolve();
    });
  } else if (data._status == "Update") {
    return true;
    promise.resolve();
  }
  return promise;
});
function apipost(params, reqParams, options, action) {
  //封装的业务函数
  let returnPromise = new cb.promise();
  var url = action;
  var suf = "?";
  let keys = Object.keys(params);
  let plen = keys.length;
  for (let num = 0; num < plen; num++) {
    let key = keys[num];
    let value = params[key];
    if (num < plen - 1) {
      suf += key + "=" + value + "&";
    } else {
      suf += key + "=" + value;
    }
  }
  var requrl = url + suf;
  var proxy = cb.rest.DynamicProxy.create({
    settle: {
      url: requrl,
      method: "POST",
      options: options
    }
  });
  proxy.settle(reqParams, function (err, result) {
    if (err) {
      console.log("请求的参数：", JSON.stringify(reqParams));
      cb.utils.alert("设置期间失败！" + err.message, "error");
      returnPromise.reject(err);
    } else {
      returnPromise.resolve(result);
    }
  });
  return returnPromise;
}
viewModel.on("afterSave", function (args) {
  function selectOrgIDByID() {
    //根据单据ID来查询业务单元ID
    let promise = new cb.promise();
    cb.rest.invokeFunction("GT3AT33.sysOrg.selectOrgIDbyID", { id: args.res.id }, function (err, res) {
      let orgid = res.res[0].OrderOrg;
      promise.resolve(orgid);
    });
    return promise;
  }
  function Update(id, res) {
    let promise = new cb.promise();
    let data = {
      id: id
    };
    let recordList = res.recordList;
    for (let i = 0; i < recordList.length; i++) {
      let obj = recordList[i];
      let type_code = obj.type_code + "ID";
      if (obj.id !== "###") {
        data[type_code] = obj.id;
      }
    }
    cb.rest.invokeFunction("GT3AT33.sysOrg.Update", { data }, function (err, res) {
      if (err !== null) {
        cb.utils.alert("回写期间ID时出错！请联系管理员！", "error");
        promise.reject();
      }
      promise.resolve();
    });
    return promise;
  }
  let returnPromise = new cb.promise();
  selectOrgIDByID().then((res, err) => {
    let orgid = res;
    let action = "https://www.example.com/";
    let params = {
      terminalType: 1,
      value1: orgid,
      itemName: "orgid",
      serviceCode: "GZTORG001"
    };
    let vbody = {
      billnum: "org_bpConflist",
      data: { org_bpConflist: [], _status: "Update" },
      externalData: { orgid: orgid },
      itemName: "orgid",
      ownDomain: "ucf-org-center",
      serviceCode: "GZTORG001",
      value1: orgid
    };
    let options = {
      domainKey: "yourKeyHere"
    };
    apipost(params, vbody, options, action).then((deatilres, err) => {
      console.log("系统里的数据：", JSON.stringify(deatilres));
      let recordList = deatilres.recordList;
      let generalLedgerID = "";
      let assetsID = "";
      let receivablesID = "";
      let payID = "";
      let cashManagementID = "";
      let stockID = "";
      let inventoryID = "";
      for (let i = 0; i < recordList.length; i++) {
        let id = recordList[i].id;
        if (id !== "###") {
          if (recordList[i].type_code == "generalLedger") {
            generalLedgerID = id;
          }
          if (recordList[i].type_code == "assets") {
            assetsID = id;
          }
          if (recordList[i].type_code == "receivables") {
            receivablesID = id;
          }
          if (recordList[i].type_code == "pay") {
            payID = id;
          }
          if (recordList[i].type_code == "cashManagement") {
            cashManagementID = id;
          }
          if (recordList[i].type_code == "stock") {
            stockID = id;
          }
          if (recordList[i].type_code == "inventory") {
            inventoryID = id;
          }
        } else {
        }
      }
      let rest = args.res;
      let action = "https://www.example.com/";
      let params = {
        terminalType: 1
      };
      let vbody = {
        billnum: "org_bpConflist",
        data: { org_bpConflist: [], _status: "Update" },
        externalData: { orgid: orgid }
      };
      if (rest.generalLedger_code !== undefined) {
        if (!cb.utils.isEmpty(generalLedgerID)) {
          vbody.data.org_bpConflist.push({
            periodid: rest.generalLedger,
            enable: 1,
            type_code_name: "总账",
            id: generalLedgerID,
            periodid_name: rest.generalLedger_code,
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "generalLedger",
            _tableDisplayOutlineAll: false,
            _status: "Update"
          });
        } else {
          vbody.data.org_bpConflist.push({
            enable: 2,
            type_code_name: "总账",
            id: "###",
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "generalLedger",
            _tableDisplayOutlineAll: false,
            periodid_name: rest.generalLedger_code,
            periodid: rest.generalLedger,
            _status: "Update"
          });
        }
        if (recordList[0].periodid !== undefined) {
          const arr = periodid_name.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item927oc_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist[0].periodid_enddate = periodid_enddate;
        }
      }
      if (rest.assets_code !== undefined) {
        if (!cb.utils.isEmpty(assetsID)) {
          const input = rest.item964tb_code;
          const arr = input.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item964tb_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist.push({
            periodid: rest.assets,
            periodid_enddate: periodid_enddate,
            enable: 1,
            type_code_name: "固定资产",
            id: assetsID,
            periodid_name: rest.assets_code,
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            _status: "Update"
          });
        } else {
          vbody.data.org_bpConflist.push({
            enable: 2,
            type_code_name: "固定资产",
            id: "###",
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            periodid_name: rest.assets_code,
            periodid: rest.assets,
            _status: "Update"
          });
        }
        if (recordList[1].periodid !== undefined) {
          const arr = periodid_name.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item927oc_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist[1].periodid_enddate = periodid_enddate;
        }
      }
      if (rest.receivables_code !== undefined) {
        if (!cb.utils.isEmpty(receivablesID)) {
          const input = rest.item997tk_code;
          const arr = input.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item997tk_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist.push({
            periodid: rest.assets,
            periodid_enddate: periodid_enddate,
            enable: 1,
            type_code_name: "应收管理",
            id: receivablesID,
            periodid_name: rest.receivables_code,
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            _status: "Update"
          });
        } else {
          vbody.data.org_bpConflist.push({
            enable: 2,
            type_code_name: "应收管理",
            id: "###",
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            periodid_name: rest.receivables_code,
            periodid: rest.assets,
            _status: "Update"
          });
        }
        if (recordList[2].periodid !== undefined) {
          const arr = periodid_name.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item927oc_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist[2].periodid_enddate = periodid_enddate;
        }
      }
      if (rest.pay_code !== undefined) {
        if (!cb.utils.isEmpty(payID)) {
          const input = rest.item1032tj_code;
          const arr = input.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item1032tj_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist.push({
            periodid: rest.assets,
            periodid_enddate: periodid_enddate,
            enable: 1,
            type_code_name: "应付管理",
            id: payID,
            periodid_name: rest.pay_code,
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            _status: "Update"
          });
        } else {
          vbody.data.org_bpConflist.push({
            enable: 2,
            type_code_name: "应付管理",
            id: "###",
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            periodid_name: rest.pay_code,
            periodid: rest.assets,
            _status: "Update"
          });
        }
        if (recordList[3].periodid !== undefined) {
          const arr = periodid_name.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item927oc_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist[3].periodid_enddate = periodid_enddate;
        }
      }
      if (rest.stock_code !== undefined) {
        if (!cb.utils.isEmpty(stockID)) {
          const input = rest.item1069qd_code;
          const arr = input.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item1069qd_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist.push({
            periodid: rest.assets,
            periodid_enddate: periodid_enddate,
            enable: 1,
            type_code_name: "存货",
            id: stockID,
            periodid_name: rest.stock_code,
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            _status: "Update"
          });
        } else {
          vbody.data.org_bpConflist.push({
            enable: 2,
            type_code_name: "存货",
            id: "###",
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            periodid_name: rest.stock_code,
            periodid: rest.assets,
            _status: "Update"
          });
        }
        if (recordList[4].periodid !== undefined) {
          const arr = periodid_name.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item927oc_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist[4].periodid_enddate = periodid_enddate;
        }
      }
      if (rest.cashManagement_code !== undefined) {
        if (!cb.utils.isEmpty(cashManagementID)) {
          const input = rest.item1117ce_code;
          const arr = input.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item1117ce_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist.push({
            periodid: rest.assets,
            periodid_enddate: periodid_enddate,
            enable: 1,
            type_code_name: "现金管理",
            id: cashManagementID,
            periodid_name: rest.cashManagement_code,
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            _status: "Update"
          });
        } else {
          vbody.data.org_bpConflist.push({
            enable: 2,
            type_code_name: "现金管理",
            id: "###",
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            periodid_name: rest.cashManagement_code,
            periodid: rest.assets,
            _status: "Update"
          });
        }
        if (recordList[5].periodid !== undefined) {
          const arr = periodid_name.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item927oc_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist[5].periodid_enddate = periodid_enddate;
        }
      }
      if (rest.inventory_code !== undefined) {
        if (!cb.utils.isEmpty(inventoryID)) {
          const input = rest.item1158nh_code;
          const arr = input.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item1158nh_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist.push({
            periodid: rest.assets,
            periodid_enddate: periodid_enddate,
            enable: 1,
            type_code_name: "库存",
            id: inventoryID,
            periodid_name: rest.inventory_code,
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            _status: "Update"
          });
        } else {
          vbody.data.org_bpConflist.push({
            enable: 2,
            type_code_name: "库存",
            id: "###",
            type_code_isperiod: 1,
            orgid: orgid,
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            periodid_name: rest.inventory_code,
            periodid: rest.assets,
            _status: "Update"
          });
        }
        if (recordList[6].periodid !== undefined) {
          const arr = periodid_name.split("-");
          const maxDay = new Date(arr[0], arr[1], 0).getDate();
          let periodid_enddate = rest.item927oc_code + "-" + maxDay + " 00: 00: 00";
          vbody.data.org_bpConflist[6].periodid_enddate = periodid_enddate;
        }
      }
      let options = {
        domainKey: "yourKeyHere"
      };
      if (vbody.data.org_bpConflist.length > 0) {
        //说明需要设置期间
        apipost(params, vbody, options, action).then((res, err) => {
          Update(args.res.id, deatilres).then(() => {
            returnPromise.resolve();
          });
        });
      }
    });
  });
  return returnPromise;
});
viewModel.get("OrderService_id_test_GxyService_name") &&
  viewModel.get("OrderService_id_test_GxyService_name").on("afterValueChange", function (data) {
    // 我订购的项目--值改变后
    let mode = viewModel.getParams().mode;
    let id = data.value.test_GxyService;
    cb.rest.invokeFunction("GT3AT33.myService.myServiceDetails", { id: id }, function (err, res) {
      if (err != null) {
        cb.utils.alert("查询我订购的服务项目详情时出错" + JSON.stringify(err), "error");
      }
      let Orgquantity = viewModel.get("item426zg").getValue(); //可用账簿数
      if (Orgquantity == 0) {
        document.getElementById("fcc9c0e9|item1273ti").style.display = "";
      } else {
        document.getElementById("fcc9c0e9|item1273ti").style.display = "none";
      }
      let func = res.arr[1][0];
      let funcKye = Object.keys(func);
      for (let i = 0; i < funcKye.length; i++) {
        switch (funcKye[i]) {
          case "adminorg":
            if (func.adminorg == "1") {
              viewModel.get("adminOrg").setVisible(true);
              if (mode !== "add") {
                viewModel.get("item1944yb").setVisible(true);
              } else if (mode == "add") {
                viewModel.get("adminOrg").setReadOnly(true);
              }
              let adminorg = viewModel.get("adminOrg").getValue();
              if (mode == "edit" && adminorg == "1") {
                viewModel.get("adminOrg").setReadOnly(true);
              }
            }
            break;
          case "salesorg":
            if (func.salesorg == "1") {
              viewModel.get("salesOrg").setVisible(true);
              if (mode !== "add") {
                viewModel.get("item2079nd").setVisible(true);
              }
              let salesOrg = viewModel.get("salesOrg").getValue();
              if (mode == "edit" && salesOrg == "1") {
                viewModel.get("salesOrg").setReadOnly(true);
              }
            }
            break;
          case "purchaseorg":
            if (func.purchaseorg == "1") {
              viewModel.get("purchaseOrg").setVisible(true);
              if (mode !== "add") {
                viewModel.get("item2218ac").setVisible(true);
              }
              let purchaseOrg = viewModel.get("purchaseOrg").getValue();
              if (mode == "edit" && purchaseOrg == "1") {
                viewModel.get("purchaseOrg").setReadOnly(true);
              }
            }
            break;
          case "inventoryorg":
            if (func.inventoryorg == "1") {
              viewModel.get("inventoryOrg").setVisible(true);
              if (mode !== "add") {
                viewModel.get("item2148ee").setVisible(true);
              }
              let inventoryOrg = viewModel.get("inventoryOrg").getValue();
              if (mode == "edit" && inventoryOrg == "1") {
                viewModel.get("inventoryOrg").setReadOnly(true);
              }
            }
            break;
          case "factoryorg":
            if (func.factoryorg == "1") {
              viewModel.get("factoryorg").setVisible(true);
            }
            break;
          case "financeorg":
            if (func.financeorg == "1") {
              viewModel.get("financeOrg").setVisible(true);
              if (mode !== "add") {
                viewModel.get("item2011ec").setVisible(true);
              }
              let financeOrg = viewModel.get("financeOrg").getValue();
              if (mode == "edit" && financeOrg == "1") {
                viewModel.get("financeOrg").setReadOnly(true);
              }
            }
            break;
          case "assetsorg":
            if (func.assetsorg == "1") {
              viewModel.get("assetsorg").setVisible(true);
            }
            break;
          case "taxpayerorg":
            if (func.taxpayerorg == "1") {
              viewModel.get("taxpayerorg").setVisible(true);
            }
        }
      }
      let financeOrg = viewModel.get("financeOrg").getValue();
      if (financeOrg == "1") {
        let period = res.arr[0][0];
        let periodKey = Object.keys(period);
        for (let i = 0; i < periodKey.length; i++) {
          switch (periodKey[i]) {
            case "generalLedger":
              if (period.generalLedger == "1") {
                viewModel.get("generalLedger_code").setVisible(true);
              }
              break;
            case "assets":
              if (period.assets == "1") {
                viewModel.get("assets_code").setVisible(true);
              }
              break;
            case "receivables":
              if (period.receivables == "1") {
                viewModel.get("receivables_code").setVisible(true);
              }
              break;
            case "pay":
              if (period.pay == "1") {
                viewModel.get("pay_code").setVisible(true);
              }
              break;
            case "cashManagement":
              if (period.cashManagement == "1") {
                viewModel.get("cashManagement_code").setVisible(true);
              }
              break;
            case "stock":
              if (period.stock == "1") {
                viewModel.get("stock_code").setVisible(true);
              }
          }
        }
      }
    });
  });
viewModel.get("OrderService_id_test_GxyService_name") &&
  viewModel.get("OrderService_id_test_GxyService_name").on("beforeBrowse", function (data) {
    // 我订购的项目--参照弹窗打开前
    let promise = new cb.promise();
    let date = new Date();
    let dat = date.toLocaleDateString();
    let OrderOrgCode = viewModel.get("code").getValue();
    cb.rest.invokeFunction("GT3AT33.myService.myServiceList", { OrgCode: OrderOrgCode, date: dat }, function (err, res) {
      if (err != null) {
        cb.utils.alert("查询我订购的服务项目时出错" + JSON.stringify(err), "error");
      }
      let arr = [];
      if (res.res.length > 0) {
        for (let i = 0; i < res.res.length; i++) {
          arr.push(res.res[i].GxyServiceCode);
        }
      }
      var myFilter = { isExtend: true, simpleVOs: [] };
      myFilter.simpleVOs.push({
        field: "GxyServiceCode",
        op: "in",
        value1: arr
      });
      myFilter.simpleVOs.push({
        field: "OrgCode",
        op: "eq",
        value1: OrderOrgCode
      });
      viewModel.get("OrderService_id_test_GxyService_name").setFilter(myFilter);
      promise.resolve();
    });
    return promise;
  });
viewModel.on("afterMount", function (args) {
  document.getElementById("fcc9c0e9|item1273ti").style.display = "none";
  let functionsEnabled = viewModel.get("functionsEnabled").getValue();
  if (functionsEnabled !== undefined) {
    if (functionsEnabled.indexOf("adminOrg") == -1) {
      viewModel.get("item1944yb").setValue(0);
    } else {
      viewModel.get("item1944yb").setValue(1);
    }
    if (functionsEnabled.indexOf("salesOrg") == -1) {
      viewModel.get("item2079nd").setValue(0);
    } else {
      viewModel.get("item2079nd").setValue(1);
    }
    if (functionsEnabled.indexOf("purchaseOrg") == -1) {
      viewModel.get("item2218ac").setValue(0);
    } else {
      viewModel.get("item2218ac").setValue(1);
    }
    if (functionsEnabled.indexOf("inventoryOrg") == -1) {
      viewModel.get("item2148ee").setValue(0);
    } else {
      viewModel.get("item2148ee").setValue(1);
    }
    if (functionsEnabled.indexOf("financeOrg") == -1) {
      viewModel.get("item2011ec").setValue(0);
    } else {
      viewModel.get("item2011ec").setValue(1);
    }
  }
});
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    viewModel.get("generalLedger_code").setVisible(false);
    viewModel.get("assets_code").setVisible(false);
    viewModel.get("receivables_code").setVisible(false);
    viewModel.get("pay_code").setVisible(false);
    viewModel.get("cashManagement_code").setVisible(false);
    viewModel.get("stock_code").setVisible(false);
    viewModel.get("inventory_code").setVisible(false);
    viewModel.get("adminOrg").setVisible(false);
    viewModel.get("salesOrg").setVisible(false);
    viewModel.get("purchaseOrg").setVisible(false);
    viewModel.get("inventoryOrg").setVisible(false);
    viewModel.get("financeOrg").setVisible(false);
    viewModel.get("item1944yb").setVisible(false);
    viewModel.get("item2011ec").setVisible(false);
    viewModel.get("item2079nd").setVisible(false);
    viewModel.get("item2148ee").setVisible(false);
    viewModel.get("item2218ac").setVisible(false);
    //用户选择了业务单元后，需要查询系统业务单元。获得系统业务单元的职能与期间
  });
viewModel.get("enddate") &&
  viewModel.get("enddate").on("afterValueChange", function (data) {
    // 有效期--值改变后
    let mode = viewModel.getParams().mode;
    if (mode !== "add") {
      let enddate = viewModel.get("enddate").getValue();
      let Maxenddate = viewModel.get("item1514bk").getValue();
      if (enddate > Maxenddate) {
        cb.utils.alert("有效期不能大于" + Maxenddate, "error");
      }
    }
  });
viewModel.get("adminOrg") &&
  viewModel.get("adminOrg").on("beforeValueChange", function (data) {
    // 人力资源组织--值改变前
    let mode = viewModel.getParams().mode;
    if (mode !== "add") {
      let value = data.value.value;
      let item1944yb = viewModel.get("item1944yb").getValue(); //职能状态 0停用1启用
      if (value == "0" && item1944yb == 1) {
        cb.utils.alert('关闭职能组织前，需要先将职能状态调整为"停用"', "error");
        return false;
      }
    }
  });
viewModel.get("financeOrg") &&
  viewModel.get("financeOrg").on("beforeValueChange", function (data) {
    // 会计主体--值改变前
    let mode = viewModel.getParams().mode;
    if (mode !== "add") {
      let value = data.value.value;
      let item2011ec = viewModel.get("item2011ec").getValue(); //职能状态 0停用1启用
      if (value == "0" && item2011ec == 1) {
        cb.utils.alert('关闭职能组织前，需要先将职能状态调整为"停用"', "error");
        return false;
      }
    }
  });
viewModel.get("salesOrg") &&
  viewModel.get("salesOrg").on("beforeValueChange", function (data) {
    // 销售组织--值改变前
    let mode = viewModel.getParams().mode;
    if (mode !== "add") {
      let value = data.value.value;
      let item2079nd = viewModel.get("item2079nd").getValue(); //职能状态 0停用1启用
      if (value == "0" && item2079nd == 1) {
        cb.utils.alert('关闭职能组织前，需要先将职能状态调整为"停用"', "error");
        return false;
      }
    }
  });
viewModel.get("inventoryOrg") &&
  viewModel.get("inventoryOrg").on("beforeValueChange", function (data) {
    // 库存组织--值改变前
    let mode = viewModel.getParams().mode;
    if (mode !== "add") {
      let value = data.value.value;
      let item2148ee = viewModel.get("item2148ee").getValue(); //职能状态 0停用1启用
      if (value == "0" && item2148ee == 1) {
        cb.utils.alert('关闭职能组织前，需要先将职能状态调整为"停用"', "error");
        return false;
      }
    }
  });
viewModel.get("purchaseOrg") &&
  viewModel.get("purchaseOrg").on("beforeValueChange", function (data) {
    // 采购组织--值改变前
    let mode = viewModel.getParams().mode;
    if (mode !== "add") {
      let value = data.value.value;
      let item2218ac = viewModel.get("item2218ac").getValue(); //职能状态 0停用1启用
      if (value == "0" && item2218ac == 1) {
        cb.utils.alert('关闭职能组织前，需要先将职能状态调整为"停用"', "error");
        return false;
      }
    }
  });
viewModel.get("financeOrg") &&
  viewModel.get("financeOrg").on("afterValueChange", function (data) {
    // 会计主体--值改变后
    let id = viewModel.get("item2284hh").getValue();
    let value = data.value.value;
    if (id !== undefined) {
      cb.rest.invokeFunction("GT3AT33.myService.myServiceDetails", { id: id }, function (err, res) {
        //这个时候再查询用户选择的服务，包含哪些期间权限
        if (err != null) {
          cb.utils.alert("会计主体--值改变后   查询我订购的服务项目详情时出错" + JSON.stringify(err), "error");
        }
        let period = res.arr[0][0];
        let periodKey = Object.keys(period);
        for (let i = 0; i < periodKey.length; i++) {
          switch (periodKey[i]) {
            case "generalLedger":
              if (period.generalLedger == "1" && value == "1") {
                //表明用户购买的服务有这个权限，并且用户需要授予组织这个权限
                viewModel.get("generalLedger_code").setVisible(true);
              } else {
                viewModel.get("generalLedger_code").setVisible(false);
                viewModel.get("generalLedger_code").clear();
              }
              break;
            case "assets":
              if (period.assets == "1" && value == "1") {
                viewModel.get("assets_code").setVisible(true);
              } else {
                viewModel.get("assets_code").setVisible(false);
                viewModel.get("assets_code").clear();
              }
              break;
            case "receivables":
              if (period.receivables == "1" && value == "1") {
                viewModel.get("receivables_code").setVisible(true);
              } else {
                viewModel.get("receivables_code").setVisible(false);
                viewModel.get("receivables_code").clear();
              }
              break;
            case "pay":
              if (period.pay == "1" && value == "1") {
                viewModel.get("pay_code").setVisible(true);
              } else {
                viewModel.get("pay_code").setVisible(false);
                viewModel.get("pay_code").clear();
              }
              break;
            case "cashManagement":
              if (period.cashManagement == "1" && value == "1") {
                viewModel.get("cashManagement_code").setVisible(true);
              } else {
                viewModel.get("cashManagement_code").setVisible(false);
                viewModel.get("cashManagement_code").clear();
              }
              break;
            case "stock":
              if (period.stock == "1" && value == "1") {
                viewModel.get("stock_code").setVisible(true);
              } else {
                viewModel.get("stock_code").setVisible(false);
                viewModel.get("stock_code").clear();
              }
          }
        }
      });
    }
    viewModel.get("generalLedger").setVisible(true);
    viewModel.get("assets").setVisible(true);
    viewModel.get("receivables").setVisible(true);
  });
viewModel.get("inventoryOrg") &&
  viewModel.get("inventoryOrg").on("afterValueChange", function (data) {
    // 库存组织--值改变后
    let id = viewModel.get("item2284hh").getValue();
    let value = data.value.value;
    if (id !== undefined) {
      cb.rest.invokeFunction("GT3AT33.myService.myServiceDetails", { id: id }, function (err, res) {
        //这个时候再查询用户选择的服务，包含哪些期间权限
        if (err != null) {
          cb.utils.alert("会计主体--值改变后   查询我订购的服务项目详情时出错" + JSON.stringify(err), "error");
        }
        let period = res.arr[0][0];
        let periodKey = Object.keys(period);
        for (let i = 0; i < periodKey.length; i++) {
          switch (periodKey[i]) {
            case "inventoryOrg":
              if (period.inventoryOrg == "1" && value == "1") {
                //表明用户购买的服务有这个权限，并且用户需要授予组织这个权限
                viewModel.get("inventory_code").setVisible(true);
              } else {
                viewModel.get("inventory_code").setVisible(false);
                viewModel.get("inventory_code").clear();
              }
          }
        }
      });
    }
  });