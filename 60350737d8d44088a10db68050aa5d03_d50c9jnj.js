let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestAction = param.requestAction;
    if (requestAction != "import") {
      return {};
    }
    let data = param.data;
    for (let i = 0; i < data.length; i++) {
      let details = data[i].demandForecastDetailList;
      if (!details || details.length == 0) {
        throw new Error("请输入需求预测明细数据！");
      } else if (details.length > 1) {
        // 供应类型的数据，有且只有一条
        throw new Error("同一条需求预测只能有一条供应类型的明细！");
      }
      for (let j = 0; j < details.length; j++) {
        let detail = details[j];
        if (detail.dataType != "3") {
          // 导入的数据只能导入供应的数据
          throw new Error("需求预测明细数据的数据类型只能是供应类型");
        }
      }
      // 数据状态改为供应商回复
      data[i].set("dataStatus", "3");
      param.requestData.set("dataStatus", "3");
      // 根据SL物料编码回填SD物料
      let itemCodes = [data[i].itemCode];
      let productFunc = extrequire("AT173E4CEE16E80007.xqycxr.getProuductInfo");
      let productInfoMap = productFunc.execute(
        {},
        {
          itemCodes: itemCodes
        }
      );
      let product = productInfoMap[data[i].itemCode];
      if (product) {
        data[i].set("suppItemCode", product.code);
        data[i].set("suppItemDesc", product.name);
        data[i].set("sServiceType", product.manageClassDesc);
        param.requestData.set("suppItemCode", product.code);
        param.requestData.set("suppItemDesc", product.name);
        param.requestData.set("sServiceType", product.manageClassDesc);
      }
      let searchSql = "select id from AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast ";
      searchSql += " where lineId = '" + data[i].lineId + "' and issueDate = '" + data[i].issueDate + "'";
      let searchRes = ObjectStore.queryByYonQL(searchSql);
      if (searchRes.length == 0) {
        return {};
      }
      let detailSql = "select dd.id id ";
      detailSql += " from AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast ";
      detailSql += " inner join AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecastDetail dd on dd.demandForecast_id = id ";
      detailSql += " where id = '" + searchRes[0].id + "' and dd.dataType = '3'";
      let detailRes = ObjectStore.queryByYonQL(detailSql);
      if (detailRes.length > 0) {
        ObjectStore.deleteBatch("AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecastDetail", detailRes);
      }
      if (searchRes.length > 0) {
        // 已存在，更新
        data[i].set("_status", "Update");
        data[i].set("id", searchRes[0].id);
        param.requestData.set("_status", "Update");
        param.requestData.set("id", searchRes[0].id);
        param.set("importMode", 1);
        param.set("id", searchRes[0].id);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });