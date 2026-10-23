import jwt from 'jsonwebtoken';
export function autenticar(req,res,next){
  const h=req.headers.authorization;
  if(!h?.startsWith('Bearer ')) return res.status(401).json({erro:'Token não informado.'});
  try{ req.usuario=jwt.verify(h.substring(7),process.env.JWT_SECRET); next(); }
  catch{ return res.status(401).json({erro:'Token inválido ou expirado.'}); }
}
export function somenteAdmin(req,res,next){
  if(req.usuario?.perfil!=='ADMIN') return res.status(403).json({erro:'Operação permitida somente para ADMIN.'});
  next();
}
