let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    function getMyDate(str) {
      var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate() + 1,
        oTime = oYear + "-" + addZero(oMonth) + "-" + addZero(oDay);
      return oTime;
    }
    //补零操作
    function addZero(num) {
      if (parseInt(num) < 10) {
        num = "0" + num;
      }
      return num;
    }
    function setInHeadData(requestData, transfer, dateTimeValue, type) {
      //入库接口表头
      let warehouseId = "";
      let customerId = "";
      let outOrgCode = "";
      let vendorfun = extrequire("GZTBDM.backDesignerFunction.getVendor");
      let transferApplysValue = transfer.transferApplys;
      let transferApply = transferApplysValue[0];
      let details = requestData.details;
      let vendorList = new Array();
      if (typeof transferApply.define3 == "undefined" || transferApply.define3 == null || transferApply.define3 == "") {
        let vendor = { code: transfer.outwarehousecode, name: transfer.outwarehouse_name };
        vendorList.push(vendor);
      } else {
        vendorList = vendorfun.execute(null, transferApply.define3).res;
      }
      if (transfer.inorg == "2522102344422656") {
        //依安工厂
        warehouseId = "yourIdHere";
        customerId = "yourIdHere";
      } else if (transfer.inorg == "2390178757465088") {
        //克东
        warehouseId = "yourIdHere";
        customerId = "yourIdHere";
      } else if (transfer.inorg == "2369205391741184") {
        //北纬47
        if (includes(transfer.inwarehousecode, "KSDS")) {
          warehouseId = "KSDS";
        } else if (includes(transfer.inwarehousecode, "XADS") || includes(transfer.inwarehousecode, "XAGK")) {
          warehouseId = "XADS";
        } else if (includes(transfer.inwarehousecode, "SZC")) {
          warehouseId = "KSDS";
        }
        customerId = "001";
      }
      if (warehouseId == "") {
        return null;
      }
      if (transfer.outorg == "2522102344422656") {
        //依安工厂
        outOrgCode = "00105";
      } else if (transfer.outorg == "2390178757465088") {
        //克东
        outOrgCode = "00101";
      } else if (transfer.outorg == "2369205391741184") {
        //北纬47
        outOrgCode = "001";
      } else if (transfer.outorg == "2522015793665536") {
        outOrgCode = "00104";
      }
      let inhead = {
        warehouseId: warehouseId, //所属仓库编,固定值
        customerId: customerId, //货主ID,固定值
        asnType: type, //订单类型
        docNo: requestData.code, //ERP单号
        createSource: "YS",
        expectedArriveTime1: dateTimeValue, //
        hedi01: transfer.inwarehousecode, //ERP入库仓库
        hedi02: transfer.outwarehousecode, //ERP出库仓库
        hedi03: transfer.inorg == "2369205391741184" ? customerId : warehouseId, //ERP调入组织
        hedi04: outOrgCode, //ERP调出组织
        notes: "" //备注
      };
      //入库接口表体
      let inDetails = setBodyData(requestData, "in");
      inhead.details = inDetails;
      return inhead;
    }
    function setBodyData(requestData, type) {
      let details = new Array();
      //子表数据
      let transferApplysValue = transfer.transferApplys;
      let detaildcs = requestData.details;
      let func7 = extrequire("GT101792AT1.common.getBatchNo");
      for (var i = 0; i < detaildcs.length; i++) {
        let transferApply = detaildcs[i];
        //查询物料
        let queryProductSql = "select code from pc.product.ProductSKU where id=" + transferApply.productsku;
        let productRes = ObjectStore.queryByYonQL(queryProductSql, "productcenter");
        if (productRes.length == 0) {
          throw new Error("未查询到物料信息！" + transferApply.product);
        }
        //查询生产厂商
        let sccssql = "select manufacturer_code from GT101792AT1.GT101792AT1.manufacturer	where dr=0 and id=" + transferApply.define8;
        let sccsRes = ObjectStore.queryByYonQL(sccssql, "developplatform");
        let sccsCode = "";
        if (sccsRes.length > 0) {
          sccsCode = sccsRes[0].manufacturer_code;
        }
        let detail = {};
        let define2 = transferApply.define2; //入库日期
        let define4 = transferApply.define4; //供应商批次
        let producedate = transferApply.producedate; //生产日期
        let invaliddate = transferApply.invaliddate; //有效期至
        let lotAtt01 = "";
        if (producedate != undefined) {
          if (producedate.length > 10) {
            lotAtt01 = substring(producedate, 0, 10);
          } else {
            lotAtt01 = producedate;
          }
        }
        let lotAtt02 = "";
        if (invaliddate != undefined) {
          if (invaliddate.length > 10) {
            lotAtt02 = substring(invaliddate, 0, 10);
          } else {
            lotAtt02 = invaliddate;
          }
        }
        let lotAtt03 = "";
        if (define2 != undefined) {
          if (define2.length > 10) {
            lotAtt03 = substring(define2, 0, 10);
          } else {
            lotAtt03 = define2;
          }
        }
        if (type == "in") {
          //入库表体
          detail = {
            referenceNo: requestData.code, //订单号
            lineNo: transferApply.lineno, //行号
            sku: productRes[0].code, //物料编码
            expectedQty: transferApply.qty, //预期数量
            lotAtt01: lotAtt01, //生产日期
            lotAtt02: lotAtt02, //失效日期
            lotAtt03: lotAtt03, //入库日期
            lotAtt04: transferApply.define4, //供应商批次号
            lotAtt05: transferApply.batchno, //系统批次
            lotAtt08: "01",
            lotAtt09: sccsCode,
            dedi05: transferApply.mainid, //上游单据主表id
            dedi06: transferApply.id, //上游单据子表id
            dedi07: transferApply.firstsourceid, //源头主表
            dedi08: transferApply.firstsourceautoid //源头指标
          };
          details.push(detail);
        }
      }
      return details;
    }
    //前台数据
    let requestData = param.convBills[0];
    let funcGetTransfer = extrequire("ST.api001.getTransfer");
    let id = requestData.srcBill;
    let transferBody = funcGetTransfer.execute(null, id);
    let transfer = transferBody.body;
    //交易类型为"生成领料退库"、"工厂间调拨"、"工厂与物流仓间调拨"时触发同步WMS
    if (
      transfer.bustype == "1536629235828391938" ||
      transfer.bustype == "1501323118598684682" ||
      transfer.bustype == "1501342574800535555" ||
      transfer.bustype == "1536628694667231233" ||
      transfer.bustype == "1602084606140481537"
    ) {
      //查询调入仓库
      let queryinWarehouseSql = "select linkman,phone,address,code from aa.warehouse.Warehouse where id='" + transfer.inwarehouse + "'";
      let inwarehouseRes = ObjectStore.queryByYonQL(queryinWarehouseSql, "productcenter");
      if (inwarehouseRes.length == 0) {
        throw new Error("未查询到调入仓库信息！" + requestData.inwarehouse);
      }
      transfer.inwarehousecode = inwarehouseRes[0].code;
      transfer.inwarehousedetail = inwarehouseRes[0];
      //查询调出仓库
      let queryoutWarehouseSql = "select code from aa.warehouse.Warehouse where id='" + transfer.outwarehouse + "'";
      let outwarehouseRes = ObjectStore.queryByYonQL(queryoutWarehouseSql, "productcenter");
      if (outwarehouseRes.length == 0) {
        throw new Error("未查询到调出仓库信息！" + requestData.outwarehouse);
      }
      transfer.outwarehousecode = outwarehouseRes[0].code;
      //获取当前时间"yyyy-MM-dd hh:mm:ss"
      let func1 = extrequire("ST.unit.getDatetime");
      let res = func1.execute(null);
      let dateTimeValue = res.dateStr;
      let inhead = null;
      let type = "";
      if (
        includes(transfer.inwarehousecode, "YA") ||
        includes(transfer.inwarehousecode, "KD") ||
        includes(transfer.inwarehousecode, "SZC") ||
        includes(transfer.inwarehousecode, "XADS") ||
        includes(transfer.inwarehousecode, "XAGK")
      ) {
        if (transfer.bustype == "1501342574800535555") {
          type = "DR04";
          inhead = setInHeadData(requestData, transfer, dateTimeValue, type);
        }
        if (transfer.bustype == "1536629235828391938") {
          //工厂间调拨
          type = "DR02";
          inhead = setInHeadData(requestData, transfer, dateTimeValue, type);
        }
        if (transfer.bustype == "1501323118598684682") {
          //工厂与物流仓间调拨
          type = "DR03";
          inhead = setInHeadData(requestData, transfer, dateTimeValue, type);
        }
        if (transfer.bustype == "1536628694667231233") {
          //物流仓间调拨
          type = "DR05";
          inhead = setInHeadData(requestData, transfer, dateTimeValue, type);
        }
        if (transfer.bustype == "1602084606140481537") {
          //物流仓间调拨
          type = "DR07";
          inhead = setInHeadData(requestData, transfer, dateTimeValue, type);
        }
        let inbody = {
          data: {
            header: [inhead]
          }
        };
        let WMSfunc = extrequire("GT101792AT1.common.sendWMS");
        if (inhead != null) {
          let param = {
            data: inbody,
            method: "putASN"
          };
          let res = WMSfunc.execute(null, param);
          let sendWMSResult = res.jsonResponse;
          let Response = sendWMSResult.Response.return;
          if (Response.returnCode != "0000") {
            throw new Error("YS调拨订单推WMS入库" + type + "失败：" + JSON.stringify(Response.returnDesc));
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });