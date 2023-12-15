let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let closednum = request.closedRowCount;
    let storeid = request.storeid;
    let productid = request.productid;
    let isclosed = request.isClosed;
    let orderCode = request.orderCode;
    var object = "";
    var usestatus = 2;
    if (closednum == undefined || closednum == "") {
      closednum = 0;
    }
    //查询对应的门店商品信息是否存在
    let productBSql = `select discountamount from GT80750AT4.GT80750AT4.specialoffer_b left join GT80750AT4.GT80750AT4.specialoffer a on specialoffer_id = a.id where product_id = 'youridHere'`;
    let product = ObjectStore.queryByYonQL(productBSql);
    //查询到有对应的商品信息则回写
    let storeSql = `select id, usenum, leftnum,specilnum from GT80750AT4.GT80750AT4.storeprofile_b left join GT80750AT4.GT80750AT4.storeprofile a on a.id = storeprofile_id where a.id = 'youridHere' and product_name = '${productid}'`;
    let storeBs = ObjectStore.queryByYonQL(storeSql);
    if ((product !== undefined || product.length > 0) && (storeBs !== undefined || storeBs.length > 0)) {
      let left = storeBs[0].leftnum - closednum;
      if (left <= 0) {
        usestatus = "1";
      } else {
        usestatus = "3";
      }
      if (isclosed) {
        object = {
          id: storeid,
          usestatus: usestatus,
          storeprofile_bList: [
            { hasDefaultInit: true, id: storeBs[0].id, usenum: storeBs[0].usenum - closednum, _status: "Update" },
            { hasDefaultInit: true, id: storeBs[0].id, leftnum: storeBs[0].leftnum + closednum, _status: "Update" }
          ]
        };
      } else {
        object = {
          id: storeid,
          usestatus: usestatus,
          storeprofile_bList: [
            { hasDefaultInit: true, id: storeBs[0].id, usenum: storeBs[0].usenum + closednum, _status: "Update" },
            { hasDefaultInit: true, id: storeBs[0].id, leftnum: storeBs[0].leftnum - closednum, _status: "Update" }
          ]
        };
      }
      var res = ObjectStore.updateById("GT80750AT4.GT80750AT4.storeprofile", object);
      //记录行回写
      if (isclosed) {
        let storeUseSql = `select id, orderCode, product_name,allNums,useNums,a.pubts as pubts from GT80750AT4.GT80750AT4.specialoffer_b_use left join 
           GT80750AT4.GT80750AT4.storeprofile a on a.id = storeprofile_id 
           where a.id = 'youridHere' and product_name = '${productid}' and orderCode= '${orderCode}' and useNums='${closednum}' `;
        let storeUseBs = ObjectStore.queryByYonQL(storeUseSql);
        if (storeUseBs == undefined || storeUseBs.length == 0 || closednum == 0) {
          return { code: 200, message: "success", data: "回写成功" };
        }
        //删除记录
        var deleteData = { id: storeid, pubts: storeUseBs[0].pubts, specialoffer_b_useList: [{ id: storeUseBs[0].id, _status: "Delete" }] };
        let deleteDataResult = ObjectStore.updateById("GT80750AT4.GT80750AT4.storeprofile", deleteData);
      } else {
        var insert = {
          id: storeid,
          specialoffer_b_useList: [{ hasDefaultInit: true, orderCode: orderCode, product_name: productid, allNums: storeBs[0].specilnum, useNums: closednum, _status: "Insert" }]
        };
        let endUseLeftNumRes = ObjectStore.updateById("GT80750AT4.GT80750AT4.storeprofile", insert);
      }
    }
    return { code: 200, message: "success", data: res };
  }
}
exports({ entryPoint: MyAPIHandler });