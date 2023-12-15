let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return {};
    var requestData = JSON.stringify(param.requestData);
    var dataReq = JSON.parse(requestData);
    var dataReqDa = JSON.parse(dataReq);
    var sendData = {};
    sendData.data = {};
    var po_order = {};
    var po_order_b = [];
    var id = dataReqDa.id;
    let body = {};
    let header = {};
    let apiResponse = openLinker("get", "https://www.example.com/" + id, "PU", JSON.stringify(body));
    let resdata = JSON.parse(apiResponse);
    if (resdata != null && resdata.code != null && resdata.code == "200") {
      var dataBill = resdata.data;
      var orgNum = "";
      for (var j = 0; j < dataBill.purchaseOrders.length; j++) {
        var detail = dataBill.purchaseOrders[j];
        var sendEntry = {};
        sendEntry.vbdef6 = detail.id; // vbdef6	YS表体主键			String
        if (detail.productsku_cCode == null || detail.productsku_cCode == "") {
          sendEntry.pk_material = detail.product_cCode; // pk_material 	物料编码			String
        } else {
          sendEntry.pk_material = detail.productsku_cCode; // pk_material 	物料编码			String
        }
        sendEntry.castunitid = detail.unit_code; // castunitid 	单位
        sendEntry.nnum = detail.qty; // nnum 	数量			UFDouble
        sendEntry.ntaxrate = detail.taxRate; // ntaxrate 	税率			UFDouble
        sendEntry.ntax = detail.oriTax; //ntax 	税额			UFDouble
        sendEntry.nqtorigprice = detail.natUnitPrice; //nqtorigprice 	无税单价			UFDouble
        sendEntry.nqtorigtaxprice = detail.natTaxUnitPrice; //nqtorigtaxprice 	含税单价			UFDouble
        sendEntry.norigmny = detail.natMoney; //norigmny 	无税金额			UFDouble
        sendEntry.norigtaxmny = detail.natSum; //norigtaxmny 	价税合计			UFDouble
        sendEntry.vbmemo = detail.memo; //vbmemo 	备注			String
        sendEntry.ctaxcodeid = detail.taxitems_code; //ctaxcodeid 	税码			String
        sendEntry.nexchangerate = dataBill.exchRate; //nexchangerate 	折本汇率			UFDouble
        if (detail.recieveDate != null && detail.recieveDate != "") {
          sendEntry.dplanarrvdate = detail.recieveDate; //dplanarrvdate 	计划到货日期			UFDate_end
        }
        if (detail.warehouse_code != null && detail.warehouse_code != "") {
          sendEntry.pk_psfinanceorg_v = detail.warehouse_code; // pk_reqstoorg_v	需求库存组织			String
          sendEntry.pk_apfinanceorg_v = detail.warehouse_code; //pk_arrvstoorg_v	收货库存组织			String
          orgNum = detail.warehouse_code;
        }
        sendEntry.pk_psfinanceorg_v = "1005"; //pk_psfinanceorg_v 	结算财务组织			String
        sendEntry.pk_apfinanceorg_v = "1005"; //pk_apfinanceorg_v 	应付财务组织			String
        po_order_b.push(sendEntry);
      }
      if (orgNum == "") {
        throw new Error("请填写仓库信息");
      }
      po_order.pk_org = orgNum; //  pk_org	采购组织			String
      po_order.vbillcode = dataBill.code; //vbillcode 	订单编码			String
      po_order.dbilldate = dataBill.vouchdate; //dbilldate 	订单日期			UFDate
      po_order.pk_supplier = dataBill.vendor_code; //pk_supplier 	供应商	YS传编码		String
      po_order.corigcurrencyid = "CNY"; //corigcurrencyid 	币种	默认CNY		String
      po_order.fhtaxtypeflag = "1"; // fhtaxtypeflag 	整单扣税类别	默认1		扣税类别 	1=应税外加，0=应税内含，
      if (dataBill.operator != null && dataBill.operator != "") {
        var sql = "select id,name,userId,unitId orgId,deptId,extension,code from hred.staff.Staff where  id = '" + dataBill.operator + "' ";
        var res = ObjectStore.queryByYonQL(sql, "hrcloud-staff-mgr");
        if (res.length > 0) {
          po_order.cemployeeid = res[0].code; // cemployeeid 	采购员	传编码		String	两边手工维护一致
        }
      }
      if (dataBill.department != null && dataBill.department != "") {
        var sql = "select  code from bd.adminOrg.AdminOrgVO  where  id = '" + dataBill.department + "' ";
        var res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
        if (res.length > 0) {
          po_order.pk_dept_v = dataBill.department_code; // pk_dept_v 	采购部门	传编码		String	两边手工维护一致
        }
      }
      po_order.ntotalorigmny = dataBill.natSum; // ntotalorigmny 	价税合计			UFDouble
      po_order.ntotalastnum = dataBill.totalQuantity; // ntotalastnum 	数量			UFDouble
      po_order.vdef6 = dataBill.id; //vdef6	YS主键			   string
      po_order.ctrantypeid = dataBill.bustype_code; //ctrantypeid 	订单类型			String
      po_order.creator = dataBill.creator; // creator	创建人			String
      sendData.data.po_order = po_order;
      sendData.data.po_order_b = po_order_b;
    } else {
      throw new Error("无法查找此采购订单。");
    }
    var svv = JSON.stringify(sendData);
  }
}
exports({ entryPoint: MyTrigger });