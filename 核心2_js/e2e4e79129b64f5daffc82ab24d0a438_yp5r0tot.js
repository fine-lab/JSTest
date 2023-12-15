let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (JSON.parse(param.requestData).fromOKT) {
      return;
    }
    let tokenfunc = extrequire("GT82072AT3.backDefaultGroup.getOpenApiToken");
    let tokenres = tokenfunc.execute({ appkey: "yourkeyHere", appSecret: "yourSecretHere" });
    var access_token = tokenres.access_token;
    // 调用高德地图api将中文地址转化出 地球经纬度
    let getHeader = {
      Accept: "application/json;charset=UTF-8",
      "Content-Type": "application/json;charset=UTF-8"
    };
    // 获取本客户档案下地址信息中的默认地址
    let merchantAddressInfos = param.data[0].merchantAddressInfos;
    let lnglat;
    let detailByCid;
    let detailByCidReq;
    if (merchantAddressInfos) {
      merchantAddressInfos.forEach((item) => {
        if (item.address) {
          if (item.isDefault || item.isDefault === undefined) {
            var lnglatjson = postman("get", `https://restapi.amap.com/v3/geocode/geo?key=ede8f8d4850bea0a28322f5537730107&s=rsv3&fromYonyou=true&address=${item.address}`, JSON.stringify(getHeader));
            lnglat = JSON.parse(lnglatjson);
            if (lnglat.geocodes) {
              if (lnglat.geocodes[0].location) {
                var lnglatArray = lnglat.geocodes[0].location.split(",");
                // 先根据openApi查询这个客户id的详情数据
                detailByCid = postman("get", `https://c2.yonyoucloud.com/iuap-api-gateway/yonbip/digitalModel/merchant/detail?access_token=${access_token}&id=${param.data[0].id}`);
                detailByCid = JSON.parse(detailByCid);
                if (detailByCid.data) {
                  detailByCid.data.longitude = lnglatArray[0];
                  detailByCid.data.latitude = lnglatArray[1];
                  detailByCid.data._status = "Update";
                  detailByCid.data.fromOKT = true;
                  detailByCidReq = postman(
                    "post",
                    `https://c2.yonyoucloud.com/iuap-api-gateway/yonbip/digitalModel/merchant/save?access_token=${access_token}`,
                    JSON.stringify(getHeader),
                    JSON.stringify({ data: detailByCid.data })
                  );
                }
              }
            }
          } else if (item.isDefault === false) {
          }
        }
      });
    }
    let header = {
      "Content-Type": "application/xml"
    };
    let body = `<?xml version="1.0" encoding='UTF-8'?>
<ufinterface account="develop" billtype="customer" businessunitcode="" filename="" groupcode="" isexchange="Y" orgcode="" receiver="" replace="Y" roottag="" sender="001">
    <bill id="">
        <billhead></billhead>
    </bill>
</ufinterface>
`;
    param.data[0].execType = "1";
    param.data[0].lnglat = lnglat;
    param.data[0].access_token = access_token;
    param.data[0].detailByCid = detailByCid;
    param.data[0].detailByCidReq = detailByCidReq;
    let func1 = extrequire("GT82072AT3.backDefaultGroup.addProduct");
    let res = func1.execute(context, param);
    return { context: context, param: param };
  }
}
exports({ entryPoint: MyTrigger });