let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let cbgj = request.cbgj;
    let id = request.cbgj.id;
    let clientCode = "";
    let gjsql = "select projectCode,huijiqijian from GT62395AT3.GT62395AT3.cbgjnew where id='" + id + "' and dr=0";
    let gjres = ObjectStore.queryByYonQL(gjsql);
    // 三和部门编码
    let shdeptCode = request.cbgj.shDeptCode;
    let deptsql = "select dept_code from GT59740AT1.GT59740AT1.deptConfig where dr=0 and sh_dept_code='" + shdeptCode + "'";
    let deptres = ObjectStore.queryByYonQL(deptsql);
    let result = {};
    if (gjres.length > 0 && deptres.length > 0) {
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
      let gj = gjres[0];
      let body = {
        accbookCode: "0010001",
        voucherTypeCode: "1",
        makerMobile: "13570089953",
        makeTime: gj.huijiqijian
      };
      let bodies = [];
      let htzcyhtfznew = cbgj.htzcyhtfznew;
      let benqidixiao = 0;
      if (htzcyhtfznew[0].benqidixiaohetongfuzhai != 0) {
        benqidixiao = htzcyhtfznew[0].benqidixiaohetongfuzhai;
      }
      if (htzcyhtfznew[0].benqidixiaohetongzichan != 0) {
        benqidixiao = htzcyhtfznew[0].benqidixiaohetongzichan;
      }
      if (benqidixiao != 0) {
        let sqlxm = "select  defineCharacter.attrext2 define2 from bd.project.ProjectVO where code='" + gj.projectCode + "'";
        var resxm = ObjectStore.queryByYonQL(sqlxm, "ucfbasedoc");
        if (resxm.length > 0) {
          let sqlkh = "select code from aa.merchant.Merchant where name='" + resxm[0].define2 + "'";
          var reskh = ObjectStore.queryByYonQL(sqlkh, "productcenter");
          clientCode = reskh[0].code;
        } else {
          result = {
            code: "999",
            message: "月份：" + gj.huijiqijian + "合同：" + gj.projectCode + "未配置委托客户"
          };
          return result;
        }
      } else {
        result = {
          code: "999",
          message: "月份：" + gj.huijiqijian + "合同：" + gj.projectCode + "合同资产、负债冲销为0，不需要生成凭证"
        };
        return result;
      }
      // 借方
      let fwjf = {
        description: substring(gj.huijiqijian, 0, 7) + "抵消合同资产、合同负债" + deptres[0].dept_code,
        accsubjectCode: "2204",
        debitOriginal: benqidixiao,
        debitOrg: benqidixiao,
        rateType: "01",
        clientAuxiliaryList: [
          {
            //部门
            filedCode: "0001",
            valueCode: deptres[0].dept_code
          },
          // 项目
          {
            filedCode: "0002",
            valueCode: gj.projectCode
          },
          // 客户
          {
            filedCode: "0005",
            valueCode: clientCode
          }
        ]
      };
      bodies.push(fwjf);
      // 贷方
      let rgdf = {
        description: substring(gj.huijiqijian, 0, 7) + "抵消合同资产、合同负债" + deptres[0].dept_code,
        accsubjectCode: "1409",
        creditOriginal: benqidixiao,
        creditOrg: benqidixiao,
        rateType: "01",
        clientAuxiliaryList: [
          {
            //部门
            filedCode: "0001",
            valueCode: deptres[0].dept_code
          },
          {
            filedCode: "0002",
            valueCode: gj.projectCode
          },
          // 客户
          {
            filedCode: "0005",
            valueCode: clientCode
          }
        ]
      };
      bodies.push(rgdf);
      if (bodies.length > 0) {
        body.bodies = bodies;
        let yssxResponse = postman("POST", yssxSaveurl, JSON.stringify(header), JSON.stringify(body));
        let yssxresponseobj = JSON.parse(yssxResponse);
        if (yssxresponseobj.code == "200") {
          result = {
            code: yssxresponseobj.code,
            message: "月份：" + gj.huijiqijian + "合同：" + gj.projectCode + "合同资产、负债冲销生成凭证成功"
          };
        } else {
          result = {
            code: yssxresponseobj.code,
            message: "月份：" + gj.huijiqijian + "合同：" + gj.projectCode + "合同资产、负债冲销生成凭证失败：" + yssxresponseobj.message
          };
        }
      } else {
        result = {
          code: 200,
          message: "合同资产、负债冲销项金额都为0，无需生成凭证"
        };
      }
    } else {
      result = {
        code: 999,
        message: "合同资产、负债冲销所属成本归集有误或部门映射有误"
      };
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });