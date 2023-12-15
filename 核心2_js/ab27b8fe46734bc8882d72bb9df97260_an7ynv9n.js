let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //相关参数
    let num = request.num;
    let storeid = request.storeid;
    let productid = request.productid;
    let isAudit = request.isAudit;
    let orderCode = request.orderCode;
    var object = ""; //更新实体对象参数
    var productBSql = ""; //查询特价商品语句
    var storeSql = ""; //查询新开门店语句
    var product; //查询特价商品档案
    var storeBs; //查询新开门店档案
    if (num == undefined || num == "") {
      num = 0;
    }
    let profileid = getSpecialId(storeid);
    if (isAudit) {
      var res = auditWriteBack(profileid, num, productid, orderCode);
    } else {
      var res = unAuditWriteBack(profileid, num, productid, orderCode);
    }
    return { code: 200, message: "success", data: res };
    //审批后回写
    function auditWriteBack(profileid, num, productid, orderCode) {
      //查询对应的门店商品信息是否存在
      //审批后需要校验商品的截止日期
      let currentDate = new Date(); // 获取当前日期时间
      let currentDateISO = currentDate.toISOString().slice(0, 10); //截取年月日
      //两步校验
      productBSql = `select 1 from GT80750AT4.GT80750AT4.specialoffer_b left join 
                      GT80750AT4.GT80750AT4.specialoffer a on specialoffer_id = a.id 
                      where specialoffer_id = 'youridHere'and product_id = 'youridHere'
                      and stopdate >= '${currentDateISO}' and a.begintime <= '${currentDateISO}'  
                      and a.endtime >= '${currentDateISO}'`;
      product = ObjectStore.queryByYonQL(productBSql);
      //查询所选门店对应的商品
      storeSql = `select id, usenum, leftnum,specilnum from GT80750AT4.GT80750AT4.storeprofile_b left join 
                   GT80750AT4.GT80750AT4.storeprofile a on a.id = storeprofile_id 
                   where a.id = 'youridHere' and product_name = '${productid}'`;
      storeBs = ObjectStore.queryByYonQL(storeSql);
      //查不到就不回写了
      if (product == undefined || product.length == 0 || storeBs == undefined || storeBs.length == 0) {
        return;
      }
      //接着判断数量
      let left = storeBs[0].leftnum; //门店商品剩余数量
      let endUseLeftNum = 0;
      //剩余数量小于下单数量 剩余数量变为0
      if (left < num) {
        endUseLeftNum = left;
        object = {
          id: storeid,
          storeprofile_bList: [
            { hasDefaultInit: true, id: storeBs[0].id, usenum: storeBs[0].usenum + left, _status: "Update" },
            { hasDefaultInit: true, id: storeBs[0].id, leftnum: 0, _status: "Update" }
          ]
        };
        //剩余数量大于下单数量  区下单数量
      } else {
        endUseLeftNum = num;
        object = {
          id: storeid,
          storeprofile_bList: [
            { hasDefaultInit: true, id: storeBs[0].id, usenum: storeBs[0].usenum + num, _status: "Update" },
            { hasDefaultInit: true, id: storeBs[0].id, leftnum: left - num, _status: "Update" }
          ]
        };
      }
      let res = ObjectStore.updateById("GT80750AT4.GT80750AT4.storeprofile", object);
      if (endUseLeftNum != 0) {
        var insert = {
          id: storeid,
          specialoffer_b_useList: [{ hasDefaultInit: true, orderCode: orderCode, product_name: productid, allNums: storeBs[0].specilnum, useNums: endUseLeftNum, _status: "Insert" }]
        };
        let endUseLeftNumRes = ObjectStore.updateById("GT80750AT4.GT80750AT4.storeprofile", insert);
      }
      return res;
    }
    //弃审后回写
    function unAuditWriteBack(profileid, num, productid, orderCode) {
      //弃审就不管截止日期了 但sql还是得跑
      productBSql = `select 1 from GT80750AT4.GT80750AT4.specialoffer_b left join 
                      GT80750AT4.GT80750AT4.specialoffer a on specialoffer_id = a.id 
                      where specialoffer_id = 'youridHere' and product_id = 'youridHere'`;
      product = ObjectStore.queryByYonQL(productBSql);
      //查询所选门店对应的商品
      storeSql = `select id, usenum, leftnum from GT80750AT4.GT80750AT4.storeprofile_b left join 
                   GT80750AT4.GT80750AT4.storeprofile a on a.id = storeprofile_id 
                   where a.id = 'youridHere' and product_name = '${productid}'`;
      storeBs = ObjectStore.queryByYonQL(storeSql);
      //查不到就不回写了
      if (product == undefined || product.length == 0 || storeBs == undefined || storeBs.length == 0) {
        return;
      }
      //数量也不用判断了 直接加回去
      //还是判断下 防止出现负数
      if (storeBs[0].usenum == 0) {
        return;
      }
      object = {
        id: storeid,
        storeprofile_bList: [
          { hasDefaultInit: true, id: storeBs[0].id, usenum: storeBs[0].usenum - num, _status: "Update" },
          { hasDefaultInit: true, id: storeBs[0].id, leftnum: storeBs[0].leftnum + num, _status: "Update" }
        ]
      };
      let res = ObjectStore.updateById("GT80750AT4.GT80750AT4.storeprofile", object);
      let storeUseSql = `select id, orderCode, product_name,allNums,useNums,a.pubts as pubts from GT80750AT4.GT80750AT4.specialoffer_b_use left join 
           GT80750AT4.GT80750AT4.storeprofile a on a.id = storeprofile_id 
           where a.id = 'youridHere' and product_name = '${productid}' and orderCode= '${orderCode}' and useNums='${num}' `;
      let storeUseBs = ObjectStore.queryByYonQL(storeUseSql);
      if (storeUseBs == undefined || storeUseBs.length == 0 || num == 0) {
        return;
      }
      //删除记录
      var deleteData = { id: storeid, pubts: storeUseBs[0].pubts, specialoffer_b_useList: [{ id: storeUseBs[0].id, _status: "Delete" }] };
      let deleteDataResult = ObjectStore.updateById("GT80750AT4.GT80750AT4.storeprofile", deleteData);
      return res;
    }
    function getSpecialId(storeid) {
      //获取订单上选取的门店对应的特价规则id
      let profileIdSql = "select businessprofile from GT80750AT4.GT80750AT4.storeprofile where id = '" + storeid + "'";
      let profileId = ObjectStore.queryByYonQL(profileIdSql)[0].businessprofile;
      return profileId;
    }
  }
}
exports({ entryPoint: MyAPIHandler });