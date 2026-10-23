import { Router } from 'express';
import { listar, criar, alterarSenha, remover } from '../controllers/usuarioController.js';
import { autenticar, somenteAdmin } from '../middlewares/auth.js';

const router = Router();
router.use(autenticar, somenteAdmin);
router.get('/', listar);
router.post('/', criar);
router.put('/:id/senha', alterarSenha);
router.delete('/:id', remover);
export default router;
