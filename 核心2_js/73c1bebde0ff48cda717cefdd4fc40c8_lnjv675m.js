let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let ownOrgretrun = param.return;
    let ownorg = JSON.parse(param.requestData);
    let OrderOrg = ownorg.OrderOrg;
    let funcccccc = extrequire("GT3AT33.myService.canBeUsed");
    let objj = funcccccc.execute({ id: ownorg.OrderService_id }).res;
    let Orgquantity = objj[0].Orgquantity;
    let UsedOrgquantity = objj[0].UsedOrgquantity;
    let oldfunctionsEnabled = ownorg.functionsEnabled; //启用的职能数组
    let stopNum = ownorg.stopNum; //停用次数
    let functionsSet = ownorg.functionsSetUp; //配置的职能
    let functionsSetUp = "";
    let functionsSetUpkeys = [];
    if (functionsSet !== undefined && typeof functionsSet !== "undefined") {
      functionsSetUp = ownorg.functionsSetUp;
      functionsSetUpkeys = JSON.parse(split(functionsSet, "-", 999));
    }
    if (Orgquantity - UsedOrgquantity > 0) {
      //可用数量没有没用完
      let id = OrderOrg;
      let name = ownorg.OrderOrg_name;
      let upOrgId = ownorg.sysparent; //上级组织id
      let functionsEnabled = ""; //启用的职能
      if (ownorg._status == "Insert") {
        functionsEnabled += "adminOrg-";
        functionsSetUp += "adminOrg-";
      }
      let externalData = {};
      externalData.typelist = [];
      let addSysOrgData = {
        id: id,
        name: { zh_CN: ownorg.OrderOrg_name },
        parent: upOrgId,
        exchangerate: "lnjv675m",
        companytype: "45ebda24614f424abe5dfb04e00f737j",
        companytype_name: "其他组织",
        exchangerate_name: "基准汇率",
        orgtype: "1",
        enable: "1",
        _status: "Update"
      };
      let ownorgArr = Object.keys(ownorg);
      for (let i = 0; i < ownorgArr.length; i++) {
        let ownorgKey = ownorgArr[i];
        switch (ownorgKey) {
          case "adminOrg":
            if (ownorg.adminOrg == "1" && ownorg._status == "Update") {
              if (ownorg.item1944yb == "1") {
                if (includes(functionsSetUpkeys, "adminOrg")) {
                  addSysOrgData.adminOrg = {};
                  addSysOrgData.adminOrg.id = OrderOrg;
                }
                addSysOrgData.adminOrg.enable = 1;
                functionsEnabled += "adminOrg-";
              } else if (ownorg.item1944yb == "0") {
                addSysOrgData.adminOrg.enable = 2;
              }
              externalData.typelist.push("adminorg");
            } else if (ownorg.adminOrg == "0") {
              addSysOrgData.adminOrg.id = OrderOrg;
              addSysOrgData.adminOrg.dr = 1;
              addSysOrgData.adminOrg.enable = 2;
              externalData.typelist.push("adminorg");
            }
            break;
          case "salesOrg":
            if (ownorg.salesOrg == "1") {
              if (!includes(functionsSetUpkeys, "salesOrg")) {
                functionsSetUp += "salesOrg-";
              }
              if (ownorg.item2079nd == "1") {
                addSysOrgData.salesOrg.enable = 1;
                functionsEnabled += "salesOrg-";
              } else if (ownorg.item2079nd == "0") {
                addSysOrgData.salesOrg.enable = 2;
              }
              if (ownorg._status == "Update") {
                if (includes(functionsSetUpkeys, "salesOrg")) {
                  addSysOrgData.salesOrg.id = OrderOrg;
                }
              }
              externalData.typelist.push("salesorg");
            }
            break;
          case "purchaseOrg":
            if (ownorg.purchaseOrg == "1") {
              if (!includes(functionsSetUpkeys, "purchaseOrg")) {
                functionsSetUp += "purchaseOrg-";
              }
              if (ownorg.item2218ac == "1") {
                addSysOrgData.purchaseOrg.enable = 1;
                functionsEnabled += "purchaseOrg-";
              } else if (ownorg.item2218ac == "0") {
                addSysOrgData.purchaseOrg.enable = 2;
              }
              if (ownorg._status == "Update") {
                if (includes(functionsSetUpkeys, "purchaseOrg")) {
                  addSysOrgData.purchaseOrg.id = OrderOrg;
                }
              }
              externalData.typelist.push("purchaseorg");
            }
            break;
          case "inventoryOrg":
            if (ownorg.inventoryOrg == "1") {
              if (!includes(functionsSetUpkeys, "inventoryOrg")) {
                functionsSetUp += "inventoryOrg-";
              }
              if (ownorg.item2148ee == "1") {
                addSysOrgData.inventoryOrg.enable = 1;
                functionsEnabled += "inventoryOrg-";
              } else if (ownorg.item2148ee == "0") {
                addSysOrgData.inventoryOrg.enable = 2;
              }
              if (ownorg._status == "Update") {
                if (includes(functionsSetUpkeys, "inventoryOrg")) {
                  addSysOrgData.inventoryOrg.id = OrderOrg;
                }
              }
              externalData.typelist.push("inventoryorg");
            }
            break;
          case "factoryOrg":
            if (ownorg.factoryOrg == "1") {
              if (!includes(functionsSetUpkeys, "adminOrg")) {
                functionsSetUp += "factoryOrg-";
              }
              addSysOrgData.factoryOrg = {
                enable: 1
              };
              externalData.typelist.push("factoryorg");
            }
            break;
          case "financeOrg":
            if (ownorg.financeOrg == "1") {
              if (!includes(functionsSetUpkeys, "financeOrg")) {
                functionsSetUp += "financeOrg-";
              }
              addSysOrgData.financeOrg = {
                currency: "G001ZM0000DEFAULTCURRENCT00000000001",
                periodschema: "2039258620960000"
              };
              if (ownorg.item2011ec == "1") {
                addSysOrgData.financeOrg.enable = 1;
                functionsEnabled += "financeOrg-";
              } else if (ownorg.item2011ec == "0") {
                addSysOrgData.financeOrg.enable = 2;
              }
              if (ownorg._status == "Update" && includes(functionsSetUpkeys, "financeOrg")) {
                addSysOrgData.financeOrg.id = OrderOrg;
              }
              externalData.typelist.push("financeorg");
            }
            break;
          case "assetsOrg":
            if (ownorg.assetsOrg == "1") {
              if (!includes(functionsSetUpkeys, "assetsOrg")) {
                functionsSetUp += "assetsOrg-";
              }
              addSysOrgData.assetsOrg = {
                enable: 1
              };
              externalData.typelist.push("assetsorg");
            }
            break;
          case "taxpayerOrg":
            if (ownorg.taxpayerOrg == "1") {
              if (!includes(functionsSetUpkeys, "taxpayerOrg")) {
                functionsSetUp += "taxpayerOrg-";
              }
              addSysOrgData.taxpayerOrg = {
                enable: 1
              };
              externalData.typelist.push("taxpayerorg");
            }
        }
      }
      let request = {};
      request.uri = "/yonbip/digitalModel/orgunit/save";
      request.body = { data: addSysOrgData, externalData: externalData };
      let Orgfunc = extrequire("GT34544AT7.common.baseOpenApi");
      let Orgfuncres = Orgfunc.execute(request).res;
      if (ownorg._status == "Insert" && Orgfuncres.code == "200") {
        //单据新增时消耗账簿数
      } else if (Orgfuncres.code !== "200") {
        throw new Error("设置职能失败！请联系系统管理员！" + Orgfuncres.message);
      }
      let ooo = { id: ownOrgretrun.id, functionsEnabled: functionsEnabled, functionsSetUp: functionsSetUp };
      let rrr = ObjectStore.updateById("GT3AT33.GT3AT33.manageOrg", ooo, "fcc9c0e9");
      //创建一个账簿组织（+1）
      let oldfunctionsEnabledKeys = [];
      if (oldfunctionsEnabled !== undefined) {
        oldfunctionsEnabledKeys = JSON.parse(split(oldfunctionsEnabled, "-", 999));
      }
      var functionsEnabledKeys = JSON.parse(split(functionsEnabled, "-", 999));
      if (ownorg._status == "Update") {
        if (oldfunctionsEnabledKeys.length == 0 && functionsEnabledKeys.length - 1 > 1) {
          //说明之前启用了一个职能，现在不只启用了一个职能。使用的账簿数就要+1
          if (stopNum >= 3) {
            //启用/停用次数已用完
            throw new Error("频繁操作，请联系管理员！");
          } else if (stopNum < 3 && stopNum >= 0) {
            //启用/停用次数没有用完
            var object = { id: ownorg.OrderService_id, UsedOrgquantity: UsedOrgquantity + 1 };
            var res = ObjectStore.updateById("GT3AT33.GT3AT33.test_OrderService", object, "3677f4d7");
          }
        } else if (oldfunctionsEnabledKeys.length - 1 > 1 && functionsEnabledKeys.length - 1 == 1) {
          //说明之前不止启用了一个职能，现在只启用了一个职能。使用的账簿数就要-1
          var object = { id: ownorg.OrderService_id, UsedOrgquantity: UsedOrgquantity - 1, stopNum: stopNum + 1 };
          var res = ObjectStore.updateById("GT3AT33.GT3AT33.test_OrderService", object, "3677f4d7");
        }
      } else if (ownorg._status == "Insert") {
        if (functionsEnabledKeys.length > 2) {
          //说明启用了不止一个职能
          var object = { id: ownorg.OrderService_id, UsedOrgquantity: UsedOrgquantity + 1 };
          var res = ObjectStore.updateById("GT3AT33.GT3AT33.test_OrderService", object, "3677f4d7");
        }
      }
    } else if (Orgquantity - UsedOrgquantity <= 0) {
      throw new Error("数量已用完！操作失败");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });