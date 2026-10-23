import { useEffect, useMemo, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Plus, LogOut, Trash2, ArrowUpRight, ArrowDownRight, CircleDollarSign } from "lucide-react";
import { api } from "./services/api";

const moeda = (valor) => Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const hoje = () => new Date().toLocaleDateString("en-CA");

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem("usuario") || "null"); } catch { return null; }
  });
  const [modoCadastro, setModoCadastro] = useState(false);
  const [transacoes, setTransacoes] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [form, setForm] = useState({ tipo: "despesa", descricao: "", categoria: "Alimentação", valor: "", data: hoje() });
  const [credenciais, setCredenciais] = useState({ nome: "", email: "", senha: "" });

  async function carregar() {
    try { setTransacoes(await api.listar()); }
    catch (e) { setErro(e.message); }
  }
  useEffect(() => { if (usuario && localStorage.getItem("token")) carregar(); }, [usuario]);

  const resumo = useMemo(() => transacoes.reduce((acc, t) => {
    const valor = Number(t.valor);
    if (t.tipo === "receita") acc.receitas += valor;
    else acc.despesas += valor;
    return acc;
  }, { receitas: 0, despesas: 0 }), [transacoes]);
  const saldo = resumo.receitas - resumo.despesas;

  async function autenticar(e) {
    e.preventDefault(); setErro(""); setSucesso(""); setCarregando(true);
    try {
      const dados = modoCadastro
        ? await api.cadastro(credenciais)
        : await api.login({ email: credenciais.email, senha: credenciais.senha });
      if (modoCadastro) {
        setSucesso("Cadastro realizado. Agora entre com seu e-mail e senha.");
        setModoCadastro(false);
      } else {
        localStorage.setItem("token", dados.token);
        localStorage.setItem("usuario", JSON.stringify(dados.usuario));
        setUsuario(dados.usuario);
      }
    } catch (e) { setErro(e.message); }
    finally { setCarregando(false); }
  }

  async function salvarTransacao(e) {
    e.preventDefault(); setErro(""); setSucesso("");
    try {
      await api.criar({ ...form, valor: Number(form.valor) });
      setForm({ tipo: "despesa", descricao: "", categoria: "Alimentação", valor: "", data: hoje() });
      setSucesso("Lançamento cadastrado com sucesso.");
      await carregar();
    } catch (e) { setErro(e.message); }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir esta transação?")) return;
    try { await api.excluir(id); await carregar(); setSucesso("Transação excluída."); }
    catch (e) { setErro(e.message); }
  }

  function sair() {
    localStorage.removeItem("token"); localStorage.removeItem("usuario");
    setUsuario(null); setTransacoes([]);
  }

  if (!usuario || !localStorage.getItem("token")) {
    return <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark"><Wallet size={28}/></div>
        <p className="eyebrow">CONTROLE FINANCEIRO PESSOAL</p>
        <h1>{modoCadastro ? "Crie sua conta" : "Bem-vindo de volta"}</h1>
        <p className="muted">Organize suas receitas e despesas em um só lugar.</p>
        {erro && <div className="alert error">{erro}</div>}
        {sucesso && <div className="alert success">{sucesso}</div>}
        <form onSubmit={autenticar} className="form-stack">
          {modoCadastro && <label>Nome completo<input required value={credenciais.nome} onChange={e => setCredenciais({...credenciais, nome:e.target.value})} placeholder="Seu nome"/></label>}
          <label>E-mail<input required type="email" value={credenciais.email} onChange={e => setCredenciais({...credenciais, email:e.target.value})} placeholder="voce@email.com"/></label>
          <label>Senha<input required minLength="6" type="password" value={credenciais.senha} onChange={e => setCredenciais({...credenciais, senha:e.target.value})} placeholder="Mínimo de 6 caracteres"/></label>
          <button className="primary full" disabled={carregando}>{carregando ? "Aguarde..." : modoCadastro ? "Cadastrar" : "Entrar"}</button>
        </form>
        <p className="switch-auth">{modoCadastro ? "Já tem conta?" : "Ainda não tem conta?"} <button className="link-button" onClick={() => {setModoCadastro(!modoCadastro);setErro("");setSucesso("");}}>{modoCadastro ? "Entrar" : "Cadastre-se"}</button></p>
        <p className="footnote">Projeto acadêmico • NTDWB</p>
      </section>
    </main>;
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark small"><Wallet size={22}/></div><span>meu<span className="brand-accent">financeiro</span></span></div>
      <div className="nav-item active"><CircleDollarSign size={18}/> Visão geral</div>
      <div className="sidebar-bottom"><div className="avatar">{(usuario.nome || "U").slice(0,1).toUpperCase()}</div><div className="user-meta"><strong>{usuario.nome}</strong><small>{usuario.email}</small></div><button className="icon-button" title="Sair" onClick={sair}><LogOut size={18}/></button></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div><p className="eyebrow">SEU DINHEIRO, SOB CONTROLE</p><h1>Visão geral</h1><p className="muted">Olá, {usuario.nome}. Veja o resumo das suas finanças.</p></div><span className="date-pill">{new Date().toLocaleDateString("pt-BR", {day:"2-digit",month:"long",year:"numeric"})}</span></header>
      {erro && <div className="alert error">{erro}<button onClick={() => setErro("")}>×</button></div>}
      {sucesso && <div className="alert success">{sucesso}<button onClick={() => setSucesso("")}>×</button></div>}
      <section className="summary-grid">
        <article className="summary-card balance"><div className="card-top"><span>Saldo disponível</span><span className="card-icon"><Wallet size={20}/></span></div><h2>{moeda(saldo)}</h2><p>Receitas menos despesas</p></article>
        <article className="summary-card"><div className="card-top"><span>Receitas</span><span className="metric-icon income"><TrendingUp size={20}/></span></div><h2>{moeda(resumo.receitas)}</h2><p className="positive"><ArrowUpRight size={15}/> Total recebido</p></article>
        <article className="summary-card"><div className="card-top"><span>Despesas</span><span className="metric-icon expense"><TrendingDown size={20}/></span></div><h2>{moeda(resumo.despesas)}</h2><p className="negative"><ArrowDownRight size={15}/> Total gasto</p></article>
      </section>
      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading"><div><h2>Novo lançamento</h2><p className="muted">Registre uma entrada ou saída.</p></div><span className="heading-icon"><Plus size={20}/></span></div>
          <form className="form-stack" onSubmit={salvarTransacao}>
            <div className="type-switch"><button type="button" className={form.tipo==="despesa"?"selected expense-selected":""} onClick={() => setForm({...form,tipo:"despesa"})}>Despesa</button><button type="button" className={form.tipo==="receita"?"selected income-selected":""} onClick={() => setForm({...form,tipo:"receita"})}>Receita</button></div>
            <label>Descrição<input required maxLength="180" value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})} placeholder="Ex.: Conta de energia"/></label>
            <label>Categoria<select value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})}>{["Alimentação","Moradia","Transporte","Saúde","Educação","Salário","Lazer","Compras","Contas","Outros"].map(c=><option key={c}>{c}</option>)}</select></label>
            <div className="two-columns"><label>Valor (R$)<input required type="number" min="0.01" step="0.01" value={form.valor} onChange={e=>setForm({...form,valor:e.target.value})} placeholder="0,00"/></label><label>Data<input required type="date" value={form.data} onChange={e=>setForm({...form,data:e.target.value})}/></label></div>
            <button className="primary full"><Plus size={17}/> Salvar lançamento</button>
          </form>
        </article>
        <article className="panel transactions-panel">
          <div className="panel-heading"><div><h2>Últimas transações</h2><p className="muted">{transacoes.length} lançamento(s) registrado(s)</p></div><button className="refresh-button" onClick={carregar}>Atualizar</button></div>
          {transacoes.length === 0 ? <div className="empty-state"><div className="empty-icon"><Wallet size={25}/></div><strong>Nenhuma transação ainda</strong><p>Cadastre sua primeira receita ou despesa ao lado.</p></div> :
            <div className="transaction-list">{transacoes.map(t=><div className="transaction-row" key={t.id}><div className={`transaction-symbol ${t.tipo}`} >{t.tipo==="receita"?<TrendingUp size={18}/>:<TrendingDown size={18}/>}</div><div className="transaction-info"><strong>{t.descricao}</strong><small>{t.categoria} · {new Date(`${t.data}T12:00:00`).toLocaleDateString("pt-BR")}</small></div><div className="transaction-value"><strong className={t.tipo==="receita"?"positive":"negative"}>{t.tipo==="receita"?"+ ":"− "}{moeda(t.valor)}</strong><button className="delete-button" title="Excluir transação" onClick={()=>excluir(t.id)}><Trash2 size={14}/></button></div></div>)}</div>}
        </article>
      </section>
      <footer className="app-footer">Sistema Financeiro Pessoal <span>•</span> Projeto acadêmico NTDWB</footer>
    </main>
  </div>;
}
