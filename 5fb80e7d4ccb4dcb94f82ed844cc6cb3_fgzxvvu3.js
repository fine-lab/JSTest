let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let orgId = data.settlementOrgId;
    let customerId = data.agentId;
    let requst = { orgId, customerId };
    //获取GMP组织参数信息
    let paramOrgRes = extrequire("ISY_2.public.getParamInfo").execute().paramRes;
    //获取GMP客户证照档案信息
    let customerLicenseRes = extrequire("ISY_2.public.getCustomerLic").execute(requst).paramRes;
    let isTrue = false;
    for (let i = 0; i < paramOrgRes.length; i++) {
      if (orgId == paramOrgRes[i].org_id) {
        if (paramOrgRes[i].customerLicenseControl == "1") {
          isTrue = true;
        }
      }
    }
    if (isTrue && customerLicenseRes.length > 0) {
      for (let i = 0; i < customerLicenseRes.length; i++) {
        let validUntil = customerLicenseRes[i].validUntil;
        let nowDate = new Date(),
          nowYear = nowDate.getFullYear(),
          nowMonth = nowDate.getMonth() + 1,
          nowDay = nowDate.getDate();
        if (nowMonth < 10) {
          nowMonth = "0" + nowMonth;
        }
        if (nowDay < 10) {
          nowDay = "0" + nowDay;
        }
        let now = nowYear + "-" + nowMonth + "-" + nowDay;
        let nowTime = new Date(now);
        let entDate = new Date(validUntil);
        let day = parseInt(nowTime.getTime() - entDate.getTime()) / parseInt(1000 * 60 * 60 * 24);
        if (day > 0) {
          throw new Error("当前客户证照编码为" + customerLicenseRes[i].licenseCode + "的证照已过期，请检查", "error");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });