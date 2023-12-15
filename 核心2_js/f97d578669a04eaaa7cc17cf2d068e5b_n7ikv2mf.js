let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //预提单id
    var id = request.id;
    var result = {};
    //根据预提单id获取预提单详情
    var object = {
      id: id,
      compositions: [
        {
          name: "apply_partner_detailList"
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("GT5258AT16.GT5258AT16.apply_outs_resource_prl", object);
    result.res = res;
    var publicNum = res.publicNum;
    if (!publicNum) publicNum = 0;
    //设置时间带时分秒
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh;
      var mm;
      var ss;
      try {
        hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      } catch (e) {
        hh = "00";
      }
      try {
        mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      } catch (e) {
        mm = "00";
      }
      try {
        ss = date.getSeconds() < 10 ? "0" + date.getSeonds() : date.getSeconds();
      } catch (e) {
        ss = "00";
      }
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    var updateList = [];
    var d = new Date(); //创建一个Date对象
    var localTime = d.getTime();
    var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
    var gmt = localTime + localOffset; //GMT时间
    var offset = 8; //东8区
    var beijing = gmt + 3600000 * offset;
    var nd = new Date(beijing);
    var currentTime = formatDateTime(nd);
    var insertList = [];
    //遍历预提单的伙伴明细
    var partnerList = res.apply_partner_detailList;
    if (partnerList && partnerList.length > 0) {
      for (var num = 0; num < partnerList.length; num++) {
        var partner = partnerList[num];
        //如果未发布则生成反馈单，并且进行消息通知
        if (partner.isPublic != "Y") {
          var fkd = {
            billName: res.billName,
            billType: res.billType,
            billDate: res.billDate,
            linkman: res.linkman,
            position: res.position,
            mobile: res.mobile,
            projectName: res.projectName,
            isSignContract: res.isSignContract,
            projectArea: res.projectArea,
            prductPlatform: res.prductPlatform,
            expectDeliverTime: res.expectDeliverTime,
            expectEnterTime: res.expectEnterTime,
            deliveryTypes: res.deliveryTypes,
            cooperationMode: res.cooperation_mode_prl,
            personNum: res.personNum,
            expectPeriod: res.expectPeriod,
            workAmount: res.workAmount,
            deliveryMode: res.deliveryMode,
            newField: res.newField,
            field: res.field,
            hasWorkAssignment: res.hasWorkAssignment,
            attachment: res.attachment,
            detailDesc: res.detailDesc,
            responseStatus: "1",
            sourceOrg: res.org_id,
            sourceOrgName: res.orgName,
            sourceBillCode: res.code,
            offerApply: res.offerApply,
            offerApplyPhone: res.offerApplyPhone,
            source_id: res.id,
            sourcechild_id: partner.id,
            org_id: partner.partner,
            yhtUserid: partner.yhtUserid,
            partnerName: partner.partnerName,
            isClose: "N"
          };
          insertList.push(fkd);
          updateList.push({ id: partner.id, isPublic: "Y", publicTime: currentTime, _status: "Update" });
        }
      }
    }
    result.insertList = insertList;
    result.updateList = updateList;
    if (insertList.length > 0) {
      //批量插入反馈单
      var res222 = ObjectStore.insertBatch("GT5258AT16.GT5258AT16.duty_outs_resource_prl", insertList, "af1fd42b");
      result.insertRes = res222;
      publicNum = publicNum + 1;
      var updateObject = { id: id, isPublic: "Y", publicNum: publicNum, apply_partner_detailList: updateList };
      var updateRes222 = ObjectStore.updateById("GT5258AT16.GT5258AT16.apply_outs_resource_prl", updateObject, "9053a2cc");
      result.updateRes222 = updateRes222;
      try {
        for (var num11 = 0; num11 < res222.length; num11++) {
          let sendMsgToPartner = extrequire("GT5258AT16.yswbzyytd.sendMsgPartner2");
          let msgRes = sendMsgToPartner.execute(res222[num11]);
          result.msgRes = msgRes;
        }
      } catch (e) {}
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });