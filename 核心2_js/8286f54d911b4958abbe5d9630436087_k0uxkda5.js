let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let realModelData = param.data;
    let request = JSON.parse(param.requestData);
    //已审核转库单单据号
    let auditstatuscodeList = new Array();
    //其他状态转库单单据号
    let otherstatuscodeList = new Array();
    //需生成转库单的变更单
    let needGenerTransfer2SaleChangeList = new Array();
    for (let j = 0; j < realModelData.length; j++) {
      //转库单查询
      let apiResponseRes = getTransferList(realModelData[j].code);
      if (apiResponseRes.code == "200") {
        let recordList = apiResponseRes.data.recordList;
        if (recordList.length > 0) {
          for (var k = 0; k < recordList.length; k++) {
            let status = recordList[k].status;
            if ("1" == status) {
              auditstatuscodeList.push(recordList[k].code);
            } else {
              otherstatuscodeList.push(recordList[k].code);
            }
          }
        } else {
          //需要生成转库单的变更单
          needGenerTransfer2SaleChangeList.push(realModelData[j]);
        }
      }
    }
    //检查转库单
    checkzjd(auditstatuscodeList, otherstatuscodeList);
    if (needGenerTransfer2SaleChangeList.length > 0) {
      let billcode_saleorgid_saleorgnameMap = new Map(); //单据号_销售组织ID###销售组织名称集合
      let biicode_stock_productmap = new Map(); //单据号_仓库ID_物料名称List集合
      let stockOrgmap = new Map(); //仓库_库存组织主键对应关系
      let stockidandnamemap = new Map(); //仓库ID_名称集合
      let productidandnamemap = new Map(); //物料ID_名称集合
      let code_mainidmap = new Map(); //变更单单据号_销售订单主键主键集合
      let code_detailsmap = new Map(); //单据号_生成转库单明细集合
      let code_contentsmap = new Map(); //单据号_发送用户消息内容集合
      let code_definesInfomap = new Map();
      for (let i = 0; i < needGenerTransfer2SaleChangeList.length; i++) {
        let detailsmap = new Map(); //明细集合
        let contentsmap = new Map(); //消息内容集合
        let definesInfomap = new Map();
        let changeModelData = needGenerTransfer2SaleChangeList[i]; //订单主表
        code_mainidmap.set(changeModelData.code, changeModelData.originalOrderId);
        billcode_saleorgid_saleorgnameMap.set(changeModelData.code, changeModelData.salesOrgId + "###" + getsaleorgname(changeModelData));
        if (changeModelData.salesOrgId == "1556733659914960925" || changeModelData.salesOrgId == "1556733659914960919") {
          let orderDetails = queryDetails(changeModelData.id);
          for (var m = 0; m < orderDetails.length; m++) {
            if (orderDetails[m].stockId == undefined || orderDetails[m].stockId == "") {
              continue;
            } else {
              stockidandnamemap.set(orderDetails[m].stockId, orderDetails[m].stockName);
              productidandnamemap.set(orderDetails[m].productId, orderDetails[m].productName);
              let safeStores = querySafeStore(orderDetails[m].stockId, orderDetails[m].productId, changeModelData.salesOrgId); //查询安全库存
              if (safeStores.length > 0) {
                generdetaiscontentdefinsmap(safeStores, orderDetails[m], detailsmap, contentsmap, definesInfomap);
              } else {
                getSaleorgstockproductmap(biicode_stock_productmap, changeModelData, orderDetails[m]);
              }
              stockOrgmap.set(orderDetails[m].stockId, orderDetails[m].stockOrgId);
            }
          }
          code_detailsmap.set(changeModelData.code, detailsmap);
          code_contentsmap.set(changeModelData.code, contentsmap);
          code_definesInfomap.set(changeModelData.code, definesInfomap);
        }
      }
      if (biicode_stock_productmap.size != 0) {
        //单据号_仓库ID_物料IDList集合
        let content = "";
        for (let key of biicode_stock_productmap.keys()) {
          let stock_product = billcode_saleorgid_saleorgnameMap.get(key);
          let resstock_product = stock_product.split("###");
          let salesorgid = resstock_product[0]; //销售组织主键
          let salesorgname = resstock_product[1]; //销售组织名称
          let setcontent = "【销售组织】：" + salesorgname + "\r\n";
          let stockpromap = biicode_stock_productmap.get(key);
          let content1 = "";
          for (let key2 of stockpromap.keys()) {
            var products = join(stockpromap.get(key2), ",");
            content1 = content1 + "    【仓库】：" + stockidandnamemap.get(key2) + "\r\n        【物料】：[" + products + "]";
          }
          content = setcontent + content1;
        }
        throw new Error(content + "\r\n没有维护安全库存");
      }
      if (code_detailsmap.size > 0) {
        for (let codekey of code_detailsmap.keys()) {
          let detailsmap = code_detailsmap.get(codekey);
          let definesInfomap = code_definesInfomap.get(codekey);
          let contentsmap = code_contentsmap.get(codekey);
          let stock_product = billcode_saleorgid_saleorgnameMap.get(codekey);
          let resstock_product = stock_product.split("###");
          let salesorgid = resstock_product[0]; //销售组织主键
          let salesorgname = resstock_product[1]; //销售组织名称
          for (let key of detailsmap.keys()) {
            let bigStockIdAndPhonemap = getBigStockAndPhonemap(stockOrgmap.get(key));
            if (bigStockIdAndPhonemap.size == 0 || "" == bigStockIdAndPhonemap.get("bigStockId")) {
              throw new Error("【仓库】：" + stockidandnamemap.get(key) + "无对应的供应商仓库");
            }
            let jsonresult = savezkd(stockOrgmap.get(key), bigStockIdAndPhonemap.get("bigStockId"), key, detailsmap.get(key), salesorgid, salesorgname, codekey);
            let zkdata = jsonresult.data;
            if (jsonresult.code == "200") {
              //销售订单反写
              let updateSaleResponse = rebackwriteSale(zkdata, definesInfomap, key, code_mainidmap, codekey);
              if (updateSaleResponse.code == "200") {
                let phone = bigStockIdAndPhonemap.hasOwnProperty("phone");
                //当手机号存在的情况下发送预警消息
                if (phone != null && phone != "") {
                  sendwarnforuser(phone, stockidandnamemap.get(key), zkdata.infos, contentsmap.get(key));
                }
              } else {
                throw new Error(updateSaleResponse.message);
              }
            } else {
              throw new Error(jsonresult.message);
            }
          }
        }
      }
    }
    function savezkd(orgid, bigStockId, key, details, saleorgid, saleorgname, billcode) {
      let urls = "https://www.example.com/";
      let param = extrequire("SCMSA.backDesignerFunction.dateNow");
      let dateNow = param.execute();
      let date = dateNow.date;
      let bodys = {
        data: {
          org: orgid,
          vouchdate: date,
          businesstype: "A11001",
          outWarehouse: bigStockId,
          inWarehouse: key,
          _status: "Insert",
          details: details,
          defines: {
            define2: saleorgid,
            define2_name: saleorgname,
            define1: billcode,
            _status: "Insert"
          }
        }
      };
      let apiResponses = openLinker("POST", urls, "SCMSA", JSON.stringify(bodys));
      let jsonresult = JSON.parse(apiResponses);
      return jsonresult;
    }
    //销售订单反写
    function rebackwriteSale(zkdata, definesInfomap, key, code_mainidmap, codekey) {
      let updateSaleurl = "https://www.example.com/";
      let infos = zkdata.infos;
      let failCount = parseInt(zkdata.failCount);
      let definesInfo = definesInfomap.get(key);
      //销售订单反写
      for (var i = 0; i < definesInfo.length; i++) {
        definesInfo[i].define1 = infos[0].code;
      }
      let updateSaleBody = {
        billnum: "voucher_order",
        datas: [
          {
            id: code_mainidmap.get(codekey),
            code: codekey,
            definesInfo: definesInfo
          }
        ]
      };
      let updateSaleResponse = openLinker("POST", updateSaleurl, "SCMSA", JSON.stringify(updateSaleBody));
      updateSaleResponse = JSON.parse(updateSaleResponse);
      return updateSaleResponse;
    }
    //发送预警
    function sendwarnforuser(phone, stockName, infos, contents) {
      //根据手机号查询用户
      let urlPhone = "https://www.example.com/";
      let bodyPhone = {
        index: "1",
        size: "10",
        searchcode: phone
      };
      let apiResponsePhone = openLinker("POST", urlPhone, "SCMSA", JSON.stringify(bodyPhone));
      var apiResponsePho = JSON.parse(apiResponsePhone);
      //用户不为空的情况下发送预警
      if (apiResponsePho.data.content.length != 0) {
        let userId = apiResponsePho.data.content[0].userId;
        let yhtUserIds = new Array();
        yhtUserIds.push(userId);
        let urlYu = "https://www.example.com/";
        let bodyYu = {
          yhtUserIds: yhtUserIds,
          title: "仓库" + stockName + "需要补货" + "转库单:" + infos[0].code,
          content: contents.toString(),
          srcMsgId: uuid() //幂等校验
        };
        let apiResponseYu = openLinker("POST", urlYu, "SCMSA", JSON.stringify(bodyYu));
      } else {
        throw new Error("该手机号下没有用户");
      }
    }
    function generdetaiscontentdefinsmap(res3, orderDetails, detailsmap, contentsmap, definesInfomap) {
      let availableqty = queryAvailableqty(orderDetails);
      //下限库存
      let xiaxiananquankucun = res3[0].xiaxiananquankucun;
      //上限库存
      let shangxiananquankucun = res3[0].shangxiananquankucun;
      //判断是否需要调货
      if (orderDetails.subQty > availableqty - xiaxiananquankucun) {
        //需要转库的数量
        let qty = orderDetails.subQty + shangxiananquankucun - availableqty;
        let detail = {
          product: orderDetails.productId,
          productsku: orderDetails.skuId,
          qty: qty,
          unit: orderDetails.masterUnitId,
          invExchRate: "1",
          subQty: qty,
          stockUnitId: orderDetails.masterUnitId,
          _status: "Insert"
        };
        let defines = {
          isHead: false,
          isFree: true,
          detailIds: orderDetails.id
        };
        let content = "商品" + orderDetails.productName + "需转库数量：" + qty;
        let stockId = orderDetails.stockId;
        if (detailsmap.hasOwnProperty(stockId)) {
          detailsmap.get(stockId).push(detail);
          contentsmap.get(stockId).push(content);
          definesInfomap.get(stockId).push(defines);
        } else {
          mapsetvalue(stockId, detail, detailsmap);
          mapsetvalue(stockId, content, contentsmap);
          mapsetvalue(stockId, defines, definesInfomap);
        }
      }
    }
    function mapsetvalue(stockId, value, tempmap) {
      let temp = new Array();
      temp.push(value);
      tempmap.set(stockId, temp);
    }
    function getSaleorgstockproductmap(saleorgstockproductmap, changeModelData, orderDetails) {
      if (saleorgstockproductmap.hasOwnProperty(changeModelData.code)) {
        if (saleorgstockproductmap.get(changeModelData.code).hasOwnProperty(orderDetails.stockId)) {
          saleorgstockproductmap.get(changeModelData.code).get(orderDetails.stockId).push(orderDetails.productName);
        } else {
          let codeList = new Array();
          codeList.push(orderDetails.productName);
          saleorgstockproductmap.get(changeModelData.code).set(orderDetails.stockId, codeList);
        }
      } else {
        let stockproductmap = new Map();
        let codeList = new Array();
        codeList.push(orderDetails.productName);
        stockproductmap.set(orderDetails.stockId, codeList);
        saleorgstockproductmap.set(changeModelData.code, stockproductmap);
      }
    }
    //查询安全库存
    function querySafeStore(stockId, productId, salesOrgId) {
      let sql = "select * from 	AT16560C6C08780007.AT16560C6C08780007.aqkcbd where cangku = '" + stockId + "' and wuliao = " + productId + " and org = " + salesOrgId;
      var res3 = ObjectStore.queryByYonQL(sql, "developplatform");
      return res3;
    }
    //查询销售变更单明细
    function queryDetails(mainid) {
      let sql = "select * from 		voucher.orderchange.OrderChangeDetail where orderId='" + mainid + "'";
      var res3 = ObjectStore.queryByYonQL(sql, "udinghuo");
      return res3;
    }
    //检查转库单单据状态
    function checkzjd(auditstatuscodeList, otherstatuscodeList) {
      if (auditstatuscodeList.length > 0) {
        var res = join(auditstatuscodeList, ",");
        throw new Error("无法审核，存在已审核转库单[" + res + "],需取消审核再处理");
      }
      if (otherstatuscodeList.length > 0) {
        var res = join(otherstatuscodeList, ",");
        throw new Error("无法审核，需要先删除[" + res + "]转库单后，方可审核");
      }
    }
    //转库单查询
    function getTransferList(billcode) {
      let param1 = { billcode: billcode };
      let func = extrequire("SCMSA.backDesignerFunction.queryTransStock");
      return func.execute(param1);
    }
    //仓库id、物料id  查可用量
    function queryAvailableqty(orderDetails) {
      let urlx = "https://www.example.com/";
      let bodyx = {
        warehouse: orderDetails.stockId,
        product: orderDetails.productId
      };
      let apiStockResponses = openLinker("POST", urlx, "SCMSA", JSON.stringify(bodyx));
      let data = JSON.parse(apiStockResponses).data;
      //查可用量
      let availableqty = 0;
      if (data != null && data != "") {
        //计算可用量
        for (var j = 0; j < data.length; j++) {
          availableqty = availableqty + data[j].availableqty;
        }
      }
      return availableqty;
    }
    function getBigStockAndPhonemap(orgcode) {
      let stockUrl = "https://www.example.com/";
      let orgList = new Array();
      orgList.push(orgcode);
      let stockBodys = {
        pageSize: 50,
        pageIndex: 1,
        iUsed: "enable",
        org: orgList
      };
      let phonebigStockIdMap = new Map(); //电话大仓库集合
      let apiStockResponsex = openLinker("POST", stockUrl, "SCMSA", JSON.stringify(stockBodys));
      apiStockResponsex = JSON.parse(apiStockResponsex);
      if (apiStockResponsex.code == "200") {
        let stockList = apiStockResponsex.data.recordList;
        if (stockList.length > 0) {
          for (var k = 0; k < stockList.length; k++) {
            let stock = stockList[k];
            if (includes(stock.code, "G")) {
              phonebigStockIdMap.set("bigStockId", stock.id);
              phonebigStockIdMap.set("phone", stock.phone);
            }
          }
        }
      }
      return phonebigStockIdMap;
    }
    function getsaleorgname(changeModelData) {
      let salesOrgId_name = changeModelData.salesOrgId_name;
      if (changeModelData.salesOrgId_name == undefined || changeModelData.salesOrgId_name == "") {
        salesOrgId_name = changeModelData.settlementOrgId_name;
      }
      return salesOrgId_name;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });