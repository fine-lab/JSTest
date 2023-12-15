let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var returnList = getInterface(param, context);
    function getInterface(param, context) {
      var Data = {};
      const id = param.param;
      let func1 = extrequire("PU.rule.GetToken");
      let res = func1.execute(require);
      let token = res.access_token;
      let headers = { "Content-Type": "application/json;charset=UTF-8" };
      // 采购订单详情查询接口
      let apiResponse1 = postman("get", "https://www.example.com/" + token + "&id=" + id, JSON.stringify(headers), null);
      let api1 = JSON.parse(apiResponse1);
      if (api1.code == "200") {
        var org = api1.data.org;
        // 获取质量状态自定义项字段
        var InvonTpye = api1.data.headItem.define1;
        if (InvonTpye == "合格") {
          InvonTpye = "FX";
        } else if (InvonTpye == "待检") {
          InvonTpye = "DJ";
        } else if (InvonTpye == "放行") {
          InvonTpye = "FX";
        } else if (InvonTpye == "冻结") {
          InvonTpye = "FREEZE";
        } else if (InvonTpye == "禁用") {
          InvonTpye = "DISABLE";
        } else if (InvonTpye == "不合格") {
          InvonTpye = "UN_HG";
        }
        // 供应商id
        var vendor = api1.data.vendor;
        var vendor_name = api1.data.vendor_name;
        let vendorSql = "select code from aa.vendor.Vendor where id = '" + vendor + "'";
        let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
        var vendorCode = vendorRes[0].code;
        // 单据日期
        var vouchdate = api1.data.vouchdate;
        let headeres = { "Content-Type": "application/json;charset=UTF-8" };
        // 组织单元详情查询接口
        let apiResponseOrg = postman("get", "https://www.example.com/" + token + "&id=" + org, JSON.stringify(headeres), null);
        let apiOrg = JSON.parse(apiResponseOrg);
        if (apiOrg.code == "200") {
          var OrgCode = apiOrg.data.code;
          var code = api1.data.code;
          // 采购订单子表数组
          var warehouseList = api1.data.purchaseOrders;
          var SunData = {};
          var orderLines = new Array();
          var productData = {};
          if (warehouseList.length > 0) {
            for (let j = 0; j < warehouseList.length; j++) {
              var warehouse = warehouseList[j].warehouse;
              if (warehouse != undefined || warehouse != null) {
                let Sql = "select code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
                let warehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
                // 仓库编码
                var warehouseCode = warehouseRes[0].code;
                var product_cCode = warehouseList[j].product_cCode;
                var product_cName = warehouseList[j].product_cName;
                var qty = warehouseList[j].qty;
                // 单位
                let unit = warehouseList[j].unit;
                let UOMSql = "select name from pc.unit.Unit where id = '" + unit + "'";
                let UOMRes = ObjectStore.queryByYonQL(UOMSql, "productcenter");
                let purUOM_Name = UOMRes[0].name;
                var materialClassCode = warehouseList[j].materialClassCode;
                var materialClassName = warehouseList[j].materialClassName;
                var SunId = warehouseList[j].id;
                var number = Math.sign(qty);
                if (number == -1) {
                  productData = {
                    itemCode: product_cCode,
                    itemName: product_cName,
                    itemType: materialClassCode,
                    itemTypeName: materialClassName
                  };
                  SunData = {
                    orderLineNo: SunId,
                    planQty: qty,
                    unit: purUOM_Name,
                    inventoryType: InvonTpye,
                    itemInfo: productData
                  };
                  orderLines.push(SunData);
                } else {
                  productData = {
                    itemCode: product_cCode,
                    itemName: product_cName,
                    itemType: materialClassCode,
                    itemTypeName: materialClassName
                  };
                  SunData = {
                    orderLineNo: SunId,
                    planQty: qty,
                    unit: purUOM_Name,
                    inventoryType: InvonTpye,
                    itemInfo: productData
                  };
                  orderLines.push(SunData);
                }
              }
            }
          }
        }
        // 组装返回数据
        Data = {
          outBizOrderCode: code,
          createTime: vouchdate,
          warehouseCode: warehouseCode,
          ownerCode: OrgCode,
          supplierCode: vendorCode,
          supplierName: vendor_name
        };
      }
      return { OrderList: orderLines, mainData: Data };
    }
    return { returnList: returnList };
  }
}
exports({ entryPoint: MyTrigger });