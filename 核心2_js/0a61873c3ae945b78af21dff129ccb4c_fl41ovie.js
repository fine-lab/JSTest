let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.data && param.data.length > 0) {
      if (Number(param.data[0].brokenQty) > Number(param.data[0].qty)) {
        throw new Error("检验破坏数量不能大于检验数量！");
      }
      let actionStatus = param.data[0]._status;
      if (actionStatus.toLowerCase() == "update") {
        return {};
      }
      let orgId = param.data[0].org_id;
      if (!orgId) {
        throw new Error("没有获取到组织！");
      }
      let productId = param.data[0].product;
      if (!productId) {
        throw new Error("没有获取到物料！");
      }
      let stockUnitId = param.data[0].stockUnit;
      if (!stockUnitId) {
        throw new Error("没有获取到库存单位！");
      }
      setCheckDepartment(orgId, param);
      setBrokenQty(orgId, productId, stockUnitId, param);
      setCheckProductSource(param);
      param.data[0].set("otheroutbusinesstype", "1989816303980800");
    }
    return {};
  }
}
//补充检验部门
function setCheckDepartment(orgId, param) {
  let querySQL = 'select * from bd.adminOrg.DeptOrgVO where deptdefines.define1 = "是" and enable = 1 and parentid = ' + orgId;
  let res = ObjectStore.queryByYonQL(querySQL, "ucf-org-center");
  if (res && res.length > 0) {
    param.data[0].set("checkdepartment", res[0].id + "");
    param.data[0].set("checkdepartment_name", res[0].name + "");
  }
}
//补充检验破坏数量
function setBrokenQty(orgId, productId, stockUnitId, param) {
  //库存单位信息
  let productClass = extrequire("GT52668AT9.CommonUtils.getProductInfo");
  let productUnit = productClass.getProductUnit(productId);
  if (!param.data[0].unit) {
    param.data[0].set("unit", productUnit[0].unit + "");
  }
  let stockUnitInfo = productUnit[0].stockUnit;
  if (!stockUnitInfo) {
    throw new Error("没有获取到库存单位信息！");
  } else if (productUnit[0].unit == stockUnitId) {
    param.data[0].set("invexchrate", "1");
    param.data[0].set("unitexchangetype", "0");
  } else if (stockUnitInfo.assistUnit != stockUnitId) {
    let assistUnitExchange = productUnit[0].assistUnitExchange;
    for (let i = 0; i < assistUnitExchange.length; i++) {
      let assistUnitTemp = assistUnitExchange[i].assistUnit;
      let mainUnitCountTemp = assistUnitExchange[i].mainUnitCount;
      let unitExchangeTypeTemp = assistUnitExchange[i].unitExchangeType;
      if (assistUnitTemp == stockUnitId) {
        param.data[0].set("invexchrate", mainUnitCountTemp + "");
        param.data[0].set("unitexchangetype", unitExchangeTypeTemp + "");
        break;
      }
    }
  } else {
    param.data[0].set("invexchrate", stockUnitInfo.mainUnitCount + "");
    param.data[0].set("unitexchangetype", stockUnitInfo.unitExchangeType + "");
  }
  //物料检验破坏数量
  let querySQL = "select define.define2 from pc.product.Product where id = " + productId;
  let res = ObjectStore.queryByYonQL(querySQL, "productcenter");
  if (!res || res.length === 0) {
    param.data[0].set("brokenQty", "0");
    param.data[0].set("brokenSubQty", "0");
  } else {
    param.data[0].set("brokenQty", res[0].define_define2 + "");
    param.data[0].set("brokenSubQty", (Number(res[0].define_define2) / Number(param.data[0].invexchrate)).toFixed(3) + "");
  }
}
//补充检品来源
function setCheckProductSource(param) {
  let source = param.data[0].source_billtype;
  if (source == "ST.st_purinrecord" || source == "ST.st_osminrecord" || source == "ST.st_salesout" || source == "ST.st_storein") {
    param.data[0].set("checkproductsource", "01");
  } else if (source == "ST.st_storeprorecord") {
    param.data[0].set("checkproductsource", "02");
  } else {
    param.data[0].set("checkproductsource", "01");
  }
}
exports({ entryPoint: MyTrigger });