let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = JSON.parse(param.requestData);
    if (requestData.verifystate == 0) {
      //开立态
      let idnumber = requestData.id;
      //查询主表
      let queryHSql = "select quatype,stocknum from GT101792AT1.GT101792AT1.quaReleMenu where dr=0 and id='" + idnumber + "'";
      let hRes = ObjectStore.queryByYonQL(queryHSql, "developplatform");
      //查询子表
      let queryBSql = "select * from GT101792AT1.GT101792AT1.quaReleMater where dr=0 and quaReleMenu_id='" + idnumber + "'";
      let bRes = ObjectStore.queryByYonQL(queryBSql, "developplatform");
      if (hRes[0].quatype == "WG01") {
        //拉取产品入库单
        //产品入库单
        let queryCodeSql = "select * from st.storeprorecord.StoreProRecord where code='" + hRes[0].stocknum + "'";
        let codeRes = ObjectStore.queryByYonQL(queryCodeSql, "ustock");
        if (codeRes.length == 0) {
          throw new Error("产品入库编号【" + hRes[0].stocknum + "】未查询到，请检查！");
        }
        if (codeRes[0].status == "1") {
          throw new Error("产品入库编号【" + hRes[0].stocknum + "】已审核，不可继续更改！");
        }
        let storeProRecordData = codeRes[0];
        let resubmitCheckKeyT = replace(uuid(), "-", "");
        let updateheadData = {
          resubmitCheckKey: resubmitCheckKeyT,
          id: storeProRecordData.id,
          srcBill: storeProRecordData.srcBill,
          srcBillNO: storeProRecordData.srcBillNO,
          srcBillType: storeProRecordData.srcBillType,
          warehouse_iSerialManage: storeProRecordData.warehouse_iSerialManage,
          org: storeProRecordData.org, //库存组织
          vouchdate: storeProRecordData.vouchdate, //单据日期
          warehouse: storeProRecordData.warehouse,
          factoryOrg: storeProRecordData.factoryOrg,
          bustype: storeProRecordData.bustype,
          pubts: storeProRecordData.pubts,
          department: storeProRecordData.department,
          _status: "Update"
        };
        var storeProRecords = new Array();
        for (var k = 0; k < bRes.length; k++) {
          let fxbodydata = bRes[k];
          //查询产品入库子表:依据质量放行单子表的上游子表id
          let queryBodySql = "select * from st.storeprorecord.StoreProRecords where mainid='" + storeProRecordData.id + "' and id='" + fxbodydata.sourcechild_id + "'";
          let bodysRes = ObjectStore.queryByYonQL(queryBodySql, "ustock");
          if (bodysRes.length == 0) {
            throw new Error("产品入库编号【" + hRes[0].stocknum + "】不存在子表id【" + fxbodydata.sourcechild_id + "】数据,请排查！");
          }
          let storeProRecordsData = bodysRes[0];
          let defines = {
            define2: "已放行"
          };
          let queryBodyDefSql = "select * from st.storeprorecord.StoreProRecordsDefine where id='" + storeProRecordsData.id + "'";
          let bodyDefRes = ObjectStore.queryByYonQL(queryBodyDefSql, "ustock");
          if (bodyDefRes.length > 0) {
            defines.id = storeProRecordsData.id;
          }
          let storeProRecord = {
            id: storeProRecordsData.id,
            product: storeProRecordsData.product,
            qty: storeProRecordsData.qty,
            unit: storeProRecordsData.unit,
            invExchRate: storeProRecordsData.invExchRate,
            stockUnitId: storeProRecordsData.stockUnitId,
            sourceid: storeProRecordsData.sourceid,
            sourceautoid: storeProRecordsData.sourceautoid,
            source: storeProRecordsData.source,
            upcode: storeProRecordsData.upcode,
            makeRuleCode: storeProRecordsData.makeRuleCode,
            mosource: storeProRecordsData.mosource,
            isSerialNoManage: storeProRecordsData.isSerialNoManage,
            makeproduct: storeProRecordsData.makeproduct,
            productsku: storeProRecordsData.productsku,
            batchno: storeProRecordsData.batchno,
            expireDateNo: storeProRecordsData.expireDateNo,
            expireDateUnit: storeProRecordsData.expireDateUnit,
            producedate: storeProRecordsData.producedate,
            invaliddate: storeProRecordsData.invaliddate,
            mainid: storeProRecordsData.mainid,
            detailid: storeProRecordsData.detailid,
            pubts: storeProRecordsData.pubts,
            isBatchManage: storeProRecordsData.isBatchManage,
            isExpiryDateManage: storeProRecordsData.isExpiryDateManage,
            moid: storeProRecordsData.moid,
            moautoid: storeProRecordsData.moautoid,
            uplineno: storeProRecordsData.uplineno,
            _status: "Update",
            defines: defines
          };
          storeProRecords.push(storeProRecord);
        }
        updateheadData.storeProRecords = storeProRecords;
        //调用YS“库存状态调整单个保存”接口
        let ysupdatefunc = extrequire("GT101792AT1.backOpenApiFunction.storeprUpdateAPI");
        let ysupdateRes = ysupdatefunc.execute(updateheadData);
        if (ysupdateRes.error) {
          throw new Error("调用YS【产品入库保存】接口实现更新异常，错误信息：" + ysupdateRes.message);
        }
        if (ysupdateRes.result.code != 200) {
          throw new Error("调用YS【产品入库保存】接口实现更新异常，错误信息：" + ysupdateRes.result.message);
        } else {
          var upateDataRes = ysupdateRes.result.data;
          if (upateDataRes.failCount > 0) {
            throw new Error("调用YS【产品入库保存】接口实现更新异常，错误信息：" + upateDataRes.messages[0]);
          }
        }
      } else if (hRes[0].quatype == "RK02") {
        //拉取采购入库
        let queryCodeSql = "select * from st.purinrecord.PurInRecord where code='" + hRes[0].stocknum + "'";
        let codeRes = ObjectStore.queryByYonQL(queryCodeSql, "ustock");
        if (codeRes.length == 0) {
          throw new Error("采购入库编号【" + hRes[0].stocknum + "】未查询到，请检查！");
        }
        if (codeRes[0].status == "1") {
          throw new Error("采购入库编号【" + hRes[0].stocknum + "】已审核，不可继续更改！");
        }
        let storeProRecordData = codeRes[0];
        let resubmitCheckKeyT = replace(uuid(), "-", "");
        let updateheadData = storeProRecordData;
        updateheadData.resubmitCheckKey = resubmitCheckKeyT;
        updateheadData._status = "Update";
        delete updateheadData.inventoryowner;
        var storeProRecords = new Array();
        for (var k = 0; k < bRes.length; k++) {
          let fxbodydata = bRes[k];
          //查询采购入库子表:依据质量放行单子表的上游子表id
          let queryBodySql = "select * from st.purinrecord.PurInRecords where mainid='" + storeProRecordData.id + "' and id='" + fxbodydata.sourcechild_id + "'";
          let bodysRes = ObjectStore.queryByYonQL(queryBodySql, "ustock");
          if (bodysRes.length == 0) {
            throw new Error("采购入库编号【" + hRes[0].stocknum + "】不存在子表id【" + fxbodydata.sourcechild_id + "】数据,请排查！");
          }
          let storeProRecordsData = bodysRes[0];
          let defines = {
            define12: "已放行"
          };
          let queryBodyDefSql = "select * from st.purinrecord.PurInRecordsDefine where id='" + storeProRecordsData.id + "'";
          let bodyDefRes = ObjectStore.queryByYonQL(queryBodyDefSql, "ustock");
          if (bodyDefRes.length > 0) {
            defines.id = storeProRecordsData.id;
          }
          let purInRecord = storeProRecordsData;
          purInRecord._status = "Update";
          purInRecord.defines = defines;
          delete purInRecord.reserveid;
          storeProRecords.push(purInRecord);
        }
        updateheadData.purInRecords = storeProRecords;
        //调用YS“库存状态调整单个保存”接口
        let ysupdatefunc = extrequire("GT101792AT1.backOpenApiFunction.purUpdateAPI");
        let ysupdateRes = ysupdatefunc.execute(updateheadData);
        if (ysupdateRes.error) {
          throw new Error("调用YS【采购入库单个保存】接口实现更新异常，错误信息：" + ysupdateRes.message);
        }
        if (ysupdateRes.result.code != 200) {
          throw new Error("调用YS【采购入库单个保存】接口实现更新异常，错误信息：" + ysupdateRes.result.message);
        } else {
          var upateDataRes = ysupdateRes.result.data;
          if (upateDataRes.failCount > 0) {
            throw new Error("调用YS【采购入库单个保存】接口实现更新异常，错误信息：" + upateDataRes.messages[0]);
          }
        }
      }
      //查询仓库
      let queryWarehouseSql = "select code from aa.warehouse.Warehouse where id='" + requestData.warehouse + "'";
      let warehouseRes = ObjectStore.queryByYonQL(queryWarehouseSql, "productcenter");
      if (requestData.stockorg == "1473045320098643975") {
        //依安工厂
        requestData.WMSwarehouseId = "yourIdHere";
        requestData.WMScustomerId = "yourIdHere";
      } else if (requestData.stockorg == "1473041368737644546") {
        //克东
        requestData.WMSwarehouseId = "yourIdHere";
        requestData.WMScustomerId = "yourIdHere";
      }
      let resubmitCheckKey = replace(uuid(), "-", "");
      let headData = {
        resubmitCheckKey: resubmitCheckKey,
        org: requestData.stockorg, //库存组织
        vouchdate: requestData.quadate, //单据日期
        _status: "Insert"
      };
      let goodChanges = new Array();
      let header1 = new Array(); //放行
      let header2 = new Array(); //禁用
      for (var i = 0; i < bRes.length; i++) {
        let bres = bRes[i];
        let lineNo = i + 1;
        //查询批次号
        let queryBatchnoSql = "select * from st.batchno.Batchno where product='" + bres.material + "' and productsku='" + bres.materialsku + "' and batchno='" + bres.systembatchnum + "'";
        let batchnoRes = ObjectStore.queryByYonQL(queryBatchnoSql, "yonbip-scm-scmbd");
        bres.producedate = batchnoRes[0].producedate;
        bres.invaliddate = batchnoRes[0].invaliddate;
        if (bres.quantity > 0) {
          //放行主数量大于0
          //拼接YS接口子表数据
          let bodyData1 = {
            _status: "Insert",
            warehouse: requestData.warehouse, //仓库
            product: bres.material, //物料
            productsku: bres.materialsku, //物料sku
            invExchRate: bres.conversionrate, //换算率
            outStockStatusDoc: "BW01", //来源库存状态id或code
            org: requestData.stockorg, //组织id或code
            inStockStatusDoc: "BW02", //目的库存状态id或code ，放行
            stockUnitId: bres.assistunit, //库存单位id或code
            qty: bres.quantity, //调整数量
            subQty: bres.assistquantity //调整件数
          };
          //批次号相关
          bodyData1.batchno = bres.systembatchnum; //批次号
          bodyData1.isBatchManage = true; //是否批次管理，false表示否；true表示是
          bodyData1.producedate = bres.producedate; //生产日期
          bodyData1.invaliddate = bres.invaliddate; //有效期至
          goodChanges.push(bodyData1);
          //拼接WMS接口数据
          let headerData1 = {
            warehouseId: requestData.WMSwarehouseId, //仓库ID
            customerId: requestData.WMScustomerId, //货主ID
            qcNo: requestData.code, //质检单号
            lineNo: lineNo, //质检行号
            docNo: requestData.stocknum, //入库单号
            asnType: requestData.quatype, //入库订单类型
            sku: bres.materialskucode, //产品,(skucode)
            orderedQty: bres.quantity, //数量
            dedi03: warehouseRes[0].code,
            dedi04: "02",
            lotatt04: bres.supplierbatchnum, //供应商批次
            lotatt05: bres.systembatchnum //系统批次
          };
          header1.push(headerData1);
        }
        if (bres.disquantity > 0) {
          //禁用主数量
          //拼接YS接口子表数据
          let bodyData2 = {
            _status: "Insert",
            warehouse: requestData.warehouse, //仓库
            product: bres.material, //物料
            productsku: bres.materialsku, //物料sku
            invExchRate: bres.conversionrate, //换算率
            outStockStatusDoc: "BW01", //来源库存状态id或code
            org: requestData.stockorg, //组织id或code
            inStockStatusDoc: "BW03", //目的库存状态id或code ，禁用
            stockUnitId: bres.assistunit, //库存单位id或code
            qty: bres.disquantity, //调整数量
            subQty: bres.assistquantity //调整件数
          };
          //批次号相关
          bodyData2.batchno = bres.systembatchnum; //批次号
          bodyData2.isBatchManage = true; //是否批次管理，false表示否；true表示是
          bodyData2.producedate = bres.producedate; //生产日期
          bodyData2.invaliddate = bres.invaliddate; //有效期至
          goodChanges.push(bodyData2);
          //拼接WMS接口数据
          let headerData2 = {
            warehouseId: requestData.WMSwarehouseId, //仓库ID
            customerId: requestData.WMScustomerId, //货主ID
            qcNo: requestData.code, //质检单号
            lineNo: lineNo, //质检行号
            docNo: requestData.stocknum, //入库单号
            asnType: requestData.quatype, //入库订单类型
            sku: bres.materialskucode, //产品,(skucode)
            orderedQty: bres.disquantity, //数量
            dedi03: warehouseRes[0].code,
            dedi04: "03",
            lotatt04: bres.supplierbatchnum, //供应商批次
            lotatt05: bres.systembatchnum //系统批次
          };
          header2.push(headerData2);
        }
      }
      headData.stockStatusChanges = goodChanges;
      //调用YS“库存状态调整单个保存”接口
      let ysfunc = extrequire("GT101792AT1.backOpenApiFunction.stockstatusAPI");
      let ysRes = ysfunc.execute(headData);
      if (ysRes.error) {
        throw new Error("调用YS【库存状态调整单个保存】接口异常，" + ysRes.message);
      }
      if (ysRes.result.code != 200) {
        throw new Error("调用YS【库存状态调整单个保存】接口异常，" + ysRes.result.message);
      }
      //调用YS“库存状态调整单审核”接口
      let auditData = { id: ysRes.result.data.id };
      let auditfunc = extrequire("GT101792AT1.backOpenApiFunction.stockauditAPI");
      let auditRes = auditfunc.execute(auditData);
      if (auditRes.error) {
        throw new Error("调用YS【库存状态调整单审核】接口异常，" + auditRes.message);
      }
      if (auditRes.result.code != 200) {
        throw new Error("调用YS【库存状态调整单审核】接口异常，" + auditRes.result.message);
      }
      if (auditRes.result.data.failInfos.length > 0) {
        throw new Error("调用YS【库存状态调整单审核】接口异常，" + auditRes.result.data.failInfos[0].message);
      }
      //调用WMS“质量状态下发”接口
      let wmsfunc = extrequire("GT101792AT1.common.sendWMSInventory");
      let headerData = {};
      let body = {};
      let param = { method: "putSKQC" };
      if (header1.length > 0) {
        headerData = { header: header1 };
        body = { data: headerData };
        param.data = body;
        let wmsres1 = wmsfunc.execute(null, param);
        let response1 = wmsres1.jsonResponse.Response.return;
        if (response1.returnCode != "0000") {
          throw new Error("YS调用WMS【质量状态下发】接口发送放行数据失败：" + JSON.stringify(response1.returnCode) + ",请求参数param为:" + JSON.stringify(param));
        }
      }
      if (header2.length > 0) {
        headerData = { header: header2 };
        body = { data: headerData };
        param.data = body;
        let wmsres2 = wmsfunc.execute(null, param);
        let response2 = wmsres2.jsonResponse.Response.return;
        if (response2.returnCode != "0000") {
          throw new Error("YS调用WMS【质量状态下发】接口发送禁用数据失败：" + JSON.stringify(response2.returnCode) + ",请求参数param为:" + JSON.stringify(param));
        }
      }
    } else if (requestData.verifystate == 2) {
      //已审核
      throw new Error("已审核！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });