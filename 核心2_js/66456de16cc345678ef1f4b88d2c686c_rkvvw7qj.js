let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    //已经传到EBS的单据
    if (pdata.defines && pdata.defines.define12 == "true") {
      return { code: 200 };
    }
    let sql1 = "select code, name from bd.bill.TransType where id =" + pdata.bustype;
    var res1 = ObjectStore.queryByYonQL(sql1, "ucf-org-center");
    pdata.bustype_name = res1[0].name;
    pdata.bustype_code = res1[0].code;
    //非贸易公司的不走该方法
    if (pdata.bustype_name.indexOf("贸易公司") == -1) {
      return { code: 200 };
    }
    //通过YonSql查询子表信息
    var purInRecords = pdata.purInRecords;
    //退货的走退货接口
    var base_path = "https://www.example.com/";
    if (pdata.bustype_name.indexOf("退库") > -1) {
      base_path = "https://www.example.com/";
      //校验退货数量
      let s = "select * from pu.purchaseorder.PurchaseOrders where mainid=" + pdata.srcBill;
      var os = ObjectStore.queryByYonQL(s, "upu");
      for (var i of os) {
        for (var ii of purInRecords) {
          if (i.product == ii.product) {
            let inT = i.totalInQty || 0;
            let outT = i.totalReturnInQty || 0;
            if (inT - outT < Math.abs(ii.qty)) {
              let ss = "select name from pc.product.Product where id=" + ii.product;
              var rr = ObjectStore.queryByYonQL(ss, "productcenter");
              throw new Error("物料" + rr[0].name + "退货数量超出库存");
            }
            break;
          }
        }
      }
    }
    //查询业务单元等于发货单主表库存组织的外部编码
    let sql3 = "select define1 from org.func.BaseOrgDefine where id=" + pdata.org;
    var res3 = ObjectStore.queryByYonQL(sql3, "ucf-org-center");
    pdata.stockorgcode = res3[0].define1;
    let sql4 = "select cert_no from bd.staff.Staff where id=" + pdata.operator;
    var res4 = ObjectStore.queryByYonQL(sql4, "ucf-org-center");
    pdata.idCard = res4[0].cert_no;
    //根据仓库id查询仓库编码
    let sql5 = "select code from aa.warehouse.Warehouse where id = " + pdata.warehouse;
    var res5 = ObjectStore.queryByYonQL(sql5, "productcenter");
    pdata.warehouse = res5[0].code;
    //查询供应商
    let sql6 = "select code from aa.vendor.Vendor where id = " + pdata["vendor"];
    var res6 = ObjectStore.queryByYonQL(sql6, "productcenter");
    pdata["vendor"] = res6[0].code;
    //查询采购工厂编码查询EBS_6级架构CODE
    let sql7 = "select define4 from org.func.BaseOrgDefine where id = " + pdata.defines.define10;
    var res7 = ObjectStore.queryByYonQL(sql7, "ucf-org-center");
    pdata.purOrg = res7[0].define4;
    var pparam = [];
    var total = 0;
    for (var p of purInRecords) {
      total += Math.abs(p.qty);
    }
    for (var item of purInRecords) {
      //通过YonSql查询子表信息
      let sql9 = "select code from bd.taxrate.TaxRateVO where ntaxRate = " + item.taxRate;
      var res9 = ObjectStore.queryByYonQL(sql9, "ucf-org-center");
      let freight = ((pdata.defines.define4 * Math.abs(item.qty)) / total).toFixed(2);
      pparam.push({
        code: pdata.code,
        vendor: pdata["vendor"], //'1058727'
        stockorgcode: pdata.stockorgcode,
        idCard: pdata.idCard,
        warehouse: pdata.warehouse,
        product_cCode: item.product_cCode,
        invExchRate: item.invExchRate,
        qty: Math.abs(item.qty),
        oriTaxUnitPrice: item.oriTaxUnitPrice,
        oriUnitPrice: item.oriUnitPrice,
        rowno: item.rowno,
        transport: 1,
        freight: freight,
        time: pdata.defines.define2,
        receiptTime: pdata.vouchdate,
        batch: item.defines.define2,
        taxRate: res9[0].code,
        transType: pdata.bustype_code,
        purOrg: pdata.purOrg,
        blueCode: pdata.defines.define11 || ""
      });
    }
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      resdata: pparam
    };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    var token = func.execute("").access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
    //加判断
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code != "200") {
      throw new Error("保存至EBS失败!" + obj.message);
    } else {
      if (obj.data.message.indexOf("成功") != -1) {
        //调用二开中的采购入库单更新接口
        var token2 = func.execute("").access_token;
        let base_path2 = "https://www.example.com/";
        let body2 = {
          id: pdata.id,
          "defines!define12": "true"
        };
        let apiResponse2 = postman("post", base_path2.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(body2));
        var obj2 = JSON.parse(apiResponse2);
        if (obj2.code != "200") {
          throw new Error("更新失败!" + obj2.message);
        } else {
          if (obj2.data.message.indexOf("成功") != -1) {
            return { code: 200 };
          } else {
            throw new Error("更新失败!" + obj2.data.message);
          }
        }
      } else {
        throw new Error("保存至EBS失败!" + obj.data.message);
      }
    }
    return { code: 200 };
  }
}
exports({ entryPoint: MyTrigger });