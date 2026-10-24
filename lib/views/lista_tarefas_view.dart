import 'package:flutter/material.dart';
import '../controllers/tarefa_controller.dart';
import '../widgets/tarefa_item.dart';
import 'nova_tarefa_view.dart';

class ListaTarefasView extends StatefulWidget {
  const ListaTarefasView({super.key});

  @override
  State<ListaTarefasView> createState() =>
      _ListaTarefasViewState();
}

class _ListaTarefasViewState extends State<ListaTarefasView> {
  final TarefaController controller = TarefaController();

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  Future<void> _novaTarefa() async {
    final titulo = await Navigator.push<String>(
      context,
      MaterialPageRoute(
        builder: (_) => const NovaTarefaView(),
      ),
    );

    if (!mounted) return;
    if (titulo != null) controller.adicionar(titulo);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('TaskFlow'),
        actions: [
          IconButton(
            onPressed: _novaTarefa,
            icon: const Icon(Icons.add),
            tooltip: 'Nova tarefa',
          ),
        ],
      ),
      body: ListenableBuilder(
        listenable: controller,
        builder: (context, _) {
          final tarefas = controller.tarefas;

          if (tarefas.isEmpty) {
            return const Center(
              child: Text('Nenhuma tarefa. Adicione a primeira!'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: tarefas.length,
            itemBuilder: (context, index) {
              final tarefa = tarefas[index];

              return TarefaItem(
                tarefa: tarefa,
                onAlternar: () =>
                    controller.alternarConclusao(tarefa.id),
                onRemover: () => controller.remover(tarefa.id),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _novaTarefa,
        child: const Icon(Icons.add),
      ),
    );
  }
}