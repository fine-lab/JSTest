let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let productCode = param.data[0].code;
    let secretKey = "yourKeyHere";
    let tokenUrl = "https://www.example.com/" + secretKey;
    let header = { Accept: "application/json" };
    let strResponse = postman("get", tokenUrl, JSON.stringify(header), null);
    let token = JSON.parse(strResponse).data;
    let proIdParam = {
      accessToken: token,
      type: 0,
      productCode: productCode
    };
    let header2 = { "Content-Type": "application/json", Accept: "application/json" };
    let strResponse2 = postman("post", "https://www.example.com/", JSON.stringify(header2), JSON.stringify(proIdParam));
    let res = JSON.parse(strResponse2);
    if (res.code != 0) {
      throw new Error("获取物料出错:" + res.errMsg);
    }
    let productList = res.data;
    let delProductNowId = null;
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].status == 1) {
        delProductNowId = productList[i].id;
      }
    }
    let strResponse3 = null;
    if (res.success) {
      let delProParma = {
        accessToken: token,
        operatorName: "管理员",
        productId: [delProductNowId]
      };
      strResponse3 = postman("post", "https://www.example.com/", JSON.stringify(header2), JSON.stringify(delProParma));
      let delNowRes = JSON.parse(strResponse3);
      if (delNowRes.code != 0) {
        throw new Error("删除物料出错:" + delNowRes.errMsg);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });