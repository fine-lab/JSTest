//订单日报拉取数据
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //根据选择物料查询销售日报数据id
    let sqlhid = "select distinct  parentid as orderId from ec.ec_salesdailyrpt.SalesDailyRptDetail";
    sqlhid += " where UPCID='" + request.materialId + "'"; //根据选择物料id查询
    sqlhid += " and parentid.dDate >= '" + request.vouchdateS + "' and parentid.dDate <='" + request.vouchdateE + "'"; //根据主表的单据日期查询
    sqlhid += " order by parentid.id";
    let reshid = ObjectStore.queryByYonQL(sqlhid, "dst");
    let orderhid = reshid.map((x) => "'" + x.orderId + "'").join(",");
    //若销售日报中的id在【销售日报中间表】中（对应的是字段【拉取数据id】）已存在，则跳过这条id数据
    //若销售日报中的id在【销售日报中间表】中（对应的是字段【拉取数据id】）不存在，则拉取数据并存储到 销售日报中间表中，即执行100行以后的代码
    //根据选择物料查询销售日报数据
    let sql =
      "select parentid.id as OrderId,parentid.cCode,parentid.org,parentid.department,parentid.customer,parentid.dDate, parentid.dailyType, parentid.num,parentid.payment,parentid.cShopID.shopName,tid,num,price,payment,isGift,UPCID,taxrate,tax,notaxmny from ec.ec_salesdailyrpt.SalesDailyRptDetail";
    sql += " where parentid in (" + orderhid + ")"; //根据选择物料id查询
    sql += " order by parentid";
    let res = ObjectStore.queryByYonQL(sql, "dst");
    //过滤出主表信息，并去重
    let orderItemsTmp = res.map((x) => {
      return {
        OrderId: x.OrderId, //ID
        code: x.parentid_cCode, //编码
        salesOrgId: x.parentid_org, //销售组织id
        saleDepartmentId: x.parentid_department, //销售部门
        agentId: x.parentid_customer, //客户ID
        vouchdate: x.parentid_dDate, //单据日期
        dailyType: x.parentid_dailyType, //日报类型
        num: x.parentid_num, //数量
        payment: x.parentid_payment, //实收金额
        shopName: x.parentid_cShopID_shopName //店铺名称
      };
    });
    let orderItems = [];
    orderItemsTmp.forEach((x) => {
      if (orderItems.filter((y) => y.OrderId == x.OrderId).length == 0) orderItems.push(x);
    });
    let data = []; //总数据
    for (let i = 0; i < orderItems.length; i++) {
      //如果【销售日报ID】在【销售日报中间表】中存在则跳过该笔销售日报的插入
      sql = "select soId from AT17C47D1409580006.AT17C47D1409580006.AdjustMtaxOrder where soId = '" + orderItems[i].OrderId + "'";
      let resSdIm = ObjectStore.queryByYonQL(sql);
      if (resSdIm.length > 0) continue;
      //处理主表数据
      let details = []; //详情数组
      let one = {}; //单条主表数据
      one["id"] = orderItems[i]["OrderId"];
      one["iscreatpo"] = "0";
      if (orderItems[i]["agentId"] != undefined) {
        one["agentId"] = orderItems[i]["agentId"];
      } else {
        one["agentId"] = ""; //客户
      }
      if (orderItems[i]["num"] != undefined) {
        one["subQty"] = orderItems[i]["num"];
      } else {
        one["subQty"] = 0;
      } //数量
      if (orderItems[i]["dailyType"] != undefined) {
        one["dailyType"] = orderItems[i]["dailyType"];
      } else {
        one["dailyType"] = 0; //日报类型
      }
      if (orderItems[i]["salesOrgId"] != undefined) {
        one["salesOrgId"] = orderItems[i]["salesOrgId"];
      } else {
        one["salesOrgId"] = ""; //销售组织
      }
      if (orderItems[i]["code"] != undefined) {
        one["code"] = orderItems[i]["code"];
      } else {
        one["code"] = ""; //日报编号
      }
      if (orderItems[i]["payment"] != undefined) {
        one["oriSum"] = orderItems[i]["payment"];
      } else {
        one["oriSum"] = 0; //实收金额
      }
      if (orderItems[i]["saleDepartmentId"] != undefined) {
        one["saleDepartmentId"] = orderItems[i]["saleDepartmentId"];
      } else {
        one["saleDepartmentId"] = ""; //部门
      }
      if (orderItems[i]["vouchdate"] != undefined) {
        one["vouchdate"] = orderItems[i]["vouchdate"];
      } else {
        one["vouchdate"] = ""; //单据日期
      }
      if (orderItems[i]["shopName"] != undefined) {
        one["cShopName"] = orderItems[i]["shopName"];
      } else {
        one["cShopName"] = "";
      }
      if (orderItems[i]["tid"] != undefined) {
        one["tid"] = orderItems[i]["tid"];
      } else {
        one["tid"] = "";
      }
      one["SelectMaterial"] = request.materialId;
      one["soId"] = orderItems[i]["OrderId"];
      one["isHC"] = "0";
      one["isCreatNV"] = "0";
      one["Vtype"] = "2";
      //处理子表数据
      let detailItems = res.filter((x) => x.OrderId == orderItems[i].OrderId);
      for (let j = 0; j < detailItems.length; j++) {
        let detailOne = {};
        detailOne["id"] = detailItems[j]["id"];
        detailOne["iscreatpo"] = "0";
        if (detailItems[j]["notaxmny"] != undefined) {
          detailOne["notaxmny"] = detailItems[j]["notaxmny"];
        } else {
          detailOne["notaxmny"] = "";
        } //无税金额
        if (detailItems[j]["tax"] != undefined) {
          detailOne["oriTax"] = detailItems[j]["tax"];
        } else {
          detailOne["oriTax"] = "";
        } //税额
        if (detailItems[j]["num"] != undefined) {
          detailOne["subQty"] = detailItems[j]["num"];
        } else {
          detailOne["subQty"] = 0;
        }
        if (detailItems[j]["UPCID"] != undefined) {
          detailOne["productId"] = detailItems[j]["UPCID"];
        } else {
          detailOne["productId"] = "";
        }
        if (detailItems[j]["price"] != undefined) {
          detailOne["oriTaxUnitPrice"] = detailItems[j]["price"];
        } else {
          detailOne["oriTaxUnitPrice"] = 0;
        }
        if (detailItems[j]["isGift"] != undefined) {
          detailOne["isGift"] = detailItems[j]["isGift"];
        } else {
          detailOne["isGift"] = 0;
        }
        if (detailItems[j]["payment"] != undefined) {
          detailOne["oriSum"] = detailItems[j]["payment"];
        } else {
          detailOne["oriSum"] = 0;
        }
        details.push(detailOne); //向明细数组中插入一条明细
      }
      one["AdjustMtaxOrderDetailList"] = details; //主表数据中赋值明细字段
      data.push(one);
    }
    let resInsertBatch = ObjectStore.insertBatch("AT17C47D1409580006.AT17C47D1409580006.AdjustMtaxOrder", data, "yb9480b2c6");
    return {
    };
  }
}
exports({ entryPoint: MyAPIHandler });