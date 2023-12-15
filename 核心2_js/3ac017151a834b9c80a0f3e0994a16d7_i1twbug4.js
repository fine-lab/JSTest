let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var base_path =
      "http://222.134.95.58:8088/nccloud/opm/accesstoken?client_id=BIP&client_secret=0COKWxr3S1h5CUUTdUIWRSE%2Bljg0BwrifiZY5CQq%2FIrjOSrjnyJi4kkerV%2FB46DUsUqkiPxe6ivI%0D%0AIneaESAeqrZABBaOZX%2BVee6g9ommuAYBdNoIf5cmS9liolCpDPwj%2FFp2sQNOInyTIb5%2Bn%2FGSyNia%0D%0A4tWbuHV241l8fSnDgMthNv%2FevY1W2IPdTud3mipjTbMkMDns5VUzpvzFm7Cxe8Zf2DoAMxdTjSHw%0D%0A2oyp6RdVLoFCAHJOE93Bmn%2FIAvjwlUeuA8%2FLSPKF%2BVnXlKIZIY9i4my%2FNAnVHb%2FlskVTbtZHxZp1%0D%0Artw1rm9drfUUEOhwcaA7dkaFumvQFpCaky9BQg%3D%3D%0D%0A&biz_center=1&signature=ada297d2ecd8b5677f0736f64235f4ebedcbca91196898c370d083f14039a806&grant_type=client_credentials&usercode=bip";
    //获取Encryption.pubEncrypt
    //数字签名
    //客户端名称
    //用户编码
    let header = { "Content-type": "application/x-www-form-urlencoded" };
    var body = {
      value1: ""
    };
    let apiResponse = postman("post", base_path, JSON.stringify(header), JSON.stringify(body));
    throw new Error("accesstoken:  " + apiResponse);
    return {};
  }
}
exports({ entryPoint: MyTrigger });