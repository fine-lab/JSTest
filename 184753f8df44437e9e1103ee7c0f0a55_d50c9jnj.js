let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ids = request.ids;
    let shiSql = "select id,code,createTime,errorMessage,(select id,country,oriRequestedQuantity,cpd,";
    shiSql += " rpd,orderMode,shipToLocation,shipToContact,shipToContactPhone,";
    shiSql += " item_type,deviceSupplier,batchNumber,orders_mapping,itemCode,cabinetNodeCode,quantitiy ";
    shiSql += " from shippingschedulebList) shippingschedulebList from GT37595AT2.GT37595AT2.shippingschedule ";
    shiSql += " where id in ('" + ids.join("','") + "')";
    let shiRes = ObjectStore.queryByYonQL(shiSql);
    let sconfigFunc = extrequire("GT37595AT2.commonFun.sConfigFunc");
    let sconfig = sconfigFunc.execute();
    let tenantid = ObjectStore.env().tenantId;
    let tenantSql = "select * from GT37595AT2.GT37595AT2.currTenantOrgBuyMessage where tenantId = '" + tenantid + "'";
    var restenant = ObjectStore.queryByYonQL(tenantSql);
    // 组织
    let orgSql = "select * from org.func.BaseOrg where code = '" + restenant[0].orgBuyCode + "'";
    var res = ObjectStore.queryByYonQL(orgSql, "orgcenter");
    // 供应商
    let vendorSql =
      "select id,name,con.contactmobile,con.defaultcontact,con.contactphone,con.contactname from aa.vendor.Vendor left join aa.vendor.VendorContacts con on con.vendor = id where code = '" +
      sconfig.BASE.vendorCode +
      "'";
    let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
    // 采购员
    let operatorSql = "select id,code,name,mobile from bd.staff.StaffNew where code in (" + sconfig.BASE.operatorCode + ")";
    let operatorRes = ObjectStore.queryByYonQL(operatorSql, "upu");
    if (operatorRes.length == 1) {
      operatorRes.push(operatorRes[0]);
    }
    // 生成采购订单发送待办，查询配置人
    let persons = [];
    let toOrdersSql = "select * from GT37595AT2.GT37595AT2.toOrdersPerson where noticeType = '1'";
    let toOrdersRes = ObjectStore.queryByYonQL(toOrdersSql);
    if (toOrdersRes && toOrdersRes.length > 0) {
      let userIdUrl = "https://www.example.com/";
      for (var to = 0; to < toOrdersRes.length; to++) {
        // 调接口获取yyUserId
        let userIdResponse = openLinker("POST", userIdUrl, "GT37595AT2", JSON.stringify({ searchcode: toOrdersRes[to].telNo }));
        userIdResponse = JSON.parse(userIdResponse);
        if (userIdResponse) {
          if (userIdResponse.code == "200") {
            if (userIdResponse.data && userIdResponse.data.content[0] && userIdResponse.data.content[0].userId) {
              persons.push(userIdResponse.data.content[0].userId);
            }
          }
        }
      }
    }
    var currentUser = JSON.parse(AppContext()).currentUser;
    // 提示语处理
    let errAlert = [];
    let successAlert = [];
    let repeatAlert = [];
    let updateShiData = []; // 无法生成采购订单的数据，回写异常信息 或 生成采购订单回写采购订单信息到要货计划
    let reg = /生成采购订单失败！失败原因：.*\n*/g;
    for (let i = 0; i < shiRes.length; i++) {
      let orderInsertData = {};
      orderInsertData.resubmitCheckKey = uuid().replace(/-/g, "");
      orderInsertData.bustype_code = "A20002";
      orderInsertData.currency_code = "CNY";
      orderInsertData.exchRate = 1;
      orderInsertData.exchRateType = "01";
      orderInsertData.invoiceVendor_code = sconfig.BASE.vendorCode;
      orderInsertData.natCurrency_code = "CNY";
      orderInsertData.org_code = res[0].code;
      orderInsertData.extend71 = shiRes[i].id;
      orderInsertData.extend72 = "SS";
      orderInsertData._status = "Insert";
      orderInsertData.vendor_code = sconfig.BASE.vendorCode;
      orderInsertData.vouchdate = shiRes[i].createTime.substring(0, 10);
      let vouchDa = new Date(Date.parse(shiRes[i].createTime.replace(/-/g, "/")));
      orderInsertData.isContract = true;
      orderInsertData.contact = vendorRes[0].con_contactname;
      if (vendorRes[0].con_contactmobile) {
        orderInsertData.contactTel = vendorRes[0].con_contactmobile;
      } else {
        orderInsertData.contactTel = vendorRes[0].con_contactphone;
      }
      // 采购员信息
      let buyerTel = "";
      if (operatorRes.length == 2) {
        if (!shiRes[i].shippingschedulebList[0].country || shiRes[i].shippingschedulebList[0].country == "China") {
          orderInsertData.operator = operatorRes[1].id;
          buyerTel = operatorRes[1].mobile;
        } else {
          orderInsertData.operator = operatorRes[0].id;
          buyerTel = operatorRes[0].mobile;
        }
      }
      // 采购订单明细
      let zeroLine = []; // 需求数量为0的行号
      let batchNumberMap = new Map(); // 同一batchNumer的要货明细行生成同一个采购订单
      let shippingschedulebList = shiRes[i].shippingschedulebList;
      let updateMappingList = []; // 与采购订单行ID对应关系更新
      let allQtyMap = new Map(); // 需求数量总数，按采购订单为维度
      let repeatBatchNo = []; // 已生成过采购订单的批次号
      let cabinetMap = new Map(); // 冷风整机柜编码
      for (let j = 0; j < shippingschedulebList.length; j++) {
        let itemSql = "";
        let quantitiyNum = 0;
        if (shippingschedulebList[j].cabinetNodeCode) {
          // 风冷整机
          if (cabinetMap.has(shippingschedulebList[j].cabinetNodeCode)) {
            // 已存在，去重合并只生成一条
            continue;
          }
          quantitiyNum = shippingschedulebList[j].quantitiy ? Number(shippingschedulebList[j].quantitiy) : 0;
          itemSql =
            "select manageClass.code,manageClass.name,detail.shortName,detail.purchasePriceUnit.code,detail.purchaseUnit.code,unit.code,* from pc.product.Product where detail.stopstatus = 'false' and detail.shortName = '" +
            shippingschedulebList[j].cabinetNodeCode +
            "'";
        } else {
          quantitiyNum = shippingschedulebList[j].oriRequestedQuantity ? Number(shippingschedulebList[j].oriRequestedQuantity) : 0;
          itemSql =
            "select manageClass.code,manageClass.name,detail.shortName,detail.purchasePriceUnit.code,detail.purchaseUnit.code,unit.code,* from pc.product.Product where detail.stopstatus = 'false' and model = '" +
            shippingschedulebList[j].itemCode +
            "'";
        }
        // 需求数量为0，不允许生成采购订单，并记得异常信息到要货计划
        if (quantitiyNum == 0) {
          zeroLine.push(j + 1);
          batchNumberMap.set(shippingschedulebList[j].batchNumber + "", "error");
          continue;
        }
        // 查询采购订单是否已经生成过了，不允许重复生成
        let repeatSql = "";
        if (shippingschedulebList[j].batchNumber) {
          repeatSql = "select count(1) cc from pu.purchaseorder.PurchaseOrder where extend71 = '" + shiRes[i].id + "' and extend76 = '" + shippingschedulebList[j].batchNumber + "'";
        } else {
          repeatSql = "select count(1) cc from pu.purchaseorder.PurchaseOrder where extend71 = '" + shiRes[i].id + "' and extend76 is null";
        }
        let repeatRes = ObjectStore.queryByYonQL(repeatSql, "upu");
        if (repeatRes && repeatRes[0].cc > 0) {
          // 已生成
          repeatBatchNo.push(shippingschedulebList[j].batchNumber);
          continue;
        }
        let purchaseOrder = {};
        let itemRes = ObjectStore.queryByYonQL(itemSql, "productcenter");
        let itemCodeChange = "";
        let purchasePriceUnit = "";
        let purchaseUnit = "";
        let unitCode = "";
        let manageClassName = "";
        if (itemRes && itemRes.length > 0 && itemRes[0].code) {
          itemCodeChange = itemRes[0].code;
          purchasePriceUnit = itemRes[0].detail_purchasePriceUnit_code;
          purchaseUnit = itemRes[0].detail_purchaseUnit_code;
          unitCode = itemRes[0].unit_code;
          manageClassName = itemRes[0].manageClass_name;
        }
        // 用于方便后面给主表的标题逻辑处理
        shippingschedulebList[j].manageClassName = manageClassName;
        let ordersMapping = uuid();
        purchaseOrder.inInvoiceOrg_code = res[0].code;
        purchaseOrder.inOrg_code = res[0].code;
        purchaseOrder.invExchRate = 1;
        purchaseOrder.natMoney = 0;
        purchaseOrder.natSum = 0;
        purchaseOrder.natTax = 0;
        purchaseOrder.natTaxUnitPrice = 0;
        purchaseOrder.natUnitPrice = 0;
        purchaseOrder.oriMoney = 0;
        purchaseOrder.oriSum = 0;
        purchaseOrder.oriTax = 0;
        purchaseOrder.oriTaxUnitPrice = 0;
        purchaseOrder.oriUnitPrice = 0;
        purchaseOrder.taxitems_code = "VAT13";
        purchaseOrder.priceQty = quantitiyNum;
        purchaseOrder.qty = quantitiyNum;
        purchaseOrder.subQty = quantitiyNum;
        purchaseOrder.allQty = quantitiyNum;
        purchaseOrder.product_cCode = itemCodeChange;
        purchaseOrder.priceUOM_Code = purchasePriceUnit;
        purchaseOrder.purUOM_Code = purchaseUnit;
        purchaseOrder.unitExchangeTypePrice = "0";
        purchaseOrder.unitExchangeType = "0";
        purchaseOrder.invPriceExchRate = 1;
        purchaseOrder.unit_code = unitCode;
        purchaseOrder.extendProDeliTime = shippingschedulebList[j].cpd;
        purchaseOrder.extendOrdersMapping = ordersMapping;
        if (shippingschedulebList[j].rpd) {
          let rpdDate = new Date(Date.parse(shippingschedulebList[j].rpd.replace(/-/g, "/")));
          if (vouchDa > rpdDate) {
            rpdDate = orderInsertData.vouchdate;
          } else {
            rpdDate = shippingschedulebList[j].rpd;
          }
          purchaseOrder.recieveDate = rpdDate;
        } else {
          purchaseOrder.recieveDate = orderInsertData.vouchdate;
        }
        purchaseOrder.manageClassName = manageClassName;
        purchaseOrder.country = shippingschedulebList[j].country;
        purchaseOrder.oriRequestedQuantity = quantitiyNum;
        purchaseOrder.orderMode = shippingschedulebList[j].orderMode;
        purchaseOrder.receiveAddress = shippingschedulebList[j].shipToLocation;
        purchaseOrder.receiver = shippingschedulebList[j].shipToContact;
        purchaseOrder.receiveTelePhone = shippingschedulebList[j].shipToContactPhone;
        purchaseOrder.memo = shippingschedulebList[j].item_type;
        purchaseOrder._status = "Insert";
        if (batchNumberMap.has(shippingschedulebList[j].batchNumber + "")) {
          if (batchNumberMap.get(shippingschedulebList[j].batchNumber + "") != "error") {
            batchNumberMap.get(shippingschedulebList[j].batchNumber + "").push(purchaseOrder);
            let qytOld = allQtyMap.get(shippingschedulebList[j].batchNumber + "") + quantitiyNum;
            allQtyMap.set(shippingschedulebList[j].batchNumber + "", qytOld);
            updateMappingList.push({ id: shippingschedulebList[j].id, orders_mapping: ordersMapping, _status: "Update" });
          }
        } else {
          batchNumberMap.set(shippingschedulebList[j].batchNumber + "", [purchaseOrder]);
          allQtyMap.set(shippingschedulebList[j].batchNumber + "", quantitiyNum);
          updateMappingList.push({ id: shippingschedulebList[j].id, orders_mapping: ordersMapping, _status: "Update" });
        }
        cabinetMap.set(shippingschedulebList[j].cabinetNodeCode, 1);
      }
      if (repeatBatchNo.length == shippingschedulebList.length) {
        // 已全部生成
        repeatAlert.push(shiRes[i].code);
      }
      if (zeroLine.length > 0) {
        let errorMessage = shiRes[i].errorMessage + "\n第 " + zeroLine.join(",") + " 行明细需求数量不能为0！";
        updateShiData.push({ id: shiRes[i].id, errorMessage: errorMessage });
      }
      batchNumberMap.forEach((value, key) => {
        if (value != "error") {
          // 需求数量为0或者存在其他错误，不生成采购订单
          // 标题
          let subjectMsg = "";
          if (value[0].manageClassName.indexOf("备件") != -1) {
            // 存在备件字样
            subjectMsg = "备件 ";
          }
          if (!value[0].country) {
            subjectMsg += "China ";
          } else {
            subjectMsg += value[0].country + " ";
          }
          subjectMsg += allQtyMap.get(key) + " 交付 ";
          subjectMsg += "(" + value[0].orderMode + " " + shiRes[i].createTime.substring(0, 10) + ")";
          orderInsertData.headParallel = { buyerTel: buyerTel, orderSubject: subjectMsg };
          if (key && key != "null" && key != "undefined") {
            orderInsertData.extend76 = key;
          } else {
            orderInsertData.extend76 = "";
          }
          orderInsertData.purchaseOrders = value;
          let orderUrl = "https://www.example.com/";
          let orderResponse = openLinker("POST", orderUrl, "PU", JSON.stringify({ data: orderInsertData }));
          orderResponse = JSON.parse(orderResponse);
          if (orderResponse.code != "200") {
            // 因接口事务不好处理，若失败，回写要货计划异常信息字段
            if (shiRes[i].errorMessage) {
              shiRes[i].errorMessage += "\n生成采购订单失败！失败原因：" + orderResponse.message;
            } else {
              shiRes[i].errorMessage = "生成采购订单失败！失败原因：" + orderResponse.message;
            }
            var errObject = { id: shiRes[i].id, errorMessage: shiRes[i].errorMessage };
            updateShiData.push(errObject);
            errAlert.push(shiRes[i].code);
          } else {
            successAlert.push(shiRes[i].code);
            // 生成采购订单成功，要货计划回写采购订单对应字段
            let clearErrorMsg = "";
            if (shiRes[i].errorMessage) {
              clearErrorMsg = shiRes[i].errorMessage.replace(reg, "");
            }
            var successObject = { id: shiRes[i].id, errorMessage: clearErrorMsg, shippingschedulebList: updateMappingList };
            updateShiData.push(successObject);
            if (persons.length > 0) {
              let todoUrl = "https://www.example.com/";
              let todoData = {
                srcMsgId: uuid(),
                yyUserIds: persons,
                title: "要货计划自动生成采购订单" + orderResponse.data.code,
                content: "发起来源：SS 发起时间：" + orderResponse.data.createTime,
                webUrl:
                  "https://www.example.com/" +
                  orderResponse.data.id +
                  "?domainKey=upu&apptype=mdf&businessStepCode=&tenantId=" +
                  currentUser.tenantId +
                  "&serviceCode=st_purchaseorderlist&systemCode=&from_service=iuap-apcom-messagecenter",
                appId: sconfig.BASE.ordersAppId,
                businessKey: "yourKeyHere" + orderResponse.data.id,
                labelCode: "PU"
              };
              let todoRes = openLinker("POST", todoUrl, "GT37595AT2", JSON.stringify(todoData));
            }
          }
        } else {
          // 组装错误提示语
          errAlert.push(shiRes[i].code);
        }
      });
      // 更新要货计划，如：异常信息回写、采购订单与要货计划对应关系字段回写
      if (updateShiData.length > 0) {
        ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", updateShiData, "02a3de71");
      }
    }
    if (errAlert.length > 0 || repeatAlert.length > 0) {
      if (successAlert.length > 0) {
        return { status: 1, errAlert: errAlert, repeatAlert: repeatAlert }; // 部分成功
      } else {
        return { status: 2, errAlert: errAlert, repeatAlert: repeatAlert }; // 全部失败
      }
    }
    return { status: 0 };
  }
}
exports({ entryPoint: MyAPIHandler });