let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let emptySql = "select id,detail.id,detail.itemCode itemCode,detail.cabinetNodeCode cabinetNodeCode,errorMessage from GT37595AT2.GT37595AT2.shippingschedule ";
    emptySql += " inner join GT37595AT2.GT37595AT2.shippingscheduleb detail on detail.shippingschedule_id = id ";
    emptySql += " where dataStatus = '1' and detail.item_code is null";
    let emptyRes = ObjectStore.queryByYonQL(emptySql);
    if (!emptyRes || emptyRes.length == 0) {
      return { notCount: 0, successCount: 0 };
    }
    // 拼接查询条件，查询对应物料编码
    let itemCodes = []; // 非整机柜用型号查询
    let cabinetNodeCodes = []; // 整机柜用简称查询
    emptyRes.forEach((item) => {
      if (item.cabinetNodeCode) {
        cabinetNodeCodes.push(item.cabinetNodeCode);
      } else if (item.itemCode) {
        itemCodes.push(item.itemCode);
      }
    });
    let productMap = {};
    let cabinetMap = {};
    if (cabinetNodeCodes.length > 0) {
      let cabinetSql =
        "select manageClass.code,manageClass.name,detail.shortName,detail.purchasePriceUnit.code,detail.purchaseUnit.code,unit.code,* from pc.product.Product where detail.stopstatus = 'false' and detail.shortName in ('" +
        cabinetNodeCodes.join("','") +
        "')";
      let cabinetRes = ObjectStore.queryByYonQL(cabinetSql, "productcenter");
      if (cabinetRes && cabinetRes.length > 0) {
        cabinetRes.forEach((item) => {
          cabinetMap[item.detail_shortName] = { id: item.id, name: item.name };
        });
      }
    }
    if (itemCodes.length > 0) {
      let itemSql =
        "select manageClass.code,manageClass.name,detail.shortName,detail.purchasePriceUnit.code,detail.purchaseUnit.code,unit.code,* from pc.product.Product where detail.stopstatus = 'false' and model in ('" +
        itemCodes.join("','") +
        "')";
      let itemRes = ObjectStore.queryByYonQL(itemSql, "productcenter");
      if (itemRes && itemRes.length > 0) {
        itemRes.forEach((item) => {
          productMap[item.model] = { id: item.id, name: item.name };
        });
      }
    }
    let updateObjs = [];
    let reg = /未找到物料信息，请检查！\n*/g;
    let reg2 = /第 \d+[,0-9]* 行明细未找到物料信息！\n*/g;
    let errMap = new Map(); // 提示语
    let allErrMap = new Map();
    let updateMap = new Map(); // 组装数据
    emptyRes.forEach((item) => {
      allErrMap.set(item.id, item.errorMessage);
      let uItem = {};
      if (item.cabinetNodeCode) {
        if (cabinetMap[item.cabinetNodeCode]) {
          uItem.id = item.detail_id;
          uItem.item_code = cabinetMap[item.cabinetNodeCode].id;
          uItem.item_name = cabinetMap[item.cabinetNodeCode].name;
          uItem._status = "Update";
          updateObjs.push(uItem);
          if (!updateMap.has(item.id)) {
            updateMap.set(item.id, [uItem]);
          } else {
            let uArr = updateMap.get(item.id);
            uArr.push(uItem);
            updateMap.set(item.id, uArr);
          }
        }
      } else {
        if (productMap[item.itemCode]) {
          uItem.id = item.detail_id;
          uItem.item_code = productMap[item.itemCode].id;
          uItem.item_name = productMap[item.itemCode].name;
          uItem._status = "Update";
          updateObjs.push(uItem);
          if (!updateMap.has(item.id)) {
            updateMap.set(item.id, [uItem]);
          } else {
            let uArr = updateMap.get(item.id);
            uArr.push(uItem);
            updateMap.set(item.id, uArr);
          }
        }
      }
      if (!uItem.item_code) {
        // 未找到物料
        errMap.set(item.id, 1);
      }
    });
    if (updateObjs.length == 0) {
      return { notCount: emptyRes.length, successCount: 0 };
    }
    let storeObj = [];
    updateMap.forEach((value, key) => {
      let obj = {};
      obj.id = key;
      if (errMap.has(key)) {
        obj["errorMessage"] = allErrMap.get(key).replace(reg2, "") + "未找到物料信息，请检查！\n";
      } else {
        obj["errorMessage"] = allErrMap.get(key).replace(reg2, "").replace(reg, "");
      }
      obj.shippingschedulebList = value;
      storeObj.push(obj);
    });
    var res = ObjectStore.updateById("GT37595AT2.GT37595AT2.shippingschedule", storeObj, "02a3de71");
    return { notCount: emptyRes.length - updateObjs.length, successCount: updateObjs.length };
  }
}
exports({ entryPoint: MyAPIHandler });