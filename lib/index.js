const app = require("express")();

app.get("/", (req, res) => {
  res.json({
    message: "Hello from agenda",
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log("Agenda api listening on " + port));
