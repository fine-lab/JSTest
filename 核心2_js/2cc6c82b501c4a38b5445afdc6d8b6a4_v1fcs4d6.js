let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //组装接口表体
    function packageBody(selectData, bodyData) {
      //含税金额
      let oriSum = MoneyFormatReturnBd(bodyData.oriTaxUnitPrice * bodyData.tranQty, 2);
      //无税金额
      let oriMoney = MoneyFormatReturnBd(bodyData.oriUnitPrice * bodyData.tranQty, 2);
      //税额
      let oriTax = MoneyFormatReturnBd(oriSum - oriMoney, 2);
      let packageBody = {
        product: bodyData.product + "", //商品
        productsku: bodyData.sku + "", //商品SKUid
        qty: bodyData.tranQty, //数量
        unit: bodyData.masterUnit + "", //主计量单位
        invExchRate: 1, //销售换算率
        subQty: bodyData.tranQty, //件数
        stockUnitId: bodyData.masterUnit, //库存单位
        oriUnitPrice: bodyData.oriUnitPrice, //无税单价
        oriTaxUnitPrice: bodyData.oriTaxUnitPrice, //含税单价
        oriMoney: oriMoney, //无税金额
        oriSum: oriSum, //含税金额
        oriTax: oriTax, //税额
        taxRate: bodyData.tax + "", //税目税率
        natUnitPrice: bodyData.oriUnitPrice, //本币无税单价
        natTaxUnitPrice: bodyData.oriTaxUnitPrice, //本币含税单价
        natMoney: oriMoney, //本币无税金额
        natSum: oriSum, //本币含税金额
        natTax: oriTax, //本币税额
        _status: "Insert",
        memo: bodyData.memo,
        defines: {
          define1: selectData.code, //来源单据号
          define2: selectData.id, //来源主表主键
          define3: bodyData.id //来源子表主键
        }
      };
      return packageBody;
    }
    //组装接口
    function packageHead(selectData, dbdata) {
      //依据调出仓库查询对应的负责人和管理部门
      let querySql = "select department,operator from aa.warehouse.Warehouse where id='" + dbdata.outstock + "'";
      var WarehouseRes = ObjectStore.queryByYonQL(querySql, "productcenter");
      let packageHead = {
        outorg: selectData.org_id + "", //调出组织id
        outaccount: selectData.org_id + "", //调出会计主体id
        vouchdate: selectData.vouchdate, //单据日期
        bustype: "A03001", //交易类型--调拨
        outwarehouse: dbdata.outstock, //调出仓库
        inorg: selectData.org_id + "", //调入组织id
        inaccount: selectData.org_id + "", //调入会计主体id
        inwarehouse: dbdata.instock, //调入仓库
        outdepartment: WarehouseRes[0].department, //调出部门id
        outbizperson: WarehouseRes[0].operator, //调出业务员id
        indepartment: selectData.saleDepartment, //调入部门id
        inbizperson: selectData.corpContact, //调入业务员id
        currency: selectData.orderPrices, //币种
        natCurrency: selectData.orderPrices, //本币
        exchRate: 1, //汇率
        dplanshipmentdate: dbdata.consignTime, //计划发货日期
        dplanarrivaldate: dbdata.planarrivalDate, //计划到货日期
        receiver: selectData.receiver, //收货人
        receivemobile: selectData.receiveMobile, //收货电话
        receivezipcode: selectData.receiveZipCode, //收货人邮编
        receiveaddr: selectData.receiveAddress, //收货地址
        status: 0,
        memo: selectData.remarks, //备注
        creator: selectData.creatorName, //创建人20220808
        creatorId: selectData.creatorId,
        headItem: {
          define1: selectData.receiver, //收货人
          define2: selectData.receiveMobile, //收货电话
          define3: selectData.receiveAddress, //收货地址
          define4: selectData.logisticstype, //物流方式
          define5: selectData.infreighttype, //库房运费结算方
          define6: selectData.outfreighttype, //外采运费结算方
          define7: selectData.issigning //签单返还
        },
        defines: {
          define2: selectData.code, //上游单据号
          define3: selectData.id, //上游主表主键
          define5: selectData.agent //客户
        },
        _status: "Insert"
      };
      return packageHead;
    }
    let context = request.billdata;
    let param = request.dbdata;
    let bodyDetils = new Array();
    bodyDetils.push(packageBody(context, param));
    var insertData = packageHead(context, param);
    insertData.transferApplys = bodyDetils;
    let body = {
      data: insertData
    };
    let getsdUrl = "https://www.example.com/";
    let apiResponse = openLinker("POST", getsdUrl, "GT83441AT1", JSON.stringify(body));
    let result = JSON.parse(apiResponse);
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });