import DecodeToken from "../utils/JWT"

export const loadCurrentUserData = () => {
    let tk = localStorage.getItem('usuario') || null

    if (tk) {
      let user = DecodeToken(tk)
      return [user, true];
    } else {
        return [ {}, true];
    }
}