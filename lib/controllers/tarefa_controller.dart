import 'package:flutter/foundation.dart';
import '../models/tarefa.dart';

class TarefaController extends ChangeNotifier {
  final List<Tarefa> _tarefas = [];
  int _proximoId = 1;

  List<Tarefa> get tarefas => List.unmodifiable(_tarefas);

  void adicionar(String titulo) {
    final texto = titulo.trim();
    if (texto.isEmpty) return;

    _tarefas.add(Tarefa(
      id: _proximoId++,
      titulo: texto,
    ));
    notifyListeners();
  }

  void alternarConclusao(int id) {
    final tarefa = _tarefas.firstWhere((t) => t.id == id);
    tarefa.concluida = !tarefa.concluida;
    notifyListeners();
  }

  void remover(int id) {
    _tarefas.removeWhere((t) => t.id == id);
    notifyListeners();
  }
}