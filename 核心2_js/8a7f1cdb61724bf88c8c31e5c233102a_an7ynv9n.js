let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取token用来访问openApi接口
    var accessToken;
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    // 获取物料信息
    var datas = param.data;
    // 循环校验物料
    datas.forEach((self) => {
      checkMaterialSplit(self);
    });
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function checkMaterialSplit(requestData) {
      // 根据组织ID获取分单规则数据
      let materialSpliting = postman(
        "post",
        config.bipSelfUrl + "/General_product_cla/rest/spliting/material?access_token=" + getAccessToken(),
        "",
        JSON.stringify({
          materialId: requestData.id
        })
      );
      // 转为JSON对象
      materialSpliting = JSON.parse(materialSpliting);
      // 返回信息校验
      if (materialSpliting.code != "200") {
        throw new Error("获取物料分单规则失败:" + materialSpliting.message);
      }
      // 分单规则列表数据
      if (materialSpliting.data === undefined || materialSpliting.data.length < 1) {
        // 分单规则未启用
        throw new Error("   请先维护分单规则，物料对应交易类型后，再进行上架处理！");
      }
    }
    function checkMaterialSplitByOrg(requestData) {
      // 根据组织ID获取分单规则数据
      let materialSpliting = postman(
        "post",
        config.bipSelfUrl + "/General_product_cla/General_product_clas/spliting/list?access_token=" + getAccessToken(),
        "",
        JSON.stringify({
          // 使用组织
          orgId: requestData.productApplyRange_orgId + "",
          materialId: requestData.id
        })
      );
      // 转为JSON对象
      materialSpliting = JSON.parse(materialSpliting);
      // 返回信息校验
      if (materialSpliting.code != "200") {
        throw new Error("获取物料分单规则失败:" + materialSpliting.message);
      }
      // 分单规则列表数据
      if (materialSpliting.data === undefined || materialSpliting.data.materials === undefined || materialSpliting.data.materials.length < 1) {
        // 分单规则未启用
        throw new Error("   请先维护分单规则，物料对应交易类型后，再进行上架处理！");
      }
    }
  }
}
exports({ entryPoint: MyTrigger });