const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ erro: "Token de acesso não informado." });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET || "troque_este_segredo");
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

module.exports = autenticar;
