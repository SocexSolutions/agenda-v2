const http = require("http");

const data = new TextEncoder().encode(
  JSON.stringify({
    username: "thudson",
    password: "thudson",
    email: "email"
  })
);

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/user/register",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${ res.statusCode }`);
  res.setEncoding("utf8");

  res.on("data", (chunk) => {
    console.log(`BODY: ${chunk}`);
  });

  res.on("end", () => {
    console.log("No more data in response.");
  });
});

req.write(data);

req.end();
