let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var ownerValue = "FSUID_0334CF28165A2D78A6B9297DDCD0D6BF"; //陈庆禄
    var fxxkWarehouse_id = "youridHere"; //纷享销客仓库，只此一个
    let newdata = param.data[0];
    if (newdata.srcBillType == "1") {
      //来源类型为销售发货单
      var idnumber = newdata.id; //销售出库单主键
      var codeValue = newdata.code; //销售出库单编码
      //查询销售发货单的来源单据号(纷享销客销售订单id)
      var querySalesOut = "select * from  st.salesout.SalesOut where id='" + idnumber + "'";
      var salesOutRes = ObjectStore.queryByYonQL(querySalesOut, "ustock");
      if (salesOutRes.length == 0) {
        throw new Error("数据状态不是最新的，请刷新后重试！");
      }
      var srcBillNO = salesOutRes[0].srcBillNO; //销售发货单单号
      var newvouchdate = salesOutRes[0].vouchdate.substr(0, 10);
      newvouchdate = newvouchdate.replace(/-/g, "/");
      var timeTamp = new Date(newvouchdate).getTime();
      //查询销售发货单的来源单据号(纷享销客销售订单id)
      var queryOrderId = "select orderId,id,payMoney from  voucher.delivery.DeliveryVoucher where code='" + srcBillNO + "'";
      var orderRes = ObjectStore.queryByYonQL(queryOrderId, "udinghuo");
      if (orderRes.length == 0) {
        throw new Error("依据来发货单号【" + srcBillNO + "】未查询到对应的销售订单！");
      }
      var orderId = orderRes[0].orderId; //销售发货单来源单据号
      //查询销售订单表头自定义项define1(纷享销客销售订单id)
      var queryFxxKid = "select define1 from  voucher.order.OrderFreeDefine where id='" + orderId + "'";
      var fxxKidRes = ObjectStore.queryByYonQL(queryFxxKid, "udinghuo");
      if (fxxKidRes.length == 1 && fxxKidRes[0].define1 != null) {
        //发货单来源销售订单且销售订单来源纷享销客，纷享销客销售订单id不为空
        var sales_order_id = fxxKidRes[0].define1; //纷享销客销售订单id
        //依据销售发货单子表数据组装 发货单产品对象
        var DeliveryNoteProductObj = new Array();
        var querybodySql = "select * from voucher.delivery.DeliveryDetail where deliveryId='" + orderRes[0].id + "'";
        var bodyRes = ObjectStore.queryByYonQL(querybodySql, "udinghuo");
        for (var i = 0; i < bodyRes.length; i++) {
          let bodydata = bodyRes[i];
          let sourceautoid = bodydata.sourceautoid; //销售订单子表id
          //查询销售订单子表自定义项1(纷享销客销售订单子表id)
          let queryPruSql = "select define1 from voucher.order.OrderDetailFreeDefine where id='" + sourceautoid + "'";
          let pruRes = ObjectStore.queryByYonQL(queryPruSql, "udinghuo");
          if (pruRes.length == 1 && pruRes[0].define1 != null) {
            //销售订单子表【外部产品主键】不为空
            let sales_order_product_id = pruRes[0].define1;
            let unit = "";
            if (bodydata.qtyName.indexOf("个") > -1) {
              unit = "1";
            } else if (bodydata.qtyName.indexOf("块") > -1) {
              unit = "2";
            } else if (bodydata.qtyName.indexOf("只") > -1) {
              unit = "3";
            } else if (bodydata.qtyName.indexOf("把") > -1) {
              unit = "4";
            } else if (bodydata.qtyName.indexOf("枚") > -1) {
              unit = "5";
            } else if (bodydata.qtyName.indexOf("条") > -1) {
              unit = "6";
            } else if (bodydata.qtyName.indexOf("瓶") > -1) {
              unit = "7";
            } else if (bodydata.qtyName.indexOf("盒") > -1) {
              unit = "8";
            } else if (bodydata.qtyName.indexOf("套") > -1) {
              unit = "9";
            } else if (bodydata.qtyName.indexOf("箱") > -1) {
              unit = "10";
            } else if (bodydata.qtyName.indexOf("米") > -1) {
              unit = "11";
            } else if (bodydata.qtyName.indexOf("千克") > -1) {
              unit = "12";
            } else if (bodydata.qtyName.indexOf("吨") > -1) {
              unit = "13";
            } else if (bodydata.qtyName.indexOf("台") > -1) {
              unit = "TAI";
            } else if (bodydata.qtyName.indexOf("包") > -1) {
              unit = "bao";
            } else if (bodydata.qtyName.indexOf("桶") > -1) {
              unit = "tong";
            } else if (bodydata.qtyName.indexOf("次") > -1) {
              unit = "ci";
            } else if (bodydata.qtyName.indexOf("元") > -1) {
              unit = "yuan";
            } else if (bodydata.qtyName.indexOf("卷") > -1) {
              unit = "juan";
            } else if (bodydata.qtyName.indexOf("袋") > -1) {
              unit = "D";
            } else if (bodydata.qtyName.indexOf("托") > -1) {
              unit = "TUO";
            } else if (bodydata.qtyName.indexOf("罐装") > -1) {
              unit = "Guan";
            } else {
              unit = bodydata.qtyCode;
            }
            //查询物料对应的纷享销客产品id
            let queryProSql = "select erpCode from pc.product.Product where id='" + bodydata.productId + "'";
            let proRes = ObjectStore.queryByYonQL(queryProSql, "productcenter");
            //查询发货单子表id对应的出库单子表id
            let querySalesOutsql = "select id from st.salesout.SalesOuts where mainid='" + idnumber + "' and sourceautoid='" + bodydata.id + "'";
            let salesOutsRes = ObjectStore.queryByYonQL(querySalesOutsql, "ustock");
            if (salesOutsRes.length == 0) {
              throw new Error("推送纷享销客失败：销售发货明细数据未找到对应的销售出库");
            }
            let newbodydata = {
              sales_order_product_id: sales_order_product_id, //订单产品编号
              delivery_note_id: salesOutRes[0].code, //发货单编号
              remark: bodydata.remark, //备注
              delivery_num: bodydata.qty, //本次发货数
              sales_order_id: sales_order_id, //销售订单编号
              product_id: proRes[0].erpCode, //产品名称
              delivery_money: bodydata.oriSum, //本次发货金额
              unit: unit, //单位
              owner: [ownerValue], //负责人
              life_status: "normal", //生命状态 正常
              name: bodydata.productName, //发货单产品id
              sales_price: bodydata.oriTaxUnitPrice, //销售单价
              delivery_warehouse_id: fxxkWarehouse_id, //发货仓库
              field_BfcC0__c: salesOutsRes[0].id, //来源单据子表id
              field_pQGs1__c: orderId, //订单id
              field_v3yZX__c: sourceautoid //订单明细id
            };
            DeliveryNoteProductObj.push(newbodydata);
          } else {
            throw new Error("推送纷享销客发货单失败：未查询到行号【" + pruRes.lineno + "】对应的销售订单子表【外部产品主键】，请检查！");
          }
        }
        let func1 = extrequire("GZTBDM.fxxk.getToken");
        let res = func1.execute(null);
        var fxxkToken = res.fxxkToken;
        var corpId = res.corpId; //企业id
        var header = { "Content-Type": "application/json;charset=UTF-8" };
        var queryAccount = "select erpCode from aa.merchant.Merchant where id='" + salesOutRes[0].cust + "'";
        var accountRes = ObjectStore.queryByYonQL(queryAccount, "productcenter");
        //查询销售订单的业务员、部门
        var queryOrderSql = "select corpContact,saleDepartmentId from voucher.order.Order where id='" + orderId + "'";
        var orderRes = ObjectStore.queryByYonQL(queryOrderSql, "udinghuo");
        if (accountRes.length == 1 && accountRes[0].erpCode != null) {
          //新增发货单
          var addDeliveryNoteObjBody = {
            corpAccessToken: fxxkToken,
            corpId: corpId,
            currentOpenUserId: ownerValue,
            data: {
              object_data: {
                field_2e31B__c: orderRes[0].corpContact, //业务员
                field_CsEq2__c: orderRes[0].saleDepartmentId, //销售部门
                field_v1GK0__c: codeValue, //来源单据号
                field_A6i2i__c: idnumber, //来源单据主键
                remark: salesOutRes[0].memo, //备注
                ship_to_add: salesOutRes[0].cReceiveAddress, //收货地址
                sales_order_id: sales_order_id, //销售订单编号
                owner: [ownerValue], //负责人
                life_status: "normal", //生命状态 正常
                total_delivery_money: orderRes[0].payMoney, //发货总金额
                consignee_phone_number: salesOutRes[0].cReceiveMobile, //收货人电话
                delivery_date: timeTamp, //发货日期
                account_id: accountRes[0].erpCode, //客户名称
                name: salesOutRes[0].code, //发货单编号
                delivery_warehouse_id: fxxkWarehouse_id, //发货仓库
                dataObjectApiName: "DeliveryNoteObj"
              },
              details: {
                DeliveryNoteProductObj: DeliveryNoteProductObj
              }
            }
          };
          var url = "https://www.example.com/";
          var aaddDeliveryNoteObjResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(addDeliveryNoteObjBody));
          var aaddDeliveryNoteObjRes = JSON.parse(aaddDeliveryNoteObjResponse);
          if (aaddDeliveryNoteObjRes.errorCode != "0") {
            throw new Error("推送纷享销客失败：" + aaddDeliveryNoteObjRes.errorMessage);
          }
        } else {
          throw new Error("推送纷享销客发货单失败：未查询到客户对应【外部编码】，请检查！");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });