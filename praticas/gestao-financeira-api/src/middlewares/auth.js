import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "secret");
    req.userId = decoded.userId;
    req.userName = decoded.name;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
