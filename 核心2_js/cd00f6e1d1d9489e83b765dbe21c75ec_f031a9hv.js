let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pageIndex = request.pageIndex;
    let pageSize = request.pageSize;
    let agentCode = request.agentCode;
    let materialCode = request.materialCode;
    let materialName = request.materialName;
    let meaname = request.meaname;
    let wlbillno = request.wlbillno;
    //调用NCC接口获取数据
    let body = {
      fxs: agentCode,
      material_code: materialCode,
      number: JSON.stringify(pageSize),
      startPage: JSON.stringify(pageIndex),
      material_name: materialName,
      meaname: meaname,
      wlbillno: wlbillno
    };
    let wfdtass = postman("post", "https://www.example.com/", null, JSON.stringify(body));
    let res = [];
    let wfdtassobj = JSON.parse(wfdtass);
    if (wfdtassobj.code == 200) {
      let dataarrs = wfdtassobj.data;
      for (let i = 0; i < dataarrs.length; i++) {
        let wfdata = dataarrs[i];
        res.push({
          billno: wfdata.vbillcode,
          address: wfdata.shdz,
          materialCode: wfdata.material_code,
          company: wfdata.orgname,
          dw: wfdata.meaname,
          materialName: wfdata.material_name,
          num: wfdata.nnum,
          numbers: wfdata.wlbillno,
          receiver: wfdata.shr,
          receiverphone: wfdata.shrphone,
          sendDate: wfdata.dbilldate,
          ssfxs: wfdata.fxs,
          note: wfdata.vnote,
          ntotaloutnum: wfdata.ntotaloutnum,
          cunitid: wfdata.cunitid,
          nastnum: wfdata.nastnum
        });
      }
    }
    return { data: res, total: wfdtassobj.total };
  }
}
exports({ entryPoint: MyAPIHandler });