let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var mode = request.mode;
    if (mode == "0") {
      var asn_no = string_nothing(request.asn_no);
      var di = string_nothing(request.di);
      var batch_number = string_nothing(request.batch_number);
      var serial_number = string_nothing(request.serial_number);
      var production_date = string_nothing(request.production_date);
      var expiration_date = string_nothing(request.expiration_date);
      var product_control_method_type = "";
      var productInformation_key = { di: di };
      var productInformation_res = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", productInformation_key);
      //产品不存在
      if (productInformation_res.length == 0) {
        //序列号为空
        if (serial_number == "") {
          product_control_method_type = "0";
        } else {
          product_control_method_type = "1";
        }
        return { product_control_method: product_control_method_type, warn: "扫描到的产品信息在产品信息中不存在，是否保留数据？" };
      } else {
        var range_code_key = { id: productInformation_res[0].product_control_method, enable: "1" };
        var range_code_res = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.range_code", range_code_key);
        var dict_code = range_code_res[0].dict_code;
        var batch_or_serial_number = "";
        var product_control_method_type = "";
        if (dict_code == "100701") {
          if (batch_number == "") {
            batch_or_serial_number = serial_number;
          } else {
            batch_or_serial_number = batch_number;
          }
          product_control_method_type = "0";
        } else if (dict_code == "100702") {
          if (serial_number == "") {
            batch_or_serial_number = batch_number;
          } else {
            batch_or_serial_number = serial_number;
          }
          product_control_method_type = "1";
        }
      }
      var product_lis_key = { AdvanceArrivalNoticeNo: asn_no, di: di, batch_number: batch_or_serial_number };
      var product_lis_res = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis", product_lis_key);
      if (product_lis_res.length == 0) {
        return { product_control_method: product_control_method_type, warn: "扫描到的产品信息在预到货通知单中不存在，是否保留数据？" };
      }
      let asn_date_manufacture = string_nothing(product_lis_res[0].date_manufacture);
      let asn_term_validity = string_nothing(product_lis_res[0].term_validity);
      if (asn_date_manufacture != production_date) {
        return { product_control_method: product_control_method_type, warn: "扫描到的产品信息与预到货通知单中的产品信息不一致，是否保留数据？" };
      }
      if (asn_term_validity != expiration_date) {
        return { product_control_method: product_control_method_type, warn: "扫描到的产品信息与预到货通知单中的产品信息不一致，是否保留数据？" };
      }
      return { product_control_method: product_control_method_type };
    } else if (mode == "1") {
      var asn_no = request.asn_no;
      var di = request.di;
      var batch_number = request.batch_number;
      var serial_number = request.serial_number;
      var production_date = request.production_date;
      var expiration_date = request.expiration_date;
      var product_control_method_type = "";
      var productInformation_key = { di: di };
      var productInformation_res = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", productInformation_key);
      //产品不存在
      if (productInformation_res.length == 0) {
        //序列号为空
        if (serial_number == "") {
          product_control_method_type = "0";
          batch_or_serial_number = batch_number;
        } else {
          product_control_method_type = "1";
          batch_or_serial_number = serial_number;
        }
        return { product_control_method_type: product_control_method_type, batch_or_serial_number: batch_or_serial_number };
      } else {
        var range_code_key = { id: productInformation_res[0].product_control_method, enable: "1" };
        var range_code_res = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.range_code", range_code_key);
        var dict_code = range_code_res[0].dict_code;
        var batch_or_serial_number = "";
        var product_control_method_type = "";
        if (dict_code == "100701") {
          product_control_method_type = "0";
          if (batch_number == "") {
            batch_or_serial_number = serial_number;
          } else {
            batch_or_serial_number = batch_number;
          }
        } else if (dict_code == "100702") {
          product_control_method_type = "1";
          if (serial_number == "") {
            batch_or_serial_number = batch_number;
          } else {
            batch_or_serial_number = serial_number;
          }
        }
        return { product_control_method_type: product_control_method_type, batch_or_serial_number: batch_or_serial_number };
      }
    }
  }
}
function string_nothing(param) {
  if (param == undefined) return "";
  if (param == null) return "";
  return param;
}
exports({ entryPoint: MyAPIHandler });