let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let map = {
      0: { name: "普通药品", type: "common" },
      1: { name: "精神药品", type: "psychotropic" },
      2: { name: "放射药品", type: "radiation" },
      3: { name: "毒性药品", type: "poison" },
      4: { name: "麻醉药品", type: "narcotic" },
      5: { name: "含麻黄碱", type: "ephedrineContaining" },
      6: { name: "冷链药品", type: "coldChainDrugs" },
      7: { name: "含特殊复方制剂", type: "specialDrugs" }
    };
    let errorMsg = "";
    let type = request.type;
    //先将物料按照组织进行分类，只判断组织之间的情况。
    let data = [];
    let tempOrg = [];
    for (let i = 0; i < request.materalIds.length; i++) {
      if (tempOrg.indexOf(request.materalIds[i].orgId) == -1) {
        data.push({
          orgId: request.materalIds[i].orgId,
          orgName: request.materalIds[i].orgName,
          materalIds: [
            {
              id: request.materalIds[i].id,
              name: request.materalIds[i].name,
              sku: request.materalIds[i].sku,
              skuName: request.materalIds[i].skuName,
              index: i
            }
          ]
        });
        tempOrg.push(request.materalIds[i].orgId);
      } else {
        for (let j = 0; j < data.length; j++) {
          if (data[j].orgId == request.materalIds[i].orgId) {
            data[j]["materalIds"].push({
              id: request.materalIds[i].id,
              name: request.materalIds[i].name,
              sku: request.materalIds[i].sku,
              skuName: request.materalIds[i].skuName,
              index: i
            });
          }
        }
      }
    }
    //循环每一个组织的数据
    for (let k = 0; k < data.length; k++) {
      let orgId = data[k].orgId;
      let materalIds = data[k].materalIds;
      let queryGSPParam = "select org_id,isgspmanage from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where org_id = '" + orgId + "'";
      let GSPParamInfo = ObjectStore.queryByYonQL(queryGSPParam);
      if (GSPParamInfo == undefined || GSPParamInfo.length == 0) {
        continue;
      }
      if (
        GSPParamInfo[0].isgspmanage == undefined ||
        GSPParamInfo[0].isgspmanage == 0 ||
        GSPParamInfo[0].isgspmanage == "0" ||
        GSPParamInfo[0].isgspmanage == "false" ||
        GSPParamInfo[0].isgspmanage == false
      ) {
        continue;
      }
      let queryRuleSql = "";
      if (type == "purchase") {
        queryRuleSql += "select type,type1 from GT22176AT10.GT22176AT10.drugControlPur where sy01_orderDrugsControl_id.org_id = '" + orgId + "'";
      } else if (type == "sale") {
        queryRuleSql += "select type,type1 from GT22176AT10.GT22176AT10.DrugsControlSale where sy01_orderDrugsControl_id.org_id = '" + orgId + "'";
      }
      let rule = ObjectStore.queryByYonQL(queryRuleSql, "sy01");
      let querySql =
        "select material,materialSkuCode,psychotropic,radiation,poison,narcotic,ephedrineContaining,coldChainDrugs,specialDrugs from GT22176AT10.GT22176AT10.SY01_material_file where org_id = '" +
        orgId +
        "' and material in (";
      for (let i = 0; i < materalIds.length; i++) {
        querySql += "'" + materalIds[i].id + "',";
      }
      querySql = querySql.substring(0, querySql.length - 1) + ")";
      let materialRes = ObjectStore.queryByYonQL(querySql, "sy01");
      for (let i = 0; i < materalIds.length; i++) {
        let flag = false;
        for (let j = 0; j < materialRes.length; j++) {
          if (materalIds[i].id == materialRes[j].material) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          errorMsg += "第" + (materalIds[i].index + 1) + "行物料【" + materalIds[i].name + "】未获取到首营信息,请先进行首营登记\n";
        }
      }
      //给药品打标签
      let materialInfo = [];
      for (let i = 0; i < materialRes.length; i++) {
        materialInfo.push({
          materialId: materialRes[i]["material"],
          skuId: materialRes[i]["materialSkuCode"],
          type: []
        });
        if (
          (materialRes[i].psychotropic == undefined || materialRes[i].psychotropic == 0) &&
          (materialRes[i].radiation == undefined || materialRes[i].radiation == 0) &&
          (materialRes[i].poison == undefined || materialRes[i].poison == 0) &&
          (materialRes[i].narcotic == undefined || materialRes[i].narcotic == 0) &&
          (materialRes[i].ephedrineContaining == undefined || materialRes[i].ephedrineContaining == 0) &&
          (materialRes[i].coldChainDrugs == undefined || materialRes[i].coldChainDrugs == 0) &&
          (materialRes[i].specialDrugs == undefined || materialRes[i].specialDrugs == 0)
        ) {
          //如果什么都不是，那么是普通药品
          materialInfo[i].type.push("common");
        }
        if (materialRes[i].psychotropic == 1) {
          materialInfo[i].type.push("psychotropic");
        }
        if (materialRes[i].radiation == 1) {
          materialInfo[i].type.push("radiation");
        }
        if (materialRes[i].poison == 1) {
          materialInfo[i].type.push("poison");
        }
        if (materialRes[i].narcotic == 1) {
          materialInfo[i].type.push("narcotic");
        }
        if (materialRes[i].ephedrineContaining == 1) {
          materialInfo[i].type.push("ephedrineContaining");
        }
        if (materialRes[i].coldChainDrugs == 1) {
          materialInfo[i].type.push("coldChainDrugs");
        }
        if (materialRes[i].specialDrugs == 1) {
          materialInfo[i].type.push("specialDrugs");
        }
      }
      //给传参的药品多行整合，按照物料+sku维度
      let requestMaterialInfo = [];
      let tempArr = [];
      let tempStr = "";
      for (let i = 0; i < materalIds.length; i++) {
        tempStr = materalIds[i].sku == undefined ? "" : materalIds[i].sku.toString();
        if (tempArr.indexOf(materalIds[i].id.toString() + tempStr) > -1) {
          continue;
        } else {
          tempArr.push(materalIds[i].id.toString() + tempStr);
          requestMaterialInfo.push({
            id: materalIds[i].id,
            name: materalIds[i].name,
            skuId: materalIds[i].sku,
            skuName: materalIds[i].skuName,
            index: materalIds[i].index
          });
          for (let j = 0; j < materialInfo.length; j++) {
            if (materalIds[i].sku == undefined && materalIds[i].id == materialInfo[j].materialId) {
              requestMaterialInfo[i].type = materialInfo[j].type;
            }
            if (materalIds[i].sku != undefined) {
              if (materialInfo[j].materialId == materalIds[i].id) {
                requestMaterialInfo[i].type = materialInfo[j].type;
              }
              if (materialInfo[j].materialId == materalIds[i].id && materialInfo[j].skuId == materalIds[i].sku) {
                requestMaterialInfo[i].type = materialInfo[j].type;
                break;
              }
            }
          }
        }
      }
      //规则匹配
      for (let i = 0; i < rule.length; i++) {
        //如果是其他商品冲突，那么这个订单，只允许有一种商品
        if (rule[i].type == "9" || rule[i].type1 == "9") {
          let otherType = rule[i].type == "9" ? rule[i].type1 : rule[i].type;
          otherType = map[otherType].type;
          for (let j = 0; j < requestMaterialInfo.length; j++) {
            if (requestMaterialInfo[j].type.indexOf(otherType) > -1 && requestMaterialInfo.length > 1) {
              errorMsg =
                "第" +
                (requestMaterialInfo[j].index + 1) +
                "行物料【" +
                requestMaterialInfo[j].name +
                "】是" +
                map[otherType].name +
                "药品，与第" +
                (j + 1) +
                "行物料(其他商品)冲突，不能一起下单，请检查互斥规则配置";
            }
          }
        }
        //如果是其他种类冲突，那么这个订单，只允许有一种类型(某个物料触发)
        else if (rule[i].type == "10" || rule[i].type1 == "10") {
          let otherType = rule[i].type == "9" ? rule[i].type1 : rule[i].type;
          otherType = map[otherType].type;
          let index = -1;
          for (let j = 0; j < requestMaterialInfo.length; j++) {
            //找到第一个与其他种类对应的types
            if (requestMaterialInfo[j].type.indexOf(otherType) > -1) {
              index = j;
              break;
            }
          }
          //如果触发规则，查询其他行的物料的type 是否除了type还有其他的类型
          if (requestMaterialInfo.length > 0 && index != -1) {
            for (let j = 0; j < requestMaterialInfo.length; j++) {
              if (j == index) {
                continue;
              }
              //这个要求比较严格，不允许其他行有其他类型
              if (requestMaterialInfo[j].type.length != 1 || requestMaterialInfo[j].type.indexOf(otherType) == -1) {
                errorMsg =
                  "第" +
                  (requestMaterialInfo[index].index + 1) +
                  "行物料【" +
                  requestMaterialInfo[index].name +
                  "】是" +
                  map[otherType].name +
                  "药品，与第" +
                  (j + 1) +
                  "行物料(其他种类)冲突，不能一起下单，请检查互斥规则配置";
              }
            }
          }
        } else {
          let index = -1;
          for (let j = 0; j < requestMaterialInfo.length; j++) {
            //找到左边属性
            if (requestMaterialInfo[j].type.indexOf(map[rule[i].type].type) > -1) {
              index = j;
              break;
            }
          }
          //如果触发规则，查询其他行的物料的type 是否除了type还有其他的类型
          if (requestMaterialInfo.length > 0 && index != -1) {
            for (let j = 0; j < requestMaterialInfo.length; j++) {
              if (j == index) {
                continue;
              }
              //只要找到rule[i].type1,即算违反配置需要
              if (requestMaterialInfo[j].type.indexOf(map[rule[i].type1].type) != -1) {
                errorMsg =
                  "第" +
                  (requestMaterialInfo[index].index + 1) +
                  "行物料【" +
                  requestMaterialInfo[index].name +
                  "】是" +
                  map[rule[i].type].name +
                  "药品，与第" +
                  (j + 1) +
                  "行物料(" +
                  map[rule[i].type1].name +
                  ")冲突，不能一起下单，请检查互斥规则配置";
              }
            }
          }
        }
      }
    }
    return { errorMsg };
  }
}
exports({ entryPoint: MyAPIHandler });