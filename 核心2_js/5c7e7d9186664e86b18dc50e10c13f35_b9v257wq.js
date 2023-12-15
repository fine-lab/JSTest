let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: ""
    };
    try {
      let startDate = request.startDate; //开始日期
      let endDate = request.endDate; //结束日期
      let xsckCode = request.xsckCode; //单据编号
      let invId = request.invId; //物料id
      let depId = request.depId; //部门
      let orgId = request.orgId; //组织
      let ws = request.ws; //仓库
      let sql = "";
      sql =
        "select id,name,code,b.name goodsName,b.id goodsId,b.code goodsCode  from aa.warehouse.Warehouse inner join aa.goodsposition.GoodsPosition b on id=b.warehouseId where 1=1 and  b.name like '寄售'"; //查询寄售仓
      var res11 = ObjectStore.queryByYonQL(sql, "productcenter");
      let goodspositionIds = []; //货位id
      res11.forEach((item, index) => {
        goodspositionIds.push(item.goodsId);
      });
      //来源销售出库
      sql =
        "select 1 source,b.goodsposition goodsposition,b.lineno rows,salesOrg,department,b.qty qty,warehouse,bustype ,id SalesOut,b.id SalesOuts,srcBillNO,srcBillType,code,vouchdate,b.unit unit,b.product product from st.salesout.SalesOut left join st.salesout.SalesOuts b on b.mainid=id  where 1=1";
      //来源其他出库
      let sql_ =
        "select 2 source,b.goodsposition goodsposition,b.lineno rows,org salesOrg,department,b.qty qty,warehouse,bustype ,id SalesOut,b.id SalesOuts,'' srcBillNO,srcBillType,code,vouchdate,b.unit unit,b.product product from st.othoutrecord.OthOutRecord left join st.othoutrecord.OthOutRecords b on b.mainid=id  where 1=1";
      let sql1 = "select salesDeliverysId,dr from AT18623B800920000A.AT18623B800920000A.consignmentList where dr=0 and salesDeliverysId is not null";
      var consignmentList = ObjectStore.queryByYonQL(sql1, "developplatform");
      let sql01 = "select  otherDeliverysId,dr from AT18623B800920000A.AT18623B800920000A.consignmentList where dr=0 and otherDeliverysId is not null";
      var otherDeliverysList = ObjectStore.queryByYonQL(sql01, "developplatform");
      let salesDeliverysIds = []; //结算销售出库单子表集合
      consignmentList.forEach((iv, ivindex) => {
        salesDeliverysIds.push(iv.salesDeliverysId);
      });
      let otherDeliveryIds = []; //结算其他出库子表集合
      otherDeliverysList.forEach((iv, ivindex) => {
        otherDeliveryIds.push(iv.otherDeliverysId);
      });
      sql += "  and b.id NOT IN (" + salesDeliverysIds + ") ";
      sql_ += " and b.id NOT IN (" + otherDeliveryIds + ")  ";
      sql += " and b.goodsposition in (" + goodspositionIds + ") ";
      sql_ += " and b.goodsposition in (" + goodspositionIds + ") ";
      if (!startDate || !endDate) {
        throw new Error("单据开始日期和结束日期必填");
      }
      sql += " and vouchdate>='" + startDate + "'  and vouchdate<='" + endDate + "'";
      sql_ += " and vouchdate>='" + startDate + "'  and vouchdate<='" + endDate + "'";
      if (xsckCode) {
        sql += " and code='" + xsckCode + "'";
        sql_ += " and code='" + xsckCode + "'";
      }
      if (invId) {
        sql += " and b.product='" + invId + "'";
        sql_ += " and b.product='" + invId + "'";
      }
      if (depId) {
        sql += " and department='" + depId + "'";
        sql_ += " and department='" + depId + "'";
      }
      if (orgId) {
        sql += " and salesOrg='" + orgId + "'";
        sql_ += " and org='" + orgId + "'";
      }
      if (ws) {
        sql += " and warehouse='" + ws + "'";
        sql_ += " and warehouse='" + ws + "'";
      }
      var dt01 = ObjectStore.queryByYonQL(sql, "ustock"); //销售出库
      var dt02 = ObjectStore.queryByYonQL(sql_, "ustock"); //其他出库
      var res = [];
      if (dt01.length > 0) {
        dt01.map((v) => {
          res.push(v);
        });
      }
      if (dt02.length > 0) {
        dt02.map((v) => {
          res.push(v);
        });
      }
      let depids = [];
      let orgids = [];
      res.forEach((item, index) => {
        depids.push(item.department);
        orgids.push(item.salesOrg);
      });
      sql = "select  id,code,name from bd.adminOrg.AdminOrgVO where id in (" + depids + ")";
      let dep = ObjectStore.queryByYonQL(sql, "ucf-org-center");
      sql = "select code,name,id from org.func.BaseOrg where id in (" + orgids + ")";
      let orgs = ObjectStore.queryByYonQL(sql, "ucf-org-center"); //组织
      res.forEach((item, index) => {
        sql =
          "select code productcode,name productname,b.productVendor productVendor,a.code  vendorcode,a.id vendorid,a.name vendorname,c.code nuitcode ,c.name nuitname from pc.product.Product left join  pc.product.ProductDetail b on b.productId=id left join aa.vendor.Vendor a on a.id=b.productVendor left join  pc.unit.Unit c on c.id=" +
          item.unit +
          " where 1=1 and id=" +
          item.product;
        var res1 = ObjectStore.queryByYonQL(sql, "yssupplier");
        if (res1.length > 0) {
          let { productcode, productname, vendorcode, vendorid, vendorname, nuitcode, nuitname, productVendor } = res1[0];
          item.productcode = productcode;
          item.productname = productname;
          item.vendorcode = vendorcode;
          item.vendorid = vendorid;
          item.vendorname = vendorname;
          item.nuitcode = nuitcode;
          item.nuitname = nuitname;
          item.productVendor = productVendor;
        }
        //查找仓库
        let warehouseinfo = res11.find((v) => v.id == item.warehouse);
        item.warehousecode = "";
        item.warehousename = "";
        if (warehouseinfo) {
          item.warehousecode = warehouseinfo.code;
          item.warehousename = warehouseinfo.name;
        }
        //查找货位
        let goodspositioninfo = res11.find((v) => v.goodsId == item.goodsposition);
        item.goodspositionName = "";
        item.goodspositionCode = "";
        if (goodspositioninfo) {
          item.goodspositionName = goodspositioninfo.goodsName;
          item.goodspositionCode = goodspositioninfo.goodsCode;
        }
        //匹配部门
        let depinfo = dep.find((v1) => v1.id == item.department);
        item.departmentcode = "";
        item.departmentname = "";
        if (depinfo) {
          item.departmentcode = depinfo.code;
          item.departmentname = depinfo.name;
        }
        //匹配组织
        let orginfo = orgs.find((v2) => v2.id == item.salesOrg);
        item.salesOrgcode = "";
        item.salesOrgname = "";
        if (depinfo) {
          item.salesOrgcode = orginfo.code;
          item.salesOrgname = orginfo.name;
        }
      });
      rsp.dataInfo = res;
    } catch (ex) {
      rsp.code = 500;
      rsp.msg = ex.message;
    }
    return rsp;
  }
}
exports({ entryPoint: MyAPIHandler });