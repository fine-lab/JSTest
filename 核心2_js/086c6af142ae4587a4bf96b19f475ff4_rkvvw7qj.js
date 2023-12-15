let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    //首先进行验证是否是ebs调用的接口,若是，然后确定是删除还是保存
    var isfromEbs = pdata.isfromEbs;
    if (!isfromEbs) {
      //如果从ebs调用的则执行以下方法
      var isDelete = pdata.isDelete; //定义一个是否要执行删除命令的字段给ebs传值（true，false或不传）
      if (!isDelete) {
        //如果是要调用保存接口，则执行以下方法
        var details = pdata.details; //获取表体行信息list
        let sql1 = "select id from org.func.BaseOrgDefine where define1 = " + pdata.org1;
        let res1 = ObjectStore.queryByYonQL(sql1, "ucf-org-center");
        pdata.set("org", res1[0].id + "");
        pdata.org = res1[0].id;
        //在aa.merchant.Merchant表中根据code比对获取id
        let sql10 = "select id from aa.merchant.Merchant where code = 11575";
        let res10 = ObjectStore.queryByYonQL(sql10, "productcenter");
        pdata.set("cust", res10[0].id);
        pdata.set("invoiceCust", res10[0].id); //这里等会改掉
        let sql2 = "select name from org.func.BaseOrg where id = 2179468900096256";
        let res2 = ObjectStore.queryByYonQL(sql2, "ucf-org-center");
        pdata.set("org_name", res2[0].name + "");
        //对表体行的信息查询、赋值
        for (var i = details.length - 1; i >= 0; i--) {
          //在voucher.delivery.DeliveryDetail中根据id等于srcBillRow), 比对获取skuId、productId、sourceautoid。skuCode等于product_cCode           ----OK
          let sql3_1 = "select skuId, sourceautoid, productId from voucher.delivery.DeliveryDetail where id = 2332297328350721";
          let res3_1 = ObjectStore.queryByYonQL(sql3_1, "udinghuo");
          details[i].set("productsku", res3_1[0].skuId);
          details[i].set("product", res3_1[0].productId);
          details[i].set("sourceautoid", res3_1[0].sourceautoid);
          details[i].set("productsku_cCode", details[i].product_cCode + "");
          //从物料档案 c.product.Product  根据物料编码product_cCode(对应code)查询是否启用辅计量单位enableAssistUnit（true/false）
          //若为false则值等于1，若为true，则从物料档案获取productAssistUnitExchanges[0].mainUnitCount                             ----OK
          let sql3 = "select enableAssistUnit from pc.product.Product where code = " + "'" + details[i].product_cCode + "'";
          let res3 = ObjectStore.queryByYonQL(sql3, "productcenter");
          if (res3[0].enableAssistUnit) {
            //在pc.product.ProductAssistUnitExchange中通过detailis[i].product等于productId比对获取mainUnitCount、unitExchangeType ----OK
            let sql3_01 = "select mainUnitCount, unitExchangeType from pc.product.ProductAssistUnitExchange where productId = 2332137763526656";
            let res3_01 = ObjectStore.queryByYonQL(sql3_01, "productcenter");
            details[i].set("invExchRate", res3_01[0].mainUnitCount);
            details[i].set("unitExchangeType", res3_01[0].unitExchangeType);
          } else {
            details[i].set("invExchRate", 1);
          }
          //顺便查个DeliveryPrice，给循环外查currency和natCurrency使用                                  ----OK
          let sql3_2 = "select id from voucher.delivery.DeliveryVoucher where code = TI6256210706000003";
          var res3_2 = ObjectStore.queryByYonQL(sql3_2, "udinghuo");
          details[i].set("sourceid", res3_2[0].id);
          //把表体行里需要写死的值在这里赋值
          details[i].set("source", "1");
          details[i].set("sourceautoid", 2332297328350721); //这样就可以了
          details[i].set("isBatchManage", "false");
          details[i].set("makeRuleCode", "deliveryTostoreout");
          details[i].set("autoCalcCost", "false");
          details[i].set("taxUnitPriceTag", "true");
        }
        let sql5 = "select currency, natCurrency from voucher.delivery.DeliveryPrice where deliveryId = " + res3_2[0].id;
        let res5 = ObjectStore.queryByYonQL(sql5, "udinghuo");
        pdata.set("currency", res5[0].currency + "");
        pdata.set("natCurrency", res5[0].natCurrency + "");
        let sql7 = "select id from aa.warehouse.Warehouse where code=" + "'" + pdata.Warehouse + "'";
        let res7 = ObjectStore.queryByYonQL(sql7, "productcenter");
        pdata.set("Warehouse", res7[0].id);
        pdata.set("define10", pdata.code);
        //固定字段赋值
        pdata.set("bustype_name", "销售出库");
        pdata.set("bustype_extend_attrs_json", "销售出库");
        pdata.set("bustype", "销售出库");
        pdata.set("stockDirection", "0");
        pdata.set("status", 0); //这里需要确认一下“保存”是不是对应0？
        pdata.set("srcBillType", "1");
        pdata.set("retailInvestors", "false");
        pdata.set("bizFlow", "b885b998-b919-11eb-8c0b-98039b073634");
        pdata.set("sourcesys", "udinghuo");
        return {};
      } else {
        //如果isdelete为true则执行删除方法
        //新建一个数组用于搭配OpenApi要求的内部是个数组的格式并存储数据
        let ddataList = [];
        let ddata = {};
        //根据传来的ebs出库单编码（define10）查st.salesout.SalesOut表中的id
        let sql7 = "select id from st.salesout.SalesOut where define10='" + pdata.code + "'";
        let res7 = ObjectStore.queryByYonQL(sql7, "ustock");
        ddata["id"] = res7[0].id;
        ddataList[0] = ddata;
        //调用OpenApi的删除接口执行删除方法
        var resdata = JSON.stringify(ddataList);
        let base_path = "https://www.example.com/";
        var hmd_contenttype = "application/json;charset=UTF-8";
        let header = {
          "Content-Type": hmd_contenttype
        };
        var body = {
          data: resdata
        };
        //拿到access_token
        let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
        let res = func.execute("");
        var token2 = res.access_token;
        let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(body));
        //加判断
        var obj = JSON.parse(apiResponse);
        var code = obj.code;
        if (code != "200") {
          throw new Error("订单同步CRM失败!" + obj.message);
        } else {
        }
        //调用删除成功，抛出异常以阻断后续函数执行
        throw new Error("出库单删除成功");
      }
    }
    //如果不是ebs调用的则什么都不干
    return {};
  }
}
exports({ entryPoint: MyTrigger });