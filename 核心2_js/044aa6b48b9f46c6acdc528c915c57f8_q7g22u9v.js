let AbstractAPIHandler = require("AbstractAPIHandler");
class CheckSupplierLicenses extends AbstractAPIHandler {
  execute(request) {
    let checkResult;
    try {
      let { suppliers } = request;
      //请求头
      let header = {
        appkey: "yourkeyHere",
        appsecret: "yoursecretHere"
      };
      let body = {
        param: suppliers // 这是一个数组
      };
      let url = "https://www.example.com/";
      let apiResponse = JSON.parse(ublinker("POST", url, JSON.stringify(header), JSON.stringify(body)));
      if (apiResponse.code != 200 && apiResponse.code !== "0") {
        throw new Error(`${apiResponse.msg}`);
      }
      if (apiResponse.code === "0") {
        return { verification: true };
      }
      let licenses = apiResponse.data;
      checkResult = this.checkSupplierLicense(suppliers, licenses);
    } catch (err) {
      checkResult = { verification: false, msg: `调用供应商资质的服务失败，错误详情: ${err.toString()}` };
    }
    return checkResult;
  }
  checkSupplierLicense(suppliers, licenses) {
    let result = { verification: true, msg: "" };
    if (!suppliers || suppliers.length <= 0 || !licenses || licenses.length <= 0) {
      return result;
    }
    let messages = [];
    let now = new Date(Date.now());
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    for (let license of licenses) {
      let { supplyDocId, supplyDocCode, supplyDocName, qualifyCode, qualifyName, expDate } = license;
      if (!expDate) {
        continue;
      }
      let expDateTime = new Date(expDate).getTime();
      if (expDateTime < today) {
        result.verification = false;
        messages.push(`供应商【${supplyDocCode}-${supplyDocName}】证照【${qualifyCode}-${qualifyName}】`);
      }
    }
    if (!result.verification) {
      result.msg = `以下供应商证照已失效：${messages.join(";")}`;
    }
    return result;
  }
}
exports({
  entryPoint: CheckSupplierLicenses
});