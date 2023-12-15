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
    let res = "";
    let toUpdate = { isCost: "1" };
    let response = [];
    for (var i = 0; i < rows.length; i++) {
      let row = rows[i];
      let xmbody = {
        code: row.ziduan2,
        pageIndex: 1,
        pageSize: 10
      };
      let httotalMoney = 0.0;
      let ystitalMoney = 0.0;
      let cbjz = 0.0;
      let yjzcbbl = 0.0;
      let mlv = 0.0;
      let cbgjje = 0.0;
      let xmType = "";
      let xmResponse = postman("POST", xmurl, JSON.stringify(header), JSON.stringify(xmbody));
      let xmresponseobj = JSON.parse(xmResponse);
      if ("200" == xmresponseobj.code) {
        let xmrst = xmresponseobj.data;
        let xmrecordList = xmrst.recordList;
        if (xmrecordList.length > 0) {
          let defines = xmrecordList[0].defines;
          httotalMoney = defines.define6;
          ystitalMoney = defines.define12;
          xmType = xmrecordList[0].classifyid_name;
          let object = { hetongbianhao: row.ziduan2 };
          let rgres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.cbgj", object);
          if (rgres.length > 0) {
            let isEnd = true;
            let cbgj = rgres[0];
            if (xmType == "常规合同") {
              if (httotalMoney != 0.0) {
                cbjz = MoneyFormatReturnBd((row.baogaojine / httotalMoney) * ystitalMoney, 8);
                yjzcbbl = MoneyFormatReturnBd(cbjz / ystitalMoney, 8);
                mlv = MoneyFormatReturnBd((httotalMoney - cbjz) / httotalMoney, 8);
              }
            } else if (xmType == "包干合同" || xmType == "单价合同") {
              let cbgjobject = { cbgj_id: cbgj.id };
              let rgres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.rgcb", cbgjobject);
              let lwres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.lwcb", cbgjobject);
              let ysres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.yscb", cbgjobject);
              let fwres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.fwcb", cbgjobject);
              let zzres = ObjectStore.selectByMap("GT62395AT3.GT62395AT3.zzfy", cbgjobject);
              rgres.forEach((res) => {
                cbgjje += benqifasheng;
              });
              rgres.forEach((res) => {
                cbgjje += benqifasheng;
              });
              lwres.forEach((res) => {
                cbgjje += benqifasheng;
              });
              ysres.forEach((res) => {
                cbgjje += benqifasheng;
              });
              fwres.forEach((res) => {
                cbgjje += benqifasheng;
              });
              zzres.forEach((res) => {
                cbgjje += benqifasheng;
              });
              if (xmType == "单价合同") {
                if (httotalMoney != 0.0) {
                  cbjz = MoneyFormatReturnBd((row.baogaojine / httotalMoney) * cbgjje, 8);
                  yjzcbbl = MoneyFormatReturnBd(cbjz / ystitalMoney, 8);
                  mlv = MoneyFormatReturnBd((httotalMoney - cbjz) / httotalMoney, 8);
                }
              } else {
                isEnd = false;
                var queryObject = { ziduan2: row.ziduan2 };
                var queryRes = ObjectStore.selectByMap("GT59740AT1.GT59740AT1.RJ01", queryObject);
                if (queryRes.length > 0) {
                  queryRes.forEach((row) => {
                    if (row.isEnd == 1) {
                      isEnd = true;
                    }
                  });
                  if (isEnd) {
                    if (httotalMoney != 0.0) {
                      cbjz = MoneyFormatReturnBd(cbgjje, 8);
                      yjzcbbl = MoneyFormatReturnBd(cbjz / ystitalMoney, 8);
                      mlv = MoneyFormatReturnBd((httotalMoney - cbjz) / httotalMoney, 8);
                    }
                  }
                }
              }
            }
            if (isEnd) {
              let cbjzobject = { jieyulvyuechengben: 0, benqijiezhuanchengben: cbjz, chengbenjiezhuanbili: yjzcbbl, maolilv: mlv, cbgj_id: cbgj.id };
              let cgSaveres = ObjectStore.insert("GT62395AT3.GT62395AT3.cbjz", cbjzobject, "b75e9387");
              let updateWrapper = new Wrapper();
              updateWrapper.eq("ziduan1", row.ziduan1);
              updateWrapper.eq("ziduan2", row.ziduan2);
              updateWrapper.eq("baogaobianma", row.baogaobianma);
              // 执行更新
              res = ObjectStore.update("GT59740AT1.GT59740AT1.RJ01", toUpdate, updateWrapper, "7b4816ae");
              response.push({ code: 1, message: "报告" + row.baogaobianma + "成本结转成功" });
            }
          } else {
            response.push({ code: 0, message: "报告涉及项目编号" + row.ziduan2 + "成本归集中未找到" });
          }
        }
      } else {
        response.push({ code: 0, message: "报告涉及项目编号" + row.ziduan2 + "项目档案中未找到" });
      }
    }
    return { response };
  }
}
exports({ entryPoint: MyAPIHandler });