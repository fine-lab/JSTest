let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = JSON.parse(decodeURI(request.excelData));
    let orgCondition = "";
    let agentCondition = "";
    let suplierCondition = "";
    let businessCondition = "";
    let itemCondition = "";
    let unitCondition = "";
    for (var i = 0; i < data.length; i++) {
      // 必填项校验
      if (!data[i]["*组织"] || data[i]["*组织"].length <= 0) {
        throw new Error("上传失败！原因:第" + (i + 1) + "行【组织】未填！");
      }
      if (!data[i]["*订单号码"] || data[i]["*订单号码"].length <= 0) {
        throw new Error("上传失败！原因:第" + (i + 1) + "行【订单号码】未填！");
      }
      if (!data[i]["*供应商名称"] || data[i]["*供应商名称"].length <= 0) {
        throw new Error("上传失败！原因:第" + (i + 1) + "行【供应商名称】未填！");
      }
      if (!data[i]["*物料"] || data[i]["*物料"].length <= 0) {
        throw new Error("上传失败！原因:第" + (i + 1) + "行【物料】未填！");
      }
      if (!data[i]["*需求数量"] || data[i]["*需求数量"].length <= 0) {
        throw new Error("上传失败！原因:第" + (i + 1) + "行【需求数量】未填！");
      }
      if (!data[i]["*单位"] || data[i]["*单位"].length <= 0) {
        throw new Error("上传失败！原因:第" + (i + 1) + "行【单位】未填！");
      }
      if (orgCondition.indexOf("'" + data[i]["*组织"] + "',") == -1) {
        orgCondition += "'" + data[i]["*组织"] + "',";
      }
      if (suplierCondition.indexOf("'" + data[i]["*供应商名称"] + "',") == -1) {
        suplierCondition += "'" + data[i]["*供应商名称"] + "',";
      }
      if (itemCondition.indexOf("'" + data[i]["*物料"] + "',") == -1) {
        itemCondition += "'" + data[i]["*物料"] + "',";
      }
      if (unitCondition.indexOf("'" + data[i]["*单位"] + "',") == -1) {
        unitCondition += "'" + data[i]["*单位"] + "',";
      }
      if (data[i]["客户名称"] && data[i]["客户名称"].length > 0 && agentCondition.indexOf("'" + data[i]["客户名称"] + "',") == -1) {
        agentCondition += "'" + data[i]["客户名称"] + "',";
      }
      if (data[i]["交易类型"] && data[i]["交易类型"].length > 0 && businessCondition.indexOf("'" + data[i]["交易类型"] + "',") == -1) {
        businessCondition += "'" + data[i]["交易类型"] + "',";
      }
    }
    orgCondition = orgCondition.substring(0, orgCondition.length - 1);
    suplierCondition = suplierCondition.substring(0, suplierCondition.length - 1);
    itemCondition = itemCondition.substring(0, itemCondition.length - 1);
    unitCondition = unitCondition.substring(0, unitCondition.length - 1);
    agentCondition = agentCondition.substring(0, agentCondition.length - 1);
    businessCondition = businessCondition.substring(0, businessCondition.length - 1);
    let orgSql = "select id,code,name from org.func.BaseOrg where name in (" + orgCondition + ")";
    let orgRes = ObjectStore.queryByYonQL(orgSql, "orgcenter");
    let orgMap = new Map();
    for (var k = 0; k < orgRes.length; k++) {
      let item = orgRes[k];
      orgMap.set(item.name, item.id);
    }
    let agentSql = "select id,code,name from aa.merchant.Merchant where name in (" + agentCondition + ")";
    let agentRes = ObjectStore.queryByYonQL(agentSql, "productcenter");
    let agentMap = new Map();
    for (var k = 0; k < agentRes.length; k++) {
      let item = agentRes[k];
      agentMap.set(item.name, item.id);
    }
    let suplierSql = "select id,code,name from aa.vendor.Vendor where name in (" + suplierCondition + ")";
    let suplierRes = ObjectStore.queryByYonQL(suplierSql, "yssupplier");
    let suplierMap = new Map();
    for (var k = 0; k < suplierRes.length; k++) {
      let item = suplierRes[k];
      suplierMap.set(item.name, item.id);
    }
    let businessSql = "select id,code,name from bd.bill.TransType where name in (" + businessCondition + ")";
    let businessRes = ObjectStore.queryByYonQL(businessSql, "transtype");
    let businessMap = new Map();
    for (var k = 0; k < businessRes.length; k++) {
      let item = businessRes[k];
      businessMap.set(item.name, item.id);
    }
    let itemSql = "select id,code,name from pc.product.Product where name in (" + itemCondition + ")";
    let itemRes = ObjectStore.queryByYonQL(itemSql, "productcenter");
    let itemMap = new Map();
    for (var k = 0; k < itemRes.length; k++) {
      let item = itemRes[k];
      itemMap.set(item.name, item.id);
    }
    let unitSql = "select id,code,name from pc.unit.Unit where name in (" + unitCondition + ")";
    let unitRes = ObjectStore.queryByYonQL(unitSql, "productcenter");
    let unitMap = new Map();
    for (var k = 0; k < unitRes.length; k++) {
      let item = unitRes[k];
      unitMap.set(item.name, item.id);
    }
    let poNumberMap = new Map();
    // 组装对象
    let insertParent = [];
    let insertParentItem = {};
    let insertChild = [];
    var reg = new RegExp("^[0-9]+$");
    var regDate = new RegExp("^[0-9]+[.][0-9]+$");
    for (var j = 0; j < data.length; j++) {
      if (!orgMap.has(data[j]["*组织"])) {
        throw new Error("上传失败！原因:第" + (j + 1) + "行【组织】在系统中未找到，请检查！");
      }
      if (!agentMap.has(data[j]["客户名称"])) {
        throw new Error("上传失败！原因:第" + (j + 1) + "行【客户名称】在系统中未找到，请检查！");
      }
      if (!suplierMap.has(data[j]["*供应商名称"])) {
        throw new Error("上传失败！原因:第" + (j + 1) + "行【供应商名称】在系统中未找到，请检查！");
      }
      if (!businessMap.has(data[j]["交易类型"])) {
        throw new Error("上传失败！原因:第" + (j + 1) + "行【交易类型】在系统中未找到，请检查！");
      }
      if (!itemMap.has(data[j]["*物料"])) {
        throw new Error("上传失败！原因:第" + (j + 1) + "行【物料】在系统中未找到，请检查！");
      }
      if (!unitMap.has(data[j]["*单位"])) {
        throw new Error("上传失败！原因:第" + (j + 1) + "行【单位】在系统中未找到，请检查！");
      }
      if (!poNumberMap.has(data[j]["*订单号码"])) {
        insertParentItem = {};
        insertChild = [];
        insertParentItem["po_number"] = data[j]["*订单号码"];
        insertParentItem["code"] = data[j]["*订单号码"];
        insertParentItem["org_id"] = orgMap.get(data[j]["*组织"]);
        insertParentItem["agentId"] = agentMap.get(data[j]["客户名称"]);
        insertParentItem["bill_to_address"] = data[j]["收货地址"];
        insertParentItem["vendorId"] = suplierMap.get(data[j]["*供应商名称"]);
        insertParentItem["vendor"] = data[j]["*供应商名称"];
        if (reg.test(data[j]["需求时间"])) {
          let datePar = new Date((parseInt(data[j]["需求时间"]) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
          insertParentItem["request_date"] = datePar.getFullYear() + "-" + prefixInteger(datePar.getMonth() + 1, 2) + "-" + prefixInteger(datePar.getDate(), 2);
        } else {
          insertParentItem["request_date"] = data[j]["需求时间"];
        }
        if (regDate.test(data[j]["单据日期"])) {
          let datePar = new Date((parseInt(data[j]["单据日期"]) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
          insertParentItem["creation_date"] =
            datePar.getFullYear() +
            "-" +
            prefixInteger(datePar.getMonth() + 1, 2) +
            "-" +
            prefixInteger(datePar.getDate(), 2) +
            " " +
            prefixInteger(datePar.getHours(), 2) +
            ":" +
            prefixInteger(datePar.getMinutes(), 2) +
            ":" +
            prefixInteger(datePar.getSeconds(), 2);
        } else {
          insertParentItem["creation_date"] = data[j]["单据日期"];
        }
        if (reg.test(data[j]["发布时间"])) {
          let datePar = new Date((parseInt(data[j]["发布时间"]) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
          insertParentItem["publish_time"] = datePar.getFullYear() + "-" + prefixInteger(datePar.getMonth() + 1, 2) + "-" + prefixInteger(datePar.getDate(), 2);
        } else {
          insertParentItem["publish_time"] = data[j]["发布时间"];
        }
        insertParentItem["signer"] = data[j]["签收人"];
        insertParentItem["order_remark"] = data[j]["订单备注"];
        insertParentItem["bustype"] = businessMap.get(data[j]["交易类型"]);
        insertParentItem["submit_status"] = "2"; // 默认未提交
      }
      let insertChildItem = {};
      insertChildItem["item_code"] = itemMap.get(data[j]["*物料"]);
      insertChildItem["item_name"] = data[j]["*物料"];
      insertChildItem["quantitiy"] = data[j]["*需求数量"];
      insertChildItem["item_type"] = data[j]["形态"];
      insertChildItem["unit"] = unitMap.get(data[j]["*单位"]);
      insertChildItem["batch"] = data[j]["PO行"];
      if (poNumberMap.has(data[j]["*订单号码"]) && poNumberMap.get(data[j]["*订单号码"])["shippingschedulebList"]) {
        insertParentItem = poNumberMap.get(data[j]["*订单号码"]);
        insertParentItem["shippingschedulebList"].push(insertChildItem);
      } else {
        insertChild.push(insertChildItem);
        insertParentItem["shippingschedulebList"] = insertChild;
      }
      poNumberMap.set(data[j]["*订单号码"], insertParentItem);
    }
    for (let [key, value] of poNumberMap) {
      insertParent.push(poNumberMap.get(key));
    }
    let insertRes = ObjectStore.insert("GT37595AT2.GT37595AT2.shippingschedule", insertParent, "02a3de71");
    // 更新po_code，这个字段当时用于销售订单推单要货计划用的，现在不推单了，这个字段其实没用了，但是太多地方用了，就直接再次更新了。以后有性能问题，可以先改这里
    let updateArr = [];
    let updateRes;
    if (insertRes) {
      if (!insertRes.length) {
        let updateItem = {};
        updateItem["id"] = insertRes.id;
        updateItem["po_code"] = insertRes.code;
        updateItem["po_number"] = insertRes.code;
        updateArr.push(updateItem);
      } else {
        for (var q = 0; q < insertRes.length; q++) {
          let updateItem = {};
          updateItem["id"] = insertRes[q].id;
          updateItem["po_code"] = insertRes[q].code;
          updateItem["po_number"] = insertRes[q].code;
          updateArr.push(updateItem);
        }
      }
      updateRes = ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", updateArr, "02a3de71");
    }
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });