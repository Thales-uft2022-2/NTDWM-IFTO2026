import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não informado.' });
  }

  try {
    req.usuario = jwt.verify(header.substring(7), process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

export function somenteAdmin(req, res, next) {
  if (req.usuario?.perfil !== 'ADMIN') {
    return res.status(403).json({ erro: 'Acesso permitido apenas para administradores.' });
  }
  next();
}
