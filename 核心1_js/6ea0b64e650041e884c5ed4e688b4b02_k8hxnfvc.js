let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let username = "张三";
    let id = param.data[0].id;
    //调用费控开放API查询当前差旅报销单详细信息
    let body2 = {};
    let queryurl = "https://www.example.com/" + id;
    let res = openLinker("GET", queryurl, "RBSM", JSON.stringify(body2));
    var apiResponse = JSON.parse(res);
    if (apiResponse.code !== "200") {
      throw new Error("报销单查询失败：" + apiResponse.message);
    }
    var mailReceiver2 = ["https://www.example.com/"];
    var channels2 = ["mail"];
    var content2 = JSON.stringify(apiResponse);
    var messageInfo2 = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver2,
      channels: channels2,
      subject: "报销单审批参数2",
      content: content2
    };
    var result2 = sendMessage(messageInfo2);
    //调用费控保存API更新数据
    let body1 = {
      data: {
        resubmitCheckKey: id,
        id: id,
        dcostdate: apiResponse.data.dcostdate,
        vouchdate: apiResponse.data.vouchdate,
        nnatbaseexchrate: apiResponse.data.nnatbaseexchrate,
        vnatexchratetype: apiResponse.data.vnatexchratetype,
        dnatexchratedate: apiResponse.data.dnatexchratedate,
        nnatexchrate: apiResponse.data.nnatexchrate,
        cfinaceorg: apiResponse.data.cfinaceorg,
        vfinacedeptid: apiResponse.data.vfinacedeptid,
        vcurrency: apiResponse.data.vcurrency,
        bustype: apiResponse.data.bustype,
        pk_handlepsn: apiResponse.data.pk_handlepsn,
        vnatcurrency: apiResponse.data.vnatcurrency,
        vhandledeptid: apiResponse.data.vhandledeptid,
        chandleorg: apiResponse.data.chandleorg,
        vreason: apiResponse.data.vreason,
        nsummny: apiResponse.data.nsummny,
        nexpensemny: apiResponse.data.nexpensemny,
        nshouldpaymny: apiResponse.data.nshouldpaymny,
        npaymentmny: apiResponse.data.npaymentmny,
        nnatexpensemny: apiResponse.data.nnatexpensemny,
        nnatsummny: apiResponse.data.nnatsummny,
        nnatshouldpaymny: apiResponse.data.nnatshouldpaymny,
        nnatpaymentmny: apiResponse.data.nnatpaymentmny,
        caccountorg: apiResponse.data.caccountorg,
        creatorId: apiResponse.data.creatorId,
        expensebillbs: [
          {
            dbegindate: apiResponse.data.expensebillbs[0].dbegindate,
            denddate: apiResponse.data.expensebillbs[0].denddate,
            id: apiResponse.data.expensebillbs[0].id,
            vhandledeptid: apiResponse.data.expensebillbs[0].vhandledeptid,
            chandleorg: apiResponse.data.expensebillbs[0].chandleorg,
            nshouldpaymny: apiResponse.data.expensebillbs[0].nshouldpaymny,
            caccountorg: apiResponse.data.expensebillbs[0].caccountorg,
            vnatcurrency: apiResponse.data.expensebillbs[0].vnatcurrency,
            nnatexchrate: apiResponse.data.expensebillbs[0].nnatexchrate,
            pk_handlepsn: apiResponse.data.expensebillbs[0].pk_handlepsn,
            npaymentmny: apiResponse.data.expensebillbs[0].npaymentmny,
            nnatpaymentmny: apiResponse.data.expensebillbs[0].nnatpaymentmny,
            vcurrency: apiResponse.data.expensebillbs[0].vcurrency,
            cfinaceorg: apiResponse.data.expensebillbs[0].cfinaceorg,
            nnatbaseexchrate: apiResponse.data.nnatbaseexchrate,
            vfinacedeptid: apiResponse.data.expensebillbs[0].vfinacedeptid,
            nexpensemny: apiResponse.data.expensebillbs[0].nexpensemny,
            nsummny: apiResponse.data.expensebillbs[0].nsummny,
            dnatexchratedate: apiResponse.data.expensebillbs[0].dnatexchratedate,
            nnatshouldpaymny: apiResponse.data.expensebillbs[0].nnatshouldpaymny,
            vnatexchratetype: apiResponse.data.expensebillbs[0].vnatexchratetype,
            nnatexpensemny: apiResponse.data.expensebillbs[0].nnatexpensemny,
            nnatsummny: apiResponse.data.expensebillbs[0].nnatsummny,
            _status: "Update"
          }
        ],
        expapportions: [
          {
            vfinacedeptid: apiResponse.data.expapportions[0].vfinacedeptid,
            id: apiResponse.data.expapportions[0].id,
            cfinaceorg: apiResponse.data.expapportions[0].cfinaceorg,
            caccountorg: apiResponse.data.expapportions[0].caccountorg,
            vcurrency: apiResponse.data.expapportions[0].vcurrency,
            napportmny: apiResponse.data.expapportions[0].napportmny,
            napportnotaxmny: apiResponse.data.expapportions[0].napportnotaxmny,
            nnatapportmny: apiResponse.data.expapportions[0].nnatapportmny,
            nnatapportnotaxmny: apiResponse.data.expapportions[0].nnatapportnotaxmny,
            _status: "Update"
          }
        ],
        expsettleinfos: [
          {
            vbankaccount: apiResponse.data.expsettleinfos[0].vbankaccount,
            id: apiResponse.data.expsettleinfos[0].id,
            vbankaccname: apiResponse.data.expsettleinfos[0].vbankaccname,
            pk_banktype: apiResponse.data.expsettleinfos[0].pk_banktype,
            pk_handlepsnbank: apiResponse.data.expsettleinfos[0].pk_handlepsnbank,
            pk_handlepsn: apiResponse.data.expsettleinfos[0].pk_handlepsn,
            centerpriseorg: apiResponse.data.expsettleinfos[0].centerpriseorg,
            vcurrency: apiResponse.data.expsettleinfos[0].vcurrency,
            vnatcurrency: apiResponse.data.vnatcurrency,
            nnatexchrate: apiResponse.data.expsettleinfos[0].nnatexchrate,
            vsettlecurrency: apiResponse.data.expsettleinfos[0].vsettlecurrency,
            nsummny: apiResponse.data.expsettleinfos[0].nsummny,
            nnatsettlesummny: apiResponse.data.expsettleinfos[0].nnatsettlesummny,
            nsettlesummny: apiResponse.data.expsettleinfos[0].nsettlesummny,
            balatypesrvattr: apiResponse.data.expsettleinfos[0].balatypesrvattr,
            _status: "Update"
          }
        ],
        expensebilluserdefs: {
          define53: username,
          id: id
        },
        _status: "Update"
      }
    };
    var mailReceiver3 = ["https://www.example.com/"];
    var channels3 = ["mail"];
    var content3 = JSON.stringify(body1);
    var messageInfo3 = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver3,
      channels: channels3,
      subject: "报销单审批参数3",
      content: content3
    };
    var result3 = sendMessage(messageInfo3);
    let saveurl = "https://www.example.com/";
    let apiResult = openLinker("POST", saveurl, "RBSM", JSON.stringify(body1));
    var apiResultResponse = JSON.parse(res);
    if (apiResultResponse.code !== "200") {
      throw new Error("报销单更新共享初审人失败：" + apiResultResponse.message);
    }
    var mailReceiver4 = ["https://www.example.com/"];
    var channels4 = ["mail"];
    var messageInfo4 = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver4,
      channels: channels4,
      subject: "报销单审批参数4",
      content: apiResultResponse
    };
    var result4 = sendMessage(messageInfo4);
    return {};
  }
}
exports({ entryPoint: MyTrigger });