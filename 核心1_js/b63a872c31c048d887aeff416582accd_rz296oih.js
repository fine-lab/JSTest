let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取参数
    let data = param.data;
    let appCode = "PU";
    let ids = data.map((item, i) => {
      return item.id;
    });
    if (ids.length == 0) {
      return { message: "未选中数据" };
    }
    let snInSqlCond = "('" + ids.join("','") + "')";
    let yonQl =
      "select *,busType.name,busType.code, (select *,taxitems.code from arrivalOrders) arrivalOrders , org.name orgName,t1.name orignProvince,t2.name orignCity,t3.name destProvince,t4.name destCity from pu.arrivalorder.ArrivalOrder ";
    yonQl += "left join  org.func.BaseOrg org on purchaseOrg = org.id ";
    yonQl += "left join aa.regioncorp.RegionCorp t1 on extendFromProvince = t1.id ";
    yonQl += "left join aa.regioncorp.RegionCorp t2 on extendFromCity = t2.id ";
    yonQl += "left join aa.regioncorp.RegionCorp t3 on extendTargetProvince = t3.id ";
    yonQl += "left join aa.regioncorp.RegionCorp t4 on extendTargetCity = t4.id ";
    yonQl += "where id in " + snInSqlCond;
    var res = ObjectStore.queryByYonQL(yonQl);
    //筛选出整机的进行同步 不是整机的不用同步
    res = res.filter((item, i) => {
      if (item.busType_code == "A35001" || item.busType_code == "A35002") {
        return item;
      }
    });
    if (res.length == 0) {
      return { message: "无需同步" };
    }
    //构造接口入参
    let syncParam = [];
    res.map((item, i) => {
      let sysObj = {};
      //到货单号
      sysObj.orderNo = item.code;
      //需求单号
      sysObj.requisitionNo = item.extendReqno;
      //客户名称 todo需要转成name
      sysObj.consigneeName = item.orgName;
      //收货人 todo 需要传什么内容
      sysObj.consignee = item.extendConsignee;
      //收货人联系电话
      sysObj.consigneeTel = item.extendConCall;
      //起始省份 todo名称
      sysObj.orignProvince = item.orignProvince;
      //起始城市
      sysObj.orignCity = item.orignCity;
      //目的省份
      sysObj.destProvince = item.destProvince;
      //目的城市
      sysObj.destCity = item.destCity;
      //客户收货地址 收货详细地址
      sysObj.consigneeAdr = item.extendClientAddr;
      //运输方式 //普通汽运、陆运（专车、普通）、海运、空运
      if (item.extendTransType && item.extendTransType == "1") {
        sysObj.transportType = "普通汽运";
      } else if (item.extendTransType && item.extendTransType == "2") {
        sysObj.transportType = "陆运（专车、普通）";
      } else if (item.extendTransType && item.extendTransType == "3") {
        sysObj.transportType = "海运";
      } else if (item.extendTransType && item.extendTransType == "4") {
        sysObj.transportType = "空运";
      }
      //车型 1 of10Ton、1 of 53FEET（一般整车运输用得上）、零担，中外运提供车型对照表
      if (item.extendCarType && item.extendCarType == "1") {
        sysObj.carType = "1 of 3TON";
      } else if (item.extendCarType && item.extendCarType == "2") {
        sysObj.carType = "1 of 12TON";
      } else if (item.extendCarType && item.extendCarType == "3") {
        sysObj.carType = "1 of 5TON";
      } else if (item.extendCarType && item.extendCarType == "4") {
        sysObj.carType = "1 of 10TON";
      } else if (item.extendCarType && item.extendCarType == "5") {
        sysObj.carType = "1 of 8TON";
      } else if (item.extendCarType && item.extendCarType == "6") {
        sysObj.carType = "1 of 1.5TON";
      } else if (item.extendCarType && item.extendCarType == "7") {
        sysObj.carType = "1 of 40FEET";
      } else if (item.extendCarType && item.extendCarType == "8") {
        sysObj.carType = "1 of 53FEET";
      } else if (item.extendCarType && item.extendCarType == "9") {
        sysObj.carType = "零担";
      }
      sysObj.totalWeight = item.extendWeight;
      sysObj.totalVolume = item.extendVolume;
      sysObj.totalPieces = item.extendCount;
      sysObj.weightUom = item.extendWeightUnit;
      sysObj.volumeUom = item.extendVoluUnit;
      //客户备注
      sysObj.customerRemark = item.extendClientRemark;
      //订单状态 0:作废，1:新增，作废时，重新推送的单，发货单号不会变化
      sysObj.active = "1";
      //服务等级  标准、加急
      if (item.extendLevel && item.extendLevel == "1") {
        sysObj.serviceLevel = "标准";
      } else if (item.extendLevel && item.extendLevel == "2") {
        sysObj.serviceLevel = "加急";
      }
      //提货时间
      sysObj.deliveryTime = item.extendPickDate;
      //提货联系人
      sysObj.deliveryContactName = item.extendPickMan;
      // 提货联系电话
      sysObj.deliveryContactTel = item.extendPickMan;
      //提货地址
      sysObj.deliveryContactAdr = item.extendPickAddr;
      //表体字段
      let details = [];
      let arrivalOrdersList = item.arrivalOrders;
      if (!arrivalOrdersList || arrivalOrdersList == null) {
        syncParam.push(sysObj);
        return;
      }
      arrivalOrdersList.map((child, j) => {
        let detail = {};
        //行号
        detail.seqNo = "" + child.lineno;
        //箱名 todo 数算互联有箱名，中融信通没箱名
        detail.packageNo = child.extendPackageNo;
        //订单类型
        //物料编码
        detail.itemCode = child.supplier_productcode;
        //物料描述
        detail.itemDesc = child.supplier_productname;
        //发货数量Qty
        detail.qty = child.purchaseSendQty;
        //单位UOM
        detail.uom = child.priceUOM;
        //备注Remark
        detail.REMARK = child.memo;
        //明细重量
        detail.detailWeight = child.extendDetailWeight;
        //明细体积
        detail.detailVolume = child.extendDetailVolume;
        //重量单位
        detail.detailWeightUom = child.extendDetailWeightUom;
        //体积单位
        detail.detailVolumeUom = child.extendDetailVolumeUom;
        details.push(detail);
      });
      sysObj.detail = details;
      syncParam.push(sysObj);
    });
    //获取配置信息
    let func = extrequire("PU.pubFunciton.configFun");
    let funRes = func.execute();
    //获取中外运token
    let tokenHeader = { "Content-Type": "application/x-www-form-urlencoded" };
    let tokenUrl = funRes.BASE.tokenUrl + "?userCode=" + funRes.BASE.userCode + "&key=" + funRes.BASE.key + "&sign=" + funRes.BASE.sign;
    let tokenBody = { userCode: funRes.BASE.userCode, key: funRes.BASE.key, sign: funRes.BASE.sign };
    let tokenResponse = postman("post", tokenUrl, JSON.stringify(tokenHeader), JSON.stringify(tokenBody));
    // 同步中外运
    tokenResponse = JSON.parse(tokenResponse);
    let url = funRes.BASE.arrivalZjTozyyUrl;
    let header = { access_token: tokenResponse.object.access_token };
    let node = { node: { appKey: funRes.BASE.zjAppKey, appId: funRes.BASE.zjAppId, data: syncParam } };
    let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(node));
    apiResponse = JSON.parse(apiResponse);
    let logisticStatus = "";
    if (apiResponse.isSuccess) {
      logisticStatus = apiResponse.isSuccess == "Y" ? 2 : 1;
    } else {
      logisticStatus = apiResponse.data.isSuccess == "Y" ? 2 : 1;
    }
    //回写单据
    let detailUrl = funRes.BASE.arrivalDetailUrl;
    let saveUrl = funRes.BASE.arrivalSaveUrl;
    res.map((item, i) => {
      apiResponse = openLinker("GET", detailUrl + "?id=" + item.id, appCode, null);
      let jsonRes = JSON.parse(apiResponse);
      let body = {};
      body.resubmitCheckKey = new Date().getTime().toString();
      body.id = item.id;
      body.purchaseOrg = jsonRes.data.purchaseOrg;
      body.org = jsonRes.data.org;
      body.inInvoiceOrg = jsonRes.data.inInvoiceOrg;
      body.isContract = jsonRes.data.isContract;
      body.vouchdate = jsonRes.data.vouchdate;
      body.busType = jsonRes.data.busType;
      body["vendor"] = jsonRes.data["vendor"];
      body.invoiceSupplier = jsonRes.data.invoiceSupplier;
      body.currency = jsonRes.data.currency;
      body.natCurrency = jsonRes.data.natCurrency;
      body.exchRateType = jsonRes.data.exchRateType;
      body.exchRate = jsonRes.data.exchRate;
      body.createDate = jsonRes.data.createDate;
      body.extendLogisticStatus = logisticStatus;
      body._status = "Update";
      body.code = jsonRes.data.code;
      let queryArrivalOrders = jsonRes.data.arrivalOrders;
      let arrivalOrders = item.arrivalOrders;
      let arrivalOrder = {};
      queryArrivalOrders.map((order, i) => {
        arrivalOrders.map((child, j) => {
          if (order.id == child.id) {
            arrivalOrder = {
              id: order.id,
              _status: "Update",
              source: order["source"],
              makeRuleCode: order.makeRuleCode,
              product: order["product"],
              oriUnitPrice: order.oriUnitPrice,
              oriTaxUnitPrice: order.oriTaxUnitPrice,
              oriMoney: order.oriMoney,
              oriSum: order.oriSum,
              oriTax: order.oriTax,
              taxitems_code: child.taxitems_code,
              natUnitPrice: order.natUnitPrice,
              natTaxUnitPrice: order.natTaxUnitPrice,
              natMoney: order.natMoney,
              natSum: order.natSum,
              natTax: order.natTax,
              qty: order.qty,
              sourceautoid: order.sourceautoid,
              sourceid: order.sourceid,
              unit: order.unit,
              purUOM: order.purUOM,
              invExchRate: order.invExchRate,
              priceUOM: order.priceUOM,
              invPriceExchRate: order.invPriceExchRate,
              unitExchangeType: order.unitExchangeType,
              isLogisticsRelated: order.isLogisticsRelated,
              unitExchangeTypePrice: order.unitExchangeTypePrice,
              subQty: order.subQty,
              priceQty: order.priceQty,
              productsku: order.productsku,
              firstsourceautoid: order.firstsourceautoid,
              firstsource: order.firstsource,
              firstupcode: order.firstupcode,
              isGift: order.isGift,
              firstsourceid: order.firstsourceid,
              taxRate: order.taxRate,
              upcode: order.upcode,
              taxitems: order.taxitems,
              discountTaxType: order.discountTaxType
            };
            return arrivalOrder;
          }
        });
      });
      body.arrivalOrders = [arrivalOrder];
      let saveParam = JSON.stringify({ data: body });
      let saveResponse = openLinker("POST", saveUrl, appCode, saveParam);
      let savejsonRes = JSON.parse(saveResponse);
      if (savejsonRes.code != 200) {
        throw new Error(saveResponse);
      }
    });
    return { message: "同步成功" };
  }
}
exports({ entryPoint: MyTrigger });