let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let type = request.type;
    let emptySql = "";
    if (type == "out") {
      emptySql += "select id,resItemCode,errorMsg from  AT181E613C1770000A.AT181E613C1770000A.ReservoirOut where itemCode is null";
    } else {
      emptySql += "select id,virtualItemCode,errorMsg from    AT181E613C1770000A.AT181E613C1770000A.ReservoirIn where resItemCode is null  ";
    }
    let emptyRes = ObjectStore.queryByYonQL(emptySql);
    if (!emptyRes || emptyRes.length == 0) {
      return { notCount: 0, successCount: 0 };
    }
    // 拼接查询条件，查询对应物料编码
    let itemCodes = [];
    if (type == "out") {
      emptyRes.forEach((item) => {
        itemCodes.push(item.resItemCode);
      });
    } else {
      emptyRes.forEach((item) => {
        if (item.virtualItemCode) {
          itemCodes.push(item.virtualItemCode);
        }
      });
    }
    let materialFunc = extrequire("AT181E613C1770000A.backFun.changeMaterial");
    let materialRes = materialFunc.execute(null, { itemCodes: itemCodes });
    let productMsg = {};
    if (materialRes && materialRes.productMsg) {
      productMsg = materialRes.productMsg;
    }
    let updateObjs = [];
    let reg = /未找到物料信息，请检查！\n*/g;
    emptyRes.forEach((item) => {
      if (type == "out") {
        if (productMsg[item.resItemCode]) {
          if (item.errorMsg) {
            item.errorMsg = item.errorMsg.replace(reg, "");
          }
          item.itemCode = productMsg[item.resItemCode].id;
          item.itemName = productMsg[item.resItemCode].name;
          item.itemDesc = productMsg[item.resItemCode].modelDescription;
          updateObjs.push(item);
        }
      } else {
        if (productMsg[item.virtualItemCode]) {
          if (item.errorMsg) {
            item.errorMsg = item.errorMsg.replace(reg, "");
          }
          item.resItemCode = productMsg[item.virtualItemCode].id;
          item.itemName = productMsg[item.virtualItemCode].name;
          item.itemDesc = productMsg[item.virtualItemCode].modelDescription;
          updateObjs.push(item);
        }
      }
    });
    if (updateObjs.length == 0) {
      return { notCount: emptyRes.length, successCount: 0 };
    }
    var res = "";
    if (type == "out") {
      res = ObjectStore.updateById("AT181E613C1770000A.AT181E613C1770000A.ReservoirOut", emptyRes, "yb97e9b3a5");
    } else {
      res = ObjectStore.updateById("AT181E613C1770000A.AT181E613C1770000A.ReservoirIn", emptyRes, "yba160dbe1");
    }
    return { notCount: emptyRes.length - updateObjs.length, successCount: updateObjs.length };
  }
}
exports({ entryPoint: MyAPIHandler });