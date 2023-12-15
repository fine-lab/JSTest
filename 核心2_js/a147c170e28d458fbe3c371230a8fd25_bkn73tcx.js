let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let dateparam = request.dateparam;
    let subdate = substring(dateparam, 0, 7);
    let cgsql = "select dept_code,tongjiyuefen,id from GT62472AT6.GT62472AT6.cbft where ispz='false' and dr=0 and tongjiyuefen leftlike '" + subdate + "'";
    let cgres = ObjectStore.queryByYonQL(cgsql);
    let result = [];
    if (cgres.length > 0) {
      let func = extrequire("GT99994AT1.api.getWayUrl");
      let funcres = func.execute(null);
      var httpurl = funcres.gatewayUrl;
      let func1 = extrequire("GT99994AT1.frontDesignerFunction.getApiToken");
      let res = func1.execute(null);
      let token = res.access_token;
      let yssxSaveurl = httpurl + "/yonbip/fi/ficloud/openapi/voucher/addVoucher?access_token=" + token;
      let contenttype = "application/json;charset=UTF-8";
      let message = "";
      let header = {
        "Content-Type": contenttype
      };
      for (var i = 0; i < cgres.length; i++) {
        let cg = cgres[i];
        let xmsql = "select * from GT62472AT6.GT62472AT6.xmgstj where dr=0 and cbft_id='" + cg.id + "'";
        let fysql = "select * from GT62472AT6.GT62472AT6.zzfymxs where cbft_id='" + cg.id + "'";
        let xmres = ObjectStore.queryByYonQL(xmsql);
        let fyres = ObjectStore.queryByYonQL(fysql);
        let accbookCode = cg.dept_code == "JJ-B03" ? "JJ0001" : "0010001";
        let body = {
          accbookCode: accbookCode,
          voucherTypeCode: "1",
          makerMobile: "13570089953",
          makeTime: dateparam
        };
        let bodies = [];
        for (var j = 0; j < xmres.length; j++) {
          let xm = xmres[j];
          if (xm.xiangmufentanrengongchengben != 0.0) {
            let rgjf = {
              description: "人工成本",
              accsubjectCode: "14060205",
              debitOriginal: xm.xiangmufentanrengongchengben,
              debitOrg: xm.xiangmufentanrengongchengben,
              rateType: "01",
              clientAuxiliaryList: [
                {
                  //部门
                  filedCode: "0001",
                  valueCode: cg.dept_code
                },
                {
                  filedCode: "0002",
                  valueCode: xm.xm_code
                }
              ]
            };
            bodies.push(rgjf);
          }
          if (xm.xiangmufentanzhizaofeiyong != 0.0) {
            let zzjf = {
              description: "制造费用",
              accsubjectCode: "14060206",
              debitOriginal: xm.xiangmufentanzhizaofeiyong,
              debitOrg: xm.xiangmufentanzhizaofeiyong,
              rateType: "01",
              clientAuxiliaryList: [
                {
                  //部门
                  filedCode: "0001",
                  valueCode: cg.dept_code
                },
                {
                  filedCode: "0002",
                  valueCode: xm.xm_code
                }
              ]
            };
            bodies.push(zzjf);
          }
        }
        for (var k = 0; k < fyres.length; k++) {
          let fy = fyres[k];
          let df = {
            description: fy.kemumingcheng,
            accsubjectCode: fy.kemubianma,
            creditOriginal: fy.dangqifashenge,
            creditOrg: fy.dangqifashenge,
            rateType: "01",
            clientAuxiliaryList: [
              {
                //部门
                filedCode: "0001",
                valueCode: cg.dept_code
              }
            ]
          };
          bodies.push(df);
        }
        body.bodies = bodies;
        let yssxResponse = postman("POST", yssxSaveurl, JSON.stringify(header), JSON.stringify(body));
        let yssxresponseobj = JSON.parse(yssxResponse);
        if (yssxresponseobj.code == "200") {
          var object = { id: cg.id, ispz: "true" };
          var updateres = ObjectStore.updateById("GT62472AT6.GT62472AT6.cbft", object, "3be5b8fc");
        }
        let returnBody = {
          code: yssxresponseobj.code,
          message: "月份：" + subdate + "部门：" + cg.dept_code + yssxresponseobj.message
        };
        result.push(returnBody);
      }
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });