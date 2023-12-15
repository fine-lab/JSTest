let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ccsxMap = {
      1: "常温",
      2: "阴凉",
      3: "冷藏",
      4: "冷冻"
    };
    let spsxMap = {
      1: "药品",
      2: "器械"
    };
    let type = request.type;
    let orgId = request.orgId;
    let index = request.index;
    let rows = request.rows;
    let productId = request.productId;
    //先判断 此组织有无配置，如没有，则无需判断
    let queryGSPParam = "select org_id,isgspmanage from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where org_id = '" + orgId + "' and dr = 0";
    let GSPParamInfo = ObjectStore.queryByYonQL(queryGSPParam);
    if (GSPParamInfo == undefined || GSPParamInfo.length == 0) {
      return {
        code: 200,
        message: "该组织无相关配置",
        errMsg: ""
      };
    }
    if (
      GSPParamInfo[0].isgspmanage == undefined ||
      GSPParamInfo[0].isgspmanage == 0 ||
      GSPParamInfo[0].isgspmanage == "0" ||
      GSPParamInfo[0].isgspmanage == "false" ||
      GSPParamInfo[0].isgspmanage == false
    ) {
      return {
        code: 200,
        message: "该组织未启用GSP配置",
        errMsg: ""
      };
    }
    let queryRuleSql = "select ccsx,hcsx from GT22176AT10.GT22176AT10.ccsxControlSale where sy01_orderDrugsControl_id.org_id = '" + orgId + "' and dr = 0";
    let ccsxRule = ObjectStore.queryByYonQL(queryRuleSql, "sy01");
    let querySpsxRuleSql = "select spsx,hcsx from GT22176AT10.GT22176AT10.sy01_spsxControlSale where sy01_orderDrugsControl_id.org_id = '" + orgId + "' and dr = 0";
    let spsxRule = ObjectStore.queryByYonQL(querySpsxRuleSql, "sy01");
    //值更新的时候，判断存储属性
    if (type == "beforeCellValueChange") {
      let queryCurrentRowCcsx = "select id,ccsx,spsx from GT22176AT10.GT22176AT10.SY01_material_file  where org_id = '" + orgId + "' and material = '" + productId + "' and dr = 0";
      let currentCcsx = ObjectStore.queryByYonQL(queryCurrentRowCcsx, "sy01")[0].ccsx;
      let currentSpsx = ObjectStore.queryByYonQL(queryCurrentRowCcsx, "sy01")[0].spsx;
      let errorMsg = "";
      //判断存储属性
      if (currentCcsx != undefined && ccsxRule.length > 0) {
        //先查询
        let rowMap = {};
        for (let i = 0; i < rows.length; i++) {
          if (i == index) {
            continue;
          }
          if (rows[i].productId == undefined) {
            continue;
          }
          let otherRowCcsxRule = "select id,ccsx from GT22176AT10.GT22176AT10.SY01_material_file  where org_id = '" + orgId + "' and material = '" + rows[i].productId + "' and dr = 0";
          let otherRowCcsx = ObjectStore.queryByYonQL(otherRowCcsxRule, "sy01")[0].ccsx;
          if (otherRowCcsx == undefined) {
            continue;
          }
          if (!rowMap.hasOwnProperty(otherRowCcsx)) {
            rowMap[otherRowCcsx] = [];
          }
          rowMap[otherRowCcsx].push(i + 1);
        }
        for (let i = 0; i < ccsxRule.length; i++) {
          if (ccsxRule[i].ccsx == currentCcsx && rowMap.hasOwnProperty(ccsxRule[i].hcsx)) {
            errorMsg += ccsxMap[ccsxRule[i].ccsx] + "(行号：" + (index + 1) + ")与" + ccsxMap[ccsxRule[i].hcsx] + "(行号：" + rowMap[ccsxRule[i].hcsx].join(", ") + "）互斥，请核对存储属性互斥属性\n";
          }
          if (ccsxRule[i].hcsx == currentCcsx && rowMap.hasOwnProperty(ccsxRule[i].ccsx)) {
            errorMsg += ccsxMap[ccsxRule[i].hcsx] + "(行号：" + (index + 1) + ")与" + ccsxMap[ccsxRule[i].ccsx] + "(行号：" + rowMap[ccsxRule[i].ccsx].join(", ") + "）互斥，请核对存储属性互斥属性\n";
          }
        }
      }
      //判断商品属性
      if (currentSpsx != undefined && spsxRule.length > 0) {
        //先查询
        let rowMap = {};
        for (let i = 0; i < rows.length; i++) {
          if (i == index) {
            continue;
          }
          if (rows[i].productId == undefined) {
            continue;
          }
          let otherRowCcsxRule = "select id,spsx from GT22176AT10.GT22176AT10.SY01_material_file  where org_id = '" + orgId + "' and material = '" + rows[i].productId + "' and dr = 0";
          let otherRowCcsx = ObjectStore.queryByYonQL(otherRowCcsxRule, "sy01")[0].spsx;
          if (otherRowCcsx == undefined) {
            continue;
          }
          if (!rowMap.hasOwnProperty(otherRowCcsx)) {
            rowMap[otherRowCcsx] = [];
          }
          rowMap[otherRowCcsx].push(i + 1);
        }
        for (let i = 0; i < spsxRule.length; i++) {
          if (spsxRule[i].spsx == currentSpsx && rowMap.hasOwnProperty(spsxRule[i].hcsx)) {
            errorMsg += spsxMap[spsxRule[i].spsx] + "(行号：" + (index + 1) + ")与" + spsxMap[spsxRule[i].hcsx] + "(行号：" + rowMap[spsxRule[i].hcsx].join(", ") + "）互斥，请核对商品属性互斥属性\n";
          }
          if (spsxRule[i].hcsx == currentSpsx && rowMap.hasOwnProperty(spsxRule[i].spsx)) {
            errorMsg += spsxMap[spsxRule[i].hcsx] + "(行号：" + (index + 1) + ")与" + spsxMap[spsxRule[i].spsx] + "(行号：" + rowMap[spsxRule[i].spsx].join(", ") + "）互斥，请核对商品属性互斥属性\n";
          }
        }
      }
      if (errorMsg.length > 0) {
        return {
          code: 777,
          message: "",
          errMsg: errorMsg
        };
      } else {
        return {
          code: 200,
          message: "没有互斥",
          errMsg: ""
        };
      }
    }
    //保存的时候，判断存储属性
    if (type == "beforeSave") {
      let errorMsg = "";
      if (ccsxRule.length > 0) {
        let rowMap = {};
        for (let i = 0; i < rows.length; i++) {
          let otherRowCcsxRule = "select id,ccsx from GT22176AT10.GT22176AT10.SY01_material_file  where org_id = '" + orgId + "' and material = '" + rows[i].productId + "' and dr = 0";
          let otherRowCcsx = ObjectStore.queryByYonQL(otherRowCcsxRule, "sy01")[0].ccsx;
          if (otherRowCcsx == undefined) {
            continue;
          }
          if (!rowMap.hasOwnProperty(otherRowCcsx)) {
            rowMap[otherRowCcsx] = [];
          }
          rowMap[otherRowCcsx].push(i + 1);
        }
        for (let i = 0; i < ccsxRule.length; i++) {
          if (rowMap.hasOwnProperty(ccsxRule[i].ccsx) && rowMap.hasOwnProperty(ccsxRule[i].hcsx)) {
            errorMsg +=
              ccsxMap[ccsxRule[i].ccsx] +
              "(行号：" +
              rowMap[ccsxRule[i].ccsx].join(", ") +
              ")与" +
              ccsxMap[ccsxRule[i].hcsx] +
              "(行号：" +
              rowMap[ccsxRule[i].hcsx].join(", ") +
              "）互斥，请核对存储属性互斥属性\n";
          }
        }
      }
      if (spsxRule.length > 0) {
        let rowMap = {};
        for (let i = 0; i < rows.length; i++) {
          let otherRowSpsxRule = "select id,spsx from GT22176AT10.GT22176AT10.SY01_material_file  where org_id = '" + orgId + "' and material = '" + rows[i].productId + "' and dr = 0";
          let otherRowSpsx = ObjectStore.queryByYonQL(otherRowSpsxRule, "sy01")[0].spsx;
          if (otherRowSpsx == undefined) {
            continue;
          }
          if (!rowMap.hasOwnProperty(otherRowSpsx)) {
            rowMap[otherRowSpsx] = [];
          }
          rowMap[otherRowSpsx].push(i + 1);
        }
        for (let i = 0; i < spsxRule.length; i++) {
          if (rowMap.hasOwnProperty(spsxRule[i].spsx) && rowMap.hasOwnProperty(spsxRule[i].hcsx)) {
            errorMsg +=
              spsxMap[spsxRule[i].spsx] +
              "(行号：" +
              rowMap[spsxRule[i].spsx].join(", ") +
              ")与" +
              spsxMap[spsxRule[i].hcsx] +
              "(行号：" +
              rowMap[spsxRule[i].hcsx].join(", ") +
              "）互斥，请核对商品属性互斥属性\n";
          }
        }
      }
      if (errorMsg.length > 0) {
        return {
          code: 777,
          message: "",
          errMsg: errorMsg
        };
      } else {
        return {
          code: 200,
          message: "没有互斥",
          errMsg: ""
        };
      }
    }
    return {
      code: 200,
      message: "没有互斥",
      errMsg: ""
    };
  }
}
exports({ entryPoint: MyAPIHandler });