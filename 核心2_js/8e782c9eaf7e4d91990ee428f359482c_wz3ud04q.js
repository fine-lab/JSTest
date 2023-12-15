let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let finishedReportDetail = data.finishedReportDetail;
    if (typeof finishedReportDetail != "undefined" && finishedReportDetail != null) {
      let orgId = data.orgId;
      let finishedId = data.finishedId;
      //查询完工报告会计主体
      let requst = { finishedId, orgId };
      let selFinanceOrgRes = extrequire("ISY_2.public.getPoFinished").execute(requst).selFinanceOrgRes;
      //查询GMP组织参数
      let gmpInfoArray = extrequire("ISY_2.public.getParamInfo").execute().paramRes;
      if (selFinanceOrgRes.length > 0) {
        orgId = selFinanceOrgRes[0].id;
        let isInspectReal = false;
        for (let i = 0; i < gmpInfoArray.length; i++) {
          if (orgId == gmpInfoArray[i].org_id) {
            isInspectReal = true;
            for (let irow = 0; irow < finishedReportDetail.length; irow++) {
              let orderDetail = finishedReportDetail[irow];
              if (gmpInfoArray[i].isProductPass != "1") {
                orderDetail.set("extend_releasestatus", "无需放行");
              } else if (gmpInfoArray[i].isProductPass == "1") {
                let materialId = orderDetail.productId;
                let requst = { materialId, orgId };
                let materialRes = extrequire("ISY_2.public.getGMPProduct").execute(requst).suppliesRes;
                if (materialRes.length > 0) {
                  let isInspect = materialRes[0].isInspect;
                  if (isInspect == "1") {
                    orderDetail.set("extend_releasestatus", "未放行");
                  } else {
                    orderDetail.set("extend_releasestatus", "无需放行");
                  }
                } else {
                  orderDetail.set("extend_releasestatus", "无需放行");
                }
              }
            }
          }
        }
        if (!isInspectReal) {
          orderDetail.set("extend_releasestatus", "无需放行");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });