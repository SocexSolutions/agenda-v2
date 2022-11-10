import axios from "axios";

// eslint-disable-next-line
const hostname = process.env.NEXT_PUBLIC_API_HOSTNAME;

const publicRoutes = ["/api/user/login", "/api/user/register"];

async function proxyRequest(req) {
  delete req.query.slug;

  const headers = {};

  if (req.cookies["agenda-auth"]) {
    headers.authorization = req.cookies["agenda-auth"];
  }

  const url = req.url.split("/api")[1];

  const args = [
    hostname + "/api/v1" + url,
    ...(["GET", "DELETE"].includes(req.method) ? [] : [req.body]),
    {
      params: req.query,
      headers,
    },
  ];

  const res = await axios[req.method.toLowerCase()](...args);

  return res.data;
}

export default async (req, res) => {
  if (publicRoutes.includes(req.url)) {
    try {
      const data = await proxyRequest(req);

      const oneWeekMS = 1000 * 60 * 60 * 24 * 7;

      res.setHeader(
        `Set-Cookie`,
        `agenda-auth=${data.token}; path=/; Expires=${new Date(
          Date.now() + oneWeekMS
        )}; HttpOnly`
      );

      return res.status(200).json(data);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send(err);
    }
  }

  if (req.url === "/api/user/logout") {
    res.setHeader(
      `Set-Cookie`,
      `agenda-auth=''; path=/; Expires=${new Date(0)}; HttpOnly`
    );

    return res.status(200).send("ok");
  }

  try {
    const data = await proxyRequest(req);

    return res.status(200).json(data);
  } catch (err) {
    let status = 500;
    let message = "Internal Server Error";

    if (err.response) {
      status = err.response.status;
      message = err.response.data;
    }

    return res.status(status).json(message);
  }
};
