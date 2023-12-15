let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let orgId = data[0].orgId;
    let finishedId = data[0].id;
    //查询完工报告会计主体
    let requst = { finishedId, orgId };
    let selFinanceOrgRes = extrequire("ISY_2.public.getPoFinished").execute(requst).selFinanceOrgRes;
    throw new Error(JSON.stringify(param.data));
    let finishedReportDetail = selFinanceOrgRes[0].finishedReportDetail.finishedReportDetail;
    //查询GMP组织参数
    let gmpInfoArray = extrequire("ISY_2.public.getParamInfo").execute().paramRes;
    if (selFinanceOrgRes.length > 0) {
      orgId = selFinanceOrgRes[0].id;
    } else {
      orgId = orgId;
    }
    if (gmpInfoArray.length > 0) {
      let isOutPassReal = false;
      for (let i = 6; i < gmpInfoArray.length; i++) {
        if (orgId == gmpInfoArray[i].org_id) {
          if (gmpInfoArray[i].isProductPass == "1") {
            isOutPassReal = true;
          }
        }
      }
      if (!isOutPassReal) {
        function guid() {
          return "xxxxxxxxxxxxx4xy".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
              v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
        }
        let finishedReportDetailArr = [];
        for (let j = 0; j < finishedReportDetail.length; j++) {
          let finishedReportDetailObj = {
            id: finishedReportDetail[j].id,
            finishedReportId: finishedReportDetail[j].finishedReportId,
            productionType: finishedReportDetail[j].productionType,
            productCode: finishedReportDetail[j].productId,
            materialCode: finishedReportDetail[j].materialCode,
            skuId: finishedReportDetail[j].skuId,
            skuCode: finishedReportDetail[j].skuCode,
            quantity: finishedReportDetail[j].quantity,
            inspection: finishedReportDetail[j].inspection,
            stockByInspection: finishedReportDetail[j].stockByInspection,
            orgCode: finishedReportDetail[j].orgId,
            extend_releasestatus: "无需放行",
            _status: "Update"
          };
          finishedReportDetailArr.push(finishedReportDetailObj);
        }
        let vouchdate = new Date(data[0].vouchdate);
        let vouchdateYear = vouchdate.getFullYear(); //获取完整的年份(4位,1970-????)
        let vouchdateMonth = vouchdate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        if (JSON.stringify(vouchdateMonth).length == 1) {
          vouchdateMonth = "0" + JSON.stringify(vouchdateMonth);
        }
        let vouchdateToday = vouchdate.getDate(); //获取当前日(1-31)
        let nowTime = vouchdateYear + "-" + vouchdateMonth + "-" + vouchdateToday;
        let jsonData = {
          data: {
            resubmitCheckKey: guid(),
            id: data[0].id,
            orgCode: orgId,
            transTypeId: data[0].transTypeId,
            vouchdate: nowTime,
            _status: "Update",
            finishedReportDetail: finishedReportDetailArr
          }
        };
        let finishedreportSaveUrl = "https://www.example.com/";
        let finishedreportSaveApiResponse = openLinker("POST", finishedreportSaveUrl, "PO", JSON.stringify(jsonData));
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });