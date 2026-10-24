import 'package:flutter/material.dart';

class NovaTarefaView extends StatefulWidget {
  const NovaTarefaView({super.key});

  @override
  State<NovaTarefaView> createState() => _NovaTarefaViewState();
}

class _NovaTarefaViewState extends State<NovaTarefaView> {
  final _formKey = GlobalKey<FormState>();
  final _tituloController = TextEditingController();

  @override
  void dispose() {
    _tituloController.dispose();
    super.dispose();
  }

  void _salvar() {
    if (_formKey.currentState!.validate()) {
      Navigator.pop(context, _tituloController.text.trim());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nova tarefa')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _tituloController,
                decoration: const InputDecoration(
                  labelText: 'Título da tarefa',
                  border: OutlineInputBorder(),
                ),
                validator: (valor) {
                  if (valor == null || valor.trim().isEmpty) {
                    return 'Informe o título da tarefa';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _salvar,
                  child: const Text('Salvar tarefa'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}