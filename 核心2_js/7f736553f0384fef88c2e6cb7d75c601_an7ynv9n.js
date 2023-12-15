let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var param = { code: request.code };
    var orderControlParam = ObjectStore.selectByMap("GT80750AT4.GT80750AT4.orderControlParam", param);
    var result = [];
    orderControlParam.forEach((data) => {
      let orgIds = [];
      var controOrgids = ObjectStore.selectByMap("GT80750AT4.GT80750AT4.orderControlParam_controOrgid", { fkid: data.id });
      if (request.orgId && controOrgids.length) {
        if (data.isControSubordinate === "Y") {
          //允许匹配下级部门
          if (controOrgids.map((item) => item.controOrgid).includes(result.orgId)) {
            result.push({
              code: data.code,
              name: data.name,
              controOrgid: controOrgids,
              enable: data.enable,
              value: data.value
            });
          } else {
            let body = { flag: false, enable: 1, orgId: request.orgId };
            let url = "https://www.example.com/";
            let resu = openLinker("POST", url, "GT80750AT4", JSON.stringify(body));
            resu = JSON.parse(resu);
            if (resu.code == 200) {
              for (let i = 0; i < resu.data.length; i++) {
                if (controOrgids.map((z) => z.controOrgid).includes(resu.data[i].id)) {
                  result.push({
                    code: data.code,
                    name: data.name,
                    controOrgid: controOrgids,
                    enable: data.enable,
                    value: data.value
                  });
                  break;
                }
              }
            }
          }
        } else {
          //不允许匹配下级部门
          if (controOrgids.map((item) => item.controOrgid).includes(result.orgId)) {
            result.push({
              code: data.code,
              name: data.name,
              controOrgid: controOrgids,
              enable: data.enable,
              value: data.value
            });
          }
        }
      } else {
        result.push({
          code: data.code,
          name: data.name,
          controOrgid: JSON.stringify(data.controOrgid),
          enable: data.enable,
          value: data.value
        });
      }
    }); //throw new Error("接口报错："+data.value+"结束")
    return {
      code: 200,
      data: result
    };
  }
}
exports({ entryPoint: MyAPIHandler });