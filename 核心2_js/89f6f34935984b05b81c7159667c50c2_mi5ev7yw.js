let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rowInfos = request.rowInfos;
    let objectIds = new Set();
    let noSourceIndexArray = [];
    for (let i = 0; i < rowInfos.length; i++) {
      let productId = rowInfos[i].productId;
      let productName = rowInfos[i].productName;
      let bathcNo = rowInfos[i].bathcNo;
      //查询入库验收子表数据
      let queryFromReport =
        "select id,qualityReport from ISY_2.ISY_2.quality_inspection_report where dr = 0 and qualityReport is not null and product = '" + productId + "' and  batch = '" + bathcNo + "' limit 1";
      let reportRes = ObjectStore.queryByYonQL(queryFromReport, "sy01");
      if (reportRes == undefined || reportRes == null || !Array.isArray(reportRes) || reportRes.length == 0) {
        //如果没有查询购进入库验收里面上传的附件
        let queryFromCheck =
          "select id,enclosure from GT22176AT10.GT22176AT10.SY01_purinstockys_l where dr = 0 and enclosure is not null and material = '" + productId + "' and  batch_no = '" + bathcNo + "' limit 1";
        let checkRes = ObjectStore.queryByYonQL(queryFromCheck, "sy01");
        if (checkRes == undefined || checkRes == null || !Array.isArray(checkRes) || checkRes.length == 0) {
          noSourceIndexArray.push(i + 1);
        } else {
          objectIds.add(checkRes[0].enclosure);
        }
      } else {
        objectIds.add(reportRes[0].qualityReport);
      }
    }
    return { objectIds: Array.from(objectIds), noSourceIndexArray: noSourceIndexArray };
  }
}
exports({ entryPoint: MyAPIHandler });