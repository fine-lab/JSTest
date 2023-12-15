let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var requestData = param.requestData;
    let requestdata = "";
    if (Object.prototype.toString.call(requestData) === "[object Array]") {
      requestdata = requestData[0];
    }
    if (Object.prototype.toString.call(requestData) === "[object String]") {
      requestdata = JSON.parse(requestData);
    }
    var visitsummaryDefineCharacter = requestdata.visitsummaryDefineCharacter;
    // 获取门店id
    var define7Id = visitsummaryDefineCharacter["attrext51"];
    // 判断门店是否是在进行开发，如果是，不能存在笔架
    if (define7Id === "1627897101886685190" || define7Id === "1627897256523857923") {
      // 获取拜访小结id
      var terminalid = requestdata.terminal;
      var sql = "select product from  dsfa.assetstandbook.AssetsStandBook  where  terminal = '" + terminalid + "'";
      var datas = ObjectStore.queryByYonQL(sql, "yycrm");
      // 查笔架类型
      if (datas && datas.length > 0) {
        for (let i = 0; i < datas.length; i++) {
          var productSql = "select * from  pc.product.Product where id = '" + datas[i].product + "' and manageClass in ('1682303368183676935','1682303720372568071')";
          var productDatas = ObjectStore.queryByYonQL(productSql, "productcenter");
          // 判断是存在笔架，如果存在需要抛出异常，终止程序
          if (productDatas.length !== 0) {
            // 抛出异常会自动终止程序，无需再跳出循环
            throw new Error("该门店已存在笔架, 【工作内容】不能选择“门店开发”和“笔架推荐+门店开发”。");
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });