let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var accessToken;
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    // 销售订单单号
    var code = request.code;
    var status = request.status;
    // 类型 1-特殊信控审批 2-未发货仅退款 3-地址/时间变动 4-退货退款 5-订单部分退款 6-多地址拆分
    var type = request.type;
    // 整车标识号
    var wholeCar = request.wholeCar == "" ? undefined : request.wholeCar;
    // 变动申请状态
    var bianDongDan = request.bianDongDan;
    // 客户ID
    var agentId = request.agentId;
    var nccOrderNo = request.nccOrderNo;
    // 信控比例
    var define5;
    var define21;
    // 审批结果
    var define22 = request.approveResult == "" ? undefined : request.approveResult;
    var define30 = request.define30 == "" ? undefined : request.define30;
    // 临时账期天
    var define42;
    // 临时信控额度
    var define43;
    // 临时首付款比例
    var define44;
    // 名额项
    var define45;
    // 金额-数量
    var define46;
    // 完成状态时间
    var define9;
    // 控货支付截止日期
    var define11;
    // 控货支付比率
    var define12;
    // 酱香之旅
    var define13;
    // 整车类型
    var define14;
    // 整车标识号
    var define15;
    // 控货支付(截止日期/比例)
    var define17;
    // 酱香之旅/整车类型
    var define35;
    // 是否整车订单
    var define7;
    // 是否多地址拆分
    var define18;
    let body = { request };
    let header = {};
    if (status == "2" || status == "3" || status == "5") {
      let strResponse = postman(
        "post",
        "https://www.example.com/" + getAccessToken(),
        JSON.stringify(header),
        JSON.stringify(body)
      );
      let res = JSON.parse(strResponse);
      if (res.code != "200") {
        throw new Error(res.message);
      }
    }
    if (status == "1") {
      define21 = "OA审批中";
      if (type == "6") {
        const result = updateOaStatus("2");
      }
    } else if (status == "2") {
      define21 = "OA审批通过";
      if (type == "1") {
        // 特殊信控审批通过
        define5 = request.calibrationRatio == "" ? undefined : request.calibrationRatio;
        define42 = request.payment == "" ? undefined : request.payment;
        define43 = request.lines == "" ? undefined : request.lines;
        define44 = request.proportion == "" ? undefined : request.proportion;
        define45 = request.discount == "" ? undefined : request.discount;
        define46 = request.prsl == "" ? undefined : request.prsl;
        define11 = request.deliveryPayDate == "" ? undefined : request.deliveryPayDate;
        define12 = request.deliveryPayRatio == "" ? undefined : request.deliveryPayRatio;
        define13 = request.tourLines == "" ? undefined : request.tourLines;
        define14 = request.vehicleType == "" ? undefined : request.vehicleType;
        define15 = wholeCar;
        if (define14 == "大车(13.5)" || define14 == "小车(9.6)") {
          define7 = "是";
        }
        if (define14 == "非整车") {
          define7 = "否";
        }
        if (define11 != null && define12 != null) {
          define17 = define11 + "/" + define12;
        }
        if (define13 != null && define14 != null) {
          define35 = define13 + "/" + define14;
        }
      }
      if (type == "2") {
        define9 = getNowDate();
      }
      if (type == "6") {
        updateOaStatus("3");
        let body = { udhNo: code };
        let url = "https://www.example.com/";
        let apiResponse = openLinker("POST", url, "GT80750AT4", JSON.stringify(body));
        updateRemark("调用pushWms接口的返回值" + JSON.stringify(apiResponse));
        const resp = JSON.parse(apiResponse);
        if (resp.code == "200") {
          updateWmsStatus("2");
          deleteRow();
          updateSplitAddressStatusToNcc(code);
          define18 = "是";
        } else {
          updateWmsStatus("3");
        }
      }
    } else if (status == "3") {
      define21 = "OA审批不通过";
      if (define22 === undefined || define22 === "") {
        throw new Error("审批不通过时请填写审批原因");
      }
      // 未发货仅退款->驳回，地址/时间变动->驳回 多地址拆分->驳回
      if (type == "2" || type == "3" || type == "6") {
        if (nccOrderNo === undefined || nccOrderNo === "") {
          throw new Error("审批不通过时请填写ncc单据号");
        }
        if (type == "2") {
          define9 = getNowDate();
          let updateOaStatusToNccParam = {
            data: [
              {
                vbillcode: code,
                vdef38: "取消挂起",
                vdef19: 2
              }
            ]
          };
          updateOaStatusToNcc(updateOaStatusToNccParam);
        }
        if (type == "6") {
          updateOaStatus("4");
          deleteRow();
        }
        // 校验销售订单是否NCC推送外系统
        let isSendWms = isSendToWmsByNcc({
          data: [{ saleorderno: code }]
        });
        if (isSendWms) {
          // 请求wms取消挂起
          if (type == 6) {
            cancelSplitAddressWms({ udhNo: code });
          } else {
            cancelHangWms({ nccOrderNo: nccOrderNo });
          }
        }
      }
    } else if (status == "4") {
      // 撤回OA审批
      define21 = "";
      define22 = "";
      //判断变动申请状态不为信控变动时才执行wms取消挂起
      if (bianDongDan != 1) {
        let nccOrderNo = getNccOrderNo(code);
        if (type == 6) {
          cancelSplitAddressWms({ udhNo: code });
        } else {
          cancelHangWms({ nccOrderNo: nccOrderNo });
        }
      }
    } else if (status == "5") {
      //什么都不做,调用其他接口完成部分退款流程
    } else {
      throw new Error("请传正确格式status值");
    }
    // 待修改销售订单自定义项参数
    var updateSaleOrderDefineParam = [];
    // 待修改销售订单表头自定义项参数 20230627 add
    var updateSaleOrderFreeDefineParam = [];
    if (code === undefined || code === "") {
      throw new Error("销售订单号不能为空");
    }
    // 封装请求参数
    var reqBody = {
      pageIndex: "1",
      pageSize: "10",
      code: code,
      isSum: true
    };
    // 查询所有符合条件销售订单
    var saleOrders = getSaleOrderData(reqBody);
    if (saleOrders === undefined || saleOrders.length < 1) {
      throw new Error("未查询到订单");
    }
    saleOrders.forEach((self) => {
      let tmpParam = {
        id: self.id,
        code: self.code,
        definesInfo: [
          {
            define3: wholeCar,
            define5: define5,
            define21: define21,
            define22: define22,
            define30: define30,
            define42: define42,
            define43: define43,
            define44: define44,
            define45: define45,
            define46: define46,
            define17: define17,
            define35: define35,
            define7: define7,
            define18: define18,
            isHead: true,
            isFree: false
          }
        ]
      };
      let tmpParam2 = {
        id: self.id,
        code: self.code,
        definesInfo: [
          {
            define9: define9,
            define11: define11,
            define12: define12,
            define13: define13,
            define14: define14,
            define15: define15,
            isHead: true,
            isFree: true
          }
        ]
      };
      updateSaleOrderDefineParam.push(tmpParam);
      updateSaleOrderFreeDefineParam.push(tmpParam2);
    });
    // 修改销售订单define
    updateSaleOrderDefine(updateSaleOrderDefineParam);
    updateSaleOrderDefine(updateSaleOrderFreeDefineParam);
    return { code: 200, data: [], message: "成功" };
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function getSaleOrderData(params) {
      // 响应信息
      let saleOrderData = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(params));
      // 转为JSON对象
      saleOrderData = JSON.parse(saleOrderData);
      // 返回信息校验
      if (saleOrderData.code != "200") {
        throw new Error("查询销售订单异常:" + saleOrderData.message);
      }
      if (saleOrderData.data !== undefined && saleOrderData.data.recordList !== undefined && saleOrderData.data.recordList.length != 0) {
        let id = saleOrderData.data.recordList[0].barCode;
        id = substring(id, 14, id.length);
        saleOrderData.data.recordList[0].id = id;
        return saleOrderData.data.recordList;
      } else {
        return [];
      }
    }
    function updateSaleOrderDefine(params) {
      // 封装请求参数
      let reqBody = {
        billnum: "voucher_order",
        datas: params
      };
      // 响应信息
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      try {
        // 转为JSON对象
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("销售自定义项更新 " + e);
      }
    }
    function cancelHangWms(params) {
      let appKey = config.busAppKey;
      let appSecret = config.busAppSecret;
      // 请求路径
      let path = "P13_004";
      // 来源
      let source = "P13";
      // 数据 Category 操作类型 1=挂起,2=取消
      let siteData = {
        OrderNo: params.nccOrderNo,
        Category: 2
      };
      // 随机字符串 100000 899999
      let nonce = Math.round(Math.random() * 899999 + 100000).toString();
      // 时间戳
      let timestamp = Date.parse(new Date()).toString();
      // 数据
      siteData = JSON.stringify(siteData);
      let httpDataJson = JSON.stringify({
        appKey: appKey,
        data: siteData,
        nonce: nonce,
        path: path,
        source: source,
        timestamp: timestamp
      });
      let signStr = appSecret + httpDataJson + appSecret;
      let sign = MD5Encode(signStr);
      // 封装请求参数
      let reqBody = {
        path: path,
        data: siteData,
        appKey: appKey,
        source: source,
        nonce: nonce,
        timestamp: timestamp,
        sign: sign
      };
      // 响应信息
      let result = postman("post", config.busUrl, "", JSON.stringify(reqBody));
      try {
        // 处理总线返回信息
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200" || result.data === undefined) {
          throw new Error(result.msg);
        }
        // 处理wms返回信息
        if (result.data.success !== true) {
          throw new Error(result.data.message);
        }
      } catch (e) {
        throw new Error("请求wms " + e);
      }
    }
    //多地址拆分wms取消挂起
    function cancelSplitAddressWms(params) {
      let appKey = config.busAppKey;
      let appSecret = config.busAppSecret;
      // 请求路径
      let path = "P13_014";
      // 来源
      let source = "P13";
      // 数据 Category 操作类型 1=挂起,2=取消
      let siteData = {
        UdhNo: params.udhNo
      };
      // 随机字符串 100000 899999
      let nonce = Math.round(Math.random() * 899999 + 100000).toString();
      // 时间戳
      let timestamp = Date.parse(new Date()).toString();
      // 数据
      siteData = JSON.stringify(siteData);
      let httpDataJson = JSON.stringify({
        appKey: appKey,
        data: siteData,
        nonce: nonce,
        path: path,
        source: source,
        timestamp: timestamp
      });
      let signStr = appSecret + httpDataJson + appSecret;
      let sign = MD5Encode(signStr);
      // 封装请求参数
      let reqBody = {
        path: path,
        data: siteData,
        appKey: appKey,
        source: source,
        nonce: nonce,
        timestamp: timestamp,
        sign: sign
      };
      // 响应信息
      let result = postman("post", config.busUrl, "", JSON.stringify(reqBody));
      try {
        // 处理总线返回信息
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200" || result.data === undefined) {
          throw new Error(result.msg);
        }
        // 处理wms返回信息
        if (result.data.outRst !== true) {
          throw new Error(result.data.message);
        }
      } catch (e) {
        throw new Error("请求wms " + e);
      }
    }
    function updateOaStatusToNcc(params) {
      let result = postman("post", config.nccUrl + "/servlet/MasterSalesUpOaStatus", "", JSON.stringify(params));
      try {
        result = JSON.parse(result);
        if (result.code + "" !== "200") {
          throw new Error(result.message);
        }
        try {
          result = postman("post", config.nccUrl + "/servlet/SoOrderdefUpdate", "", JSON.stringify(params));
        } catch (e) {}
      } catch (e) {
        throw new Error("NCC更新审批状态 " + e + ";参数:" + JSON.stringify(params));
      }
    }
    function isSendToWmsByNcc(params) {
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/JudgeOrderIsToWMSServlet", "", JSON.stringify(params));
      let returnFlag = true;
      try {
        result = JSON.parse(result);
        if (result.code + "" !== "200") {
          throw new Error(result.msg);
        } else if (result.data === undefined || result.data.length < 1) {
          throw new Error(JSON.stringify(result));
        } else {
          result.data.forEach((self) => {
            if (self.issendtowms + "" === "false") {
              returnFlag = false;
            }
          });
        }
        return returnFlag;
      } catch (e) {
        throw new Error("NCC校验 " + e + ";参数:" + JSON.stringify(params));
      }
    }
    function getMerchant(params) {
      let sql = "select code,name from aa.merchant.Merchant where id = '" + params.id + "'";
      let res;
      try {
        res = ObjectStore.queryByYonQL(sql, "productcenter");
      } catch (e) {
        throw new Error("查询客户档案详情(approveVerifyRule)" + e);
      }
      return res[0];
    }
    function getMerchantOld(params) {
      // 响应信息
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      try {
        // 转为JSON对象
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询客户档案详情 " + e);
      }
      return result.data;
    }
    function getPlatformCode(agentCode) {
      let req = { code: agentCode };
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/GetCtrlCustCode", "", JSON.stringify(req));
      try {
        result = JSON.parse(result);
        if (result.code + "" != "200") {
          throw new Error(result.msg);
        } else if (result.data == undefined || result.data.fxscode == undefined || result.data.fxscode == "") {
          throw new Error(`根据客户编码${agentCode}未查询到所属平台`);
        }
      } catch (e) {
        throw new Error(`获取所属平台${e};参数:${JSON.stringify(req)}`);
      }
      return result.data.fxscode;
    }
    function getNccOrderNo(bipOrderNo) {
      let req = {
        data: [
          {
            bipOrderNo: bipOrderNo
          }
        ]
      };
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/SaleOrderNOQueryServlet", "", JSON.stringify(req));
      try {
        result = JSON.parse(result);
        if (result.code + "" != "200") {
          throw new Error(result.msg);
        } else if (result.data == undefined || result.data[0].nccBillCode == undefined || result.data[0].nccBillCode == "") {
          throw new Error(`根据BIP订单号{bipOrderNo}未查询到NCC订单号`);
        }
      } catch (e) {
        throw new Error(`获取NCC订单号${e};参数:${JSON.stringify(req)}`);
      }
      return result.data[0].nccBillCode;
    }
    function getNowDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month > 9 ? month : "0" + month;
      day = day > 10 ? day : "0" + day;
      return year + "-" + month + "-" + day;
    }
    function updateOaStatus(status) {
      let body = { oaStatus: status };
      let url = "https://www.example.com/";
      return openLinker("POST", url, "GT80750AT4", JSON.stringify({ udhNo: code, data: body }));
    }
    function updateWmsStatus(status) {
      let body = { wmsStatus: status };
      let url = "https://www.example.com/";
      return openLinker("POST", url, "GT80750AT4", JSON.stringify({ udhNo: code, data: body }));
    }
    function updateRemark(remark) {
      let body = { remark: remark };
      let url = "https://www.example.com/";
      return openLinker("POST", url, "GT80750AT4", JSON.stringify({ udhNo: code, data: body }));
    }
    function deleteRow() {
      let body = { deletRow: 1 };
      let url = "https://www.example.com/";
      return openLinker("POST", url, "GT80750AT4", JSON.stringify({ udhNo: code, data: body }));
    }
    function updateSplitAddressStatusToNcc(billNo) {
      let req = {
        data: [
          {
            vbillcode: billNo,
            vdef64: "Y"
          }
        ]
      };
      let result = postman("post", config.nccUrl + "/servlet/SoOrderdefUpdate", "", JSON.stringify(req));
      throw new Error(result);
      result = JSON.parse(result);
      if (result.code + "" !== "200") {
        throw new Error(result.msg);
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });