let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var billData = request.billData;
    //快递单号
    let bodys = billData.bodys;
    if (bodys.length == 0) {
      throw new Error("数据子表为空！");
    }
    let databodys = new Array();
    for (var i = 0; i < bodys.length; i++) {
      let body = bodys[i];
      //查询物料
      let queryProduct = "select * from pc.product.Product where id=" + body.product;
      var productRes = ObjectStore.queryByYonQL(queryProduct, "productcenter");
      let cargoDetail = {
        name: productRes[0].name, //货物名称
        count: Math.ceil(body.subQty) //货物数量,菜鸟数量必须为整数
      };
      databodys.push(cargoDetail);
    }
    var address = billData.cReceiveAddress;
    var addressArray = address.split(" ");
    var requestdata = {
      contact: "婷曼逸", //发件联系人
      mobile: "15386588004", //发件联系人电话
      code: billData.code, //YS订单号
      cReceiver: billData.cReceiver, //收方联系人
      cReceiveMobile: billData.cReceiveMobile, //收方电话
      address: address, //收方地址
      province: addressArray[0], //收方省份
      bodys: databodys
    };
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let bodydata = { data: requestdata };
    var cnUrl = "http://123.57.144.10:9997/toCn/sendData";
    var strResponseRes = postman("POST", cnUrl, JSON.stringify(header), JSON.stringify(bodydata));
    var strResponse = JSON.parse(strResponseRes);
    if (strResponse.code == 200) {
      let updateFunc = extrequire("ST.sf.updateTrackNum");
      var updateData = { id: billData.id, tracknum: strResponse.msg };
      let updateRes = updateFunc.execute(updateData);
      if (updateRes.error) {
        //回更销售出库“快递单号”异常
        throw new Error(updateRes.error.message);
      }
    } else {
      throw new Error(strResponse.msg);
    }
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });