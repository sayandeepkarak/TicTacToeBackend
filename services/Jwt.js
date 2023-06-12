import jsonwebtoken from "jsonwebtoken";
import { SECRET_KEY } from "../config";

class Jwt {
  static sign(payload, expire = "1m", secret = SECRET_KEY) {
    return jsonwebtoken.sign(payload, secret, { expiresIn: expire });
  }
  static verify(token, secret = SECRET_KEY) {
    return jsonwebtoken.verify(token, secret);
  }
  static decode(token) {
    return jsonwebtoken.decode(token);
  }
}

export default Jwt;
