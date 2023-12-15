let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var priceList = request.priceList;
    var sid = request.sid;
    // 查询销售日报主表数据
    var sql = "select * from GT5646AT1.GT5646AT1.sales_Report where id ='" + sid + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    var org_id = result[0].org_id;
    // 查询销售日报子表数据
    var sonSql = "select * from GT5646AT1.GT5646AT1.sales_ReportDetails where sales_Report_id = '" + sid + "'";
    var resultSon = ObjectStore.queryByYonQL(sonSql, "developplatform");
    let productSql = "select * from pc.product.Product where code = 'ZM0101010008'";
    let resprod = ObjectStore.queryByYonQL(productSql, "productcenter");
    // 物料鸭胚的id
    var code = resprod[0].id;
    // 物料鸭胚的sku
    var codeSku = resprod[0].defaultSKUId;
    var Dlist = new Array();
    var List = new Array();
    var resultList = new Array();
    let ContentType = "application/json;charset=UTF-8";
    let header = { "Content-Type": ContentType };
    let uuidStr = uuid();
    let uuids = replace(uuidStr, "-", "");
    let resultJson = result[0];
    // 获取仓库的主键
    var wareHouseId = resultJson.warehouse;
    // 获取主表仓库的主键
    var wareHouseSql = "select * from aa.warehouse.Warehouse where id = '" + wareHouseId + "'";
    var wareHouseResult = ObjectStore.queryByYonQL(wareHouseSql, "productcenter");
    let wareHouseObj = wareHouseResult[0];
    // 获取仓库的编码--->对应生成销售出库的客户编码
    let wareCode = wareHouseObj.code;
    // 客户表
    let custSql = "select * from aa.agent.Agent where code = '" + wareCode + "'";
    let custRes = ObjectStore.queryByYonQL(custSql, "udinghuo");
    // 客户交易关系
    let AgentRelation = "select * from aa.agent.AgentRelation where agentId ='" + custRes[0].id + "' and orgId = '" + org_id + "'";
    let AgentRelationRes = ObjectStore.queryByYonQL(AgentRelation, "udinghuo");
    if (AgentRelationRes.length != 0) {
      // 税率id
      var taxRateId = AgentRelationRes[0].taxRateId;
      if (taxRateId == "" || taxRateId == null) {
        throw new Error(JSON.stringify("该客户没有销向税率请添加！"));
      } else {
        var taxSql = "select * from bd.taxrate.TaxRateVO where id = '" + taxRateId + "'";
        var taxRes = ObjectStore.queryByYonQL(taxSql, "ucfbasedoc");
        // 销项税率名称
        var taxName = taxRes[0].ntaxRate;
        var map = {};
        let details = {};
        var list = {};
        var item = {};
        var deatil = {};
        var sum = 0;
        var s = 0;
        for (var i = 0; i < resultSon.length; i++) {
          var qty = resultSon[i].qty;
          let productNo = resultSon[i].product;
          // 查询菜品成本卡数据  根据获取到的每一条物料Id去查询菜品成本卡主表
          var cardSql = "select id from GT5646AT1.GT5646AT1.menuMaintenance where menuNo = '" + productNo + "'";
          var resultCard = ObjectStore.queryByYonQL(cardSql, "developplatform");
          if (resultCard.length == 0) {
            // 在菜品成本卡中没有查到
            continue;
          } else {
            // 获取菜品成本卡的主表的id
            let productId = resultCard[0].id;
            // 根据主表id去查转换卡子表
            var selectCardSonSql = "select * from GT5646AT1.GT5646AT1.menuListMaintenance where menuMaintenance_id = '" + productId + "'";
            var resultCardSon = ObjectStore.queryByYonQL(selectCardSonSql, "developplatform");
            // 遍历菜品成本卡子表数据
            for (let x = 0; x < resultCardSon.length; x++) {
              let cardJSON = resultCardSon[x];
              // 获取成本卡子表的物料sku
              let productSku = resultCardSon[x].productSku;
              // 获取成本卡子表的物料的id
              let materialScienceNo = resultCardSon[x].materialScienceNo;
              let ProductSunData = "select isBatchManage,fMarkPrice from pc.product.ProductDetail where productId = '" + materialScienceNo + "'";
              let ProductSunDataRes = ObjectStore.queryByYonQL(ProductSunData, "productcenter");
              // 获取是否有批次管理
              let BatchManage = ProductSunDataRes[0].isBatchManage;
              if (BatchManage == true) {
                // 查询批次档案
                let batchData = "select batchno,producedate,invaliddate from st.batchno.Batchno where product = '" + materialScienceNo + "' and productsku = '" + productSku + "' order by pubts desc";
                let batchRes = ObjectStore.queryByYonQL(batchData, "yonbip-scm-scmbd");
                //批次号
                var batchno = batchRes[0].batchno;
                // 获取成本卡子表物料的数量
                let number = cardJSON.number;
                let numberS = number * qty;
                list = {
                  productID: materialScienceNo, // 物料id
                  number: numberS, // 数量
                  taxId: taxRateId, // 税率id
                  oriSum: resultSon[i].oriSum, // 含税金额
                  stockUnit: resultSon[i].stockUnit, // 计价单位
                  taxRate: taxName // 税率名称
                };
                resultList.push(list);
              } else {
                let cardJSON = resultCardSon[x];
                // 获取成本卡子表的物料sku
                let productSku = resultCardSon[x].productSku;
                // 获取成本卡子表的物料的id
                let materialScienceNo1 = resultCardSon[x].materialScienceNo;
                // 获取成本卡子表物料的数量
                let number = cardJSON.number;
                let numberS = number * qty;
                list = {
                  productID: materialScienceNo1,
                  number: numberS,
                  taxId: taxRateId,
                  oriSum: resultSon[i].oriSum,
                  stockUnit: resultSon[i].stockUnit,
                  taxRate: taxName
                };
                resultList.push(list);
              }
            }
            if (resultList.length != 0) {
              let size = resultList.length;
              for (let t = 0; t < size - 1; t++) {
                for (let m = 0; m < size - 1 - t; m++) {
                  if (resultList[m].productID < resultList[m + 1].productID) {
                    let temp = resultList[m].productID;
                    resultList[m].productID = resultList[m + 1].productID;
                    resultList[m + 1].productID = temp;
                    let aount = resultList[m].number;
                    resultList[m].number = resultList[m + 1].number;
                    resultList[m + 1].number = aount;
                  }
                }
              }
              var p = 0;
              let produID = resultList[0].productID;
              for (var q = 0; q < resultList.length; q++) {
                var ProductID = resultList[q].productID;
                var count = resultList[q].number;
                if (produID == ProductID) {
                  s = s + count;
                  item = {
                    proid: produID,
                    sit: s
                  };
                  List.push(item);
                } else {
                  deatil = {
                    id: resultList[q - 1].productID,
                    numb: s,
                    taxId: resultList[q - 1].taxId,
                    oriSum: resultList[q - 1].oriSum,
                    stockUnit: resultList[q - 1].stockUnit,
                    taxRate: resultList[q - 1].taxRate
                  };
                  Dlist.push(deatil);
                  produID = resultList[q].productID;
                  s = count;
                  item = {
                    proid: produID,
                    sit: s
                  };
                  List.push(item);
                }
              }
              var totl = resultList.length - 1;
              deatil = {
                id: resultList[totl].productID,
                numb: s,
                taxId: resultList[totl].taxId,
                oriSum: resultList[totl].oriSum,
                stockUnit: resultList[totl].stockUnit,
                taxRate: resultList[totl].taxRate
              };
              Dlist.push(deatil);
            }
          }
        }
      }
    }
    return { res: Dlist };
  }
}
exports({ entryPoint: MyAPIHandler });