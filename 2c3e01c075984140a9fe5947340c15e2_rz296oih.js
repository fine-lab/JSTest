let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    //声明返回信息
    var retData = {
      //是否成功的标识
      success: true,
      //错误信息
      message: "",
      errorList: [],
      data: []
    };
    let env = ObjectStore.env();
    let ytenant = env.tenantId;
    //根据查询条件，获取需要更新的物料信息
    let allProductCode = context.allProductCode || [];
    let inSqlCondition = "('" + allProductCode.join("','") + "')";
    let productQuerySql = "select id,model,code  from pc.product.Product  where code in " + inSqlCondition + "";
    var productRes = ObjectStore.queryByYonQL(productQuerySql, "productcenter");
    if (!productRes || productRes.length == 0) {
      retData.success = false;
      retData.message = "根据编码获取系统物料失败，请校验物料编码是否正确！";
    }
    // 将结果数据进行code映射，构建map
    let productMap = {};
    productRes.map((item) => {
      productMap[item.code] = item;
    });
    //遍历查询结果，对数据进行更新
    let requestData = context.data;
    let dataForUpdate = [];
    requestData.map((item) => {
      let product = productMap[item.suppItemCode];
      if (product) {
        item.itemCode = product.model;
        item.product = product.id;
        item.pushFlagS = true;
        item.ytenant = ytenant;
        dataForUpdate.push(item);
      } else {
        retData.errorList.push({
          product_code: item.suppItemCode,
          reason: "系统未录入此编码的物料信息"
        });
      }
    });
    //调用实体操作，对实体进行更新
    if (dataForUpdate && dataForUpdate.length > 0) {
      var res = ObjectStore.insertBatch("AT173E4CEE16E80007.AT173E4CEE16E80007.demandStock", dataForUpdate);
      retData.data = res || [];
    } else {
      retData.success = false;
    }
    //根据执行结果，构建返回值
    return retData;
  }
}
exports({ entryPoint: MyTrigger });