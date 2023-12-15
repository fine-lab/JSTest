let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data;
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    var othOutRecords = Data.othOutRecords;
    if (othOutRecords.length > 0) {
      var WMSmark = "否";
      let sourceState = othOutRecords[0].hasOwnProperty("source");
      console.log(JSON.stringify(sourceState));
      if (sourceState == true) {
        var Sunsource = othOutRecords[0].source;
        if (Sunsource == "st_morphologyconversion") {
          var SunsourceId = othOutRecords[0].sourceid;
          // 查询形态转换单详情
          let apiResponse1 = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/scm/morphologyconversion/detail?access_token=" + token + "&id=" + SunsourceId, JSON.stringify(headers), null);
          let api1 = JSON.parse(apiResponse1);
          if (api1.code == 200) {
            var APIData = api1.data;
            var stateXTZH = APIData.hasOwnProperty("defines");
            if (stateXTZH == true) {
              var stateSSD = APIData.defines.hasOwnProperty("define1");
              if (stateSSD == true) {
                // 来源是否为OMS
                WMSmark = APIData.defines.define1;
              }
            }
            var bustypeCode = APIData.businesstypeCode;
          } else {
            throw new Error("查询形态转换单失败！");
          }
        }
      }
      // 单据编码
      let code = Data.code;
      // 仓库id
      let warehouse = Data.warehouse;
      // 形态转换交易类型名称
      // 单据id
      var id = Data.id;
      // 交易类型id
      let bustype = Data.bustype;
      // 查询交易类型详情
      let bustypeSQL = "select code from bd.bill.TransType where id = '" + bustype + "'";
      let bustypeRES = ObjectStore.queryByYonQL(bustypeSQL, "transtype");
      if (bustypeRES.length > 0) {
        let BusCode = bustypeRES[0].code;
        // 组织
        let org = Data.org;
        // 会计主体
        let accountOrg = Data.accountOrg;
        // 组织单元详情查询
        let accountOrgSQL = "select code,name from org.func.BaseOrg where id = '" + accountOrg + "'";
        let accountOrgRES = ObjectStore.queryByYonQL(accountOrgSQL, "ucf-org-center");
        if (accountOrgRES.length > 0) {
          var accountOrgNames = accountOrgRES[0].name;
          // 库存员ID
          var stockMgr = "";
          // 库存员名称
          var stocName = "";
          // 判断库存员是否存在
          var stocSates = Data.hasOwnProperty("stockMgr");
          if (stocSates == true) {
            stockMgr = Data.stockMgr;
            // 员工组织
            let staffSQL = "select name from bd.staff.Staff where id = '" + stockMgr + "'";
            let staffSQLRES = ObjectStore.queryByYonQL(staffSQL, "ucf-staff-center");
            stocName = staffSQLRES[0].name;
          }
          // 业务员ID
          var operator = "";
          // 业务员名称
          var atorName = "";
          // 判断业务员是否存在
          var atorSates = Data.hasOwnProperty("operator");
          if (atorSates == true) {
            operator = Data.operator;
            // 员工组织
            let staffSQL = "select name from bd.staff.Staff where id = '" + operator + "'";
            let staffSQLRES = ObjectStore.queryByYonQL(staffSQL, "ucf-staff-center");
            atorName = staffSQLRES[0].name;
          }
          var remark = "";
          var remarkBool = Data.hasOwnProperty("remark");
          if (remarkBool == true) {
            remark = Data.remark;
          }
          let othOutData = Data.othOutRecords;
          let createTime = Data.createDate;
          var date = new Date(createTime);
          let Year = date.getFullYear();
          let Moth = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
          let Day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
          let Hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          let Minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          let Sechond = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
          var GMT = Year + "-" + Moth + "-" + Day + " " + Hour + ":" + Minute + ":" + Sechond;
          // 组织单元详情查询
          let OrgSQL = "select code,name from org.func.BaseOrg where id = '" + org + "'";
          let OrgRES = ObjectStore.queryByYonQL(OrgSQL, "ucf-org-center");
          if (OrgRES.length > 0) {
            let orgCode = OrgRES[0].code;
            let Sql = "select code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
            let warehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
            if (warehouseRes.length > 0) {
              var warehouseCode = warehouseRes[0].code;
              if (othOutData.length > 0) {
                let jsonBody = {
                  outBizOrderCode: code,
                  XTZHBusType: bustypeCode,
                  bizOrderType: "OUTBOUND",
                  subBizOrderType: "QTCK",
                  orderSource: "MANUAL_IMPORT",
                  createTime: GMT,
                  salesMan: atorName,
                  storeKeeper: stocName,
                  remark: remark,
                  org: org,
                  accountingEntity: accountOrgNames,
                  warehouseCode: warehouseCode,
                  ownerCode: orgCode,
                  orderLines: getDetalis(othOutData),
                  channelCode: "XSQD003",
                  supplierCode: "00YL000004",
                  supplierName: "天韦合作社",
                  senderInfo: {},
                  receiverInfo: {},
                  SourcePlatformCode: "YS",
                  ysId: id,
                  bustype: BusCode,
                  status: "WAIT_INBOUND"
                };
                var body = {
                  appCode: "beiwei-ys",
                  appApiCode: "standard.other.order.out.create",
                  schemeCode: "bw47",
                  jsonBody: jsonBody
                };
              }
            } else {
              throw new Error("查询仓库档案失败！");
            }
          } else {
            throw new Error("查询业务单元失败！");
          }
        } else {
          throw new Error("查询库存组织失败！");
        }
      } else {
        throw new Error("查询交易类型档案失败！");
      }
    }
    // 获取子表数据
    function getDetalis(AllDetails) {
      let DataMap = new Map();
      let QtyMap = new Map();
      let stockStatusList = new Array();
      for (let k = 0; k < AllDetails.length; k++) {
        let productID = AllDetails[k].product;
        stockStatusList.push(AllDetails[k].stockStatusDoc);
        if (undefined != DataMap.get(productID) && null != DataMap.get(productID)) {
          let Count = AllDetails[k].qty + QtyMap.get(productID);
          QtyMap.set(productID, Count);
        } else {
          DataMap.set(productID, AllDetails[k]);
          QtyMap.set(productID, AllDetails[k].qty);
        }
      }
      if (DataMap.size > 0) {
        var orderList = new Array();
        for (let key of DataMap.keys()) {
          let SunData = {};
          let batch_Info = {};
          // 物料SKU
          var productsku = DataMap.get(key).productsku;
          var skuSql = "select code,name from pc.product.ProductSKU where id = '" + productsku + "'";
          var skuRes = ObjectStore.queryByYonQL(skuSql, "productcenter");
          if (skuRes.length > 0) {
            var productsku_cCode = skuRes[0].code;
            var productsku_cName = skuRes[0].name;
            var vendorCode = null;
            var vendor_name = null;
            // 物料
            let productMessage = DataMap.get(key).product;
            let productSql = "select manageClass,code,name from pc.product.Product where id = '" + productMessage + "'";
            let productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
            if (productRes.length > 0) {
              let product_cCode = productRes[0].code;
              let product_cName = productRes[0].name;
              let manageClass = productRes[0].manageClass;
              var batchNo = DataMap.get(key).batchno;
              let SunId = DataMap.get(key).sunID;
              let qty = DataMap.get(key).qty;
              let subQty = DataMap.get(key).subQty;
              let stockUnitId = DataMap.get(key).stockUnitId;
              // 物料分类详情查询
              let ManageClassSQL = "select code,name from pc.cls.ManagementClass where id = '" + manageClass + "'";
              let ManageClassRes = ObjectStore.queryByYonQL(ManageClassSQL, "productcenter");
              if (ManageClassRes.length > 0) {
                let productClassCode = ManageClassRes[0].code;
                let productClassName = ManageClassRes[0].name;
                // 计量单位详情查询
                let UnitSql = "select name from pc.unit.Unit where id = '" + stockUnitId + "'";
                var UnitRes = ObjectStore.queryByYonQL(UnitSql, "productcenter");
                if (UnitRes.length > 0) {
                  let stockUnit_name = UnitRes[0].name;
                  var batchInfo_List = new Array();
                  for (let j = 0; j < AllDetails.length; j++) {
                    let batchNo = AllDetails[j].batchno;
                    let ProductID = AllDetails[j].product;
                    let stockStatusDoc = AllDetails[j].stockStatusDoc;
                    var inventoryType = getStockStatusMap(stockStatusList).get(stockStatusDoc);
                    if (ProductID == productMessage) {
                      batch_Info = {
                        batchCode: batchNo,
                        inventoryType: inventoryType
                      };
                      batchInfo_List.push(batch_Info);
                    }
                  }
                  SunData = {
                    orderLineNo: SunId,
                    relationOrderLineNo: SunId,
                    planQty: QtyMap.get(key),
                    actualQty: QtyMap.get(key),
                    unit: stockUnit_name,
                    inventoryType: inventoryType,
                    itemInfo: {
                      itemCode: productsku_cCode,
                      itemName: productsku_cName,
                      itemType: productClassCode,
                      itemTypeName: productClassName
                    },
                    batchInfos: batchInfo_List
                  };
                  orderList.push(SunData);
                } else {
                  throw new Error("查询计量单位档案失败！");
                }
              } else {
                throw new Error("查询物料分类档案失败！");
              }
            } else {
              throw new Error("查询物料档案失败！");
            }
          } else {
            throw new Error("查询物料SKU档案失败！");
          }
        }
        return orderList;
      }
    }
    // 获取生产日期
    function getPRODATE(details) {
      var producedate = details.producedate;
      var proDate = new Date(producedate);
      let Year = proDate.getFullYear();
      let Moth = proDate.getMonth() + 1 < 10 ? "0" + (proDate.getMonth() + 1) : proDate.getMonth() + 1;
      let Day = proDate.getDate() < 10 ? "0" + proDate.getDate() : proDate.getDate();
      var PRODATE = Year + "-" + Moth + "-" + Day;
      return PRODATE;
    }
    // 获取有效期至
    function getINVALDATE(details) {
      var invaliddate = details.invaliddate;
      var invalDate = new Date(invaliddate);
      let Years = invalDate.getFullYear();
      let Mother = invalDate.getMonth() + 1 < 10 ? "0" + (invalDate.getMonth() + 1) : invalDate.getMonth() + 1;
      let Days = invalDate.getDate() < 10 ? "0" + invalDate.getDate() : invalDate.getDate();
      var INVALDATE = Years + "-" + Mother + "-" + Days;
      return INVALDATE;
    }
    // 组装库存状态
    function getStockStatusMap(ids) {
      var object = { ids: ids };
      let stockStatumap = new Map();
      //实体查询
      var res = ObjectStore.selectBatchIds("st.stockStatusRecord.stockStatusRecord", object);
      if (undefined != res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          var stockStatusDoc_name = res[i].statusName;
          var Invoicetype = "";
          if (stockStatusDoc_name == "合格") {
            Invoicetype = "FX";
          } else if (stockStatusDoc_name == "待检") {
            Invoicetype = "DJ";
          } else if (stockStatusDoc_name == "放行") {
            Invoicetype = "FX";
          } else if (stockStatusDoc_name == "冻结") {
            Invoicetype = "FREEZE";
          } else if (stockStatusDoc_name == "禁用") {
            Invoicetype = "DISABLE";
          } else if (stockStatusDoc_name == "不合格") {
            Invoicetype = "UN_HG";
          }
          stockStatumap.set(res[i].id, Invoicetype);
        }
      }
      return stockStatumap;
    }
    return body;
  }
}
exports({ entryPoint: MyTrigger });