let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rows = request.rows;
    let func1 = extrequire("GT59740AT1.backDefaultGroup.getApiToken");
    let resToken = func1.execute();
    let token = resToken.access_token;
    let xmurl = "https://www.example.com/" + token;
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    rows.forEach((row) => {
      if (row.hetongleixing_name == "常规合同") {
        var object = { ziduan2: row.hetongbianhao };
        var cgres = ObjectStore.selectByMap("GT59740AT1.GT59740AT1.RJ01", object);
        var bgje = 0.0;
        if (cgres.length > 0) {
          cgres.forEach((res) => {
            bgje += res.baogaojine;
          });
        }
        let xmbody = {
          code: row.hetongbianhao,
          pageIndex: 1,
          pageSize: 10
        };
        let httotalMoney = 0.0;
        let ystitalMoney = 0.0;
        let cbjz = 0.0;
        let xmResponse = postman("POST", xmurl, JSON.stringify(header), JSON.stringify(xmbody));
        let xmresponseobj = JSON.parse(xmResponse);
        if ("200" == xmresponseobj.code) {
          let xmrst = xmresponseobj.data;
          let xmrecordList = xmrst.recordList;
          if (xmrecordList.length > 0) {
            let defines = xmrecordList[0].defines;
            httotalMoney = defines.define6;
            ystitalMoney = defines.define12;
          }
        }
        if (httotalMoney != 0.0) {
          cbjz = MoneyFormatReturnBd((bgje / httotalMoney) * ystitalMoney, 8);
        }
        var cbjzobject = { jieyulvyuechengben: "value", benqijiezhuanchengben: cbjz, chengbenjiezhuanbili: 1, maolilv: 1, cbgj_id: row.id };
        var cgSaveres = ObjectStore.insert("GT62395AT3.GT62395AT3.cbjz", object, "b75e9387");
      } else if (row.hetongleixing_name == "单价合同") {
        var object = { ziduan2: row.hetongbianhao };
        var cgres = ObjectStore.selectByMap("GT59740AT1.GT59740AT1.RJ01", object);
        var bgje = 0.0;
        if (cgres.length > 0) {
          cgres.forEach((res) => {
            bgje += res.baogaojine;
          });
        }
        let xmbody = {
          code: row.hetongbianhao,
          pageIndex: 1,
          pageSize: 10
        };
        let httotalMoney = 0.0;
        let ystitalMoney = 0.0;
        let djjz = 0.0;
        let xmResponse = postman("POST", xmurl, JSON.stringify(header), JSON.stringify(xmbody));
        let xmresponseobj = JSON.parse(xmResponse);
        if ("200" == xmresponseobj.code) {
          let xmrst = xmresponseobj.data;
          let xmrecordList = xmrst.recordList;
          if (xmrecordList.length > 0) {
            let defines = xmrecordList[0].defines;
            httotalMoney = defines.define6;
          }
        }
        var object = { cbgj_id: row.id };
        var rgres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.rgcb", object);
        var lwres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.lwcb", object);
        var ysres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.yscb", object);
        var fwres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.fwcb", object);
        var zzres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.zzfy", object);
        rgres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        rgres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        lwres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        ysres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        fwres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        zzres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        if (httotalMoney != 0.0) {
          djjz = MoneyFormatReturnBd((bgje / httotalMoney) * ystitalMoney, 8);
        }
        var djjzobject = { jieyulvyuechengben: "value", benqijiezhuanchengben: cbjz, chengbenjiezhuanbili: 1, maolilv: 1, cbgj_id: row.id };
        var djSaveres = ObjectStore.insert("GT62395AT3.GT62395AT3.cbjz", object, "b75e9387");
      } else if (row.hetongleixing_name == "总包干合同") {
        var object = { cbgj_id: row.id };
        var rgres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.rgcb", object);
        var lwres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.lwcb", object);
        var ysres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.yscb", object);
        var fwres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.fwcb", object);
        var zzres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.zzfy", object);
        rgres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        rgres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        lwres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        ysres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        fwres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        zzres.forEach((res) => {
          ystitalMoney += benqifasheng;
        });
        var zbgjzobject = { jieyulvyuechengben: "value", benqijiezhuanchengben: ystitalMoney, chengbenjiezhuanbili: 1, maolilv: 1, cbgj_id: row.id };
        var cgSaveres = ObjectStore.insert("GT62395AT3.GT62395AT3.cbjz", object, "b75e9387");
      }
    });
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });