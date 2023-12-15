let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var accessToken;
    var saleOrder = getSaleOrderDetail({ id: param.data[0].id });
    var agentCode = getMerchant({ id: saleOrder.agentId }).code;
    // 校验NCC是否允许弃审
    verifyByNcc({ data: [{ saleorderno: saleOrder.code }] }); //注释该行，关闭弃审检验
    // 酒标累积量
    wineLabelsCount();
    function getToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function getSaleOrderDetail(params) {
      let result = postman("get", "https://www.example.com/" + getToken() + "&id=" + params.id, "", "");
      result = JSON.parse(result);
      if (result.code != "200") {
        throw new Error("查询销售订单异常:" + result.message);
      }
      return result.data;
    }
    function getMerchant(params) {
      // 响应信息
      let result = postman("get", "https://www.example.com/" + getToken() + "&id=" + params.id, "", "");
      try {
        // 转为JSON对象
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询客户档案详情 " + e);
      }
      return result.data;
    }
    function verifyByNcc(params) {
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/JudgeOrderIsToWMSServlet", "", JSON.stringify(params));
      try {
        result = JSON.parse(result);
        if (result.code + "" !== "200") {
          throw new Error(result.msg);
        } else if (result.data === undefined || result.data.length < 1) {
          throw new Error(JSON.stringify(result));
        } else {
          result.data.forEach((self) => {
            if (self.issendtowms + "" !== "false") {
              throw new Error("单据已进行发货相关流程，不允许弃审。");
            }
          });
        }
      } catch (e) {
        throw new Error("NCC校验 " + e + ";参数:" + JSON.stringify(params));
      }
    }
    function wineLabelsCount() {
      let wineLabelCodeAndName = saleOrder.headItem.define48;
      if (wineLabelCodeAndName == "" || wineLabelCodeAndName == undefined) {
        return;
      }
      let wineLabelCode = wineLabelCodeAndName.split("+")[0];
      let operCount = new Big(0);
      let productIds = [];
      saleOrder.orderDetails.forEach((self) => {
        productIds.push(self.productId);
      });
      let materialInfos = getMaterialInfos(productIds);
      let productId2ManageClass = {};
      materialInfos.forEach((self) => {
        productId2ManageClass[self.id] = self.manageClass_Name;
      });
      saleOrder.orderDetails.forEach((self) => {
        // 服务类过滤
        if (productId2ManageClass[self.productId] == "服务类") {
          return;
        }
        operCount = operCount.plus(new Big(self.qty));
      });
      let req = {
        code: wineLabelCode,
        agentCode: agentCode,
        operCount: -operCount
      };
      let res = postman("post", config.bipSelfUrl + "/General_product_cla/rest/updateLableCount?access_token=" + getToken(), "", JSON.stringify(req));
      // 转为JSON对象
      res = JSON.parse(res);
      // 返回信息校验
      if (res.code + "" != "200") {
        throw new Error("修改酒标累积量失败:" + res.message);
      }
    }
    function getMaterialInfos(param) {
      let req = { data: { id: param } };
      let res = postman("post", "https://www.example.com/" + getToken(), "", JSON.stringify(req));
      res = JSON.parse(res);
      if (res.code != "200") {
        throw new Error("物料档案批量详情查询异常:" + res.message + ";参数[" + param + "]");
      }
      return res.data.recordList;
    }
  }
}
exports({ entryPoint: MyTrigger });