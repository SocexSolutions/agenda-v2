import axios from "axios";

const hostname = process.env.NEXT_PUBLIC_API_HOSTNAME;

const publicRoutes = ["/api/user/login", "/api/user/register"];

async function proxyRequest(req) {
  delete req.query.slug;

  const args = [
    hostname + req.url,
    ...(["GET", "DELETE"].includes(req.method) ? [] : [req.body]),
    {
      params: req.query,
      headers: {
        authorization: req.cookies["agenda-auth"],
      },
    },
  ];

  const res = await axios[req.method.toLowerCase()](...args);

  return res.data;
}

export default async (req, res) => {
  if (publicRoutes.includes(req.url)) {
    const data = await proxyRequest(req);

    res.setHeader(`Set-Cookie`, `agenda-auth=${data.token}; path=/; HttpOnly`);

    return res.status(200).json(data);
  }

  try {
    const data = await proxyRequest(req);

    return res.status(200).json(data);
  } catch (err) {
    return res.status(err.response.status).json(err.response.data);
  }
};
