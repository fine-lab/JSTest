let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取当前登录人的信息
    var res = AppContext();
    res = JSON.parse(res);
    //获取当前年月日时分秒
    let dateApi = extrequire("AT18526ADE08800003.util.getNowDate");
    let dateResult = dateApi.execute(null, new Date(new Date().getTime() + 28800000)); //当前时间
    let endDate = dateResult.dateView;
    let zhuIdList = "";
    let ziIDList = "";
    if (!param.isBiaotou) {
      for (var x = 0; x < param.selectData.length; x++) {
        if (!includes(zhuIdList, param.selectData[x].id)) {
          zhuIdList = zhuIdList + param.selectData[x].id + ",";
        }
        ziIDList = ziIDList + param.selectData[x].transferApplys_id + ",";
      }
    } else {
      for (var x = 0; x < param.selectData.length; x++) {
        if (!includes(zhuIdList, param.selectData[x].id)) {
          zhuIdList = zhuIdList + param.selectData[x].id + ",";
        }
      }
    }
    var limit = 1000;
    var idZhuList = split(substring(zhuIdList, 0, zhuIdList.length - 1), ",", limit); // ["today", "is", "Tuesday"]
    idZhuList = JSON.parse(idZhuList);
    let errorInfoMessage = "";
    for (var aa = 0; aa < idZhuList.length; aa++) {
      let bodyXiangqing = {};
      let urlXiangqing = "https://www.example.com/" + idZhuList[aa];
      let apiResponseXiangqing = openLinker("GET", urlXiangqing, "AT18526ADE08800003", JSON.stringify(bodyXiangqing));
      apiResponseXiangqing = JSON.parse(apiResponseXiangqing);
      if (apiResponseXiangqing.code != "200") {
        throw new Error(JSON.stringify(bodyXiangqing) + "------查询调拨订单详情异常，异常如下：------" + JSON.stringify(apiResponseXiangqing));
      }
      if (apiResponseXiangqing.data.status != "0") {
        errorInfoMessage = errorInfoMessage + apiResponseXiangqing.data.code + ",";
        continue;
      }
      let details = ""; //-------------------------------------------------------------------
      if (param.isBiaotou) {
        //表头
        for (var b = 0; b < apiResponseXiangqing.data.transferApplys.length; b++) {
          let xsdj = 0;
          if (
            apiResponseXiangqing.data.transferApplys[b].transferApplysDefineCharacter.attrext21 != undefined &&
            apiResponseXiangqing.data.transferApplys[b].transferApplysDefineCharacter.attrext21 != null
          ) {
            xsdj = apiResponseXiangqing.data.transferApplys[b].transferApplysDefineCharacter.attrext21 * 1 * (1 + (param.value * 1) / 100);
          }
          let bfbshuilv = apiResponseXiangqing.data.transferApplys[b].taxRate / 100;
          let hanshuiDanAmount = Math.round(xsdj * 1000000) / 1000000; //含税单价
          let hanshuiAmount = (apiResponseXiangqing.data.transferApplys[b].qty * Math.round(xsdj * 1000000)) / 1000000; //含税金额=数量*含税单价
          let shuiAmount = (hanshuiAmount / (1 * 1 + bfbshuilv * 1)) * bfbshuilv; //税额=含税金额÷（1＋税率）×税率
          let wushuiAmount = hanshuiAmount * 1 - shuiAmount * 1; //无税金额＝含税金额－税额
          let wushuiDanjiaAmount = wushuiAmount / apiResponseXiangqing.data.transferApplys[b].qty; //无税单价=无税金额/数量
          let detail = {
            product: apiResponseXiangqing.data.transferApplys[b].product, //是否必填：否，物料id或code
            product_cCode: apiResponseXiangqing.data.transferApplys[b].product_cCode, //是否必填：否，物料编码
            product_cName: apiResponseXiangqing.data.transferApplys[b].product_cName, //是否必填：否，物料名称
            product_model: apiResponseXiangqing.data.transferApplys[b].product_model, //是否必填：否，型号
            modelDescription: apiResponseXiangqing.data.transferApplys[b].modelDescription, //是否必填：否，规格说明
            manageClass: apiResponseXiangqing.data.transferApplys[b].manageClass, //是否必填：否，物料分类
            isSerialNoManage: apiResponseXiangqing.data.transferApplys[b].isSerialNoManage, //是否必填：否，是否序列号管理
            productsku: apiResponseXiangqing.data.transferApplys[b].productsku, //是否必填：否，商品SKUid或code（未启用特征必输）
            productsku_cCode: apiResponseXiangqing.data.transferApplys[b].productsku_cCode, //是否必填：否，物料sku编码
            productsku_cName: apiResponseXiangqing.data.transferApplys[b].productsku_cName, //是否必填：否，物料sku名称
            propertiesValue: apiResponseXiangqing.data.transferApplys[b].propertiesValue, //是否必填：否，规格
            isExpiryDateManage: apiResponseXiangqing.data.transferApplys[b].isExpiryDateManage, //是否必填：否，是否效期管理
            isBatchManage: apiResponseXiangqing.data.transferApplys[b].isBatchManage, //是否必填：否，是否批次管理
            batchno: apiResponseXiangqing.data.transferApplys[b].batchno, //是否必填：否，批次号
            producedate: apiResponseXiangqing.data.transferApplys[b].producedate, //是否必填：否，生产日期
            invaliddate: apiResponseXiangqing.data.transferApplys[b].invaliddate, //是否必填：否，有效期至
            expireDateNo: apiResponseXiangqing.data.transferApplys[b].expireDateNo, //是否必填：否，保质期
            expireDateUnit: apiResponseXiangqing.data.transferApplys[b].expireDateUnit, //是否必填：否，保质期单位, 1:年、2:月、6:天、
            mainid: apiResponseXiangqing.data.transferApplys[b].mainid, //是否必填：否，主表id
            id: apiResponseXiangqing.data.transferApplys[b].id, //是否必填：否，子表ID
            pubts: apiResponseXiangqing.data.transferApplys[b].pubts, //是否必填：否，时间戳
            qty: apiResponseXiangqing.data.transferApplys[b].qty, //是否必填：是，数量
            unit: apiResponseXiangqing.data.transferApplys[b].unit, //是否必填：否，主计量id或code
            unitName: apiResponseXiangqing.data.transferApplys[b].unitName, //是否必填：否，主计量
            invExchRate: apiResponseXiangqing.data.transferApplys[b].invExchRate, //是否必填：是，换算率
            subQty: apiResponseXiangqing.data.transferApplys[b].subQty, //是否必填：是，件数
            stockUnitId: apiResponseXiangqing.data.transferApplys[b].stockUnitId, //是否必填：否，库存单位id或code
            stockUnit_name: apiResponseXiangqing.data.transferApplys[b].stockUnit_name, //是否必填：否，库存单位名称
            unitExchangeType: apiResponseXiangqing.data.transferApplys[b].unitExchangeType, //是否必填：否，库存换算率换算方式
            unit_Precision: apiResponseXiangqing.data.transferApplys[b].unit_Precision, //是否必填：否，主计量精度
            stockUnitId_Precision: apiResponseXiangqing.data.transferApplys[b].stockUnitId_Precision, //是否必填：否，库存单位精度
            isCanModPrice: apiResponseXiangqing.data.transferApplys[b].isCanModPrice, //是否必填：否，价格可改, true:是、false:否、
            taxUnitPriceTag: apiResponseXiangqing.data.transferApplys[b].taxUnitPriceTag, //是否必填：否，价格含税, true:是、false:否、
            project: apiResponseXiangqing.data.transferApplys[b].project, //是否必填：否，项目id或code
            project_name: apiResponseXiangqing.data.transferApplys[b].project_name, //是否必填：否，项目名称
            sourceid: apiResponseXiangqing.data.transferApplys[b].sourceid, //是否必填：否，上游单据主表id
            sourceautoid: apiResponseXiangqing.data.transferApplys[b].sourceautoid, //是否必填：否，上游单据子表id
            source: apiResponseXiangqing.data.transferApplys[b].source, //是否必填：否，上游单据类型
            upcode: apiResponseXiangqing.data.transferApplys[b].upcode, //是否必填：否，上游单据号
            memo: apiResponseXiangqing.data.transferApplys[b].memo, //是否必填：否，备注
            oriMoney: Math.round(wushuiAmount * 100) / 100, //是否必填：否，无税金额
            natMoney: Math.round(wushuiAmount * 100) / 100, //是否必填：否，本币无税金额
            oriUnitPrice: Math.round(wushuiDanjiaAmount * 1000000) / 1000000, //是否必填：否，无税单价
            natUnitPrice: Math.round(wushuiDanjiaAmount * 1000000) / 1000000, //是否必填：否，本币无税单价
            oriTax: Math.round(shuiAmount * 100) / 100, //是否必填：否，税额
            natTax: Math.round(shuiAmount * 100) / 100, //是否必填：否，本币税额
            oriSum: Math.round(hanshuiAmount * 100) / 100, //是否必填：否，含税金额
            natSum: Math.round(hanshuiAmount * 100) / 100, //是否必填：否，本币含税金额
            oriTaxUnitPrice: Math.round(hanshuiDanAmount * 1000000) / 1000000, //是否必填：否，含税单价
            natTaxUnitPrice: Math.round(hanshuiDanAmount * 1000000) / 1000000, //是否必填：否，本币含税单价
            transferApplysDefineCharacter: {
              //是否必填：否，
              id: apiResponseXiangqing.data.transferApplys[b].id,
              attrext1: param.value
            },
            _status: "Update"
          };
          details = details + JSON.stringify(detail) + ",";
        }
      } else if (!param.isBiaotou) {
        //表头+表体
        for (var b = 0; b < apiResponseXiangqing.data.transferApplys.length; b++) {
          if (includes(ziIDList, apiResponseXiangqing.data.transferApplys[b].id)) {
            let xsdj = 0;
            if (
              apiResponseXiangqing.data.transferApplys[b].transferApplysDefineCharacter.attrext21 != undefined &&
              apiResponseXiangqing.data.transferApplys[b].transferApplysDefineCharacter.attrext21 != null
            ) {
              xsdj = apiResponseXiangqing.data.transferApplys[b].transferApplysDefineCharacter.attrext21 * 1 * (1 + (param.value * 1) / 100);
            }
            let bfbshuilv = apiResponseXiangqing.data.transferApplys[b].taxRate / 100;
            let hanshuiDanAmount = Math.round(xsdj * 1000000) / 1000000; //含税单价
            let hanshuiAmount = (apiResponseXiangqing.data.transferApplys[b].qty * Math.round(xsdj * 1000000)) / 1000000; //含税金额=数量*含税单价
            let shuiAmount = (hanshuiAmount / (1 * 1 + bfbshuilv * 1)) * bfbshuilv; //税额=含税金额÷（1＋税率）×税率
            let wushuiAmount = hanshuiAmount * 1 - shuiAmount * 1; //无税金额＝含税金额－税额
            let wushuiDanjiaAmount = wushuiAmount / apiResponseXiangqing.data.transferApplys[b].qty; //无税单价=无税金额/数量
            let detail = {
              product: apiResponseXiangqing.data.transferApplys[b].product, //是否必填：否，物料id或code
              product_cCode: apiResponseXiangqing.data.transferApplys[b].product_cCode, //是否必填：否，物料编码
              product_cName: apiResponseXiangqing.data.transferApplys[b].product_cName, //是否必填：否，物料名称
              product_model: apiResponseXiangqing.data.transferApplys[b].product_model, //是否必填：否，型号
              modelDescription: apiResponseXiangqing.data.transferApplys[b].modelDescription, //是否必填：否，规格说明
              manageClass: apiResponseXiangqing.data.transferApplys[b].manageClass, //是否必填：否，物料分类
              isSerialNoManage: apiResponseXiangqing.data.transferApplys[b].isSerialNoManage, //是否必填：否，是否序列号管理
              productsku: apiResponseXiangqing.data.transferApplys[b].productsku, //是否必填：否，商品SKUid或code（未启用特征必输）
              productsku_cCode: apiResponseXiangqing.data.transferApplys[b].productsku_cCode, //是否必填：否，物料sku编码
              productsku_cName: apiResponseXiangqing.data.transferApplys[b].productsku_cName, //是否必填：否，物料sku名称
              propertiesValue: apiResponseXiangqing.data.transferApplys[b].propertiesValue, //是否必填：否，规格
              isExpiryDateManage: apiResponseXiangqing.data.transferApplys[b].isExpiryDateManage, //是否必填：否，是否效期管理
              isBatchManage: apiResponseXiangqing.data.transferApplys[b].isBatchManage, //是否必填：否，是否批次管理
              batchno: apiResponseXiangqing.data.transferApplys[b].batchno, //是否必填：否，批次号
              producedate: apiResponseXiangqing.data.transferApplys[b].producedate, //是否必填：否，生产日期
              invaliddate: apiResponseXiangqing.data.transferApplys[b].invaliddate, //是否必填：否，有效期至
              expireDateNo: apiResponseXiangqing.data.transferApplys[b].expireDateNo, //是否必填：否，保质期
              expireDateUnit: apiResponseXiangqing.data.transferApplys[b].expireDateUnit, //是否必填：否，保质期单位, 1:年、2:月、6:天、
              mainid: apiResponseXiangqing.data.transferApplys[b].mainid, //是否必填：否，主表id
              id: apiResponseXiangqing.data.transferApplys[b].id, //是否必填：否，子表ID
              pubts: apiResponseXiangqing.data.transferApplys[b].pubts, //是否必填：否，时间戳
              qty: apiResponseXiangqing.data.transferApplys[b].qty, //是否必填：是，数量
              unit: apiResponseXiangqing.data.transferApplys[b].unit, //是否必填：否，主计量id或code
              unitName: apiResponseXiangqing.data.transferApplys[b].unitName, //是否必填：否，主计量
              invExchRate: apiResponseXiangqing.data.transferApplys[b].invExchRate, //是否必填：是，换算率
              subQty: apiResponseXiangqing.data.transferApplys[b].subQty, //是否必填：是，件数
              stockUnitId: apiResponseXiangqing.data.transferApplys[b].stockUnitId, //是否必填：否，库存单位id或code
              stockUnit_name: apiResponseXiangqing.data.transferApplys[b].stockUnit_name, //是否必填：否，库存单位名称
              unitExchangeType: apiResponseXiangqing.data.transferApplys[b].unitExchangeType, //是否必填：否，库存换算率换算方式
              unit_Precision: apiResponseXiangqing.data.transferApplys[b].unit_Precision, //是否必填：否，主计量精度
              stockUnitId_Precision: apiResponseXiangqing.data.transferApplys[b].stockUnitId_Precision, //是否必填：否，库存单位精度
              isCanModPrice: apiResponseXiangqing.data.transferApplys[b].isCanModPrice, //是否必填：否，价格可改, true:是、false:否、
              taxUnitPriceTag: apiResponseXiangqing.data.transferApplys[b].taxUnitPriceTag, //是否必填：否，价格含税, true:是、false:否、
              project: apiResponseXiangqing.data.transferApplys[b].project, //是否必填：否，项目id或code
              project_name: apiResponseXiangqing.data.transferApplys[b].project_name, //是否必填：否，项目名称
              sourceid: apiResponseXiangqing.data.transferApplys[b].sourceid, //是否必填：否，上游单据主表id
              sourceautoid: apiResponseXiangqing.data.transferApplys[b].sourceautoid, //是否必填：否，上游单据子表id
              source: apiResponseXiangqing.data.transferApplys[b].source, //是否必填：否，上游单据类型
              upcode: apiResponseXiangqing.data.transferApplys[b].upcode, //是否必填：否，上游单据号
              memo: apiResponseXiangqing.data.transferApplys[b].memo, //是否必填：否，备注
              oriMoney: Math.round(wushuiAmount * 100) / 100, //是否必填：否，无税金额
              natMoney: Math.round(wushuiAmount * 100) / 100, //是否必填：否，本币无税金额
              oriUnitPrice: Math.round(wushuiDanjiaAmount * 1000000) / 1000000, //是否必填：否，无税单价
              natUnitPrice: Math.round(wushuiDanjiaAmount * 1000000) / 1000000, //是否必填：否，本币无税单价
              oriTax: Math.round(shuiAmount * 100) / 100, //是否必填：否，税额
              natTax: Math.round(shuiAmount * 100) / 100, //是否必填：否，本币税额
              oriSum: Math.round(hanshuiAmount * 100) / 100, //是否必填：否，含税金额
              natSum: Math.round(hanshuiAmount * 100) / 100, //是否必填：否，本币含税金额
              oriTaxUnitPrice: Math.round(hanshuiDanAmount * 1000000) / 1000000, //是否必填：否，含税单价
              natTaxUnitPrice: Math.round(hanshuiDanAmount * 1000000) / 1000000, //是否必填：否，本币含税单价
              transferApplysDefineCharacter: {
                //是否必填：否，
                id: apiResponseXiangqing.data.transferApplys[b].id,
                attrext1: param.value
              },
              _status: "Update"
            };
            details = details + JSON.stringify(detail) + ",";
          }
        }
      }
      let body = {
        data: {
          outorg: apiResponseXiangqing.data.outorg, //是否必填：是，调出组织id或code
          outaccount: apiResponseXiangqing.data.outaccount, //是否必填：是，调出会计主体id或code
          code: apiResponseXiangqing.data.code, //是否必填：是，单据编号
          vouchdate: apiResponseXiangqing.data.vouchdate, //是否必填：是，单据日期
          bustype: apiResponseXiangqing.data.bustype, //是否必填：是，交易类型id或code
          inorg: apiResponseXiangqing.data.inorg, //是否必填：是，调入组织id或code
          inaccount: apiResponseXiangqing.data.inaccount, //是否必填：是，调入会计主体id或code
          id: apiResponseXiangqing.data.id, //是否必填：否，主表ID
          pubts: apiResponseXiangqing.data.pubts, //是否必填：否，时间戳（update时必填）
          dplanshipmentdate: apiResponseXiangqing.data.dplanshipmentdate, //是否必填：是，计划发货日期
          dplanarrivaldate: apiResponseXiangqing.data.dplanarrivaldate, //是否必填：是，计划到货日期
          modifier: res.currentUser.name, //是否必填：否，修改人，修改时填写，新增时不填
          modifyTime: endDate, //是否必填：否，修改时间，修改时填写，新增时不填
          modifyDate: endDate.substring(0, 10) + " 00:00:00", //是否必填：否，修改日期，修改时填写，新增时不填
          transferApplys: JSON.parse("[" + details.substring(0, details.length - 1) + "]"),
          _status: "Update"
        }
      };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "AT18526ADE08800003", JSON.stringify(body));
      apiResponse = JSON.parse(apiResponse);
      if (apiResponse.code != "200") {
        throw new Error("------修改调拨订单批改功能异常，异常如下：------" + JSON.stringify(apiResponse) + ";参数如下：" + JSON.stringify(body));
      }
    }
    if (errorInfoMessage != "") {
      throw new Error("单据号" + errorInfoMessage + "处于非开立状态，无法修改加价比例！！！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });