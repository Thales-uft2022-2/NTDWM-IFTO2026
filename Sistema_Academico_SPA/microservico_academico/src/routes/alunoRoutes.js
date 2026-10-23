import { Router } from 'express'; import * as c from '../controllers/alunoController.js'; import {autenticar,somenteAdmin} from '../middlewares/auth.js';
const r=Router(); r.get('/',autenticar,c.listar); r.post('/',autenticar,somenteAdmin,c.criar); r.delete('/:id',autenticar,somenteAdmin,c.remover); export default r;
