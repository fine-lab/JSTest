let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let yonql = "select id from GT22176AT10.GT22176AT10.SY01_material_file where org_id=" + request.orgId + " and material = " + request.materialId;
    let res = ObjectStore.queryByYonQL(yonql, "sy01");
    if (res.length == 0) {
      return { proLicInfo: null };
    } else {
      let obj = {
        id: res[0].id,
        compositions: [
          {
            name: "SY01_material_file_childList"
          }
        ]
      };
      let proLicInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_material_file", obj);
      //查询近效期类别
      let nperiodTypeObject = { id: proLicInfo.nearEffectivePeriodType };
      let nperiodTypeRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_nperiodtypesv2", nperiodTypeObject);
      //查询存储条件
      let storageConditionsObject = { id: proLicInfo.storageCondition };
      let storageConditionsRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_stocondv2", storageConditionsObject);
      if (nperiodTypeRes.length > 0) {
        proLicInfo.nearName = nperiodTypeRes[0].nearName;
      }
      if (storageConditionsRes.length > 0) {
        proLicInfo.storageName = storageConditionsRes[0].storageName;
      }
      for (let i = 0; i < proLicInfo.SY01_material_file_childList.length; i++) {
        let qualifyReport = proLicInfo.SY01_material_file_childList[i].qualifyReport;
        //查询资质及报告档案
        let otherReportObject = { id: qualifyReport };
        let otherReportRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.sy01_other_report", otherReportObject);
        proLicInfo.SY01_material_file_childList[i].qualifyReportName = otherReportRes[0].name;
      }
      return { proLicInfo: proLicInfo };
    }
  }
}
exports({ entryPoint: MyAPIHandler });