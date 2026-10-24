import 'package:flutter/material.dart';
import '../models/tarefa.dart';

class TarefaItem extends StatelessWidget {
  final Tarefa tarefa;
  final VoidCallback onAlternar;
  final VoidCallback onRemover;

  const TarefaItem({
    super.key,
    required this.tarefa,
    required this.onAlternar,
    required this.onRemover,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Checkbox(
          value: tarefa.concluida,
          onChanged: (_) => onAlternar(),
        ),
        title: Text(
          tarefa.titulo,
          style: TextStyle(
            decoration: tarefa.concluida
                ? TextDecoration.lineThrough
                : TextDecoration.none,
          ),
        ),
        trailing: IconButton(
          icon: const Icon(Icons.delete_outline),
          onPressed: onRemover,
        ),
      ),
    );
  }
}