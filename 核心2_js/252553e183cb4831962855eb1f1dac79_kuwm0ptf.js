let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var image1_base64 = request.image1_base64;
    var image2_base64 = request.image2_base64;
    if (image1_base64 == null) {
      throw new Error("image1_base64参数不能为空！");
    }
    if (image2_base64 == null) {
      throw new Error("image2_base64参数不能为空！");
    }
    const huawei_token_url = "https://www.example.com/";
    const huawei_iam_user = "yydevgame17352777151";
    const huawei_iam_password = "yourpasswordHere";
    const huawei_iam_area = "cn-north-4";
    const request_type = "post";
    let req_token_header = {
      "Content-Type": "application/json",
      return_header: "true"
    };
    let req_token_body = {
      auth: {
        identity: {
          methods: ["password"],
          password: {
            user: {
              password: huawei_iam_password,
              domain: {
                name: huawei_iam_user
              },
              name: huawei_iam_user
            }
          }
        },
        scope: {
          project: {
            name: huawei_iam_area
          }
        }
      }
    };
    var token_res = postman(request_type, huawei_token_url, JSON.stringify(req_token_header), JSON.stringify(req_token_body));
    token_res = token_res.replace("x-subject-token", "huawei_token");
    var res_header = JSON.parse(token_res).header;
    if (res_header && res_header.huawei_token[0]) {
      var huawei_token = res_header.huawei_token[0];
    } else {
      throw new Error("获取人脸比对token失败");
    }
    const projectid = "youridHere";
    const huawei_face_compare_url = "https://www.example.com/" + projectid + "/face-compare";
    const res_face_compare_header = {
      "Content-Type": "application/json",
      "X-Auth-Token": res_header.huawei_token[0]
    };
    const res_face_compare_body = {
      image1_base64: image1_base64,
      image2_base64: image2_base64
    };
    var face_compare_res = postman(request_type, huawei_face_compare_url, JSON.stringify(res_face_compare_header), JSON.stringify(res_face_compare_body));
    var face_compare_res_json = JSON.parse(face_compare_res);
    if (face_compare_res_json && face_compare_res_json.error_code) {
      throw new Error(JSON.stringify(face_compare_res_json));
    }
    return { result: face_compare_res_json };
  }
}
exports({ entryPoint: MyAPIHandler });