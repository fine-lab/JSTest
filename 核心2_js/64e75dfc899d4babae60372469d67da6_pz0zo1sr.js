let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var replaceRequest = replace(JSON.stringify(request), "!", "");
    request = JSON.parse(replaceRequest);
    let data = request.datum;
    // 根据客户id，查询客户档案维护的SAP客户编码
    let clientId = data.agentId != undefined ? data.agentId : undefined;
    if (clientId == undefined) {
      throw new Error("客户档案id为空");
    }
    let sql = "select orgId from aa.merchant.Merchant where id = '" + clientId + "'";
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    let orgId;
    if (res != undefined) {
      if (res[0] != undefined) {
        orgId = res[0].orgId != undefined ? res[0].orgId : undefined;
      }
    }
    if (orgId == undefined) {
      throw new Error("客户管理组织id为空，请检查");
    }
    // 调用YS客户档案详情查询接口
    let func2 = extrequire("AT15D7426009680001.apiCode.getYsToken");
    let res2 = func2.execute(null, null);
    if (res2 == undefined) {
      throw new Error("获取YS系统Token失败，请稍后重试");
    }
    let token = res2.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let url = "https://www.example.com/" + token + "&id=" + clientId + "&orgId" + orgId;
    var strResponse = postman("get", url, JSON.stringify(header), null);
    let clientCode;
    let clientData = JSON.parse(strResponse);
    if (clientData.data.merchantDefine != undefined) {
      if (clientData.data.merchantDefine.define1 != undefined) {
        clientCode = clientData.data.merchantDefine.define1;
      }
    }
    if (clientCode == undefined) {
      throw new Error("该客户档案未在SAP系统维护");
    }
    // 组装SAP查询客商额度的body请求参数
    let body = {
      funName: "ZIF_QURY_FUNC_002",
      field: {
        IV_VKBUR: "1340", // 部门编码 - 固定值：1340
        IV_KUNNR: clientCode // 客户编码 "2000055578"
      }
    };
    let func1 = extrequire("AT15D7426009680001.code.sendSap");
    let res1 = func1.execute(null, body);
    if (res1 == undefined) {
      throw new Error("查询SAP客商额度查询接口失败，请重试");
    }
    let strResponses = JSON.parse(res1.strResponse);
    if (res1 != undefined) {
      if (strResponses.ZIF_QURY_FUNC_002 != undefined && strResponses.ZIF_QURY_FUNC_002.OUTPUT != undefined) {
        if (strResponses.ZIF_QURY_FUNC_002.OUTPUT.TRAN_FLAG == 0) {
          // 查询成功
          var sapClientED = strResponses.ZIF_QURY_FUNC_002.TABLES.ITEMS[0] != undefined ? strResponses.ZIF_QURY_FUNC_002.TABLES.ITEMS[0] : undefined; // SAP客商额度表数据
          if (sapClientED != undefined) {
            var sapClientZje = sapClientED.ZEDJE;
            var sapClientKyje = sapClientED.ZKYYE;
            var sapClientzyje = sapClientED.ZZYJE;
            var sapClientGxje = sapClientED.LTXT5 != undefined ? sapClientED.LTXT5 : "";
            // 查询客户欠款情况接口
            if (data.saleDepartmentId != undefined) {
              // 部组Code
              let queryBmSql = "select code from 	aa.dept.Department where id = '" + data.saleDepartmentId + "'";
              var bmRes = ObjectStore.queryByYonQL(queryBmSql, "productcenter");
              var I_VKGRP = bmRes[0].code != undefined ? bmRes[0].code : "";
            }
            if (data.salesOrgId != undefined) {
              // 组织Code
              let queryZzSql = "select code from aa.org.SalesOrg where id = '" + data.salesOrgId + "'";
              var zzRes = ObjectStore.queryByYonQL(queryZzSql, "productcenter");
              var I_BUKRS = zzRes[0].code != undefined ? zzRes[0].code : "";
            }
            var I_VBELN = "";
            if (data.headFreeItemdefine1 != undefined) {
              I_VBELN = data.headFreeItemdefine1;
            }
            if (I_VKGRP == "" || I_BUKRS == "") {
              throw new Error("查询销售组织、销售部门编码失败或未维护字段信息");
            }
            let clientBody = {
              funName: "ZFM_GET_KUNNR_ARREARS",
              field: {
                I_VBELN: I_VBELN, // SAP销售订单号
                I_BUKRS: I_BUKRS, // 公司代码，示例：1250
                I_VKBUR: "1340", // 销售部门，示例：1340
                I_VKGRP: I_VKGRP, // 销售组，示例：GQ8
                I_KUNNR: clientCode // 客户编码，示例：2000003284
              }
            };
            let func3 = extrequire("AT15D7426009680001.code.sendSap");
            let res3 = func3.execute(null, clientBody);
            if (res3 == undefined) {
              throw new Error("查询SAP客户欠款情况查询接口失败，请重试");
            }
            let res3ReturnJson = JSON.parse(res3.strResponse);
            if (res3ReturnJson.ZFM_GET_KUNNR_ARREARS != undefined && res3ReturnJson.ZFM_GET_KUNNR_ARREARS.OUTPUT != undefined) {
              var OUTPUT = res3ReturnJson.ZFM_GET_KUNNR_ARREARS.OUTPUT;
              if (res3ReturnJson.ZFM_GET_KUNNR_ARREARS.OUTPUT.TRAN_FLAG == 0) {
                var QKJE = OUTPUT.QKJE; // 逾期金额，示例：3446.00
                var QK1 = OUTPUT.QK1; // 客户欠款额度，示例：0.00
                var QK2 = OUTPUT.QK2; // 赊销欠款额度，示例：0.34
                var QK3 = OUTPUT.QK3; // 本次申请发货金额，示例：0.38
                var QK4 = OUTPUT.QK4; // 发货后欠款，示例：384.67
                var QK5 = OUTPUT.QK5; // 超欠款额度，示例：384.67
                var QK6 = OUTPUT.QK6; // 合同未交货金额，示例：385.72
                var QKRQ = OUTPUT.QKRQ; // 逾期货款约定付款日期，示例：2021年11月19日
                var QKTS = OUTPUT.QKTS; // 逾期天数，示例：412
                var QKBL = OUTPUT.QKB; // 超额度比例
              } else {
                throw new Error("查询SAP客户欠款情况查询接口失败：" + OUTPUT.GS_MES);
              }
            }
          } else {
            throw new Error("SAP客商额度表数据为空");
          }
          // 组装客户档案更新接口参数：
          var bodyClientUpdate = {
            billnum: "voucher_order",
            datas: [
              {
                id: data.id,
                code: data.code,
                definesInfo: [
                  {
                    // 表头字段
                    define3: sapClientZje,
                    define4: sapClientKyje,
                    define5: sapClientzyje,
                    define8: sapClientGxje,
                    define15: QK1, // 欠款额度
                    define14: QK2, // 赊销欠款额度，示例：0.34
                    define16: QK3, // 本次申请发货金额
                    define17: QK4, // 发货后欠款
                    define18: QK5, // 超欠款额度（qk5）
                    define19: QK6, // 合同未交货金额（qk6）
                    define20: QKBL, // 超额度比例
                    define21: QKRQ, // 逾期约定付款日期
                    define22: QKJE, // 逾期金额
                    define23: QKTS, // 逾期天数
                    isHead: true,
                    isFree: true
                  }
                ]
              }
            ]
          };
          //调用openlinker
          let url = "https://www.example.com/";
          var zidingyi = openLinker("POST", url, "SCMSA", JSON.stringify(bodyClientUpdate));
          let zidingyiObj = JSON.parse(zidingyi);
          if (zidingyiObj.code == 200) {
            return { code: "200" };
          } else {
            throw new Error("更新YS客商额度失败：" + zidingyiObj.message);
          }
        } else {
          // 查询SAP接口失败
          if ("查询失败，没有数据" == strResponses.ZIF_QURY_FUNC_002.OUTPUT.MESSAGE) {
            // 额度不足
            throw new Error("该客户额度不足");
          } else {
            // 其他情况
            throw new Error(strResponses.ZIF_QURY_FUNC_002.OUTPUT.MESSAGE);
          }
        }
      } else {
        throw new Error("调用SAP接口失败,请将此信息提供开发:" + JSON.stringify(strResponses));
      }
    } else {
      // 查询SAP接口失败
      throw new Error("调用SAP接口失败");
    }
    return { sapClientED };
  }
}
exports({ entryPoint: MyAPIHandler });