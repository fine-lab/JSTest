let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let customerId = request.customerId;
      let vouchdate = request.vouchdate;
      if (vouchdate == undefined || vouchdate == null) {
        throw new Error("单据日期为空");
      }
      vouchdate = new Date(vouchdate);
      let month = "" + (vouchdate.getMonth() + 1),
        day = "" + vouchdate.getDate(),
        year = vouchdate.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      vouchdate = [year, month, day].join("-");
      vouchdate = vouchdate.substring(0, 10);
      let settlementOrgId = request.settlementOrgId;
      let parameterRequest = { saleorgid: settlementOrgId };
      let gspParametersFun = extrequire("GT22176AT10.publicFunction.getGspParameters");
      let orgParameter = gspParametersFun.execute(parameterRequest);
      if (orgParameter.gspParameterArray.length == 0) {
        return { code: 200, message: "success" };
      }
      let isgspzz = orgParameter.gspParameterArray[0].isgspzz;
      //如果没有证照管理，那么就随便选
      if (![1, "1", true, "true"].includes(isgspzz)) {
        return { code: 200, message: "success" };
      }
      let queryCustomerZzQl =
        "select license,license.licenseName licenseName,beginDate,endDate from GT22176AT10.GT22176AT10.sy01_customers_file_license " +
        " where sy01_customers_file_id.customer = '" +
        customerId +
        "' and sy01_customers_file_id.org_id = '" +
        settlementOrgId +
        "' " +
        " and dr = 0 and sy01_customers_file_id.dr = 0";
      let customerZzRes = ObjectStore.queryByYonQL(queryCustomerZzQl, "sy01");
      if (customerZzRes == undefined || customerZzRes == null || !Array.isArray(customerZzRes) || customerZzRes.length == 0) {
        throw new Error("该客户未上传证照！");
      }
      let zzMap = {};
      let licenseId;
      let licenseName;
      let beginDate;
      let endDate;
      let periodIsLegal = false;
      for (let i = 0; i < customerZzRes.length; i++) {
        periodIsLegal = false;
        licenseId = customerZzRes[i].license;
        licenseName = customerZzRes[i].licenseName;
        beginDate = customerZzRes[i].beginDate;
        endDate = customerZzRes[i].endDate;
        if (licenseId == undefined || licenseId == null) {
          throw new Error("客户证照档案表体中未维护证照档案");
        }
        if (beginDate != undefined && endDate != undefined && vouchdate >= beginDate && vouchdate <= endDate) {
          periodIsLegal = true;
        }
        if (zzMap.hasOwnProperty(licenseId)) {
          if (zzMap[licenseId].periodIsLegal == false && periodIsLegal == true) {
            zzMap[licenseId].periodIsLegal = true;
          }
        } else {
          zzMap[licenseId] = { licenseName: licenseName, periodIsLegal: periodIsLegal };
        }
      }
      let licenseNameArray = [];
      for (let key in zzMap) {
        if (zzMap[key].periodIsLegal == false) {
          licenseNameArray.push("【" + zzMap[key].licenseName + "】");
        }
      }
      if (licenseNameArray.length > 0) {
        throw new Error("客户证照" + licenseNameArray.join("、") + "效期不合法");
      }
    } catch (e) {
      throw new Error(e);
    }
    return { code: 200, message: "success" };
  }
}
exports({ entryPoint: MyAPIHandler });