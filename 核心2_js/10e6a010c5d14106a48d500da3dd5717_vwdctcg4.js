let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request.pageSize === undefined) {
      throw new Error("pageSize必须传入");
    }
    if (request.pageIndex === undefined) {
      throw new Error("pageIndex必须传入");
    }
    if (request.pageSize > 100) {
      request.pageSize = 100;
    }
    //重要：此接口权限需要从应用构建-前置销售订单下，授权销售出库单列表查询接口
    let func = extrequire("GT4691AT1.publicfun.getSystemToken");
    let res = func.execute("", "");
    let simpleVOs = request.simpleVOs;
    let authFunc = extrequire("GT4691AT1.zotieszmu8.getZMWHAuth");
    let authResult = authFunc.execute(request);
    request.warehouse = authResult;
    request.simpleVOs = simpleVOs;
    let urlFunc = extrequire("GT4691AT1.publicfun.getdomainurl");
    let urlRes = urlFunc.execute("", "");
    let gatewayurl = urlRes.domainurl.gatewayUrl;
    var saleorderurl = gatewayurl + "/yonbip/scm/salesout/list?access_token=" + res.access_token;
    var strResponse = postman("post", saleorderurl, null, JSON.stringify(request));
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      //组织表体销售订单明细行ID,传入YSQL取价格
      var sourcedetailidStr = "";
      for (var i = responseObj.data.recordList.length - 1; i >= 0; i--) {
        var detail = responseObj.data.recordList[i];
        var detailsId = detail.details_firstsourceautoid;
        if (i == 0) {
          sourcedetailidStr += detailsId;
        } else {
          sourcedetailidStr += detailsId + ",";
        }
      }
      var soDetailSql = "select  oriTaxUnitPrice,taxRate,invPriceExchRate,id from voucher.order.OrderDetail  where id in (" + sourcedetailidStr + ")";
      var starttime = new Date();
      var soDetailResult = ObjectStore.queryByYonQL(soDetailSql, "udinghuo");
      var endtime = new Date();
      //处理字段转换，long主键替换成字符串
      var recordList = [];
      var colArry =
        "formula_userDefine_1769082031335538689#cus_modifydate,id#id,details_id#details_id,details_firstsourceautoid#firstsourceautoid,headItem!define8#account_date,headItem!define1#pre_code,st_salesoutlist_userDefine005#sale_code,st_salesoutlist_userDefine001#delivery_code,code#code,vouchdate#vouchdate,createTime#createTime,headItem!define6#bu,headItem!define10#area,formula_userDefine_1758668823012573186#ap,department_name#department_name,operator#operator,operator_name#operator_name,headItem!define12#cust_class,formula_userDefine_1779447050151133189#cust,cust_name#cust_name,headItem!define15#receive_address,headItem!define13#receive_person,headItem!define14#receive_mobile,headItem!define2#legal_entity,warehouse_name#warehouse_name,details_productn_productClass_name#product_class_name,details_productn_manageClass_name#manage_class_name,product_cCode#product_code,product_cName#product_name,priceUOM_name#price_unit,unitName#unit,batchno#batchno,producedate#producedate,formula_userDefine_1758625684359479297#invaliddate,qty#qty";
      var idArray = "cust,details_firstsourceautoid,operator";
      var colName = colArry.split(",");
      for (var i = responseObj.data.recordList.length - 1; i >= 0; i--) {
        var oldRec = responseObj.data.recordList[i];
        var newRec = {};
        for (var j = 0; j < colName.length; j++) {
          var colInfo = colName[j].split("#");
          var sourceFieldName = colInfo[0];
          var retureFieldName = colInfo.length == 2 ? colInfo[1] : colInfo[0];
          var returnColName = colName[j];
          if (idArray.indexOf(sourceFieldName + ",") >= 0) {
            newRec[retureFieldName] = oldRec[sourceFieldName] + "";
          } else {
            newRec[retureFieldName] = oldRec[sourceFieldName];
          }
        }
        //通过销售订单明细行ID,查找价格，计算金额，赋值到recordlist
        var detailsFirstSourceAutoId = oldRec.details_firstsourceautoid;
        var detailsQty = oldRec.qty;
        for (var k = soDetailResult.length - 1; k >= 0; k--) {
          var soPriceObj = soDetailResult[k];
          var soPriceId = soPriceObj.id;
          if (detailsFirstSourceAutoId == soPriceId) {
            //无税=含税/税率计算，系统无法直接取数
            //取计价转换率，如出库单号CK20230627000040
            var invPriceExchRate = soPriceObj.invPriceExchRate;
            if (invPriceExchRate === undefined || invPriceExchRate == 0 || invPriceExchRate == "") {
              invPriceExchRate = 1;
            }
            var taxRate = soPriceObj.taxRate;
            var taxUnitPrice = new Big(soPriceObj.oriTaxUnitPrice) / new Big(invPriceExchRate);
            var taxUnitPriceFloat = Math.round(taxUnitPrice * 100) / 100;
            var natSum = taxUnitPrice * detailsQty;
            var natMoney = Math.round((natSum / (100.0 + taxRate)) * 10000) / 100;
            var unitPirce = Math.round((natMoney / detailsQty) * 100) / 100;
            var natMoneyFloat = Math.round(natMoney * 100) / 100;
            var natSumFloat = Math.round(natSum * 100) / 100;
            newRec.price_exch_rate = invPriceExchRate;
            newRec.tax_rate = taxRate;
            newRec.unit_price = unitPirce;
            newRec.tax_unit_price = taxUnitPriceFloat;
            newRec.total_money = natMoneyFloat;
            newRec.total_tax_money = natSumFloat;
            break; //跳出循环
          }
        }
        recordList.push(newRec);
      }
      return {
        pageIndex: responseObj.data.pageIndex + "",
        pageSize: responseObj.data.pageSize + "",
        pageCount: responseObj.data.pageCount + "",
        beginPageIndex: responseObj.data.beginPageIndex + "",
        endPageIndex: responseObj.data.endPageIndex + "",
        recordCount: responseObj.data.recordCount + "",
        recordList: recordList,
        message: recordList.length === 0 ? "当前条件下没有数据" : responseObj.message
      };
    } else {
      throw new Error(responseObj.message);
    }
  }
}
exports({ entryPoint: MyAPIHandler });