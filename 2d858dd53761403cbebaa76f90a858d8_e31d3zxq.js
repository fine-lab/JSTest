let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //判断组织是否启用GSP组织参数
    let sqlStr = " select isgspzz, poacontrol,isgspmanage, noGspFlowCtrl from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where dr = 0  and org_id = '" + request.orgId + "'";
    let gspParameterArray = ObjectStore.queryByYonQL(sqlStr, "sy01");
    if (gspParameterArray.length > 0) {
      if (!gspParameterArray[0].isgspmanage) {
        return { code: 1005, message: "该组织未启用GSP管理, 请检查" };
      }
    } else {
      return { code: 1005, message: "该组织未启用GSP管理, 请检查" };
    }
    let validateFeature = function (orgId, materialId, feature) {
      //先判断是否传的值，是否符合敏感
      let queryTemplateInfo = "select productTemplate.id id,productTemplate.name name from pc.product.Product where id = '" + materialId + "'";
      let template = ObjectStore.queryByYonQL(queryTemplateInfo, "productcenter")[0].id;
      let yonql = "select featureId,featureName,featureCode,gspControl from GT22176AT10.GT22176AT10.sy01_freeFeature where drugFeatrueConfig_id.template = '" + template + "'";
      let controlRes = ObjectStore.queryByYonQL(yonql, "sy01");
      if (controlRes.length == 0) {
        return { code: 1004, message: "该物料模板未设置药品敏感特征" };
      }
      let sensitiveError = "";
      for (let i = 0; i < controlRes.length; i++) {
        if (controlRes[i].gspControl == true && (!feature.hasOwnProperty(controlRes[i].featureCode) || feature[controlRes[i].featureCode] == undefined)) {
          sensitiveError += controlRes[i].featureName + ",";
        }
      }
      if (sensitiveError.length > 0) {
        return { code: 1003, message: "特征项：【" + sensitiveError.substring(0, sensitiveError.length - 1) + "】为敏感特征，不能为空" };
      }
      //首营商品档案，特征实体：GT22176AT10.GT22176AT10.SY01_fccusauditv4tezhengnFreeCT
      //医药商品档案，特征实体：GT22176AT10.GT22176AT10.SY01_material_filefreeCTHFreeCT
      //查询医药物料证照档案中，此特征是否进行过首营
      //解析feture
      //先判断是否经过物料维度的首营
      let isMaterialCamp = "select id from GT22176AT10.GT22176AT10.SY01_material_file where isSku = 0 and org_id = '" + orgId + "' and material = '" + materialId + "'";
      let isMaterialCampRes = ObjectStore.queryByYonQL(isMaterialCamp, "sy01");
      if (isMaterialCampRes.length > 0) {
        return { code: 1001, message: "该特征组已进行过首营" };
      }
      let extendStr = "";
      let featureCode;
      for (let i = 0; i < controlRes.length; i++) {
        if (controlRes[i].gspControl == true) {
          featureCode = controlRes[i].featureCode;
          extendStr += "freeCTH." + featureCode + " = '" + feature[featureCode] + "' and ";
        }
      }
      extendStr = extendStr.substring(0, extendStr.length - 4);
      let isCampYonql = "select id from GT22176AT10.GT22176AT10.SY01_material_file where isSku = 2 and org_id = '" + orgId + "' and material = '" + materialId + "' and " + extendStr;
      let isCampRes = ObjectStore.queryByYonQL(isCampYonql, "sy01");
      if (isCampRes.length > 0) {
        return { code: 1001, message: "该特征组已进行过首营" };
      } else {
        return { code: 1002, message: "该特征组未进行首营" };
      }
    };
    let message = "";
    let licenseRows = request.licenseRows;
    let index = 0;
    let index1 = 0;
    //判断证照中
    for (let i = 0; i < licenseRows.length; i++) {
      let type = parseInt(licenseRows[i][request.licenseAuthKey]);
      if (licenseRows[i]._status != "Delete") {
        index++;
        if (type == 5 || type == "5") {
          let licenseRange = licenseRows[i][request.licenseSubTableKey];
          for (let j = 0; j < licenseRange.length; j++) {
            if (licenseRange[j]._status != "Delete") {
              index1++;
              let materialId = licenseRange[j].extend_pro_auth_type;
              let feature = licenseRange[j].feature;
              let validateResult = validateFeature(request.orgId, materialId, feature);
              if (validateResult.code != 1001) {
                message += "第" + index + "行证照中，第" + index1 + "行授权范围" + validateResult.message + "\n";
              }
            }
          }
        }
      }
    }
    index = 0;
    index1 = 0;
    let authRows = request.authRows;
    //判断授权委托书中
    for (let i = 0; i < authRows.length; i++) {
      let type = parseInt(authRows[i][request.authKey]);
      if (authRows[i]._status != "Delete") {
        index++;
        if (type == 5 || type == "5") {
          let authRange = authRows[i][request.authSubTableKey];
          for (let j = 0; j < authRange.length; j++) {
            if (authRange[j]._status != "Delete") {
              index1++;
              let materialId = authRange[j].extend_pro_auth_type;
              let feature = authRange[j].feature;
              let validateResult = validateFeature(request.orgId, materialId, feature);
              if (validateResult.code != 1001) {
                message += "第" + index + "行授权中，第" + index1 + "行授权范围" + validateResult.message + "\n";
              }
            }
          }
        }
      }
    }
    return { message: message };
  }
}
exports({ entryPoint: MyAPIHandler });