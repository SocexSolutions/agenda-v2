import cookie from "cookie";
import client from "../../client";

export default ( req, res ) => {
  res.setHeader(
    "Set-Cookie", cookie.serialize( "token", req.body.token, {
      httpsOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60,
      sameSite: "strict",
      path: "/",
    })
  );
  res.statusCode = 200;
  res.json({ success: true });
};

// export const userLoginCookie = ( token ) => {
//   return async function loginUser( dispatch, getState ) {
//     try {

//       const { data } = await client.post(
//         "user/json",
//         {
//           token
//         }
//       );
//       dispatch(
//         {
//           type: "user/json",
//           payload: {
//             token:    data.token
//           }
//         }
//       );
//     } catch ( error ) {

//       console.error( error.message );
//     }
//   };
// };