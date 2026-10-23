export default function Feedback({erro,sucesso}){return <>{erro&&<div className="alert error">{erro}</div>}{sucesso&&<div className="alert success">{sucesso}</div>}</>}
