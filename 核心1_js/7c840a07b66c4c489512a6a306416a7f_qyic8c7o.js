let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let logObject = {
      log_contractid: id,
      log_sync_is_last: "是",
      log_sync_status: "成功",
      log_sync_source: "合同生效"
    };
    let logRes = ObjectStore.selectByMap("GT3407AT1.GT3407AT1.yc_contract_sync_log", logObject, "yb5b1f52c8");
    //如果已经存在合同生效并且同步成功的日志，则表示本次是变更
    let isChanging = "N";
    if (logRes && logRes.length > 0) {
      isChanging = "Y";
    }
    //查询采购合同信息
    let url = "https://www.example.com/" + id;
    let apiResponse = openLinker("GET", url, "ycContractManagement", JSON.stringify({}));
    let con = JSON.parse(apiResponse).data;
    //获取创建人的员工信息
    let creator = con.creator;
    let upUrl = "https://www.example.com/";
    let upParam = {
      userId: [creator]
    };
    let upObj = openLinker("POST", upUrl, "ycContractManagement", JSON.stringify(upParam));
    let psnid = JSON.parse(upObj).data.data[0].id;
    let psnUrl = "https://www.example.com/" + psnid;
    let psnObj = openLinker("GET", psnUrl, "ycContractManagement", JSON.stringify({}));
    let creatorDetail = JSON.parse(psnObj).data;
    let erpUserCode = creatorDetail.email.split("@")[0];
    //盖章单位
    let firstPartyId = con.firstPartyId;
    let firstPartyUrl = "https://www.example.com/" + firstPartyId;
    let firstPartyObj = openLinker("GET", firstPartyUrl, "ycContractManagement", JSON.stringify({}));
    let firstPartyOrg = JSON.parse(firstPartyObj).data;
    let firstPartyCode = firstPartyOrg.code;
    //供应商
    let supplierId = con.supplierId;
    let supUrl = "https://www.example.com/" + supplierId;
    let supObj = openLinker("GET", supUrl, "ycContractManagement", JSON.stringify({}));
    let supplierDoc = JSON.parse(supObj).data;
    let erpSupplierCode = supplierDoc.erpCode;
    //采购部门
    let deptId = con.deptId;
    let deptUrl = "https://www.example.com/" + deptId;
    let deptObj = openLinker("GET", deptUrl, "ycContractManagement", JSON.stringify({}));
    let deptDoc = JSON.parse(deptObj).data;
    let deptCode = deptDoc.code;
    //采购员
    let purPersonId = con.purPersonId;
    psnUrl = "https://www.example.com/" + purPersonId;
    let purPsnObj = openLinker("GET", psnUrl, "ycContractManagement", JSON.stringify({}));
    let purPsnDetail = JSON.parse(purPsnObj).data;
    let purPersonCode = purPsnDetail.code;
    let body = [];
    var timestampToTime = function (timestamp) {
      var date = new Date(timestamp);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? "0" + date.getSeonds() : date.getSeconds();
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    //设置时间带时分秒
    var formatDateTime = function (d) {
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
      var gmt = localTime + localOffset; //GMT时间
      var offset = 8; //东8区
      var beijing = gmt + 3600000 * offset;
      var date = new Date(beijing);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? "0" + date.getSeonds() : date.getSeconds();
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    let param = {
      head: {
        subject: con.subject, //合同名称
        memo: con.memo, //备注
        valdate: timestampToTime(con.subscribedate), //签订日期
        erpUserCode: erpUserCode, //合同创建人
        pk_org: firstPartyCode, //盖章单位编码
        id: con.id, //采购合同id
        currencyId: con.currencyId, //币种ID
        currencyCode: con.currencyCode, //币种编码
        currencyName: con.currencyName, //币种名称
        erpSupId: erpSupplierCode, //erp供应商id
        taxMoney: con.taxMoney, //价税合计
        erpDeptPk: deptCode, //采购部门 编码
        erpDeptName: deptCode, //采购部门 编码
        erpDeptCode: deptCode, //采购部门 编码
        sourceType: con.sourceType, //合同来源类型
        billno: con.billno, //采购合同编码
        PurCategoryName: con["define1_name"], //采购类别
        subscribedate: timestampToTime(con.subscribedate), //签订日期
        cvendorid: erpSupplierCode, //erp供应商id
        yccontractId: con.id, //采购合同id
        yccontractCode: con.billno, //采购合同编码
        orgId: firstPartyCode, //盖章单位编码
        firstPartyId: firstPartyCode, //盖章单位编码
        erpOrgCode: firstPartyCode, //盖章单位编码
        personnelid: purPersonCode, //采购员编码
        erpPersionCode: purPersonCode, //采购员编码
        creator: creatorDetail.email, //创建人邮箱
        money: con.money, //无税金额
        ctname: con.subject, //合同名称
        field6: con["define1_name"] //采购类别
      }
    };
    let contractMaterialList = con.contractMaterialList;
    for (var i = 0; i < contractMaterialList.length; i++) {
      let bd = {
        materialDesc: "",
        num: contractMaterialList[i].num, //数量
        nastnum: contractMaterialList[i].num, //数量
        pk_material: "0001A210000000BCQN5J", //物料
        erpMaterialClassId: "yourIdHere", //物料分类
        erpMaterialId: "yourIdHere", //物料
        id: contractMaterialList[i].id, //主键
        taxrate: contractMaterialList[i].taxrate, //税率
        ntaxrate: contractMaterialList[i].taxrate, //税率
        nqtorigtaxprice: contractMaterialList[i].taxPrice, //含税单价
        taxPrice: contractMaterialList[i].taxPrice, //含税单价
        materialName: contractMaterialList[i].materialId_name, //物料名称
        ycContractBId: contractMaterialList[i].id //主键
      };
      body.push(bd);
    }
    param.body = body;
    let ncbody = {
      itype: "nc.impl.pcm.contract.pub.CGYToSubContractServiceImpl",
      info: JSON.stringify(param)
    };
    let ncheader = {};
    let ncurl = "https://www.example.com/";
    let strResponse = postman("post", ncurl, JSON.stringify(ncheader), JSON.stringify(ncbody));
    let erpCtCode = "";
    let erpCtbid = "";
    let erpCtid = "";
    let ycctbid = "";
    let ycctcode = "";
    let ycctid = "";
    let log_sync_status = "失败";
    if (JSON.parse(strResponse).status == "success" && JSON.parse(JSON.parse(strResponse).data).status == "success") {
      let erpct = JSON.parse(JSON.parse(JSON.parse(strResponse).data).data)[0];
      erpCtCode = erpct.erpCtCode;
      erpCtbid = erpct.erpCtbid;
      erpCtid = erpct.erpCtid;
      ycctbid = erpct.ycctbid;
      ycctcode = erpct.ycctcode;
      ycctid = erpct.ycctid;
      log_sync_status = "成功";
    }
    if (log_sync_status == "成功") {
      var updateWrapper = new Wrapper();
      updateWrapper.eq("log_contractid", con.id);
      updateWrapper.eq("log_sync_is_last", "是");
      updateWrapper.eq("log_sync_status", "成功");
      updateWrapper.eq("log_sync_source", isChanging == "Y" ? "合同变更" : "合同生效");
      // 待更新字段内容
      var toUpdate = { log_sync_is_last: "否" };
      ObjectStore.update("GT3407AT1.GT3407AT1.yc_contract_sync_log", toUpdate, updateWrapper, "yb5b1f52c8");
    }
    var insertlogobject = {
      log_billno: con.billno,
      log_contractid: con.id,
      log_erp_contract_code: erpCtCode,
      log_erp_contrct_id: erpCtid,
      log_sync_param: JSON.stringify(ncbody),
      log_sync_result: strResponse,
      log_sync_is_last: log_sync_status == "成功" ? "是" : "否",
      log_sync_status: log_sync_status,
      log_sync_source: isChanging == "Y" ? "合同变更" : "合同生效",
      log_sync_time: formatDateTime(new Date()),
      log_sync_user: JSON.parse(AppContext()).currentUser.name
    };
    var res = ObjectStore.insert("GT3407AT1.GT3407AT1.yc_contract_sync_log", insertlogobject, "yb5b1f52c8");
    return JSON.parse(strResponse);
  }
}
exports({ entryPoint: MyAPIHandler });