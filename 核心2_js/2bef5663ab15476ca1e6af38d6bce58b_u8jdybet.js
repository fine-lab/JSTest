let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //主要是对档案（type=0)的操作，如果是新增则新增档案（type=0),更新则更新档案（type=0),生成售送达代码，并保持锁定lck=1/2
    var res1, res2, res3;
    let ApplyData = request.record;
    let isApply = request.isApply;
    let address = ApplyData.Address3List;
    var pCode = {
      北京市: "11",
      天津市: "12",
      河北省: "13",
      山西省: "14",
      内蒙古自治区: "15",
      辽宁省: "21",
      吉林省: "22",
      黑龙江省: "23",
      上海市: "31",
      江苏省: "32",
      浙江省: "33",
      安徽省: "34",
      福建省: "35",
      江西省: "36",
      山东省: "37",
      河南省: "41",
      湖北省: "42",
      湖南省: "43",
      广东省: "44",
      广西壮族自治区: "45",
      海南省: "46",
      重庆市: "50",
      四川省: "51",
      贵州省: "52",
      云南省: "53",
      西藏自治区: "54",
      陕西省: "61",
      甘肃省: "62",
      青海省: "63",
      宁夏回族自治区: "64",
      新疆维吾尔自治区: "65"
    };
    if (isApply) {
      //最后一步需要增加售送达代码
      if (ApplyData.lck == 1) {
        //新增
        let isDuplicateSql = "select 1 from AT16F632B808C80005.AT16F632B808C80005.Merchant3 where type=0 and dr=0 and name='" + ApplyData.name + "' and keCode='" + ApplyData.keCode + "'";
        let DuplicateData = ObjectStore.queryByYonQL(isDuplicateSql);
        if (DuplicateData.length > 0) throw Error("已存在档案,客户名称:" + ApplyData.name + ",课代码:" + ApplyData.keCode);
        let province = ApplyData.province;
        let pre = "21" + pCode[province];
        if (!province) throw Error("注册省份异常:" + province);
        //获取新售达代码
        let sql = "select shoudaCode from AT16F632B808C80005.AT16F632B808C80005.Merchant3 where type=0 and dr=0 and shoudaCode leftlike '" + pre + "' order by shoudaCode desc limit 1,1";
        let data = ObjectStore.queryByYonQL(sql);
        let newShoudaCode;
        if (data.length == 0) newShoudaCode = pre + "001";
        else newShoudaCode = (parseInt(data[0].shoudaCode) + 1).toString();
        ApplyData.shoudaCode = newShoudaCode;
        //获取新送达代码
        address.forEach((ad, i) => {
          ad._status = "Update";
          ad.songdaCode = newShoudaCode + "_" + (i + 1 < 10 ? "0" + (i + 1) : "" + (i + 1));
        });
      } else if (ApplyData.lck == 2) {
        //更新
        let t, maxSongda;
        address.forEach((ad, i) => {
          if (ad.lck == 1) {
            //新增
            if (!maxSongda) {
              let shoudaCode = ApplyData.shoudaCode;
              let s3 =
                "select addr.songdaCode songdaCode from AT16F632B808C80005.AT16F632B808C80005.Merchant3 left join AT16F632B808C80005.AT16F632B808C80005.Address3 addr on id=addr.Merchant3_id where type=0 and dr=0 and shoudaCode='" +
                shoudaCode +
                "' order by addr.songdaCode desc limit 1,1 ";
              let songdaData = ObjectStore.queryByYonQL(s3);
              maxSongda = songdaData[0].songdaCode.split("_"); //最大送达代码
              t = parseInt(maxSongda[1]) + 1;
            }
            let newSongdaCode = t < 10 ? maxSongda[0] + "_0" + t.toString() : maxSongda[0] + "_" + t.toString();
            ad.songdaCode = newSongdaCode;
            t += 1;
          }
          ad._status = "Update";
        });
        //删除原有档案
        var object = { shoudaCode: ApplyData.shoudaCode, type: 0, dr: 0 };
        var res1 = ObjectStore.deleteByMap("AT16F632B808C80005.AT16F632B808C80005.Merchant3", object, "ybff7b95d3");
      }
    }
    //更新申请数据
    var res2 = ObjectStore.updateById("AT16F632B808C80005.AT16F632B808C80005.Merchant3", ApplyData, "ybff7b95d3");
    //新增档案
    if (isApply) {
      ApplyData.type = 0;
      ApplyData.log = "";
      address.forEach((ad, i) => {
        ad.type = 0;
        ad.log = "";
      });
      var res3 = ObjectStore.insert("AT16F632B808C80005.AT16F632B808C80005.Merchant3", ApplyData, "ybff7b95d3");
    }
    return { result: { status: "ok", res: [res1, res2, res3], ApplyData: ApplyData } };
  }
}
exports({ entryPoint: MyAPIHandler }); // JavaScript source code