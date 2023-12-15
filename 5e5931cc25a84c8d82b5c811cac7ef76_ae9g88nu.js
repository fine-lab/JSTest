let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let materialId = request.materialId;
    let feature = request.feature;
    let orgId = request.orgId;
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
  }
}
exports({ entryPoint: MyAPIHandler });