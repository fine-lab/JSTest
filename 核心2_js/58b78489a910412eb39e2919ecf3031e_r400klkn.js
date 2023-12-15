let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let filterSchemeId = request.filterSchemeId; //养护过滤方案id
    let orgId = request.orgId; //组织id
    //查询过滤方案条件
    let filterconditQuery = { SY01_yhjk_config_v1_id: filterSchemeId };
    let filterconditList = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_filtercondit", filterconditQuery);
    let querySql = "select * ,material product_code,materialName product_name,dosageForm dosage_form"; //,materialCode product_code.code,packingMaterialName packing_material.packing_name,dosageFormName dosage_form.dosagaFormName";
    querySql += ", commonNme produc_name, packingMaterial packing_material,producingArea origin_place,listingHolder license_holder,listingHolderName license_holder_ip_name";
    querySql += ",materialCode product_code_materialCode,packingMaterialName packing_material_packing_name,dosageFormName dosage_form_dosagaFormName";
    querySql += ",approvalNumber approval_number,expireDateNo guarantee,expireDateUnit guarantee_dw, specs specification from GT22176AT10.GT22176AT10.SY01_material_file where ";
    for (let i = 0; i < filterconditList.length; i++) {
      //通过拼接过滤条件生成动态sql
      let filtercondit = filterconditList[i];
      let startBrackets = "";
      let brackets = "";
      let logic = "";
      let compare = "";
      switch (parseInt(filtercondit.startBrackets)) {
        case 1:
          startBrackets = " ( ";
          break;
        case 2:
          startBrackets = " (( ";
          break;
        case 3:
          startBrackets = " ((( ";
          break;
      }
      switch (parseInt(filtercondit.brackets)) {
        case 4:
          brackets = ") ";
          break;
        case 5:
          brackets = ")) ";
          break;
        case 6:
          brackets = "))) ";
          break;
      }
      switch (parseInt(filtercondit.logic)) {
        case 1:
          logic = " and ";
          break;
        case 2:
          logic = " or ";
          break;
      }
      let value = filtercondit.value;
      switch (filtercondit.compare) {
        case "eq":
          compare = " = ";
          break;
        case "neq":
          compare = " != ";
          break;
        case "like":
          compare = " like ";
          break;
        case "egt":
          compare = " >= ";
          break;
        case "elt":
          compare = " <= ";
          break;
        case "gt":
          compare = " > ";
          break;
        case "lt":
          compare = " < ";
          break;
      }
      value = "'" + value + "'";
      //查询过滤条件字段配置
      let filterFieldCfQuery = { id: filtercondit.SY01_filtercondit_field_id };
      let filterFieldCfList = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_filtercondit_field", filterFieldCfQuery);
      let filterFieldCfObj = filterFieldCfList[0];
      if (filterFieldCfObj.is_own == 2) {
        continue;
      }
      let field = filterFieldCfObj.fieldCode;
      querySql += startBrackets + field + compare + value + brackets + " " + logic;
    }
    //查询医药物料档案
    let apiResponseProduct = ObjectStore.queryByYonQL(querySql);
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let qtyBatchno = [];
    let simpleVOs = [];
    //循环医药物料
    for (let l = 0; l < apiResponseProduct.length; l++) {
      if (apiResponseProduct[l].curingTypeName != "一般养护") {
        apiResponseProduct.splice(l, 1);
        l--;
        continue;
      }
      //查询重点明细是否存在相同物料
      let mainCurSql = "select * from GT22176AT10.GT22176AT10.SY01_mainproco_son where product_code='" + apiResponseProduct[l].material + "'  or scyhrq is not null";
      let mainCurRes = ObjectStore.queryByYonQL(mainCurSql);
      if (typeof mainCurRes != "undefined" && mainCurRes != null) {
        let count = mainCurRes.length;
        if (count < 1) {
          //不存在则将医药物料条件添加作为物料api条件
          simpleVOs.push({
            logicOp: "or",
            conditions: [
              {
                op: "eq",
                field: "productApplyRange_orgId",
                value1: apiResponseProduct[l].org_id
              },
              {
                op: "eq",
                field: "id",
                value1: apiResponseProduct[l].material
              }
            ]
          });
        } else {
          //存在则判断养护日期是否有小于30天的
          let isFlag = false;
          for (let i = 0; i < mainCurRes.length; i++) {
            let scyhrq = mainCurRes[i].scyhrq;
            let date = new Date(scyhrq);
            let nowDate = new Date();
            let difValue = Math.floor((nowDate - date) / (1000 * 60 * 60 * 24));
            if (difValue < 30) {
              isFlag = true;
              break;
            }
          }
          //小于30天则无需重复提取
          if (isFlag) {
            apiResponseProduct.splice(l, 1);
            l--;
          } else {
            simpleVOs.push({
              logicOp: "or",
              conditions: [
                {
                  op: "eq",
                  field: "productApplyRange_orgId",
                  value1: apiResponseProduct[l].org_id
                },
                {
                  op: "eq",
                  field: "id",
                  value1: apiResponseProduct[l].material
                }
              ]
            });
          }
        }
      }
    }
    let resultList = apiResponseProduct;
    //现存量查询
    let menchantQueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/stock/QueryCurrentStocksByCondition";
    let menchantQueryBody = { org: orgId };
    let apiQtyResponse = openLinker("POST", menchantQueryUrl, apiPreAndAppCode.appCode, JSON.stringify(menchantQueryBody));
    apiQtyResponse = JSON.parse(apiQtyResponse);
    let merchantQtyInfo = apiQtyResponse.data;
    if (typeof merchantQtyInfo != "undefined" && merchantQtyInfo != null) {
      //循环现存量判断医药物料是否相等
      for (let batch = 0; batch < merchantQtyInfo.length; batch++) {
        for (let i = 0; i < apiResponseProduct.length; i++) {
          if (apiResponseProduct[i].material == merchantQtyInfo[batch].product) {
            //同个物料存在多个现存 所以需要添加提取相同物料 赋值不同的现存量
            apiResponseProduct[i].product_num = merchantQtyInfo[batch].currentqty;
            resultList.push(apiResponseProduct[i]);
            //将批次号添加作为批次号api条件
            qtyBatchno.push(merchantQtyInfo[batch].batchno);
            break;
          }
        }
      }
    }
    //循环批次号接口
    for (let j = 0; j < qtyBatchno.length; j++) {
      let batchNoUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/batchno/report/list";
      let Body = {
        batchno: qtyBatchno[j],
        pageIndex: "1",
        pageSize: apiResponseProduct.length + 100
      };
      let apiResponseBatch = openLinker("POST", batchNoUrl, apiPreAndAppCode.appCode, JSON.stringify(Body));
      apiResponseBatch = JSON.parse(apiResponseBatch);
      let batchInfo = apiResponseBatch.data.recordList[0];
      for (let i = 0; i < apiResponseProduct.length; i++) {
        //将批次和医药物料进行匹配 批次时间药大于30天
        if (typeof batchInfo.invaliddate != "undefined") {
          let endDate = batchInfo.invaliddate;
          let date = new Date(endDate);
          let nowDate = new Date();
          let difValue = Math.floor((date - nowDate) / (1000 * 60 * 60 * 24));
          if (typeof endDate != "undefined" && difValue >= 30 && apiResponseProduct[i].material == batchInfo.product) {
            apiResponseProduct[i].lot_number = batchInfo.batchno;
            apiResponseProduct[i].produce_date_show = batchInfo.producedate;
            apiResponseProduct[i].valid_until_show = batchInfo.invaliddate;
          }
        }
      }
    }
    //查询原厂物料档案
    let menchantQueryPageUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/product/list";
    let bodyPage = {
      pageIndex: "1",
      pageSize: apiResponseProduct.length + 100,
      condition: {
        simpleVOs: simpleVOs
      }
    };
    let materialProList = openLinker("POST", menchantQueryPageUrl, apiPreAndAppCode.appCode, JSON.stringify(bodyPage));
    materialProList = JSON.parse(materialProList);
    let proList = [];
    if (typeof materialProList != "undefined") {
      proList = materialProList.data.recordList;
    }
    if (typeof proList != "undefined" && proList != null) {
      for (let k = 0; k < apiResponseProduct.length; k++) {
        for (let l = 0; l < proList.length; l++) {
          if (apiResponseProduct[k].material == proList[l].id) {
            apiResponseProduct[k].product_unit = proList[l].unit;
            apiResponseProduct[k].product_unit_name = proList[l].unit_Name;
            apiResponseProduct[k].product_name = proList[l].name.zh_CN;
            break;
          }
        }
      }
    }
    return { result: resultList };
  }
}
exports({ entryPoint: MyAPIHandler });