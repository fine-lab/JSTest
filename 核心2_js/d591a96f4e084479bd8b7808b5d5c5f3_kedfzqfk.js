let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var billData = request.billData;
    //子表数据
    let bodys = billData.bodys;
    let contenttype = "application/x-www-form-urlencoded;charset=UTF-8";
    let header = { "Content-Type": contenttype };
    //合作伙伴编码（即顾客编码）
    let partnerID = "yourIDHere";
    //顺丰正式环境参数
    let tokenurl = "https://www.example.com/"; //token地址
    let url = "https://www.example.com/"; //接口地址
    let secret = "yoursecretHere"; //密钥
    let monthlyCard = "8300298252";
    let func1 = extrequire("ST.sf.querySFToken");
    let tokenUrl = tokenurl + "partnerID=" + partnerID + "&grantType=password&secret=" + secret;
    let tokenres = func1.execute(tokenUrl);
    if (tokenres.apiResultCode != "A1000") {
      throw new Error("获取顺丰token异常：" + tokenres.apiErrorMsg);
    }
    //访问令牌
    let accessToken = tokenres.accessToken;
    //接口服务代码,接口编码
    let serviceCode = "EXP_RECE_CREATE_ORDER"; //下订单接口
    //	请求唯一号UUID
    let requestID = uuid();
    //调用接口时间戳
    let timestamp = new Date().getTime();
    //拖寄物信息
    let cargoDetailsValue = new Array();
    for (var i = 0; i < bodys.length; i++) {
      let body = bodys[i];
      //查询物料
      let queryProduct = "select * from pc.product.Product where id=" + body.product;
      var productRes = ObjectStore.queryByYonQL(queryProduct, "productcenter");
      //查询单位
      let queryUnit = "select * from pc.unit.Unit where id=" + body.unit;
      var unitRes = ObjectStore.queryByYonQL(queryUnit, "productcenter");
      let cargoDetail = {
        name: productRes[0].name, //货物名称
        count: body.subQty, //货物数量
        unit: unitRes[0].name //货物单位
      };
      cargoDetailsValue.push(cargoDetail);
    }
    //收寄双方信息
    let contactInfoListValue = new Array();
    //寄方信息,客户指定  婷曼逸15386588004四川省泸州市龙马潭区安宁大道一段俊浩仓储
    let ContactInfo1 = {
      contactType: 1, //地址类型：1，寄件方信息2，到件方信息 3，委托人信息
      contact: "婷曼逸", //联系人–与公司必输一个
      mobile: "15386588004", //联系方手机–与联系方电话必输一个
      country: "CN", //国家或地区 2位代码 参照附录国家代码附件–国内传CN
      province: "四川省", //所在省级行政区名称，必须是标准的省级行政区名称
      city: "泸州市", //所在地级行政区名称
      county: "龙马潭区", //详细地址，若province/city字段的值不传，此字段必须包含省市信息，
      address: "四川省泸州市龙马潭区安宁大道一段俊浩仓储" //详细地址，若province/city字段的值不传，此字段必须包含省市信息，
    };
    contactInfoListValue.push(ContactInfo1);
    //收方信息
    let ContactInfo2 = {
      contactType: 2,
      contact: billData.cReceiver,
      mobile: billData.cReceiveMobile,
      country: "CN",
      province: "",
      city: "",
      county: "",
      address: billData.cReceiveAddress
    };
    contactInfoListValue.push(ContactInfo2);
    let msgData = {
      language: "zh-CN", //返回描述语语言
      orderId: billData.code, //客户订单号
      cargoDetails: cargoDetailsValue, //拖寄物信息
      contactInfoList: contactInfoListValue, //收寄双方信息
      monthlyCard: monthlyCard, //顺丰月结卡号
      payMethod: 1, //付款方式，支持以下值：1:寄方付 2:收方付 3:第三方付
      expressTypeId: 2, //快件产品类别，客户确认发"顺丰标快"
      isDocall: 0 //是否通过手持终端通知顺丰收派员上门收件，支持以下值：1：要求 0：不要求 (默认0) *电商退货固定传1
    };
    let body = {
      partnerID: partnerID,
      requestID: requestID,
      serviceCode: serviceCode,
      timestamp: timestamp,
      accessToken: accessToken,
      msgData: JSON.stringify(msgData)
    };
    url =
      url + "?partnerID=" + partnerID + "&requestID=" + requestID + "&serviceCode=" + serviceCode + "&timestamp=" + timestamp + "&accessToken=" + accessToken + "&msgData=" + JSON.stringify(msgData);
    var strResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    var strResponseObj = JSON.parse(strResponse);
    let message = "";
    if (strResponseObj.apiResultCode == "A1000") {
      let datas = JSON.parse(strResponseObj.apiResultData);
      if (datas.errorCode == "S0000") {
        let sfcode = datas.msgData.waybillNoInfoList[0].waybillNo;
        let updateFunc = extrequire("ST.backDesignerFunction.updateTrackNum");
        var updateData = { id: billData.id, tracknum: sfcode };
        let updateRes = updateFunc.execute(updateData);
        if (updateRes.error) {
          //回更销售出库“快递单号”异常
          throw new Error(updateRes.error.message);
        }
      } else {
        throw new Error("调用顺丰下订单接口异常：errorCode:" + datas.errorCode + ",errorMsg:" + datas.errorMsg);
      }
    } else {
      throw new Error("调用顺丰下订单接口异常：apiResultCode:" + strResponseObj.apiResultCode + ",apiErrorMsg:" + strResponseObj.apiErrorMsg);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });