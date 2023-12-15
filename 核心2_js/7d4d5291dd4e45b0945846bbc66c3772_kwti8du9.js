let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    function setOutHeadData(requestData, dateTimeValue, type) {
      //出库接口表头
      let warehouseId = "";
      let customerId = "";
      let inOrgCode = "";
      // 是否调拨退货
      let breturn = "";
      let DBstate = requestData.hasOwnProperty("breturn");
      if (DBstate == true) {
        breturn = requestData.breturn;
      }
      if (requestData.inorg == "2522102344422656") {
        //依安工厂
        inOrgCode = "00105";
      } else if (requestData.inorg == "2390178757465088") {
        //克东
        inOrgCode = "00101";
      } else if (requestData.inorg == "2369205391741184") {
        //克东
        inOrgCode = "001";
      }
      if (requestData.outorg == "2522102344422656") {
        //依安工厂
        warehouseId = "yourIdHere";
        customerId = "yourIdHere";
      } else if (requestData.outorg == "2390178757465088") {
        //克东
        warehouseId = "yourIdHere";
        customerId = "yourIdHere";
      } else if (requestData.outorg == "2369205391741184") {
        //北纬47
        if (includes(requestData.outwarehousecode, "KSDS")) {
          warehouseId = "KSDS";
        } else if (includes(requestData.outwarehousecode, "XADS") || includes(requestData.outwarehousecode, "XAGK")) {
          warehouseId = "XADS";
        } else if (includes(requestData.outwarehousecode, "SZC")) {
          warehouseId = "KSDS";
        }
        customerId = "001";
      }
      if (warehouseId == "") {
        return null;
      }
      let outhead = {
        warehouseId: warehouseId, //所属仓库编,固定值
        customerId: customerId, //货主ID,固定值
        orderType: type, //订单类型,DC02	：工厂间调拨入库
        docNo: requestData.code, //ERP单号
        createSource: "YS",
        expectedShipmentTime1: dateTimeValue, //预期发货时间 当前
        consigneeId: requestData.inwarehousecode, //收货人代码
        consigneeName: requestData.inwarehousedetail.linkman, //收货人
        consigneeAddress1: requestData.inwarehousedetail.address, //收货人地址
        consigneeTel1: requestData.inwarehousedetail.phone, //收货人电话
        hedi01: requestData.inwarehousecode, //ERP入库仓库
        hedi02: requestData.outwarehousecode, //ERP出库仓库
        hedi03: inOrgCode, //ERP调入组织
        hedi04: requestData.outorg == "2369205391741184" ? customerId : warehouseId, //ERP调出组织
        hedi05: breturn, // 调拨退货
        notes: requestData.memo //备注
      };
      //入库接口表体
      let outDetails = setBodyData(requestData, "out");
      outhead.details = outDetails;
      return outhead;
    }
    function setBodyData(requestData, type) {
      let details = new Array();
      //子表数据
      let transferApplysValue = requestData.transferApplys;
      for (var i = 0; i < transferApplysValue.length; i++) {
        let transferApply = transferApplysValue[i];
        //查询物料
        let queryProductSql = "select code from pc.product.ProductSKU where id=" + transferApply.productsku;
        let productRes = ObjectStore.queryByYonQL(queryProductSql, "productcenter");
        if (productRes.length == 0) {
          throw new Error("未查询到物料信息！" + transferApply.product);
        }
        let sccsId = transferApply.sccsId;
        let detail = {};
        if (type == "in") {
          //入库表体
          detail = {
            referenceNo: requestData.code, //订单号
            lineNo: transferApply.lineno, //行号
            sku: productRes[0].code, //物料编码
            expectedQty: transferApply.qty, //预期数量
            lotAtt01: transferApply.producedate, //生产日期
            lotAtt02: transferApply.invaliddate, //失效日期
            lotAtt03: transferApply.define2, //入库日期
            lotAtt04: transferApply.define6, //供应商批次号
            lotAtt05: transferApply.batchno, //系统批次
            lotAtt09: transferApply.define7_manufacturer_code, //生产厂商
            lotAtt06: "02",
            dedi05: transferApply.mainid, //上游单据主表id
            dedi06: transferApply.id //上游单据子表id
          };
          details.push(detail);
        } else if (type == "out") {
          //出库表体
          let producedate = transferApply.producedate;
          if (!(typeof producedate == "undefined" || producedate == null || producedate == "")) {
            producedate = substring(producedate, 0, 10);
          }
          let invaliddate = transferApply.invaliddate;
          if (!(typeof invaliddate == "undefined" || invaliddate == null || invaliddate == "")) {
            invaliddate = substring(invaliddate, 0, 10);
          }
          let define2 = transferApply.define2;
          if (!(typeof define2 == "undefined" || define2 == null || define2 == "")) {
            define2 = substring(define2, 0, 10);
          }
          let define4 = transferApply.define4;
          let batchno = transferApply.batchno;
          detail = {
            referenceNo: requestData.code, //订单号
            lineNo: transferApply.lineno, //行号
            sku: productRes[0].code, //物料编码
            qtyOrdered: transferApply.qty, //订货数
            lotAtt01: producedate, //生产日期
            lotAtt02: invaliddate, //失效日期
            lotAtt03: define2, //入库日期
            lotAtt04: define4, //供应商批次
            lotAtt05: batchno, //系统批次号
            lotAtt08: "02",
            dedi05: transferApply.mainid, //上游单据主表id
            dedi06: transferApply.id //上游单据子表id
          };
          details.push(detail);
        }
      }
      return details;
    }
    //前台数据
    let requestData = param.convBills[0];
    let funcGetTransfer = extrequire("ST.api001.getTransfer");
    let id = requestData.id;
    let transferBody = funcGetTransfer.execute(null, id);
    requestData = transferBody.body;
    //交易类型为"生产领用调拨"、"工厂间调拨"、"工厂与物流仓间调拨"时触发同步WMS
    if (requestData.bustype == "1501322817959362570" || requestData.bustype == "1536629235828391938" || requestData.bustype == "1501323118598684682" || requestData.bustype == "1536628694667231233") {
      //查询调入仓库
      let queryinWarehouseSql = "select linkman,phone,address,code from aa.warehouse.Warehouse where id='" + requestData.inwarehouse + "'";
      let inwarehouseRes = ObjectStore.queryByYonQL(queryinWarehouseSql, "productcenter");
      if (inwarehouseRes.length == 0) {
        throw new Error("未查询到调入仓库信息！" + requestData.inwarehouse);
      }
      requestData.inwarehousecode = inwarehouseRes[0].code;
      requestData.inwarehousedetail = inwarehouseRes[0];
      //查询调出仓库
      let queryoutWarehouseSql = "select code from aa.warehouse.Warehouse where id='" + requestData.outwarehouse + "'";
      let outwarehouseRes = ObjectStore.queryByYonQL(queryoutWarehouseSql, "productcenter");
      if (outwarehouseRes.length == 0) {
        throw new Error("未查询到调出仓库信息！" + requestData.outwarehouse);
      }
      requestData.outwarehousecode = outwarehouseRes[0].code;
      //获取当前时间"yyyy-MM-dd hh:mm:ss"
      let func1 = extrequire("ST.unit.getDatetime");
      let res = func1.execute(null);
      let dateTimeValue = res.dateStr;
      let inhead = null;
      let outhead = null;
      let type = "";
      if (
        includes(requestData.outwarehousecode, "YA") ||
        includes(requestData.outwarehousecode, "KD") ||
        includes(requestData.outwarehousecode, "SZC") ||
        includes(requestData.outwarehousecode, "XADS") ||
        includes(requestData.outwarehousecode, "XAGK")
      ) {
        if (requestData.bustype == "1501322817959362570") {
          type = "DC01";
          outhead = setOutHeadData(requestData, dateTimeValue, "DC01");
        }
        if (requestData.bustype == "1536629235828391938") {
          //工厂间调拨
          type = "DC02";
          outhead = setOutHeadData(requestData, dateTimeValue, "DC02");
        }
        if (requestData.bustype == "1501323118598684682") {
          //工厂与物流仓间调拨
          type = "DC03";
          outhead = setOutHeadData(requestData, dateTimeValue, "DC03");
        }
        if (requestData.bustype == "1536628694667231233") {
          //工厂与物流仓间调拨
          type = "DC05";
          outhead = setOutHeadData(requestData, dateTimeValue, "DC05");
        }
        if (requestData.bustype == "1602084606140481537") {
          //工厂与物流仓间调拨
          type = "DC07";
          outhead = setOutHeadData(requestData, dateTimeValue, "DC07");
        }
        let outbody = {
          data: {
            header: [outhead]
          }
        };
        let WMSfunc = extrequire("GT101792AT1.common.sendWMS");
        if (outhead != null) {
          let param = {
            data: outbody,
            method: "putSalesOrder"
          };
          let res = WMSfunc.execute(null, param);
          let sendWMSResult = res.jsonResponse;
          let Response = sendWMSResult.Response.return;
          if (Response.returnCode != "0000") {
            let uspaceReceiver = ["6177310f-2b4f-46a4-8f7c-ce82202859ff"];
            let channelses = ["uspace"];
            let title = "调拨订单审核推送WMS系统错误预警！";
            let content = "单据编号为：" + param.data.data.header[0].docNo + "，报错节点：" + "审核" + "，报错信息：" + JSON.stringify(Response.returnDesc);
            let messageInfos = {
              sysId: "yourIdHere",
              tenantId: "yourIdHere",
              uspaceReceiver: uspaceReceiver,
              channels: channelses,
              subject: title,
              content: content,
              groupCode: "prewarning"
            };
            let resulte = sendMessage(messageInfos);
            throw new Error("YS调拨订单推WMS出库" + type + "失败：" + JSON.stringify(Response.returnDesc));
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });