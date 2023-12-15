let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = ObjectStore.env().url;
    let item = request;
    //校验参数
    if (item.org == null) {
      throw new Error("库存组织不能为空");
    }
    if (item.vouchdate == null) {
      throw new Error("库存组织为" + item.org + "的单据日期不能为空");
    }
    if (item.businesstype == null) {
      throw new Error("库存组织为" + item.org + "的交易类型不能为空");
    }
    if (item.inWarehouse == null) {
      throw new Error("库存组织为" + item.org + "的入库仓库不能为空");
    }
    if (item.outWarehouse == null) {
      throw new Error("库存组织为" + item.org + "的出库仓库不能为空");
    }
    if (item._status == null) {
      throw new Error("库存组织为" + item.org + "的操作标识不能为空");
    }
    let details = item.details;
    if (details.length == 0) {
      throw new Error("库存组织为" + item.org + "的转库单子表不能为空");
    }
    details.forEach((detail, j) => {
      if (detail["product"] == null) {
        throw new Error("库存组织为" + item.org + "子表的物料id或code不能为空");
      }
      if (detail.qty == null) {
        throw new Error("库存组织为" + item.org + ",子表的物料id或code为" + detail["product"] + "的数量不能为空");
      }
      if (detail.unit == null) {
        throw new Error("库存组织为" + item.org + ",子表的物料id或code为" + detail["product"] + "的单位id或编码不能为空");
      }
      if (detail.invExchRate == null) {
        throw new Error("库存组织为" + item.org + ",子表的物料id或code为" + detail["product"] + "的件数不能为空");
      }
      if (detail.subQty == null) {
        throw new Error("库存组织为" + item.org + ",子表的物料id或code为" + detail["product"] + "的数量不能为空");
      }
      if (detail.stockUnitId == null) {
        throw new Error("库存组织为" + item.org + ",子表的物料id或code为" + detail["product"] + "的库存单位id或编码不能为空");
      }
      if (detail._status == null) {
        throw new Error("库存组织为" + item.org + ",子表的物料id或code为" + detail["product"] + "的操作标识不能为空");
      }
    });
    //转库保存
    let saveUrl = url + "/iuap-api-gateway/yonbip/scm/storetransfer/save";
    let apiResponse = openLinker("POST", saveUrl, "AT1707A99A16B00005", JSON.stringify({ data: item }));
    //转库审核
    apiResponse = JSON.parse(apiResponse);
    if (apiResponse.code == "200" && apiResponse.data.failCount != 0) {
      return { message: apiResponse.data };
    } else if (apiResponse.code != "200") {
      return { message: "网关原因保存失败" };
    }
    let aduitIds = [];
    let res = apiResponse.data.infos;
    res.map((item, i) => {
      aduitIds.push({ id: item.id });
    });
    if (aduitIds.length == 0) {
      return { message: "没有要审核的转库单" };
    }
    let params = aduitIds;
    let aduitUrl = url + "/iuap-api-gateway/yonbip/scm/storetransfer/batchaudit";
    apiResponse = openLinker("POST", aduitUrl, "AT1707A99A16B00005", JSON.stringify({ data: params }));
    apiResponse = JSON.parse(apiResponse);
    if (apiResponse.code == "200" && apiResponse.data.failCount != 0) {
      res = res.map((obj, i) => {
        let objCopy = {};
        for (var e in obj) {
          let add = false;
          if (
            e != "shop" &&
            e != "creatorId" &&
            e != "outWarehouse__transferValue" &&
            e != "pubts" &&
            e != "createDate" &&
            e != "tenant" &&
            e != "fromApi_ustock" &&
            e != "outWarehouse_iSerialManage" &&
            e != "creator" &&
            e != "isWfControlled" &&
            e != "barcodeRecord" &&
            e != "accountOrg" &&
            e != "yTenantId" &&
            e != "barCode" &&
            e != "wStore" &&
            e != "createTime" &&
            e != "ownertype" &&
            e != "businesstype__transferValue" &&
            e != "org__transferValue" &&
            e != "inventoryowner" &&
            e != "status"
          ) {
            let details = obj.details;
            objCopy[e] = obj[e];
            objCopy.details = details.map((detail, j) => {
              let detailsCopy = {};
              for (var a in detail) {
                if (
                  a != "product__transferValue" &&
                  a != "outStockStatusDoc" &&
                  a != "businessAttribute" &&
                  a != "unitPrecision" &&
                  a != "yTenantId" &&
                  a != "isExpiryDateManage_new" &&
                  a != "productsku_cCode" &&
                  a != "lineno" &&
                  a != "ownertype" &&
                  a != "stockUnitId__transferValue" &&
                  a != "inventoryowner"
                ) {
                  detailsCopy[a] = detail[a];
                }
              }
              detailsCopy._status = "Update";
              let sun = detailsCopy.storeTransDetailSNs;
              if (sun != null && sun.length > 0) {
                sun.map((child, k) => {
                  child._status = "Update";
                  return child;
                });
              }
              return detailsCopy;
            });
          }
        }
        objCopy.memo = apiResponse.data.messages.join();
        objCopy._status = "Update";
        return objCopy;
      });
      let res1 = openLinker("POST", saveUrl, "AT1707A99A16B00005", JSON.stringify({ data: res[0] }));
      res1 = JSON.parse(res1);
      if (res1.code == "200" && res1.data.failCount != 0) {
        return { message: res1.data.messages };
      } else if (res1.code != "200") {
        return { message: "网关原因保存失败" };
      }
      return { message: "审核失败,原因是:" + apiResponse.data.messages };
    } else if (apiResponse.code != "200") {
      return { message: "网关原因审核失败" };
    }
    return { data: "保存审核成功" };
  }
}
exports({ entryPoint: MyAPIHandler });